"use client";

import { useState, useRef, useEffect } from "react";

type LanguageFilter = "c" | "cpp" | "java";

interface LanguageDropdownProps {
  value: LanguageFilter;
  onChange: (language: LanguageFilter) => void;
}

export function LanguageDropdown({ value, onChange }: LanguageDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { value: LanguageFilter; label: string }[] = [
    { value: "cpp", label: "C++ Problems" },
    { value: "c", label: "C Problems" },
    { value: "java", label: "Java Problems" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg px-3 py-1 text-xs font-medium transition md:px-4 md:py-1.5 md:text-sm bg-zinc-900 text-white hover:bg-zinc-800 cursor-pointer flex items-center gap-2"
      >
        {languages.find((l) => l.value === value)?.label}
        <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 w-full rounded-lg border border-zinc-200 bg-white shadow-lg z-10">
          {languages.map((lang) => (
            <button
              key={lang.value}
              onClick={() => {
                onChange(lang.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-xs md:text-sm text-left transition ${
                value === lang.value
                  ? "bg-zinc-900 text-white font-medium"
                  : "text-zinc-700 hover:bg-zinc-100"
              } ${
                lang.value === "cpp"
                  ? "rounded-t-lg"
                  : lang.value === "java"
                    ? "rounded-b-lg"
                    : ""
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
