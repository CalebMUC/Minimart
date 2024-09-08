import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import packageInfo from "../../package.json";
import '../../src/Header.css';
import '../../src/Dropdown.css';
import { cartContext } from "./CartContext";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [dashboardCategories, setDashboardCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [username, setUsername] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);


  const { cartCount, GetCartItems } = useContext(cartContext);

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch(packageInfo.urls.GetCategories);
      if (!response.ok) {
        throw new Error(`Network Error: ${response.statusText}`);
      }
      const data = await response.json();
      setCategories(data);
      setDashboardCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
    GetCartItems(); // Optionally call GetCartItems to load cart items when Header mounts
  }, []);

  // Handle hover events
  const showDropdown = () => setIsDropdownVisible(true);
  const hideDropdown = () => setIsDropdownVisible(false);

  // Toggle the sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
    setCurrentCategory(null); // Reset to main categories when closing/reopening sidebar
  };

  // Handle Logout
  const HandleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    setUsername(null);
    setIsAdmin(false);
  };

  // Handle category click
  const handleCategoryClick = (category) => {
    if (!category) return;
    if (category.subcategoryids && category.subcategoryids.length > 0) {
      setCurrentCategory(category);
    } else {
      navigate(`/products/${category.name}`);
    }
  };

  // Handle back navigation to parent category
  const handleBackNavigation = () => {
    if (currentCategory?.parent) {
      setCurrentCategory(currentCategory.parent);
    } else {
      setCurrentCategory(null);
    }
  };

  // Hide sidebar on navigation to other pages
  useEffect(() => {
    if (location.pathname !== "/") {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Check for user and admin role on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    // const userRole = localStorage.getItem('userRole');
    const userRole = 'admin';
    if (storedUsername) {
      setUsername(storedUsername);
    }
    //for testing
  

    if (userRole === 'admin') {
      setIsAdmin(true);
    }
  }, []);

  return (
    <>
      <header className="header">
        {/* Top Header */}
        <div className="header-top">
          <div className="header-left">
            <img src="/images/shopping-bag.png" alt="Minimart Logo" className="header-logo" />
            <span>Minimart Logo</span>
          </div>
          <div className="header-search">
            <input type="text" className="search-input" placeholder="Search Minimart" />
            <button className="search-button">
              <i className="fas fa-search"></i>
            </button>
          </div>
          <div className="header-right">
            <div className="header-account" onMouseEnter={showDropdown} onMouseLeave={hideDropdown}>
              <a href="#">
                {username != null ? <span>Hello, {username}</span> : <span>Hello</span>}
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
              <a href="#" onClick={() => navigate('/Orders')}>
                <span>Returns</span>
                <span>& Orders</span>
              </a>
            </div>
            <div className="header-cart">
              <a href="#" onClick={() => navigate('/ProductPage')}>
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
          {currentCategory ? (
            <>
              <button className="back-btn" onClick={handleBackNavigation}>
                &larr; Main Menu
              </button>
              <h3>{currentCategory.name}</h3>
            </>
          ) : (
            <>
              {username != null ? <span>Hello, {username}</span> : <span>Hello</span>}
              <button className="close-btn" onClick={toggleSidebar}>
                &times;
              </button>
            </>
          )}
        </div>
        <div className="sidebar-content">
          {currentCategory ? (
            <ul>
              {currentCategory.subcategoryids.map((sub) => (
                <li key={sub.id} className="sub-category-list">
                  <a
                    href="#"
                    onClick={() => handleCategoryClick({ ...sub, parent: currentCategory })}
                  >
                    {sub.name}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <>
              {dashboardCategories.map((category) => (
                <div key={category.id} className="category-group">
                  <h3 onClick={() => handleCategoryClick(category)}>{category.name}</h3>
                </div>
              ))}
              {isAdmin && (
                <div className="category-group">
                  <h3 onClick={() => navigate('/AddProducts')}>Add Product</h3>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
