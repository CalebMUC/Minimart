import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../src/Mainpage.css";
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
          return { ...category, products, scrollRef: React.createRef() };
        })
      );

      setCategories(categoriesWithProducts);
    };

    loadCategoriesAndProducts();
  }, []);

  return (
    <>
      {/* Ad Slider at the top */}
      <AdSlider />

      {/* Body */}
      <div className="container3">
        {/* Loop through categories */}
        {categories.map((category) => (
          <div key={category.id} className="category-section">
            <h2 className="product-heading">{category.name}</h2>

            <div className="carouselContainer">
              <div className="carousel">
                <button
                  className="cont-scrollBtn left"
                  onClick={() => scrollLeft(category.scrollRef)}
                >
                  &#8249;
                </button>

                <div className="carouselContent" ref={category.scrollRef}>
                  {category.products.map((product, index) => {
                    const discount = 0.10; // 10% discount for now, can be dynamically passed later
                    const discountedPrice = (product.price * (1 - discount)).toFixed(2);

                    return (
                      <div key={index} className="item">
                        <Link to={`/ProductPage/${product.productName}`}>
                          {/* Discount tag */}
                          <div className="discount-tag">
                            -{(discount * 100).toFixed(0)}%
                          </div>

                          {/* Product image */}
                          <img
                            src={`${product.productImage}`}
                            alt={product.productName}
                          />

                          {/* Product name (ellipsis after 3 lines) */}
                          <p className="product-name">{product.productName}</p>

                          {/* Stock information */}
                          <p className={product.inStock ? "Instock" : "LowStock"}>
                            {product.inStock
                              ? "In Stock"
                              : "Only a few left in stock - order soon."}
                          </p>

                          {/* Original price with strike-through */}
                          <p className="original-price">
                            <s>Was KSH {product.price.toLocaleString()}</s>
                          </p>

                          {/* Price after discount */}
                          <p className="discounted-price">
                            KSH {discountedPrice.toLocaleString()}
                          </p>
                        </Link>
                      </div>
                    );
                  })}
                </div>

                <button
                  className="cont-scrollBtn right"
                  onClick={() => scrollRight(category.scrollRef)}
                >
                  &#8250;
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MainPage;
