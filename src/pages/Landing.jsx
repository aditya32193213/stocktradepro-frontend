import { Link } from "react-router-dom";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function Landing() {
  return (
    <div
      className="relative min-h-screen 
                 bg-gray-50 dark:bg-gray-950 
                 text-gray-900 dark:text-gray-100"
    >
      {/* Theme Toggle (KEEPING YOUR LOGIC INTACT) */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 pt-32">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Trade Smarter with <span className="text-blue-600">StockTradePro</span>
        </h1>

        <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-400 mb-8">
          A modern stock trading platform to track markets, manage your
          portfolio, and execute trades with confidence.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4">
          <Link
            to="/register"
            className="px-6 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="px-6 py-3 rounded-md border border-gray-300 dark:border-gray-700
                       hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Live Market Data",
              desc: "Track real-time stock prices, trends, and market movements.",
            },
            {
              title: "Smart Portfolio",
              desc: "Monitor holdings, balance, and performance at a glance.",
            },
            {
              title: "Secure Trading",
              desc: "Buy and sell stocks securely with validated transactions.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-gray-200 dark:border-gray-800
                         bg-white dark:bg-gray-900 p-6 text-center"
            >
              <h3 className="text-lg font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-24 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} StockTradePro. All rights reserved.
      </footer>
    </div>
  );
}
