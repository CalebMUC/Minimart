import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // React Icons for the arrow
import packageInfo from "../../package.json";
import "../../src/CSS/Header.css";
import "../../src/CSS/Dropdown.css";
import { cartContext } from "./CartContext";
import { fetchRoleModules, fetchSubModuleCategories } from "../Data.js";

const Header = () => {
  const [dashboardModules, setDashboardModules] = useState([]); // Store modules and submodules
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [username, setUsername] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubModule, setSelectedSubModule] = useState(null); // Track selected submodule

  const { cartCount, GetCartItems } = useContext(cartContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch modules based on user role
  const fetchModules = async () => {
    try {
      const token = localStorage.getItem("token");
      const RoleID = token ? localStorage.getItem("userRole") || "User" : "User";

      const response = await fetchRoleModules(RoleID);
      setDashboardModules(response);
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  // Fetch subcategories for a specific submodule
  const fetchSubcategories = async (subModuleID) => {
    try {
      const response = await fetchSubModuleCategories(subModuleID);
      setSubCategories(response);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  // Fetch modules and subcategories on component mount
  useEffect(() => {
    fetchModules();
    GetCartItems(); // Optionally call GetCartItems to load cart items when Header mounts
  }, []);

  // Handle hover events for dropdown
  const showDropdown = () => setIsDropdownVisible(true);
  const hideDropdown = () => setIsDropdownVisible(false);

  // Toggle the sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Handle submodule click
  const handleSubModuleClick = async (subModule) => {
    try {
      // Fetch subcategories for the submodule
      const subCategories = await fetchSubModuleCategories(subModule.subModuleID);
  
      if (subCategories.length > 0) {
        // If subcategories exist, display them
        setSelectedSubModule(subModule);
        setSubCategories(subCategories);
      } else {
        // If no subcategories exist, navigate to the submodule URL
        navigate(subModule.subModuleUrl);
        setSidebarOpen(false)
      }
    } catch (error) {
      console.error("Error handling submodule click:", error);
    }
  };

  // Handle logout
  const HandleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    setUsername(null);
    setIsAdmin(false);
  };

  // Toggle visibility of submodules
  const toggleSubmodules = (moduleId) => {
    setDashboardModules((prevModules) =>
      prevModules.map((module) =>
        module.moduleID === moduleId
          ? { ...module, showAll: !module.showAll }
          : module
      )
    );
  };

  // Check for user and admin role on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const userRole = localStorage.getItem("userRole"); // Replace with actual logic
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (userRole === "admin") {
      setIsAdmin(true);
    }
  }, []);

  return (
    <>
      <header className="header">
        {/* Top Header */}
        <div className="header-top">
          <div className="header-left">
            <img
              src="/images/shopping-bag.png"
              alt="Minimart Logo"
              className="header-logo"
            />
            <span>Minimart Logo</span>
          </div>
          <div className="header-search">
            <input
              type="text"
              className="search-input"
              placeholder="Search Minimart"
            />
            <button className="search-button">
              <i className="fas fa-search"></i>
            </button>
          </div>
          <div className="header-right">
            <div
              className="header-account"
              onMouseEnter={showDropdown}
              onMouseLeave={hideDropdown}
            >
              <a href="#">
                {username != null ? (
                  <span>Hello, {username}</span>
                ) : (
                  <span>Hello</span>
                )}
                <br />
                <span>Account & Lists</span>
              </a>
              {isDropdownVisible && (
                <div className="dropdown-content">
                  <Link to="/Login">
                    <i className="fas fa-sign-in-alt"></i>
                    Sign In
                  </Link>
                  <Link to="/profile">
                    <i className="fas fa-user"></i>
                    My Profile
                  </Link>
                  <Link to="/account-settings">
                    <i className="fas fa-cog"></i>
                    Account Settings
                  </Link>
                  <Link to="/device-management">
                    <i className="fas fa-mobile-alt"></i>
                    Device Management
                  </Link>
                  <Link onClick={HandleLogout} to="/Login">
                    <i className="fas fa-sign-out-alt"></i>
                    Sign Out
                  </Link>
                </div>
              )}
            </div>
            <div className="header-orders">
              <a href="#" onClick={() => navigate("/Orders")}>
                <span>Returns</span>
                <span>& Orders</span>
              </a>
            </div>
            <div className="header-cart">
              <a href="#" onClick={() => navigate("/ProductPage")}>
                <i className="fas fa-shopping-cart"></i>
                <span id="itemCount">{cartCount}</span>
                <span>Cart</span>
              </a>
            </div>
          </div>
        </div>
        {/* Sub Header */}
        <div className="sub-header">
          <div className="sub-header-menu">
            <a href="#" onClick={toggleSidebar}>
              <i className="fas fa-bars"></i>
              <span>All</span>
            </a>
          </div>
          <div className="sub-header-links">
            <a href="#">Great Deals</a>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          {username != null ? (
            <span>Hello, {username}</span>
          ) : (
            <span>Hello</span>
          )}
          <button className="close-btn" onClick={toggleSidebar}>
            &times;
          </button>
        </div>
        <div className="sidebar-content">
            {selectedSubModule ? (
              <>
                <button className="back-btn" onClick={() => setSelectedSubModule(null)}>
                  &larr; Back to {selectedSubModule.ModuleName}
                </button>
                <div className="subcategory-group">
                  <h4>{selectedSubModule.subModuleName}</h4>
                  <ul>
                    {subCategories.map((subCategory) => (
                      <li key={subCategory.subCategoryID}>
                        <Link to={subCategory.subCategoryUrl}>
                          {subCategory.subCategoryName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              dashboardModules.map((module) => (
                <div key={module.moduleID} className="module-group">
                  <h3>{module.moduleName}</h3>
                  <ul>
                    {module.subModules.slice(
                      0,
                      module.showAll ? module.subModules.length : 5
                    ).map((subModule) => (
                      <li key={subModule.subModuleID}>
                         <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault(); // Prevent default link behavior
                            handleSubModuleClick(subModule);
                          }}
                        >
                          {subModule.subModuleName}
                        </a>
                      </li>
                    ))}
                  </ul>
                  {module.subModules.length > 5 && (
                    <button
                      className="see-all-btn"
                      onClick={() => toggleSubmodules(module.moduleID)}
                    >
                      {module.showAll ? "See Less" : "See All"}
                      {module.showAll ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
      </div>
    </>
  );
};

export default Header;