import React, { useContext } from 'react';
import { useNotifications } from "../Notifications/NotificatonContext";

const NotificationsPage = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <button
        onClick={markAllAsRead}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-4"
      >
        Mark All as Read
      </button>
      <ul>
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className={`p-4 mb-2 rounded-lg ${
              notification.read ? 'bg-gray-100' : 'bg-blue-100'
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{notification.message}</span>
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Mark as Read
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPage;