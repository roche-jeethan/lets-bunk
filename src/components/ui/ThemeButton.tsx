"use client";

import { useTheme } from "next-themes";

export default function ThemeToggler() {
  const { theme, setTheme } = useTheme();
  const toggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return (
    <>
      <button className="px-4 py-2 text-sm font-medium text-emerald-700 border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors hover: cursor-pointer" onClick={toggle}>
        {theme === "dark" ? "Switch Light" : "Switch Dark"}
      </button>
    </>
  );
}
