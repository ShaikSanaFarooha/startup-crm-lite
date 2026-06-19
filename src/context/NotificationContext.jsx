import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext(null);

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_1',
    message: 'Sarah won the lead: Emma Watson (Hogwarts Inc)',
    type: 'success',
    isRead: false,
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString() // 10 minutes ago
  },
  {
    id: 'notif_2',
    message: 'David scheduled a meeting with Bruce Wayne (Wayne Ent)',
    type: 'info',
    isRead: false,
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString() // 45 minutes ago
  },
  {
    id: 'notif_3',
    message: 'New lead John Doe captured from LinkedIn',
    type: 'success',
    isRead: true,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() // 3 hours ago
  }
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem('crm_notifications');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse notifications', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('crm_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (message, type = 'info') => {
    const newNotif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      message,
      type,
      isRead: false,
      timestamp: new Date().toISOString()
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        unreadCount
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
