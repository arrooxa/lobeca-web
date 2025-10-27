import { cn } from "@/utils/cn";

interface LoadingBarberProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingBarber({ size = "md", className }: LoadingBarberProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const dotSizeClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  };

  const gapClasses = {
    sm: "gap-4",
    md: "gap-5",
    lg: "gap-6",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        gapClasses[size],
        className
      )}
    >
      {/* Scissors with pulsing circle */}
      <div className={cn("relative", sizeClasses[size])}>
        {/* Pulsing colored circle */}
        <div className="absolute inset-0 rounded-full border-3 border-brand-primary animate-pulse" />

        {/* Scissors icon */}
        <svg
          className="w-full h-full p-4"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left handle */}
          <circle
            cx="6"
            cy="6"
            r="2"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-brand-primary"
            fill="none"
          />
          {/* Right handle */}
          <circle
            cx="6"
            cy="18"
            r="2"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-brand-primary"
            fill="none"
          />
          {/* Left blade */}
          <path
            d="M6 6L13 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="text-brand-primary"
          />
          {/* Right blade */}
          <path
            d="M6 18L13 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="text-brand-primary"
          />
          {/* Blade tips */}
          <path
            d="M14 12L21 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="text-brand-primary"
          />
          <path
            d="M14 12L21 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="text-brand-primary"
          />
        </svg>
      </div>

      {/* Bouncing dots */}
      <div className="flex gap-1.5 justify-center">
        <span
          className={cn(
            dotSizeClasses[size],
            "bg-brand-primary rounded-full animate-bounce"
          )}
          style={{ animationDelay: "0ms" }}
        />
        <span
          className={cn(
            dotSizeClasses[size],
            "bg-brand-primary rounded-full animate-bounce"
          )}
          style={{ animationDelay: "150ms" }}
        />
        <span
          className={cn(
            dotSizeClasses[size],
            "bg-brand-primary rounded-full animate-bounce"
          )}
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}

// Inline loading variant for buttons or small spaces
export function LoadingBarberInline({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <svg
        className="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span>Carregando...</span>
    </div>
  );
}

// Full page loading with backdrop
export function LoadingBarberFullPage() {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <LoadingBarber size="lg" />
    </div>
  );
}

// Skeleton loader for cards
export function LoadingBarberSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded animate-pulse" />
        <div className="h-3 bg-muted rounded animate-pulse w-5/6" />
        <div className="h-3 bg-muted rounded animate-pulse w-4/6" />
      </div>
    </div>
  );
}
