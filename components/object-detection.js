"use client";

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import {
  renderPredictions,
  updatePauseState,
  updateAudioOutputDevice,
} from "@/utils/render-predictions";

let detectInterval;

const ObjectDetection = ({ isPaused, deviceId, cameraIndex = 0 }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(deviceId || "");
  const [cameraError, setCameraError] = useState(null);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState("");
  const [audioPermissionState, setAudioPermissionState] = useState("unknown"); // "unknown", "granted", "denied"

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Get device type
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile on component mount
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    // Initial check
    checkMobile();

    // Listen for resize events
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Get available camera devices
  const handleDevices = React.useCallback(
    (mediaDevices) => {
      // Filter for video devices only
      const videoDevices = mediaDevices.filter(
        (device) => device.kind === "videoinput"
      );
      setDevices(videoDevices);

      // Use provided deviceId or select first device by default
      if (videoDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(deviceId || videoDevices[0].deviceId);
      }
    },
    [selectedDeviceId, deviceId]
  );

  // Initialize devices on mount with better permission handling and retries
  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    // Check if mediaDevices is supported
    if (!navigator.mediaDevices?.enumerateDevices) {
      console.log("enumerateDevices() not supported.");
      return;
    }

    const getDevicesWithRetry = async () => {
      try {
        // Request camera permissions with more specific constraints
        await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        if (!mounted) return;

        // Get devices after permission
        const devices = await navigator.mediaDevices.enumerateDevices();

        if (!mounted) return;

        // Check if we have valid device labels, often we don't on first try
        const hasValidLabels = devices.some(
          (device) => device.kind === "videoinput" && device.label
        );

        if (!hasValidLabels && retryCount < maxRetries) {
          console.log(
            `No labeled devices found, retrying (${
              retryCount + 1
            }/${maxRetries})...`
          );
          retryCount++;
          // Retry after a delay
          setTimeout(getDevicesWithRetry, 500);
          return;
        }

        handleDevices(devices);
      } catch (err) {
        if (!mounted) return;

        console.error("Error getting media devices:", err);

        if (retryCount < maxRetries) {
          console.log(
            `Failed to get devices, retrying (${
              retryCount + 1
            }/${maxRetries})...`
          );
          retryCount++;
          // Retry after a delay
          setTimeout(getDevicesWithRetry, 1000);
        } else {
          setCameraError("Permission denied or cameras unavailable");
          setIsLoading(false);
        }
      }
    };

    // Some browsers need time to initialize cameras
    setTimeout(() => {
      if (mounted) {
        getDevicesWithRetry();
      }
    }, 500);

    return () => {
      mounted = false;
    };
  }, [handleDevices]);

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

  // Get available audio output devices
  const handleAudioDevices = React.useCallback(
    (mediaDevices) => {
      // Filter for audio output devices only
      const outputDevices = mediaDevices.filter(
        (device) => device.kind === "audiooutput"
      );
      setAudioDevices(outputDevices);

      // Select first audio device by default if no device is selected
      if (outputDevices.length > 0 && !selectedAudioDeviceId) {
        setSelectedAudioDeviceId(outputDevices[0].deviceId);
        updateAudioOutputDevice(outputDevices[0].deviceId);
      }
    },
    [selectedAudioDeviceId]
  );

  // Initialize audio devices
  useEffect(() => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      console.log("Audio device enumeration not supported.");
      return;
    }

    // Check if browser supports setSinkId (audio output selection)
    if (!HTMLAudioElement.prototype.setSinkId) {
      console.log(
        "Audio output device selection is not supported in this browser."
      );
      setAudioPermissionState("unsupported");
      return;
    }

    // Try to get permission for audio output devices
    // In most browsers, this requires a secure context (HTTPS)
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        setAudioPermissionState("granted");

        // Now enumerate devices after permission
        navigator.mediaDevices
          .enumerateDevices()
          .then(handleAudioDevices)
          .catch((err) => {
            console.error("Error enumerating audio devices:", err);
          });
      })
      .catch((err) => {
        console.log("Audio permission denied:", err);
        setAudioPermissionState("denied");
      });
  }, [handleAudioDevices]);

  // Handle audio output device change
  const handleAudioDeviceChange = (e) => {
    const newAudioDeviceId = e.target.value;
    console.log(`Switching audio output to: ${newAudioDeviceId}`);
    setSelectedAudioDeviceId(newAudioDeviceId);
    updateAudioOutputDevice(newAudioDeviceId);
  };

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
    // Skip if we're still loading or in the process of switching cameras
    if (isLoading) return;

    try {
      if (
        canvasRef.current &&
        webcamRef.current !== null &&
        webcamRef.current.video?.readyState === 4
      ) {
        // Check if video dimensions are valid
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        if (videoWidth === 0 || videoHeight === 0) {
          // Skip detection if video dimensions are not valid
          return;
        }

        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        try {
          // find detected objects
          const detectedObjects = await net.detect(
            webcamRef.current.video,
            undefined,
            0.6
          );

          if (canvasRef.current) {
            // Check again before drawing in case component unmounted
            const context = canvasRef.current.getContext("2d");
            renderPredictions(detectedObjects, context);
          }
        } catch (error) {
          console.error("Detection error:", error);
          // If we get texture errors repeatedly, it might indicate we need to restart detection
          if (error.message && error.message.includes("texture size")) {
            console.log("Texture error detected, attempting recovery...");
            incrementTextureError();
          }
        }
      }
    } catch (outerError) {
      console.error("Outer detection error:", outerError);
      // If the outer try fails, it's likely a more serious error with the webcam element
    }
  }

  const showmyVideo = () => {
    if (
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      const myVideoWidth = webcamRef.current.video.videoWidth;
      const myVideoHeight = webcamRef.current.video.videoHeight;

      // Skip if dimensions are not valid
      if (myVideoWidth === 0 || myVideoHeight === 0) {
        return;
      }

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

  // Function to properly cleanup video resources
  const cleanupVideoResources = () => {
    if (
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.srcObject
    ) {
      try {
        const stream = webcamRef.current.video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
        webcamRef.current.video.srcObject = null;
      } catch (e) {
        console.error("Error cleaning up video resources:", e);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);

    runCoco();
    showmyVideo();

    return () => {
      // Clear any running intervals
      if (detectInterval) {
        clearInterval(detectInterval);
        detectInterval = null;
      }

      // Remove event listeners
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      // Properly release camera
      cleanupVideoResources();

      // Clear refs
      webcamRef.current = null;
      canvasRef.current = null;
    };
  }, []);

  // Reset detection when camera changes
  useEffect(() => {
    if (selectedDeviceId) {
      // Clear previous detection interval
      if (detectInterval) {
        clearInterval(detectInterval);
        detectInterval = null;
      }

      // Set loading state to prevent detection errors during camera switch
      setIsLoading(true);

      // Stop any existing video stream
      if (webcamRef.current && webcamRef.current.video) {
        const stream = webcamRef.current.video.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      }

      // Wait for camera to initialize before restarting detection
      const switchTimer = setTimeout(() => {
        // Clear canvas to prevent ghosting between camera switches
        if (canvasRef.current) {
          const context = canvasRef.current.getContext("2d");
          if (context) {
            context.clearRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );
          }
        }

        runCoco();
      }, 1500); // Even longer delay for OBS virtual cameras

      return () => {
        clearTimeout(switchTimer);
      };
    }
  }, [selectedDeviceId]);

  // Handle camera errors and fallback
  const handleCameraError = (error) => {
    console.error("Webcam error:", error);
    setCameraError(error.name || "Unknown Error");
    setIsLoading(false);

    // If we have multiple cameras, try falling back to a different one
    if (devices.length > 1) {
      const currentIndex = devices.findIndex(
        (d) => d.deviceId === selectedDeviceId
      );
      if (currentIndex >= 0 && currentIndex < devices.length - 1) {
        // Try next camera
        console.log("Attempting to fall back to next available camera");
        const nextDeviceId = devices[currentIndex + 1].deviceId;
        setTimeout(() => {
          cleanupVideoResources();
          setSelectedDeviceId(nextDeviceId);
          setCameraError(null);
        }, 1000);
      }
    }
  };

  // Handle camera change with virtual camera detection
  const handleCameraChange = (e) => {
    try {
      const newDeviceId = e.target.value;

      // Only proceed if actually changing cameras
      if (newDeviceId === selectedDeviceId) return;

      // Find the selected device to check if it might be a virtual camera
      const selectedDevice = devices.find((d) => d.deviceId === newDeviceId);
      const isLikelyVirtual =
        selectedDevice?.label &&
        (selectedDevice.label.toLowerCase().includes("obs") ||
          selectedDevice.label.toLowerCase().includes("virtual") ||
          selectedDevice.label.toLowerCase().includes("capture"));

      console.log(
        `Switching camera to: ${selectedDevice?.label || newDeviceId} ${
          isLikelyVirtual ? "(Virtual Camera)" : ""
        }`
      );

      // First stop any existing tracks
      cleanupVideoResources();

      // Reset error state when manually changing camera
      setCameraError(null);

      // Use longer delay for virtual cameras
      if (isLikelyVirtual) {
        setIsLoading(true);
        // Allow more time for virtual cameras to initialize
        setTimeout(() => {
          setSelectedDeviceId(newDeviceId);
        }, 500);
      } else {
        // Update selected device immediately for regular cameras
        setSelectedDeviceId(newDeviceId);
      }
    } catch (err) {
      console.error("Error during camera change:", err);
    }
  };

  // Add error recovery mechanism for persistent texture errors
  const [textureErrorCount, setTextureErrorCount] = useState(0);

  useEffect(() => {
    // If we get too many texture errors, try to recover by forcing a camera restart
    if (textureErrorCount > 5) {
      console.log("Too many texture errors, forcing camera restart");
      cleanupVideoResources();
      setIsLoading(true);

      setTimeout(() => {
        runCoco();
        setTextureErrorCount(0);
      }, 2000);
    }
  }, [textureErrorCount]);

  // Recovery function that can be called in the detection error handler
  const incrementTextureError = () => {
    setTextureErrorCount((prev) => prev + 1);
  };

  // Function to force restart a problematic camera
  const forceRestartCamera = (deviceId) => {
    setIsLoading(true);
    setCameraError(null);
    cleanupVideoResources();

    // Release camera completely
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // First request with exact deviceId to release it from other applications
      navigator.mediaDevices
        .getUserMedia({
          video: {
            deviceId: { exact: deviceId },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        })
        .then((stream) => {
          // Stop all tracks immediately to fully release
          stream.getTracks().forEach((track) => track.stop());

          // Short delay before restarting
          setTimeout(() => {
            // Restart detection
            runCoco();
          }, 1000);
        })
        .catch((err) => {
          console.error("Failed to force restart camera:", err);
          setCameraError(`Cannot access camera (${err.name})`);
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
            <p className="mt-2">Loading Camera {cameraIndex + 1}...</p>
          </div>
        </div>
      )}
      {cameraError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
          <div className="text-white text-center p-4">
            <p className="text-red-500">{cameraError}</p>
            <p className="mt-2">Camera {cameraIndex + 1}</p>
          </div>
        </div>
      )}
      <Webcam
        ref={webcamRef}
        audio={false}
        width="100%"
        height="100%"
        screenshotFormat="image/jpeg"
        videoConstraints={{
          deviceId: selectedDeviceId,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        }}
        className="w-full h-full object-cover"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
};

export default ObjectDetection;
