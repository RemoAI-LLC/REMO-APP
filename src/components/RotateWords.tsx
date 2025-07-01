// src/components/RotateWords.tsx
"use client";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface RotateWordsProps {
  text: string;
  words: string[];
  className?: string; // ✅ Add this line
}

export function RotateWords({
  text = "Rotate",
  words = ["Word 1", "Word 2", "Word 3"],
  className = "",
}: RotateWordsProps) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div
      className={`text-xl text-center sm:text-3xl font-semibold tracking-tight md:text-4xl flex items-center justify-center gap-2 mt-2 ${className}`}
    >
      <span>{text}</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-gray-600 dark:text-gray-400"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
