import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import packageInfo from "../../package.json";
import AdSlider from "../components/AdSlider";

const MainPage = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const scrollLeft = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(packageInfo.urls.GetCategories);
      if (!response.ok) {
        throw new Error(`Network Error: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };

  const fetchProductsByCategory = async (categoryId) => {
    try {
      const response = await fetch(packageInfo.urls.GetProductsByCategory, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryID: categoryId,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const products = await response.json();
      return products;
    } catch (error) {
      console.error(`Failed to fetch products for category ${categoryId}:`, error);
      return [];
    }
  };

  useEffect(() => {
    const loadCategoriesAndProducts = async () => {
      const categoryData = await fetchCategories();

      if (categoryData.length === 0) {
        console.log("No categories found");
        return;
      }

      const categoriesWithProducts = await Promise.all(
        categoryData.map(async (category) => {
          const products = await fetchProductsByCategory(category.id);
          console.log(products);
          return { ...category, products, scrollRef: React.createRef() };
        })
      );

      setCategories(categoriesWithProducts);
    };

    loadCategoriesAndProducts();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Ad Slider at the top */}
      <AdSlider />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Loop through categories */}
        {categories.map((category) => (
          <div key={category.id} className="mb-12">
            {/* Category Header */}
            <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg shadow-md">
              <h2 className="text-xl font-bold">{category.name}</h2>
            </div>

            {/* Products Carousel */}
            <div className="relative group">
              {/* Left Scroll Button */}
              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-blue-600 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg hover:bg-blue-700"
                onClick={() => scrollLeft(category.scrollRef)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Products Container */}
              <div
                ref={category.scrollRef}
                className="flex space-x-4 py-6 px-2 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar"
              >
                {category.products.map((product, index) => {
                  const discount = 0.10; // 10% discount
                  const discountedPrice = (product.price * (1 - discount)).toFixed(2);

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
                            src={product.productImage}
                            alt={product.productName}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        {/* Product details */}
                        <div className="p-4">
                          {/* Product name */}
                          <h3 className="text-sm font-medium text-blue-800 mb-2 line-clamp-2 h-12">
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
                            <span className="text-xs text-gray-500 ml-1">(30,000)</span>
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
                onClick={() => scrollRight(category.scrollRef)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainPage;