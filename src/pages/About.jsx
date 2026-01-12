import ThemeToggle from "@/components/common/ThemeToggle";

export default function About() {
  return (
    <div className="relative min-h-screen flex items-center justify-center 
                    bg-gray-50 dark:bg-gray-950 
                    text-gray-900 dark:text-gray-100">

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <h1 className="text-2xl font-semibold">About StockTradePro</h1>
    </div>
  );
}
