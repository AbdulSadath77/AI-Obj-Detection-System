"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CameraGrid from "@/components/camera-grid";
import AnalyticsDashboard from "@/components/analytics-dashboard";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const [isPaused, setIsPaused] = useState(false);
  const router = useRouter();
  const { currentUser } = useAuth();

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

  // Redirect to login if not authenticated
  useEffect(() => {
    // Add a delay to prevent flash of login redirect during auth initialization
    const timer = setTimeout(() => {
      if (!currentUser) {
        router.push('/login');
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [currentUser, router]);

  // If user is not logged in, show loading state
  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <main className="flex flex-col min-h-screen items-center bg-gray-900">
      <div className="w-full max-w-7xl px-4 py-8 mx-auto">
        <header className="mb-6">
          <h1 className="gradient-title font-extrabold text-3xl md:text-5xl lg:text-6xl tracking-tighter pb-2 text-center">
            AI-Theft Detection System
          </h1>
          <p className="text-center text-gray-400 mt-2">
            Multi-camera theft detection with real-time analytics
          </p>
        </header>

        <div className="flex-grow w-full mb-6">
          <CameraGrid isPaused={isPaused} userId={currentUser.id} />
        </div>

        <div className="flex justify-center space-x-4 my-6">
          <button
            id="pauseButton"
            type="button"
            className={`font-semibold uppercase tracking-wide px-8 py-3 rounded-xl w-36 active:scale-[0.98] transition-all duration-200 ${
              isPaused
                ? "bg-red-600 text-white"
                : "bg-white text-black hover:bg-gray-200"
            }`}
            onClick={() => setIsPaused(true)}
          >
            Pause
          </button>

          <button
            id="resumeButton"
            type="button"
            className={`font-semibold uppercase tracking-wide px-8 py-3 rounded-xl w-36 active:scale-[0.98] transition-all duration-200 ${
              !isPaused
                ? "bg-green-600 text-white"
                : "bg-white text-black hover:bg-gray-200"
            }`}
            onClick={() => setIsPaused(false)}
          >
            Resume
          </button>
        </div>

        {/* Analytics Dashboard */}
        <AnalyticsDashboard userId={currentUser.id} />

        <footer className="mt-8 p-4 text-center text-gray-500 border-t border-gray-800">
          <p>
            Welcome, {currentUser.name}! | 
            <a
              href="https://www.linkedin.com/in/abdulsadath/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 hover:underline text-blue-400"
            >
              Developed by Abdul Sadath
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
