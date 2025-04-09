"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getUnreadNotificationCount, getUserNotifications, markNotificationAsRead } from "@/utils/memory-bank";

export const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const { currentUser, logout, isAdmin } = useAuth();
  
  // Load notifications
  useEffect(() => {
    if (currentUser) {
      // Update notifications
      const updateNotifications = () => {
        const userNotifications = getUserNotifications(currentUser.id);
        setNotifications(userNotifications);
        setUnreadCount(getUnreadNotificationCount(currentUser.id));
      };
      
      // Initial load
      updateNotifications();
      
      // Set up interval to check for new notifications
      const interval = setInterval(updateNotifications, 10000); // Check every 10 seconds
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [currentUser]);
  
  const handleLogout = () => {
    logout();
    setIsNavOpen(false);
  };
  
  const handleNotificationClick = (notificationId) => {
    if (currentUser) {
      markNotificationAsRead(currentUser.id, notificationId);
      // Update the UI
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      setUnreadCount(prev => prev - 1);
    }
  };
  
  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-white font-bold text-xl">
                AI Theft Detection
              </Link>
            </div>
          </div>
          
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <Link
              href="/"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Dashboard
            </Link>
            
            {currentUser && (
              <>
                <Link
                  href="/history"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  History
                </Link>
                
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Admin
                  </Link>
                )}
                
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white relative"
                  >
                    Notifications
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 z-10">
                      <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
                        Notifications
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() => handleNotificationClick(notification.id)}
                              className={`px-4 py-3 flex items-start hover:bg-gray-700 cursor-pointer ${
                                !notification.read ? 'bg-gray-700/50' : ''
                              }`}
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium text-white">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notification.timestamp).toLocaleString()}
                                </p>
                              </div>
                              {!notification.read && (
                                <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-400">
                            No notifications
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          
          <div className="flex items-center">
            {currentUser ? (
              <div className="hidden md:flex md:items-center">
                <span className="text-sm text-gray-300 mr-4">
                  {currentUser.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="hidden md:flex md:items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-gray-700 text-white hover:bg-gray-600"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="flex md:hidden ml-4">
              <button
                onClick={() => setIsNavOpen(!isNavOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                <svg
                  className={`${isNavOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isNavOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${isNavOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900"
            onClick={() => setIsNavOpen(false)}
          >
            Dashboard
          </Link>
          
          {currentUser && (
            <>
              <Link
                href="/history"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={() => setIsNavOpen(false)}
              >
                History
              </Link>
              
              {isAdmin && (
                <Link
                  href="/admin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={() => setIsNavOpen(false)}
                >
                  Admin
                </Link>
              )}
              
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setIsNavOpen(false);
                }}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {unreadCount}
                  </span>
                )}
              </button>
            </>
          )}
        </div>
        
        <div className="pt-4 pb-3 border-t border-gray-700">
          {currentUser ? (
            <div className="px-4">
              <div className="text-base font-medium text-white mb-2">
                {currentUser.name}
              </div>
              <div className="text-sm text-gray-400 mb-4">
                {currentUser.email}
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="px-4 space-y-2">
              <Link
                href="/login"
                className="block w-full px-4 py-2 rounded-md text-sm font-medium bg-gray-700 text-white hover:bg-gray-600 text-center"
                onClick={() => setIsNavOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="block w-full px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 text-center"
                onClick={() => setIsNavOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
