"use client";

import React, { useState, useEffect } from "react";
import ObjectDetection from "./object-detection";

const CameraGrid = ({ isPaused, userId }) => {
  const [cameras, setCameras] = useState([]);
  const [userCameraSettings, setUserCameraSettings] = useState({});

  // Get available camera devices
  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");
        setCameras(videoDevices);
        
        // Load user camera settings if they exist
        if (userId) {
          try {
            const storedSettings = localStorage.getItem(`camera_settings_${userId}`);
            if (storedSettings) {
              setUserCameraSettings(JSON.parse(storedSettings));
            } else {
              // Initialize with default settings for all cameras
              const defaultSettings = {};
              videoDevices.forEach((camera, index) => {
                defaultSettings[camera.deviceId] = {
                  enabled: true,
                  sensitivity: 0.6, // Default sensitivity
                  name: camera.label || `Camera ${index + 1}`
                };
              });
              setUserCameraSettings(defaultSettings);
              localStorage.setItem(`camera_settings_${userId}`, JSON.stringify(defaultSettings));
            }
          } catch (error) {
            console.error("Error loading user camera settings:", error);
          }
        }
      } catch (error) {
        console.error("Error getting cameras:", error);
      }
    };

    getCameras();
  }, [userId]);

  // Update camera settings
  const updateCameraSetting = (deviceId, setting, value) => {
    if (!userId) return;
    
    const newSettings = {
      ...userCameraSettings,
      [deviceId]: {
        ...userCameraSettings[deviceId],
        [setting]: value
      }
    };
    
    setUserCameraSettings(newSettings);
    localStorage.setItem(`camera_settings_${userId}`, JSON.stringify(newSettings));
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cameras.map((camera, index) => {
          // Get camera settings or use defaults
          const cameraSettings = userCameraSettings[camera.deviceId] || {
            enabled: true,
            sensitivity: 0.6,
            name: camera.label || `Camera ${index + 1}`
          };
          
          // Skip disabled cameras
          if (!cameraSettings.enabled) return null;
          
          return (
            <div key={camera.deviceId} className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <div className="absolute top-2 left-2 z-10 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {cameraSettings.name}
              </div>
              
              <div className="absolute top-2 right-2 z-10">
                <button 
                  onClick={() => updateCameraSetting(camera.deviceId, 'enabled', false)}
                  className="bg-red-600 text-white p-1 rounded-full"
                  title="Disable camera"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <ObjectDetection 
                deviceId={camera.deviceId}
                isPaused={isPaused}
                cameraIndex={index}
                userId={userId}
                sensitivity={cameraSettings.sensitivity}
              />
            </div>
          );
        })}
      </div>
      
      {cameras.length === 0 && (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-white text-lg">No cameras detected</p>
          <p className="text-gray-400 mt-2">Please connect a camera and refresh the page</p>
        </div>
      )}
      
      {/* Disabled cameras section */}
      {Object.entries(userCameraSettings).filter(([_, settings]) => !settings.enabled).length > 0 && (
        <div className="mt-8">
          <h3 className="text-white text-lg font-medium mb-4">Disabled Cameras</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(userCameraSettings)
              .filter(([_, settings]) => !settings.enabled)
              .map(([deviceId, settings]) => (
                <div key={deviceId} className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                  <span className="text-white">{settings.name}</span>
                  <button
                    onClick={() => updateCameraSetting(deviceId, 'enabled', true)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Enable
                  </button>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraGrid; 