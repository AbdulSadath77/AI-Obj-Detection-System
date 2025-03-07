"use client";

import { useState, useEffect } from "react";
import ObjectDetection from "@/components/object-detection";
import Link from "next/link";

export default function Home() {
  const [isPaused, setIsPaused] = useState(false);

  // Initialize isPaused state from sessionStorage on component mount
  useEffect(() => {
    const storedPauseState = sessionStorage.getItem("alarmPaused");
    if (storedPauseState !== null) {
      setIsPaused(storedPauseState === "true");
    }
  }, []);

  // Update sessionStorage whenever isPaused changes
  useEffect(() => {
    sessionStorage.setItem("alarmPaused", isPaused.toString());
  }, [isPaused]);

  return (
    <main className="flex flex-col min-h-[90vh] items-center p-4">
      <header className="w-full mb-4">
        <h1 className="gradient-title font-extrabold text-3xl md:text-6xl lg:text-8xl tracking-tighter pb-2 md:px-6 text-center">
          AI-Theft Detection System
        </h1>
        {/* <p className="text-center text-gray-300 mt-2 text-lg">
          Advanced Theft Detection System
        </p> */}
      </header>

      <div className="flex-grow w-full">
        <ObjectDetection isPaused={isPaused} />
      </div>

      <div className="flex space-x-4 mt-4">
        <button
          id="pauseButton"
          type="button"
          className={`font-semibold uppercase tracking-wide px-8 py-4 rounded-xl w-36 active:scale-[0.98] duration-50 ${
            isPaused
              ? "bg-gray-600 text-white"
              : "bg-white text-black hover:bg-gray-200"
          }`}
          onClick={() => setIsPaused(true)}
        >
          Pause
        </button>

        <button
          id="resumeButton"
          type="button"
          className={`font-semibold uppercase tracking-wide px-8 py-4 rounded-xl w-36 active:scale-[0.98] duration-50 ${
            !isPaused
              ? "bg-gray-600 text-white"
              : "bg-white text-black hover:bg-gray-200"
          }`}
          onClick={() => setIsPaused(false)}
        >
          Resume
        </button>
      </div>

      <footer className="mt-8 p-4 text-center text-gray-500">
        <p>
          Developed by&nbsp;
          <a
            href="https://www.linkedin.com/in/abdulsadath/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="hover:underline text-white">Abdul Sadath</span>
          </a>
        </p>
      </footer>
    </main>
  );
}
