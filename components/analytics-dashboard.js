"use client";

import React, { useState, useEffect } from "react";

const AnalyticsDashboard = ({ cameraIndex }) => {
  const [stats, setStats] = useState({
    totalDetections: 0,
    personDetections: 0,
    lastDetectionTime: null,
    detectionHistory: [],
    detectionRate: 0,
  });

  // Function to update detection statistics
  const updateStats = (detection) => {
    setStats(prevStats => {
      const now = new Date();
      const newHistory = [...prevStats.detectionHistory];
      
      // Add new detection to history (keep last 10)
      newHistory.unshift({
        time: now,
        object: detection.class,
        confidence: detection.score,
        cameraIndex: cameraIndex
      });
      
      if (newHistory.length > 10) {
        newHistory.pop();
      }
      
      // Calculate detection rate (detections per minute)
      const oneMinuteAgo = new Date(now.getTime() - 60000);
      const recentDetections = newHistory.filter(item => item.time > oneMinuteAgo).length;
      
      return {
        totalDetections: prevStats.totalDetections + 1,
        personDetections: detection.class === "person" ? prevStats.personDetections + 1 : prevStats.personDetections,
        lastDetectionTime: now,
        detectionHistory: newHistory,
        detectionRate: recentDetections
      };
    });
  };

  // Expose the updateStats function to parent components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.updateDetectionStats = updateStats;
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete window.updateDetectionStats;
      }
    };
  }, [cameraIndex]);

  return (
    <div className="w-full bg-gray-800 rounded-xl p-4 mt-4">
      <h2 className="text-xl font-bold text-white mb-4">Detection Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-gray-300 text-sm">Total Detections</h3>
          <p className="text-2xl font-bold text-white">{stats.totalDetections}</p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-gray-300 text-sm">Person Detections</h3>
          <p className="text-2xl font-bold text-white">{stats.personDetections}</p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-gray-300 text-sm">Detection Rate</h3>
          <p className="text-2xl font-bold text-white">{stats.detectionRate}/min</p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-gray-300 text-sm">Last Detection</h3>
          <p className="text-lg font-bold text-white">
            {stats.lastDetectionTime 
              ? stats.lastDetectionTime.toLocaleTimeString() 
              : "None"}
          </p>
        </div>
      </div>
      
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-gray-300 text-sm mb-2">Recent Detections</h3>
        <div className="max-h-40 overflow-y-auto">
          {stats.detectionHistory.length > 0 ? (
            <ul className="space-y-2">
              {stats.detectionHistory.map((detection, index) => (
                <li key={index} className="flex justify-between items-center text-white">
                  <span>
                    <span className="font-bold">{detection.object}</span>
                    <span className="text-gray-400 text-xs ml-2">
                      ({(detection.confidence * 100).toFixed(1)}%)
                    </span>
                  </span>
                  <span className="text-gray-400 text-xs">
                    {detection.time.toLocaleTimeString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-center py-2">No detections yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 