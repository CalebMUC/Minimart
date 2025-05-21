import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import packageInfo from "../../package.json";
import AdSlider from "../components/AdSlider";
import { FetchNestedCategories } from "../Data";

const MainPage = () => {
  const [categories, setCategories] = useState([]);
  const [subCategoryProducts, setSubCategoryProducts] = useState({});
  const [selectedSubCategories, setSelectedSubCategories] = useState({});
  const navigate = useNavigate();
  
  // Create refs for each category carousel
  const scrollRefs = useRef({});

  const scrollLeft = (categoryId) => {
    if (scrollRefs.current[categoryId]) {
      scrollRefs.current[categoryId].scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = (categoryId) => {
    if (scrollRefs.current[categoryId]) {
      scrollRefs.current[categoryId].scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  // Load nested categories
  useEffect(() => {
    const LoadNestedCategories = async () => {
      try {
        const response = await FetchNestedCategories();
        setCategories(response);
        
        // Initialize selected subcategories with the first subcategory of each category
        const initialSelections = {};
        response.forEach(category => {
          if (category.subCategories && category.subCategories.length > 0) {
            initialSelections[category.categoryId] = category.subCategories[0].categoryId;
          }
        });
        setSelectedSubCategories(initialSelections);
      } catch (error) {
        console.error(error);
      }
    };
    LoadNestedCategories();
  }, []);

  // Fetch products for selected subcategories
  useEffect(() => {
    const fetchProductsForSubCategories = async () => {
      const productsMap = {};
      
      for (const [categoryId, subCategoryId] of Object.entries(selectedSubCategories)) {
        try {
          const response = await fetch(packageInfo.urls.GetProductsByCategory, {
            method: "POST",
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              categoryID: subCategoryId,
            }),
          });
          
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          
          const products = await response.json();
          productsMap[categoryId] = products;
        } catch (error) {
          console.error(`Failed to fetch products for subcategory ${subCategoryId}:`, error);
          productsMap[categoryId] = [];
        }
      }
      
      setSubCategoryProducts(productsMap);
    };
    
    if (Object.keys(selectedSubCategories).length > 0) {
      fetchProductsForSubCategories();
    }
  }, [selectedSubCategories]);

  const handleSubCategoryChange = (categoryId, subCategoryId) => {
    setSelectedSubCategories(prev => ({
      ...prev,
      [categoryId]: subCategoryId
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Ad Slider at the top */}
      <AdSlider />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Loop through categories */}
        {categories.map((category) => {
          // Skip categories without subcategories
          if (!category.subCategories || category.subCategories.length === 0) {
            return null;
          }
          
          const currentSubCategoryId = selectedSubCategories[category.categoryId];
          const currentProducts = subCategoryProducts[category.categoryId] || [];
          
          return (
            <div key={category.categoryId} className="mb-12">
              {/* Category Header */}
              <div className="bg-yellow-500 text-white px-3 py-1 rounded-t-lg shadow-md">
                <h2 className="text-l font-bold">{category.categoryName}</h2>
              </div>
              
              {/* Subcategory dropdown */}
              <div className="bg-white px-4 py-2 shadow-sm">
                <select
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                  value={currentSubCategoryId}
                  onChange={(e) => handleSubCategoryChange(category.categoryId, parseInt(e.target.value))}
                >
                  {category.subCategories.map(subCategory => (
                    <option key={subCategory.categoryId} value={subCategory.categoryId}>
                      {subCategory.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Products Carousel */}
              {currentProducts.length > 0 ? (
                <div className="relative group">
                  {/* Left Scroll Button */}
                  <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-blue-600 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg hover:bg-blue-700"
                    onClick={() => scrollLeft(category.categoryId)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Products Container */}
                  <div
                    ref={(el) => (scrollRefs.current[category.categoryId] = el)}
                    className="flex space-x-4 py-6 px-2 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar"
                  >
                    {currentProducts.map((product, index) => {
                      const discount = 0.10; // 10% discount 
                      const discountedPrice = (product.price * (1 - discount)).toFixed(2);

                      // Parse the productImage string into an actual array
                        const productImages = JSON.parse(product.productImage);
                        const firstImage = productImages[0]; // Get the first image
                        const showDiscount = true;

                      return (
                            <div className="flex flex-col w-52 p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                              {showDiscount && (
                                <div className="absolute bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                                  -{(discount * 100).toFixed(0)}%
                                </div>
                              )}
                              <Link to={`/product/${encodeURIComponent(product.productName)}/${product.productID}`}>
                                <img 
                                  src={firstImage} 
                                  alt={product.productName}
                                  className="w-full h-40 object-contain" 
                                />
                                <div className="mt-3 space-y-1">
                                  <h3 className="text-sm font-medium hover:underline line-clamp-3">{product.productName}</h3>
                                  <div className={`text-xs ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.inStock ? "In Stock" : "Low Stock"}
                                  </div>
                                  <div className="flex items-center text-xs text-yellow-500">
                                    ⭐{4.5} ({30000})
                                  </div>
                                  {showDiscount && (
                                    <div className="text-xs text-gray-500 line-through">
                                      Was KSH {product.price.toLocaleString()}
                                    </div>
                                  )}
                                  <div className="text-base font-bold text-gray-800">
                                    KSH {showDiscount ? discountedPrice.toLocaleString() : product.price.toLocaleString()}
                                  </div>
                                </div>
                              </Link>
                            </div>
                          );
                    })}
                  </div>

                  {/* Right Scroll Button */}
                  <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-blue-600 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg hover:bg-blue-700"
                    onClick={() => scrollRight(category.categoryId)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="bg-white p-8 text-center text-gray-500">
                  No products available in this category
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MainPage;