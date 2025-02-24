import { useState } from "react";
import "../../CSS/Generalsetting.css";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import AccountSection from "./AccountSection/AccountSection";
import {
  AccountCircle, // For Account Setting
  Security,      // For Security
  LocalShipping, // For Orders
  Payment,       // For Payment & Subscriptions
  Notifications, // For Notification Settings
  Language,      // For Language Preference
  Settings,
} from "@mui/icons-material";

const GeneralSettings = () => {
  const [expandedItem, setExpandedItem] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [activeSubItem, setActiveSubItem] = useState(null);

  const menuItems = [
    {
      name: "Account Setting",
      subItems: [
        "Personal Information",
        "Billing Address",
        "Shipping Address",
        "Change Password",
        "Manage Accounts",
      ],
    },
    {
      name: "Security",
      subItems: [
        "Two-Factor Authentication",
        "Login Activity",
        "Connected Accounts",
        "Privacy Settings",
      ],
    },
    {
      name: "Orders",
      subItems: ["Past Orders", "Returns & Refunds", "Saved Items"],
    },
    {
      name: "Payment & Subscriptions",
      subItems: [
        "Saved Payment Methods",
        "Subscription Plans",   
        "Billing History",
      ],
    },
    {
      name: "Notification Settings",
      subItems: [
        "Email & SMS Preferences",
        "Push Notifications",
        "Marketing Preferences",
      ],
    },
    {
      name: "Language Preference",
      subItems: ["English(en)", "French"],
    },
  ];

  // Toggle sub-items visibility
  const toggleItemClick = (mainItem) => {
    if (expandedItem === mainItem) {
      setExpandedItem(null);
    } else {
      setExpandedItem(mainItem);
    }
  };

  // Handle sub-item click
  const handleSubItemClick = (mainItem, subItem) => {
    setActiveItem(mainItem);
    setActiveSubItem(subItem);
  };

  const renderActiveSection = () => {
    switch (activeItem) {
      case "Account Setting":
        return <AccountSection activeSubItem={activeSubItem} />;
      case "Security":
        return (
          <div className="active-section">
            <h2>Security Settings</h2>
            <p>{activeSubItem} has been chosen.</p>
          </div>
        );
      case "Orders":
        return (
          <div className="active-section">
            <h2>Order Settings</h2>
            <p>{activeSubItem} has been chosen.</p>
          </div>
        );
      default:
        return (
          <section className="landing-page">
            {/* <h2>Welcome to Settings</h2>
            <p>Select a section to get started.</p> */}
            <div className="settings-grid">
              {menuItems.map((menuItem, index) => (
                <div key={index} className="settings-card">
                  <div className="card-icon">
                    {menuItem.name === "Account Setting" ? <AccountCircle fontSize="large" /> :
                    menuItem.name === "Security" ? <Security fontSize="large" /> :
                    menuItem.name === "Orders" ? <LocalShipping fontSize="large" /> :
                    menuItem.name === "Payment & Subscriptions" ? <Payment fontSize="large" /> :
                    menuItem.name === "Notification Settings" ? <Notifications fontSize="large" /> :
                    menuItem.name === "Language Preference" ? <Language fontSize="large" /> : <Settings fontSize="large" />}
                  </div>
                  <div className="card-content">
                    <h3>{menuItem.name}</h3>
                    <p>
                      {menuItem.name === "Account Setting"
                        ? "Manage your personal details, addresses, and passwords."
                        : menuItem.name === "Security"
                        ? "Secure your account with two-factor authentication and privacy settings."
                        : menuItem.name === "Orders"
                        ? "Track, return, or cancel orders, and view order history."
                        : menuItem.name === "Payment & Subscriptions"
                        ? "Manage payment methods, subscriptions, and billing history."
                        : menuItem.name === "Notification Settings"
                        ? "Customize your email, SMS, and push notification preferences."
                        : menuItem.name === "Language Preference"
                        ? "Set your preferred language for the platform."
                        : "Explore this section to manage your settings."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
    }
  };

  return (
    <div className="main-page-settings">
      {/* Sidebar */}
      <div className="settings-side-bar">
        <h2>Settings</h2>
        <ul className="setting-item-list">
          {menuItems.map((menuItem, index) => (
            <li key={index}>
              <div
                className="item-header"
                onClick={() => toggleItemClick(menuItem.name)}
              >
                <span>{menuItem.name}</span>
                <span>
                  {expandedItem === menuItem.name ? (
                    <MdKeyboardArrowDown />
                  ) : (
                    <MdKeyboardArrowRight />
                  )}
                </span>
              </div>
              {expandedItem === menuItem.name && (
                <ul className="side-item-list">
                  {menuItem.subItems.map((subitem, subIndex) => (
                    <li
                      key={subIndex}
                      onClick={() => handleSubItemClick(menuItem.name, subitem)}
                    >
                      {subitem}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="settings-main-content">
        {/* <h1 className="settings-main-header">
          {activeItem} - {activeSubItem}
        </h1> */}
        {renderActiveSection()}
      </div>
    </div>
  );
};

export default GeneralSettings;