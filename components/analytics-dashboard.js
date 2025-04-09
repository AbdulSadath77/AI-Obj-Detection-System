"use client";

import React, { useState, useEffect } from "react";
import { getUserHistory, getUserNotifications } from "@/utils/memory-bank";

const AnalyticsDashboard = ({ userId }) => {
  const [cameras, setCameras] = useState([]);
  const [stats, setStats] = useState({});
  const [totalDetections, setTotalDetections] = useState(0);
  const [personDetections, setPersonDetections] = useState(0);
  const [detectionRate, setDetectionRate] = useState(0);
  const [lastDetectionTime, setLastDetectionTime] = useState(null);
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [activeCamera, setActiveCamera] = useState('all');
  
  // Load detection history from memory bank
  useEffect(() => {
    if (userId) {
      const loadUserData = () => {
        // Get user history from memory bank
        const history = getUserHistory(userId);
        setDetectionHistory(history);
        
        // Calculate stats from history
        let personCount = 0;
        let lastDetection = null;
        
        history.forEach(item => {
          if (item.class === 'person') {
            personCount++;
          }
          
          if (!lastDetection || new Date(item.timestamp) > new Date(lastDetection.timestamp)) {
            lastDetection = item;
          }
        });
        
        setTotalDetections(history.length);
        setPersonDetections(personCount);
        setLastDetectionTime(lastDetection ? new Date(lastDetection.timestamp) : null);
        
        // Calculate detection rate (per minute)
        const now = new Date();
        const oneMinuteAgo = new Date(now.getTime() - 60000);
        const recentDetections = history.filter(item => 
          new Date(item.timestamp) > oneMinuteAgo
        ).length;
        
        setDetectionRate(recentDetections);
        
        // Get available cameras
        const getAvailableCameras = async () => {
          try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === "videoinput");
            setCameras(videoDevices);
          } catch (error) {
            console.error("Error getting cameras:", error);
          }
        };
        
        getAvailableCameras();
      };
      
      // Initial load
      loadUserData();
      
      // Set up interval to refresh data
      const interval = setInterval(loadUserData, 5000); // Refresh every 5 seconds
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [userId]);
  
  // Filter history based on active camera
  const filteredHistory = activeCamera === 'all' 
    ? detectionHistory 
    : detectionHistory.filter(d => d.cameraIndex === parseInt(activeCamera));

  return (
    <div className="w-full bg-gray-800 rounded-xl p-4 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Detection Analytics</h2>
        
        <div className="flex items-center">
          <label htmlFor="camera-select" className="text-gray-300 mr-2 text-sm">Camera:</label>
          <select 
            id="camera-select"
            value={activeCamera}
            onChange={(e) => setActiveCamera(e.target.value)}
            className="bg-gray-700 text-white rounded-lg px-2 py-1 text-sm"
          >
            <option value="all">All Cameras</option>
            {cameras.map((camera, index) => (
              <option key={camera.deviceId} value={index.toString()}>
                {camera.label || `Camera ${index + 1}`}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-gray-300 text-sm">Total Detections</h3>
          <p className="text-2xl font-bold text-white">{totalDetections}</p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-gray-300 text-sm">Person Detections</h3>
          <p className="text-2xl font-bold text-white">{personDetections}</p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-gray-300 text-sm">Detection Rate</h3>
          <p className="text-2xl font-bold text-white">{detectionRate}/min</p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-gray-300 text-sm">Last Detection</h3>
          <p className="text-lg font-bold text-white">
            {lastDetectionTime 
              ? lastDetectionTime.toLocaleTimeString() 
              : "None"}
          </p>
        </div>
      </div>
      
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-gray-300 text-sm mb-2">Recent Detections</h3>
        <div className="max-h-60 overflow-y-auto">
          {filteredHistory.length > 0 ? (
            <ul className="space-y-2">
              {filteredHistory.map((detection, index) => (
                <li key={detection.id || index} className="flex justify-between items-center text-white border-b border-gray-600 pb-2">
                  <div>
                    <span className="font-bold">{detection.class}</span>
                    <span className="text-gray-400 text-xs ml-2">
                      ({(detection.score * 100).toFixed(1)}%)
                    </span>
                    <div className="text-xs text-gray-400 mt-1">
                      Camera {detection.cameraIndex + 1}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-400 text-xs">
                      {new Date(detection.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {new Date(detection.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-center py-4">No detections yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 