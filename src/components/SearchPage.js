import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchFilterSidebar from "./SearchFilterSidebar";
import ProductGrid from "./ProductGrid";
import { FetchSearchProducts, FetchFeatures, FetchFilteredProducts, GetProductsSearch } from "../Data.js";
import { FiFilter, FiX } from "react-icons/fi";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('q');
  
  const [features, setFeatures] = useState([]);
  const [filters, setFilters] = useState({});
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [CategoryID, setCategoryID] = useState(0);
  const [SubCategoryID, setSubCategoryID] = useState(0);
  const [priceRange, setPriceRange] = useState([10000, 200000]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const productsPerPage = 12;

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (searchQuery) {
          const [productsData] = await Promise.all([
            GetProductsSearch(searchQuery),
          ]);

          setCategoryID(productsData[0]?.categoryId || 0);
          setSubCategoryID(productsData[0]?.subCategoryId || 0);

          const requestData = {
            categoryID: productsData[0]?.categoryId || 0,
            subCategoryID: productsData[0]?.subCategoryId || 0,
            subSubCategoryID: 0
          };

          const featuresData = await FetchFeatures(requestData);

          setProducts(productsData || []);
          setFeatures(featuresData || []);
          setTotalPages(Math.ceil(productsData.total / productsPerPage));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [searchQuery]);

  useEffect(() => {
    if (Object.keys(filters).length > 0 || priceRange) {
      const fetchFilteredResults = async () => {
        setIsLoading(true);
        try {
          const filteredData = await FetchFilteredProducts({
            searchQuery,
            filters,
            page: currentPage,
            pageSize: productsPerPage,
            categoryID: CategoryID,
            subCategoryID: SubCategoryID,
            minPrice: priceRange[0], 
            maxPrice: priceRange[1]
          });
          setProducts(filteredData.data || []);
          setTotalPages(Math.ceil(filteredData.total / productsPerPage));
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchFilteredResults();
    }
  }, [filters, currentPage, searchQuery, priceRange, CategoryID, SubCategoryID]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        Error: {error}. Please try again later.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Mobile Filter Button */}
      {isMobile && (
        <button
          onClick={toggleMobileFilters}
          className="fixed bottom-6 right-6 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors md:hidden"
        >
          <FiFilter className="text-xl" />
        </button>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar - Desktop */}
        {!isMobile && (
          <div className="w-full md:w-1/4 lg:w-1/5">
            <SearchFilterSidebar 
              features={features} 
              setFilters={setFilters} 
              currentFilters={filters}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>
        )}

        {/* Mobile Filters Overlay */}
        {isMobile && showMobileFilters && (
          <div className="fixed inset-0 z-30 bg-black bg-opacity-50" onClick={toggleMobileFilters}></div>
        )}

        {/* Mobile Filters Sidebar */}
        {isMobile && (
          <div 
            className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-40 shadow-xl transform transition-transform duration-300 ease-in-out ${
              showMobileFilters ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="p-4 h-full overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={toggleMobileFilters} className="text-gray-500 hover:text-gray-700">
                  <FiX className="text-xl" />
                </button>
              </div>
              <SearchFilterSidebar 
                features={features} 
                setFilters={setFilters} 
                currentFilters={filters}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
              />
              <div className="mt-4 p-4">
                <button
                  onClick={toggleMobileFilters}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`w-full ${isMobile ? '' : 'md:w-3/4 lg:w-4/5'}`}>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  {searchQuery && `Results for "${searchQuery}"`}
                  <span className="ml-2 text-gray-500">
                    ({products.length} {products.length === 1 ? 'item' : 'items'})
                  </span>
                </h2>
                {isMobile && (
                  <button
                    onClick={toggleMobileFilters}
                    className="flex items-center text-blue-600 hover:text-blue-800 md:hidden"
                  >
                    <FiFilter className="mr-1" />
                    Filters
                  </button>
                )}
              </div>

              <ProductGrid
                products={products}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;