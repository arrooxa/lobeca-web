import { getNameInitials } from "@/utils/formatter";
import { cn } from "../utils/cn";

interface AvatarIconProps {
  name: string;
  photoURL?: string;
  size?: "extra-small" | "small" | "medium" | "large";
  format?: "circle" | "square";
  className?: string;
}

const AvatarIcon = ({
  name,
  photoURL,
  size = "medium",
  format = "circle",
  className,
}: AvatarIconProps) => {
  let avatarSizeClass = "w-24 h-24";
  let textSizeClass = "text-3xl";

  if (size === "extra-small") {
    avatarSizeClass = "w-12 h-12";
    textSizeClass = "text-sm";
  } else if (size === "small") {
    avatarSizeClass = "w-16 h-16";
    textSizeClass = "text-xl";
  } else if (size === "large") {
    avatarSizeClass = "w-32 h-32";
    textSizeClass = "text-5xl";
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {photoURL ? (
        <img
          src={photoURL}
          alt={name}
          className={`${avatarSizeClass} ${
            format === "circle" ? "rounded-full" : "rounded-md"
          }`}
        />
      ) : (
        <div
          className={`${avatarSizeClass} bg-gray-400 ${
            format === "circle" ? "rounded-full" : "rounded-md"
          } flex items-center justify-center`}
        >
          <p className={`text-white ${textSizeClass} font-bold`}>
            {getNameInitials(name)}
          </p>
        </div>
      )}
    </div>
  );
};

export default AvatarIcon;
