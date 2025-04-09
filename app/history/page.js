"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getUserHistory, clearHistory } from '@/utils/memory-bank';

export default function History() {
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [filters, setFilters] = useState({
    objectType: 'all',
    camera: 'all',
    date: 'all',
    confidenceLevel: 0
  });
  const [cameras, setCameras] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);
  
  const { currentUser } = useAuth();
  const router = useRouter();

  // Load cameras and detection history
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      // Get cameras
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");
        setCameras(videoDevices);
      } catch (error) {
        console.error("Error getting cameras:", error);
      }

      if (currentUser) {
        // Get history from memory bank
        const history = getUserHistory(currentUser.id);
        setDetectionHistory(history);
      }
      
      setIsLoading(false);
    };
    
    // Redirect to login if not authenticated
    if (!currentUser) {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 500);
      return () => clearTimeout(timer);
    } else {
      loadData();
    }
  }, [currentUser, router]);

  // Apply filters to history
  const filteredHistory = detectionHistory.filter(item => {
    // Filter by object type
    if (filters.objectType !== 'all' && item.class !== filters.objectType) {
      return false;
    }
    
    // Filter by camera
    if (filters.camera !== 'all' && item.cameraIndex !== parseInt(filters.camera)) {
      return false;
    }
    
    // Filter by date
    if (filters.date !== 'all') {
      const itemDate = new Date(item.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const isToday = itemDate.toDateString() === today.toDateString();
      const isYesterday = itemDate.toDateString() === yesterday.toDateString();
      
      if (filters.date === 'today' && !isToday) {
        return false;
      }
      
      if (filters.date === 'yesterday' && !isYesterday) {
        return false;
      }
      
      // Filter by this week
      if (filters.date === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (itemDate < weekAgo) {
          return false;
        }
      }
    }
    
    // Filter by confidence level
    if (item.score < filters.confidenceLevel) {
      return false;
    }
    
    return true;
  });
  
  // Get unique object types from history
  const objectTypes = [...new Set(detectionHistory.map(item => item.class))];
  
  // Update filter
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };
  
  // Handle clear history
  const handleClearHistory = () => {
    if (confirmClear && currentUser) {
      clearHistory(currentUser.id);
      setDetectionHistory([]);
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      // Auto-reset confirm after 5 seconds
      setTimeout(() => setConfirmClear(false), 5000);
    }
  };

  // Show loading state if not authenticated yet
  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-white text-3xl font-bold">Detection History</h1>
          <p className="text-gray-400 mt-2">View and filter your detection history</p>
        </header>
        
        {/* Filters */}
        <div className="bg-gray-800 p-4 rounded-xl mb-6">
          <div className="flex flex-wrap gap-4">
            {/* Object Type Filter */}
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Object Type
              </label>
              <select
                value={filters.objectType}
                onChange={(e) => handleFilterChange('objectType', e.target.value)}
                className="bg-gray-700 text-white rounded-lg px-3 py-2 w-full"
              >
                <option value="all">All Objects</option>
                {objectTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            {/* Camera Filter */}
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Camera
              </label>
              <select
                value={filters.camera}
                onChange={(e) => handleFilterChange('camera', e.target.value)}
                className="bg-gray-700 text-white rounded-lg px-3 py-2 w-full"
              >
                <option value="all">All Cameras</option>
                {cameras.map((camera, index) => (
                  <option key={camera.deviceId} value={index.toString()}>
                    {camera.label || `Camera ${index + 1}`}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Date Filter */}
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Date Range
              </label>
              <select
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="bg-gray-700 text-white rounded-lg px-3 py-2 w-full"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">This Week</option>
              </select>
            </div>
            
            {/* Confidence Level Filter */}
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Min. Confidence: {Math.round(filters.confidenceLevel * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={filters.confidenceLevel}
                onChange={(e) => handleFilterChange('confidenceLevel', parseFloat(e.target.value))}
                className="w-full bg-gray-700 rounded-lg"
              />
            </div>
            
            {/* Clear History Button */}
            <div className="w-full sm:w-auto flex items-end">
              <button
                onClick={handleClearHistory}
                className={`px-4 py-2 rounded-lg text-white ${
                  confirmClear ? 'bg-red-600' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {confirmClear ? 'Click to Confirm' : 'Clear History'}
              </button>
            </div>
          </div>
        </div>
        
        {/* History List */}
        <div className="bg-gray-800 rounded-xl">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
              <p className="text-white mt-4">Loading history...</p>
            </div>
          ) : filteredHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-700 text-white">
                  <tr>
                    <th className="px-4 py-3 text-sm font-medium">Time</th>
                    <th className="px-4 py-3 text-sm font-medium">Object</th>
                    <th className="px-4 py-3 text-sm font-medium">Confidence</th>
                    <th className="px-4 py-3 text-sm font-medium">Camera</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredHistory.map((item, index) => (
                    <tr key={item.id || index} className="text-gray-300 hover:bg-gray-700/50">
                      <td className="px-4 py-3 text-sm">
                        <div>{new Date(item.timestamp).toLocaleTimeString()}</div>
                        <div className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleDateString()}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium">{item.class}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-600 rounded-full h-2 mr-2">
                            <div 
                              className={`h-full rounded-full ${
                                item.score > 0.8 ? 'bg-green-500' : 
                                item.score > 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${item.score * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{Math.round(item.score * 100)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm">
                          {cameras[item.cameraIndex]?.label || `Camera ${item.cameraIndex + 1}`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">
              {detectionHistory.length > 0 ? (
                <p>No results match your filters</p>
              ) : (
                <p>No detection history found</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 