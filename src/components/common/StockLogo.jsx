import { useState } from "react";

/**
 * StockLogo Component
 * Displays stock logo with white background for dark mode
 * Includes fallback for missing/broken images
 */
export default function StockLogo({ 
  src, 
  alt, 
  symbol, 
  size = "md",
  className = "" 
}) {
  const [error, setError] = useState(false);

  // Size configurations
  const sizeClasses = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
  };

  const handleError = () => {
    setError(true);
  };

  // Fallback: Show first letter of symbol in colored circle
  if (!src || error) {
    const firstLetter = symbol ? symbol.charAt(0).toUpperCase() : "?";
    
    // Generate consistent color based on symbol
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    
    const colorIndex = symbol 
      ? symbol.charCodeAt(0) % colors.length 
      : 0;
    
    return (
      <div
        className={`${sizeClasses[size]} rounded-full ${colors[colorIndex]} 
                    flex items-center justify-center text-white font-bold
                    ${className}`}
        title={alt || symbol}
      >
        {firstLetter}
      </div>
    );
  }

  // Show actual logo with white background
  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-white 
                  flex items-center justify-center overflow-hidden
                  border border-gray-200 dark:border-gray-700
                  ${className}`}
      title={alt || symbol}
    >
      <img
        src={src}
        alt={alt || symbol}
        className="w-full h-full object-cover"
        onError={handleError}
      />
    </div>
  );
}