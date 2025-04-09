"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [relatedUsers, setRelatedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedIsAdmin = localStorage.getItem('isAdmin');
    const storedRelatedUsers = localStorage.getItem('relatedUsers');
    
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    if (storedIsAdmin) {
      setIsAdmin(JSON.parse(storedIsAdmin) === true);
    }
    
    if (storedRelatedUsers) {
      setRelatedUsers(JSON.parse(storedRelatedUsers));
    }
    
    setLoading(false);
  }, []);
  
  // Save to local storage whenever state changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
      localStorage.setItem('relatedUsers', JSON.stringify(relatedUsers));
    }
  }, [currentUser, isAdmin, relatedUsers, loading]);
  
  // Register a new user
  const register = (name, email, password, isUserAdmin = false) => {
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password, // In a real app, this should be hashed
      createdAt: new Date().toISOString()
    };
    
    // Store in local storage for persistence
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    setCurrentUser(newUser);
    setIsAdmin(isUserAdmin);
    
    return newUser;
  };
  
  // Login an existing user
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      
      // Check if user is an admin (in a real app, this would be stored in the user object)
      const adminEmails = ['admin@example.com']; // Example admin emails
      setIsAdmin(adminEmails.includes(email));
      
      // Load related users for this user
      const allRelationships = JSON.parse(localStorage.getItem('userRelationships') || '[]');
      const userRelationships = allRelationships.filter(r => 
        r.userId === user.id || r.relatedUserId === user.id
      );
      
      // Get all related user IDs
      const relatedUserIds = userRelationships.map(r => 
        r.userId === user.id ? r.relatedUserId : r.userId
      );
      
      // Get related user objects
      const relatedUserObjects = users.filter(u => relatedUserIds.includes(u.id));
      setRelatedUsers(relatedUserObjects);
      
      return true;
    }
    
    return false;
  };
  
  // Logout the current user
  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setRelatedUsers([]);
  };
  
  // Add a related user
  const addRelatedUser = (userId) => {
    if (!currentUser) return false;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userToAdd = users.find(u => u.id === userId);
    
    if (userToAdd) {
      // Create relationship
      const relationship = {
        id: uuidv4(),
        userId: currentUser.id,
        relatedUserId: userId,
        createdAt: new Date().toISOString()
      };
      
      // Store relationship
      const relationships = JSON.parse(localStorage.getItem('userRelationships') || '[]');
      relationships.push(relationship);
      localStorage.setItem('userRelationships', JSON.stringify(relationships));
      
      // Update state
      setRelatedUsers([...relatedUsers, userToAdd]);
      return true;
    }
    
    return false;
  };
  
  // Remove a related user
  const removeRelatedUser = (userId) => {
    if (!currentUser) return false;
    
    // Remove relationship from storage
    const relationships = JSON.parse(localStorage.getItem('userRelationships') || '[]');
    const updatedRelationships = relationships.filter(r => 
      !(r.userId === currentUser.id && r.relatedUserId === userId) && 
      !(r.userId === userId && r.relatedUserId === currentUser.id)
    );
    
    localStorage.setItem('userRelationships', JSON.stringify(updatedRelationships));
    
    // Update state
    setRelatedUsers(relatedUsers.filter(u => u.id !== userId));
    return true;
  };
  
  // Context value
  const value = {
    currentUser,
    isAdmin,
    relatedUsers,
    register,
    login,
    logout,
    addRelatedUser,
    removeRelatedUser
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  return useContext(AuthContext);
}; 