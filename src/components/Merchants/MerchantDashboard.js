import React, { useState } from "react";
import { Link } from "react-router-dom";
import MerchantsMainContent from "../Merchants/MerchantsMainContent";
import Products from "../../components/Products/AddProducts";
import Orders from "../../components/Merchants/MerchantOrders";
import Reports from "../../components/Reports";
import Settings from "../../components/Settings/GeneralSettings";
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
} from "react-icons/fa";

const CustomerFeedback = () => <div>Customer Feedback Content</div>;

const MerchantDashboard = () => {
  const [showAddProducts, setShowAddProducts] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);
  const [merchantId, setMerchantId] = useState(4); // Example merchantId
  const [orderId, setOrderId] = useState(null); // Example orderId

  const sidebarItems = [
    {
      id: 1,
      name: "Home",
      menuUrl: "/Merchant/MerchantsMainContent",
      icon: <FaHome className="text-xl" />,
      component: <MerchantsMainContent />,
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
      menuUrl: `/Merchants/${merchantId}/${orderId}`, // Dynamic URL
      icon: <FaShoppingCart className="text-xl" />,
      component: <Orders />,
    },
    {
      id: 4,
      name: "Reports",
      menuUrl: "/Reports",
      icon: <FaFileAlt className="text-xl" />,
      component: <Reports />,
    },
    {
      id: 5,
      name: "Customer Feedback",
      menuUrl: "/customerFeedback",
      icon: <FaComments className="text-xl" />,
      component: <CustomerFeedback />,
    },
    {
      id: 6,
      name: "Settings",
      menuUrl: "/Settings/GeneralSettings",
      icon: <FaCog className="text-xl" />,
      component: <Settings />,
    },
  ];

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleAddProducts = () => {
    setShowAddProducts(true);
  };

  const handleCloseAddProducts = () => {
    setShowAddProducts(false);
  };

  const handleSidebarItemClick = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {isSidebarVisible && (
        <div
          className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 overflow-y-auto transition-all duration-300 ${
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
                {sidebarItem.name === "Orders" ? (
                  <Link
                    to={sidebarItem.menuUrl}
                    className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-blue-50 rounded"
                  >
                    {sidebarItem.icon}
                    {!isSidebarCollapsed && <span>{sidebarItem.name}</span>}
                  </Link>
                ) : (
                  <button
                    onClick={() => handleSidebarItemClick(sidebarItem.component)}
                    className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-blue-50 rounded w-full text-left"
                  >
                    {sidebarItem.icon}
                    {!isSidebarCollapsed && <span>{sidebarItem.name}</span>}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarVisible ? (isSidebarCollapsed ? "ml-16" : "ml-64") : "ml-0"
        }`}
      >
        <div className="bg-faintblue shadow-md p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4 text-white">
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
          <div className="flex items-center">
            <FaBell className="text-2xl text-gray-600 hover:text-blue-600 cursor-pointer" />
          </div>
        </div>

        {showAddProducts ? (
          <AddProducts onClose={handleCloseAddProducts} />
        ) : (
          activeComponent || <MerchantsMainContent />
        )}
      </div>
    </div>
  );
};

export default MerchantDashboard;