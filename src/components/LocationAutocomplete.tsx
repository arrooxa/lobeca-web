import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: {
    address: string;
    latitude: number;
    longitude: number;
  }) => void;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

const LocationAutocomplete = ({
  value,
  onChange,
  onPlaceSelect,
  error,
  errorMessage,
  label = "Endereço",
  placeholder = "Digite o endereço completo",
  required = false,
}: LocationAutocompleteProps) => {
  const places = useMapsLibrary("places");
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompleteSuggestion[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value === "") {
      setInputValue("");
      setSuggestions([]);
    }
  }, [value]);

  useEffect(() => {
    if (!places || !inputValue) {
      setSuggestions([]);
      return;
    }

    const { AutocompleteSessionToken, AutocompleteSuggestion } = places;

    if (!sessionTokenRef.current) {
      sessionTokenRef.current = new AutocompleteSessionToken();
    }

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const request: google.maps.places.AutocompleteRequest = {
          input: inputValue,
          sessionToken: sessionTokenRef.current!,
        };

        const response =
          await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
        setSuggestions(response.suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [places, inputValue]);

  const handleInputChange = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      const newValue = (e.target as HTMLInputElement).value;
      setInputValue(newValue);
      onChange(newValue);
    },
    [onChange]
  );

  const handleSuggestionClick = useCallback(
    async (suggestion: google.maps.places.AutocompleteSuggestion) => {
      if (!places || !suggestion.placePrediction) return;

      try {
        const place = suggestion.placePrediction.toPlace();
        await place.fetchFields({
          fields: ["formattedAddress", "location"],
        });

        const address = place.formattedAddress || "";
        const latitude = place.location?.lat() ?? 0;
        const longitude = place.location?.lng() ?? 0;

        setInputValue(address);
        onChange(address);
        onPlaceSelect({
          address,
          latitude,
          longitude,
        });

        sessionTokenRef.current = null;
        setShowSuggestions(false);
        setSuggestions([]);
      } catch (error) {
        console.error("Error selecting place:", error);
      }
    },
    [places, onChange, onPlaceSelect]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor="location-autocomplete">
          {label}
          {required && <span className="text-brand-secondary ml-1">*</span>}
        </Label>
      )}
      <div className="relative" ref={inputRef}>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          <MapPin className="w-4 h-4 text-gray-400" />
        </div>
        <Input
          id="location-autocomplete"
          type="text"
          value={inputValue}
          onInput={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          error={error}
          className="pl-10"
        />

        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => {
              const prediction = suggestion.placePrediction;
              if (!prediction) return null;

              return (
                <li
                  key={prediction.placeId || index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {prediction.text?.text}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400" />
          </div>
        )}
      </div>

      {errorMessage && (
        <p className="text-sm text-brand-secondary">{errorMessage}</p>
      )}
      {!errorMessage && (
        <p className="text-xs text-foreground-subtle flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          Digite e selecione um endereço da lista
        </p>
      )}
    </div>
  );
};

export default LocationAutocomplete;
