"use client";

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import {
  renderPredictions,
  updatePauseState,
} from "@/utils/render-predictions";

let detectInterval;

const ObjectDetection = ({ isPaused }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Initialize from session storage on first render
  useEffect(() => {
    if (!initialLoadComplete) {
      const storedPauseState = sessionStorage.getItem("alarmPaused");
      if (storedPauseState !== null) {
        updatePauseState(storedPauseState === "true");
      }
      setInitialLoadComplete(true);
    }
  }, [initialLoadComplete]);

  // Update the pause state in the render-predictions module whenever isPaused changes
  useEffect(() => {
    updatePauseState(isPaused);
  }, [isPaused]);

  async function runCoco() {
    setIsLoading(true); // Set loading state to true when model loading starts
    try {
      const net = await cocoSSDLoad();
      setIsLoading(false); // Set loading state to false when model loading completes

      detectInterval = setInterval(() => {
        runObjectDetection(net);
      }, 10);
    } catch (error) {
      console.error("Error loading model:", error);
      setIsLoading(false);
    }
  }

  async function runObjectDetection(net) {
    if (
      canvasRef.current &&
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      canvasRef.current.width = webcamRef.current.video.videoWidth;
      canvasRef.current.height = webcamRef.current.video.videoHeight;

      try {
        // find detected objects
        const detectedObjects = await net.detect(
          webcamRef.current.video,
          undefined,
          0.6
        );

        const context = canvasRef.current.getContext("2d");
        renderPredictions(detectedObjects, context);
      } catch (error) {
        console.error("Detection error:", error);
      }
    }
  }

  const showmyVideo = () => {
    if (
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      const myVideoWidth = webcamRef.current.video.videoWidth;
      const myVideoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = myVideoWidth;
      webcamRef.current.video.height = myVideoHeight;
    }
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      if (webcamRef.current && webcamRef.current.video) {
        webcamRef.current.video.pause();
      }
    } else {
      if (
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.paused
      ) {
        webcamRef.current.video.play().catch((err) => {
          console.log("Error resuming video:", err);
        });
      }
    }
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);

    runCoco();
    showmyVideo();

    return () => {
      clearInterval(detectInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (webcamRef.current) {
        webcamRef.current = null;
      }
      if (canvasRef.current) {
        canvasRef.current = null;
      }
    };
  }, []);

  return (
    <div className="mt-2 w-full">
      {isLoading ? (
        <div className="text-center py-16">
          <div className="text-white animate-pulse text-xl">Loading AI Model...</div>
          <div className="mt-4 text-gray-400 text-xs">
            This may take a few moments depending on your connection
          </div>
        </div>
      ) : (
        <div className="relative flex min-w-[300px] w-fit mx-auto justify-center items-center bg-gray-700 p-1.5 rounded-2xl overflow-hidden">
          {/* webcam */}
          <Webcam
            ref={webcamRef}
            className="rounded-xl w-full lg:h-[720px]"
            muted
          />

          {/* canvas */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 z-99999 w-full lg:h-[720px]"
          />

          {/* Status indicator */}
          {isPaused && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Alarm Paused
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;
