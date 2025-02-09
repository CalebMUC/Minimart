import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import packageInfo from "../../package.json";
import '../../src/Header.css';
import '../../src/Dropdown.css';
import { cartContext } from "./CartContext";
import { UserContext } from "./UserMainContext";
import axios from "axios"; // Add axios for API calls

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [dashboardCategories, setDashboardCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [username, setUsername] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [searchResults, setSearchResults] = useState([]); // State for search results
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]); // State for autocomplete suggestions
  const [isSearchFocused, setIsSearchFocused] = useState(false); // State to track search input focus

  const { usercontextname } = useContext(UserContext);
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

  // Handle search input change
  const handleSearchInputChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Fetch autocomplete suggestions
    if (query.length > 2) {
      try {
        const response = await axios.get(`https://localhost:44334/api/Search/SearchProducts?query=${query}`);
        setAutocompleteSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching autocomplete suggestions:", error);
      }
    } else {
      setAutocompleteSuggestions([]);
    }
  };

  // Handle search submission
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        const response = await axios.get(`https://localhost:44334/api/search?query=${searchQuery}`);
        setSearchResults(response.data);
        navigate("/search-results", { state: { results: response.data } }); // Navigate to search results page
      } catch (error) {
        console.error("Error searching:", error);
      }
    }
  };

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

  useEffect(() => {
    const handleStorageChange = () => {
      localStorage.getItem('username');
    };
    window.addEventListener('storage', handleStorageChange);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Check for user and admin role on component mount
  useEffect(() => {
    const userRole = 'admin'; // For testing
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
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                className="search-input"
                placeholder="Search Minimart"
                value={searchQuery}
                onChange={handleSearchInputChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} // Delay to allow click on suggestions
              />
              <button type="submit" className="search-button">
                <i className="fas fa-search"></i>
              </button>
            </form>
            {isSearchFocused && autocompleteSuggestions.length > 0 && (
              <div className="autocomplete-dropdown">
                {autocompleteSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="autocomplete-item"
                    onMouseDown={() => {
                      setSearchQuery(suggestion.productName);
                      setIsSearchFocused(false);
                    }}
                  >
                    <i className="fas fa-search suggestion-icon"></i>
                    {suggestion.searchKeyWord} 
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="header-right">
            <div className="header-account" onMouseEnter={showDropdown} onMouseLeave={hideDropdown}>
              <a href="#">
                {usercontextname != null ? <span>Hello, {usercontextname}</span> : <span>Hello</span>}
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
              <a href="#" onClick={() => navigate('/ReturnsAndOrdersPage')}>
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
          <div className="sub-header-links">
            <a href="./CreateMarketPlace">Create {usercontextname} Market place</a>
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
              <p>{currentCategory.name}</p>
            </>
          ) : (
            <>
              {usercontextname != null ? <span>Hello, {usercontextname}</span> : <span>Hello</span>}
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
                  <p onClick={() => handleCategoryClick(category)}>{category.name}</p>
                  <FontAwesomeIcon icon={faChevronRight} className="right-arrow-icon" />
                </div>
              ))}
              {isAdmin && (
                <>
                  <div className="category-group">
                    <h3 onClick={() => navigate('/AddProducts')}>Add Product</h3>
                  </div>
                  <div className="category-group">
                    <h3 onClick={() => navigate('/MaintainStations')}>Maintain Stations</h3>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;