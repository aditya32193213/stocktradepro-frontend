// /**
//  * File: StockLogo.jsx
//  * Purpose:
//  * - Displays stock logo with graceful fallback
//  *
//  * Flow:
//  * - Renders image if available
//  * - Falls back to symbol-based avatar on error
//  * - Ensures visibility in dark mode
//  *
//  * Key Responsibilities:
//  * - Branding consistency
//  * - Robust image handling
//  */

import { useState } from "react";

export default function StockLogo({
  src,
  alt,
  symbol,
  size = "md",
  className = "",
}) {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
  };

  // ✅ FALLBACK AVATAR
  if (!src || hasError) {
    const firstLetter = symbol ? symbol.charAt(0).toUpperCase() : "?";

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

  // ✅ LOGO RENDER
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
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
