import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdminMainContent from "../../components/Administrator/AdminMainContent";
import Products from "../../components/Products/AddProducts"
import Orders from "../Administrator/AdminOrders"
import MaintainMerchants from "../../components/Merchants/MaintainMerchants"
import Reports from "../../components/Reports"
import Settings from "../../components/Settings/GeneralSettings"

import AddProducts from "../../components/Products/AddProducts";
import {
  FaTachometerAlt,
  FaBell,
  FaPlus,
  FaChartLine,
  FaTimes,
  FaBox,
  FaShoppingCart,
  FaFileAlt,
  FaComments,
  FaCog,
  FaHome,
  FaBusinessTime,
} from "react-icons/fa";
const CustomerFeedback = () => <div>Customer Feedback Content</div>;

const AdminDashboard = () => {
  // State to manage whether to show the AddProducts component
  const [showAddProducts, setShowAddProducts] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(true); // Sidebar is visible by default
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false); // Sidebar is not collapsed by default
  const [activeComponent, setActiveComponent] = useState(null);


  // Sidebar items with icons
  const sidebarItems = [
    {
      id: 1,
      name: "Home",
      menuUrl: "/Merchant/MerchantsMainContent",
      icon: <FaHome className="text-xl" />,
      component: <AdminMainContent />,
    },
    {
      id: 2,
      name: "Products",
      menuUrl: "/products/addProducts",
      icon: <FaBox className="text-xl" />,
      component: <Products />,
    },
    {
      id: 3,
      name: "Orders",
      menuUrl: "/Admin/AdminOrders",
      icon: <FaShoppingCart className="text-xl" />,
      component: <Orders />,
    },
    {
        id: 4,
        name: "Merchants",
        menuUrl: "/Merchants/MaintainMerchants",
        icon: <FaBusinessTime className="text-xl" />,
        component: <MaintainMerchants />,
    },
    {
      id: 5,
      name: "Reports",
      menuUrl: "/Reports",
      icon: <FaFileAlt className="text-xl" />,
      component: <Reports />,
    },
    {
      id: 6,
      name: "Customer Feedback",
      menuUrl: "/customerFeedback",
      icon: <FaComments className="text-xl" />,
      component: <CustomerFeedback />,
    },
    {
      id: 7,
      name: "Settings",
      menuUrl: "/Settings/GeneralSettings",
      icon: <FaCog className="text-xl" />,
      component: <Settings />,
    },
  ];

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  // Toggle sidebar collapse
  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  // Function to handle the "Add Product" button click
  const handleAddProducts = () => {
    setShowAddProducts(true);
  };

  // Function to close the AddProducts component
  const handleCloseAddProducts = () => {
    setShowAddProducts(false);
  };
  
  const handleSidebarItemClick = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      {isSidebarVisible && (
        <div
          className={`fixed top-0 left-0 h-full bg-faintblue shadow-lg z-50 overflow-y-auto transition-all duration-300 ${
            isSidebarCollapsed ? "w-16" : "w-64"
          }`}
        >
          <div className="p-4 flex justify-between items-center border-b">
            {!isSidebarCollapsed && <h2 className="text-xl font-bold">Menu</h2>}
            <button
              onClick={toggleSidebarCollapse}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              {isSidebarCollapsed ? (
                <FaTachometerAlt className="text-2xl" />
              ) : (
                <FaTimes className="text-2xl" />
              )}
            </button>
          </div>
          <ul className="p-4">
            {sidebarItems.map((sidebarItem) => (
              <li key={sidebarItem.id} className="mb-2">
                {/* <Link
                  to={sidebarItem.menuUrl}
                  className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-blue-50 rounded"
                >
                  {sidebarItem.icon}
                  {!isSidebarCollapsed && <span>{sidebarItem.name}</span>}
                </Link> */}

                <button
                  onClick={() => handleSidebarItemClick(sidebarItem.component)}
                  className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-blue-50 rounded w-full text-left"
                >
                  {sidebarItem.icon}
                  {!isSidebarCollapsed && <span>{sidebarItem.name}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarVisible ? (isSidebarCollapsed ? "ml-16" : "ml-64") : "ml-0"
        }`}
      >
        {/* Header */}
        <div className="bg-faintblue shadow-md p-4 flex justify-between items-center">
          {/* Left Section: Dashboard Icon and Quick Links */}
          <div className="flex items-center space-x-4 text-white">
            {/* <button onClick={toggleSidebar} className="focus:outline-none">
              <FaTachometerAlt className="text-2xl text-blue-600" />
            </button> */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddProducts}
                className="flex items-center space-x-2 text-white hover:text-blue-600"
              >
                <FaPlus className="text-lg" />
                <span>Add Product</span>
              </button>
              <button className="flex items-center space-x-2 text-white hover:text-blue-600">
                <FaChartLine className="text-lg" />
                <span>View Reports</span>
              </button>
            </div>
          </div>

          {/* Right Section: Notifications */}
          <div className="flex items-center">
            <FaBell className="text-2xl text-gray-600 hover:text-blue-600 cursor-pointer" />
          </div>
        </div>

        {/* Main Content Area */}
        {showAddProducts ? (
          <AddProducts onClose={handleCloseAddProducts} />
        ) : (
          
          activeComponent || <AdminMainContent />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;