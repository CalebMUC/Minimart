import React, { useState, useEffect, useRef } from "react";
import signalRService from "../../SignalR/SignalR";
import { useNotifications } from "../Notifications/NotificatonContext";

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const { addNotifications } = useNotifications();
  const eventListenersRegistered = useRef(false); // Prevent duplicate event listeners

  useEffect(() => {
    signalRService.startConnection();

    if (!eventListenersRegistered.current) {
      signalRService.onNewUser((message) => {
        setActivities((prev) => [`New User Registered: ${message}`, ...prev]);
        addNotifications("New user registered: " + message);
      });

      signalRService.onNewOrder((message) => {
        setActivities((prev) => [`New Order Placed: ${message}`, ...prev]);
        addNotifications("New order placed: " + message);
      });

      signalRService.onNewMerchant((message) => {
        setActivities((prev) => [`New Merchant Joined: ${message}`, ...prev]);
        addNotifications("New merchant joined: " + message);
      });

      eventListenersRegistered.current = true;
    }

    return () => {
      signalRService.stopConnection();
    };
  }, [addNotifications]); // Dependency ensures `addNotification` is correctly referenced

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
      <ul className="space-y-2">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <li key={index} className="text-gray-600">{activity}</li>
          ))
        ) : (
          <li className="text-gray-400">No recent activity</li>
        )}
      </ul>
    </div>
  );
};

export default RecentActivity;
