/**
 * Memory Bank - Utility for storing detection history and notifications
 */

// Maximum number of history items to store per user
const MAX_HISTORY_ITEMS = 100;

// Maximum number of notifications to store per user
const MAX_NOTIFICATIONS = 50;

/**
 * Get detection history for a specific user
 * @param {string} userId - The user ID
 * @returns {Array} - Array of detection history items
 */
export const getUserHistory = (userId) => {
  if (!userId) return [];
  
  try {
    const historyKey = `detection_history_${userId}`;
    const history = localStorage.getItem(historyKey);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting user history:', error);
    return [];
  }
};

/**
 * Add a detection to user history
 * @param {string} userId - The user ID
 * @param {Object} detection - The detection object
 */
export const addToHistory = (userId, detection) => {
  if (!userId) return;
  
  try {
    const historyKey = `detection_history_${userId}`;
    const history = getUserHistory(userId);
    
    // Add new detection with timestamp
    const newItem = {
      ...detection,
      timestamp: new Date().toISOString(),
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    // Add to beginning of array (newest first)
    history.unshift(newItem);
    
    // Limit to max items
    if (history.length > MAX_HISTORY_ITEMS) {
      history.length = MAX_HISTORY_ITEMS;
    }
    
    // Save back to localStorage
    localStorage.setItem(historyKey, JSON.stringify(history));
    
    // If it's a person, create a notification
    if (detection.class === 'person' && detection.score > 0.7) {
      createNotification(userId, {
        title: 'Person Detected',
        message: `A person was detected with ${(detection.score * 100).toFixed(1)}% confidence on Camera ${detection.cameraIndex + 1}`,
        type: 'alert',
        detection: newItem
      });
    }
  } catch (error) {
    console.error('Error adding to history:', error);
  }
};

/**
 * Get notifications for a specific user
 * @param {string} userId - The user ID
 * @returns {Array} - Array of notifications
 */
export const getUserNotifications = (userId) => {
  if (!userId) return [];
  
  try {
    const notificationsKey = `notifications_${userId}`;
    const notifications = localStorage.getItem(notificationsKey);
    return notifications ? JSON.parse(notifications) : [];
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
};

/**
 * Create a notification for a user
 * @param {string} userId - The user ID
 * @param {Object} notification - The notification object
 */
export const createNotification = (userId, notification) => {
  if (!userId) return;
  
  try {
    const notificationsKey = `notifications_${userId}`;
    const notifications = getUserNotifications(userId);
    
    // Add new notification with timestamp and ID
    const newNotification = {
      ...notification,
      timestamp: new Date().toISOString(),
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      read: false
    };
    
    // Add to beginning of array (newest first)
    notifications.unshift(newNotification);
    
    // Limit to max notifications
    if (notifications.length > MAX_NOTIFICATIONS) {
      notifications.length = MAX_NOTIFICATIONS;
    }
    
    // Save back to localStorage
    localStorage.setItem(notificationsKey, JSON.stringify(notifications));
    
    // Notify related users
    notifyRelatedUsers(userId, newNotification);
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

/**
 * Mark a notification as read
 * @param {string} userId - The user ID
 * @param {string} notificationId - The notification ID
 */
export const markNotificationAsRead = (userId, notificationId) => {
  if (!userId || !notificationId) return;
  
  try {
    const notificationsKey = `notifications_${userId}`;
    const notifications = getUserNotifications(userId);
    
    // Find and update notification
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === notificationId) {
        return { ...notification, read: true };
      }
      return notification;
    });
    
    // Save back to localStorage
    localStorage.setItem(notificationsKey, JSON.stringify(updatedNotifications));
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

/**
 * Notify related users about an alert
 * @param {string} userId - The user ID
 * @param {Object} notification - The notification object
 */
const notifyRelatedUsers = (userId, notification) => {
  try {
    // Get relationships
    const relationships = JSON.parse(localStorage.getItem('userRelationships') || '[]');
    
    // Find relationships for this user
    const userRelationships = relationships.filter(r => 
      r.userId === userId || r.relatedUserId === userId
    );
    
    // Get related user IDs
    const relatedUserIds = userRelationships.map(r => 
      r.userId === userId ? r.relatedUserId : r.userId
    );
    
    // Create notification for each related user
    relatedUserIds.forEach(relatedUserId => {
      // Add a note that this is a notification from a related user
      const relatedNotification = {
        ...notification,
        title: `${notification.title} (Related User)`,
        fromUserId: userId,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      // Get notifications for related user
      const notificationsKey = `notifications_${relatedUserId}`;
      const notifications = JSON.parse(localStorage.getItem(notificationsKey) || '[]');
      
      // Add notification
      notifications.unshift(relatedNotification);
      
      // Limit to max notifications
      if (notifications.length > MAX_NOTIFICATIONS) {
        notifications.length = MAX_NOTIFICATIONS;
      }
      
      // Save back to localStorage
      localStorage.setItem(notificationsKey, JSON.stringify(notifications));
    });
  } catch (error) {
    console.error('Error notifying related users:', error);
  }
};

/**
 * Get unread notification count for a user
 * @param {string} userId - The user ID
 * @returns {number} - Number of unread notifications
 */
export const getUnreadNotificationCount = (userId) => {
  if (!userId) return 0;
  
  try {
    const notifications = getUserNotifications(userId);
    return notifications.filter(n => !n.read).length;
  } catch (error) {
    console.error('Error counting unread notifications:', error);
    return 0;
  }
};

/**
 * Clear all history for a user
 * @param {string} userId - The user ID
 */
export const clearHistory = (userId) => {
  if (!userId) return;
  
  try {
    const historyKey = `detection_history_${userId}`;
    localStorage.removeItem(historyKey);
  } catch (error) {
    console.error('Error clearing history:', error);
  }
};

/**
 * Clear all notifications for a user
 * @param {string} userId - The user ID
 */
export const clearNotifications = (userId) => {
  if (!userId) return;
  
  try {
    const notificationsKey = `notifications_${userId}`;
    localStorage.removeItem(notificationsKey);
  } catch (error) {
    console.error('Error clearing notifications:', error);
  }
}; 