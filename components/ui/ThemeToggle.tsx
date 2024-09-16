"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    const root = window.document.documentElement;
    if (
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    if (newTheme === "system") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", newTheme);
    }
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      setTheme("system");
    }
  }, []);

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => handleThemeChange("light")}
        className={`px-3 py-2 rounded ${
          theme === "light"
            ? "bg-indigo-500 text-white"
            : "bg-gray-800 text-gray-300"
        }`}
      >
        Light
      </button>
      <button
        onClick={() => handleThemeChange("dark")}
        className={`px-3 py-2 rounded ${
          theme === "dark"
            ? "bg-indigo-500 text-white"
            : "bg-gray-800 text-gray-300"
        }`}
      >
        Dark
      </button>
      <button
        onClick={() => handleThemeChange("system")}
        className={`px-3 py-2 rounded ${
          theme === "system"
            ? "bg-indigo-500 text-white"
            : "bg-gray-800 text-gray-300"
        }`}
      >
        System
      </button>
    </div>
  );
}
