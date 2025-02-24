import React, { useState, useEffect } from "react";
import SearchFilterSidebar from "./SearchFilterSidebar";
import ProductGrid from "./ProductGrid";
import "../../src/CSS/SearchPage.css";
import { FetchSearchProducts, FetchFeatures,FetchFilteredProducts } from "../Data.js";
import { useParams } from "react-router-dom";

const SearchPage = () => {
  const [features, setFeatures] = useState([]); // Available features fetched from the backend
  const [filters, setFilters] = useState({}); // Active filters set by the user
  const [allProducts, setAllProducts] = useState([]); // Products fetched without filters
  const [filteredProducts, setFilteredProducts] = useState([]); // Products fetched with filters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 10; // Number of products displayed per page
  const { categoryID, subCategoryID } = useParams();

  useEffect(() => {
    // Load all products and features when the page loads
    fetchAllProducts();
    fetchCategoryFeatures();
  }, []);

  useEffect(() => {
    // Fetch filtered products whenever filters or page changes
    if (Object.keys(filters).length > 0) {
      fetchFilteredProducts();
    }
  }, [filters, currentPage]);

  const fetchAllProducts = async () => {
    try {
      const data = await FetchSearchProducts(subCategoryID);
      setAllProducts(data|| []);
      setTotalPages(Math.ceil(data.total / productsPerPage)); // Calculate total pages based on backend response
    } catch (error) {
      console.error("Failed to fetch all products:", error);
    }
  };

  const fetchFilteredProducts = async () => {
    try {
      // Transform filters to match the "features" field format in .NET
      const transformedFilters = Object.keys(filters).reduce((acc, key) => {
        acc[key] = filters[key]; // Map each filter key to its value array
        return acc;
      }, {});
  
      // Construct the requestData object
      const requestData = {
        categoryID: categoryID, // Ensure categoryID is included
        subCategoryID: subCategoryID, // Ensure subCategoryID is included
        features: transformedFilters // Attach transformed filters as "features"
      };
  
      // Call the API with the structured request data
      const data = await FetchFilteredProducts(requestData);
  
      // Update the state with the filtered products
      setFilteredProducts(data || []);
      setTotalPages(Math.ceil(data.total / productsPerPage)); // Update total pages
    } catch (error) {
      console.error("Failed to fetch filtered products:", error);
    }
  };
  

  const fetchCategoryFeatures = async () => {
    try {
      const requestData = {
        categoryID,
        subCategoryID,
      };
      const response = await FetchFeatures(requestData);
      setFeatures(response); // Set available features for the sidebar
    } catch (error) {
      console.error("Failed to fetch features:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update the current page for pagination
  };

  return (
    <div className="search-page">
      {/* Sidebar with features */}
      <SearchFilterSidebar features={features} setFilters={setFilters} />

      {/* Main content area */}
      <div className="main-content">
        {Object.keys(filters).length === 0 ? (
          <ProductGrid
            products={allProducts} // Display all products if no filters are applied
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        ) : (
          <ProductGrid
            products={filteredProducts} // Display filtered products if filters are applied
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default SearchPage;
