import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaChevronDown, FaChevronUp, FaSearch, FaBars, FaTimes, FaUser, FaCog, FaMobileAlt, FaSignOutAlt, FaSignInAlt, FaShoppingCart } from "react-icons/fa";
import packageInfo from "../../package.json";
import { cartContext } from "./CartContext";
import { fetchRoleModules, fetchSubModuleCategories } from "../Data.js";

const Header = () => {
  const [dashboardModules, setDashboardModules] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [username, setUsername] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubModule, setSelectedSubModule] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [query, setQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { cartCount, GetCartItemsAsync } = useContext(cartContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Mock function to fetch suggestions - replace with your actual API call
  const fetchSearchSuggestions = async (searchTerm) => {
    // In a real app, you would fetch these from your backend
    const mockSuggestions = [
      "Q laptop",
      "Q lap",
      "Q lap desk", 
      "Q laptop stand",
      "Q lap table",
      "Q lap tray",
      "Q lap pillow"
    ];
    
    return mockSuggestions.filter(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 0) {
      const suggestions = await fetchSearchSuggestions(value);
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    // Navigate to search results or perform search
    // navigate(`/search?q=${suggestion}`);
  };

  const handleSearchSubmit = () => {
    setShowSuggestions(false);
    // Perform search with the query
    // navigate(`/search?q=${query}`);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const fetchSubcategories = async (subModuleID) => {
    try {
      const response = await fetchSubModuleCategories(subModuleID);
      setSubCategories(response);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  useEffect(() => {
    fetchModules();
    GetCartItemsAsync();
  }, []);

  const showDropdown = () => setIsDropdownVisible(true);
  const hideDropdown = () => setIsDropdownVisible(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleSubModuleClick = async (subModule) => {
    try {
      const subCategories = await fetchSubModuleCategories(subModule.subModuleID);
  
      if (subCategories.length > 0) {
        setSelectedSubModule(subModule);
        setSubCategories(subCategories);
      } else {
        navigate(subModule.subModuleUrl);
        setSidebarOpen(false);
      }
    } catch (error) {
      console.error("Error handling submodule click:", error);
    }
  };

  const HandleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    setUsername(null);
    setIsAdmin(false);
  };

  const toggleSubmodules = (moduleId) => {
    setDashboardModules((prevModules) =>
      prevModules.map((module) =>
        module.moduleID === moduleId
          ? { ...module, showAll: !module.showAll }
          : module
      )
    );
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const userRole = localStorage.getItem("userRole");
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (userRole === "admin") {
      setIsAdmin(true);
    }
  }, []);

  return (
    <>
      {/* Header */}
      <header className="bg-blue-600 text-white">
        {/* Top Header */}
        <div className="container mx-auto px-4 py-2">
          {/* First Row - Logo and Right Items */}
          <div className="flex items-center justify-between pb-2">
            {/* Left Section - Logo and Menu */}
            <div className="flex items-center space-x-4">
              <button 
                className="flex items-center hover:underline md:hidden"
                onClick={toggleSidebar}
              >
                <FaBars className="mr-1" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="bg-white p-1 rounded shadow-md">
                  <img
                    src="/images/shopping-bag.png"
                    alt="Minimart Logo"
                    className="w-8 h-8"
                  />
                </div>
                <span className="font-semibold">Minimart</span>
              </div>
            </div>

            {/* Center Section - Search (hidden on mobile) */}
            {!isMobileView && (
              <div className="flex-1 max-w-xl mx-4 relative">
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={handleSearchChange}
                    onFocus={() => query.length > 0 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full py-2 px-4 rounded-l focus:outline-none text-gray-800"
                    placeholder="Search Minimart"
                  />
                  <button 
                    onClick={handleSearchSubmit}
                    className="absolute right-0 top-0 h-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-4 rounded-r flex items-center justify-center"
                  >
                    <FaSearch />
                  </button>
                </div>
                
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-md shadow-lg z-50 mt-1">
                    <ul className="py-1">
                      {searchSuggestions.map((suggestion, index) => (
                        <li 
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <FaSearch className="text-gray-400 mr-2" />
                          <span className="text-gray-500">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Right Section - Navigation */}
            <div className="flex items-center space-x-6">
              {/* Account Dropdown */}
              <div 
                className="relative group hidden md:block"
                onMouseEnter={showDropdown}
                onMouseLeave={hideDropdown}
              >
                <div className="flex flex-col items-center cursor-pointer">
                  <span className="text-xs">
                    {username ? `Hello, ${username}` : "Hello"}
                  </span>
                  <span className="text-sm font-semibold">Account & Lists</span>
                </div>
                
                {isDropdownVisible && (
                  <div className="absolute right-0 mt-1 w-56 bg-white rounded-md shadow-lg z-50 text-gray-800">
                    <div className="py-1">
                      {username ? (
                        <>
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                          >
                            <FaUser className="mr-2" /> My Profile
                          </Link>
                          <Link
                            to="/account-settings"
                            className="block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                          >
                            <FaCog className="mr-2" /> Account Settings
                          </Link>
                          <Link
                            to="/device-management"
                            className="block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                          >
                            <FaMobileAlt className="mr-2" /> Device Management
                          </Link>
                          <button
                            onClick={HandleLogout}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                          >
                            <FaSignOutAlt className="mr-2" /> Sign Out
                          </button>
                        </>
                      ) : (
                        <Link
                          to="/Login"
                          className="block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                        >
                          <FaSignInAlt className="mr-2" /> Sign In
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Returns & Orders */}
              <div 
                className="flex flex-col items-center cursor-pointer hidden md:flex"
                onClick={() => navigate("/ReturnsAndOrdersPage")}
              >
                <span className="text-xs">Returns</span>
                <span className="text-sm font-semibold">& Orders</span>
              </div>

              {/* Cart */}
              <div 
                className="flex items-center cursor-pointer relative"
                onClick={() => navigate("/ProductPage")}
              >
                <div className="relative">
                  <FaShoppingCart className="text-2xl" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="ml-1 text-sm font-semibold hidden md:block">Cart</span>
              </div>

              {/* Mobile Profile Dropdown Trigger */}
              <button 
                onClick={() => setIsDropdownVisible(!isDropdownVisible)}
                className="flex items-center md:hidden"
              >
                <FaUser className="text-xl" />
              </button>
            </div>
          </div>

          {/* Second Row - Search Bar (only on mobile) */}
          {isMobileView && (
            <div className="w-full pb-2 relative">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={handleSearchChange}
                  onFocus={() => query.length > 0 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full py-2 px-4 rounded-l focus:outline-none text-gray-800"
                  placeholder="Search Minimart"
                />
                <button 
                  onClick={handleSearchSubmit}
                  className="absolute right-0 top-0 h-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-4 rounded-r flex items-center justify-center"
                >
                  <FaSearch />
                </button>
              </div>
              
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-md shadow-lg z-50 mt-1">
                  <ul className="py-1">
                    {searchSuggestions.map((suggestion, index) => (
                      <li 
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <FaSearch className="text-gray-400 mr-2" />
                        <span className="text-gray-500">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Mobile Dropdown */}
          {isMobileView && isDropdownVisible && (
            <div className="absolute right-4 mt-2 w-56 bg-white rounded-md shadow-lg z-50 text-gray-800 border border-gray-200">
              <div className="py-2">
                <div className="px-4 py-2 font-medium border-b border-gray-200">
                  {username ? `Hello, ${username}` : "Hello, Sign In"}
                </div>
                
                <div className="py-1">
                  <h4 className="px-4 py-2 font-medium">Account</h4>
                  {username ? (
                    <>
                      <Link
                        to="/profile"
                        className="block px-6 py-2 text-sm hover:bg-gray-100"
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/account-settings"
                        className="block px-6 py-2 text-sm hover:bg-gray-100"
                      >
                        Account Settings
                      </Link>
                      <button
                        onClick={HandleLogout}
                        className="w-full text-left px-6 py-2 text-sm hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/Login"
                      className="block px-6 py-2 text-sm hover:bg-gray-100"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
                
                <div className="border-t border-gray-200"></div>
                
                <div className="py-1">
                  <h4 className="px-4 py-2 font-medium">Orders</h4>
                  <div 
                    onClick={() => navigate("/ReturnsAndOrdersPage")}
                    className="block px-6 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    Returns & Orders
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sub Header */}
        <div className="bg-blue-400">
          <div className="container mx-auto px-4 py-2 flex items-center">
            {/* Sidebar Toggle (hidden on mobile) */}
            <button 
              className="hidden md:flex items-center mr-4 hover:underline"
              onClick={toggleSidebar}
            >
              <FaBars className="mr-1" />
              <span>All</span>
            </button>

            {/* Navigation Links */}
            <div className="flex space-x-4">
              <a href="#" className="hover:underline">Great Deals</a>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-white shadow-xl z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="bg-blue-400 text-white px-4 py-3 flex justify-between items-center">
            <div>
              {username ? `Hello, ${username}` : "Hello"}
            </div>
            <button 
              onClick={toggleSidebar}
              className="text-white hover:text-gray-200"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {selectedSubModule ? (
              <>
                <button 
                  onClick={() => setSelectedSubModule(null)}
                  className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
                >
                  <span className="mr-1">&larr;</span> Back to {selectedSubModule.ModuleName}
                </button>
                <div className="mb-6">
                  <h4 className="font-bold text-lg mb-2">{selectedSubModule.subModuleName}</h4>
                  <ul className="space-y-2">
                    {subCategories.map((subCategory) => (
                      <li key={subCategory.subCategoryID}>
                        <Link 
                          to={subCategory.subCategoryUrl}
                          className="block py-1 text-gray-700 hover:text-blue-600"
                        >
                          {subCategory.subCategoryName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              dashboardModules.map((module) => (
                <div key={module.moduleID} className="mb-6">
                  <h3 className="font-bold text-lg mb-2">{module.moduleName}</h3>
                  <ul className="space-y-1">
                    {module.subModules.slice(
                      0,
                      module.showAll ? module.subModules.length : 5
                    ).map((subModule) => (
                      <li key={subModule.subModuleID}>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleSubModuleClick(subModule);
                          }}
                          className="w-full text-left py-1 text-gray-700 hover:text-blue-600"
                        >
                          {subModule.subModuleName}
                        </button>
                      </li>
                    ))}
                  </ul>
                  {module.subModules.length > 5 && (
                    <button
                      className="text-blue-600 hover:text-blue-800 mt-2 flex items-center"
                      onClick={() => toggleSubmodules(module.moduleID)}
                    >
                      {module.showAll ? "See Less" : "See All"}
                      {module.showAll ? (
                        <FaChevronUp className="ml-1" />
                      ) : (
                        <FaChevronDown className="ml-1" />
                      )}
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Header;