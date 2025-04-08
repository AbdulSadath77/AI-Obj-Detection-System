"use client";

import React, { useState, useEffect } from "react";
import ObjectDetection from "./object-detection";

const CameraGrid = ({ isPaused }) => {
  const [cameras, setCameras] = useState([]);

  // Get available camera devices
  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");
        setCameras(videoDevices);
      } catch (error) {
        console.error("Error getting cameras:", error);
      }
    };

    getCameras();
  }, []);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cameras.map((camera, index) => (
          <div key={camera.deviceId} className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <ObjectDetection 
              deviceId={camera.deviceId}
              isPaused={isPaused}
              cameraIndex={index}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CameraGrid; 