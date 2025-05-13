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

                      return (
                        <div
                          key={index}
                          className="flex-shrink-0 w-52 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 snap-start"
                        >
                          <Link to={`/product/${encodeURIComponent(product.productName)}/${product.productID}`} className="block">
                            {/* Discount tag */}
                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                              -{(discount * 100).toFixed(0)}%
                            </div>

                            
                             {/* Product image */}
                            <div className="h-40 flex items-center justify-center p-4">
                              <img
                                src={firstImage}  
                                alt={product.productName}
                                className="max-h-full max-w-full object-contain"
                                onError={(e) => {
                                  e.target.onerror = null; 
                                  e.target.src = "/path/to/default-image.jpg";
                                }}
                              />
                            </div>

                            {/* Product details */}
                            <div className="p-4">
                              {/* Product name */}
                              <h3 className="text-sm font-medium text-blue-800 mb-2 line-clamp-3 h-14 hover:underline">
                                {product.productName}
                              </h3>

                              {/* Rating */}
                              <div className="flex items-center mb-2">
                                <div className="flex text-yellow-400">
                                  {[...Array(5)].map((_, i) => (
                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500 ml-1">(3000)</span>
                              </div>

                              {/* Stock status */}
                              <p className={`text-xs mb-2 ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                {product.inStock ? 'In Stock' : 'Low Stock'}
                              </p>

                              {/* Pricing */}
                              <div className="mt-2">
                                <span className="text-xs text-gray-500 line-through mr-2">
                                  KSH {product.price.toLocaleString()}
                                </span>
                                <span className="text-base font-bold text-red-600">
                                  KSH {discountedPrice.toLocaleString()}
                                </span>
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