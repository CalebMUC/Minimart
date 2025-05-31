import React, { createContext, useContext, useState, useEffect } from "react";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Calculate unreadCount whenever notifications change
  useEffect(() => {
    const count = notifications.filter((notification) => !notification.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const addNotifications = (message) => {
    setNotifications((prev) => [
      ...prev,
      {
        id: Date.now(),
        message: message,
        read: false,
      },
    ]);
  };

  const MarkAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId // Use strict equality
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const MarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, addNotifications, MarkAllAsRead, MarkAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};