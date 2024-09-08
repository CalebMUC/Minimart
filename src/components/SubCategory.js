import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import packageInfo from "../../package.json";
import { Link } from 'react-router-dom';
import '../../src/SubCategory.css';

const SubCategories = () => {
  const { subCategoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await fetch(packageInfo.urls.GetSubCategory, {
        method: "POST",
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          categoryName: subCategoryName
        })
      });

      if (!response.ok) {
        throw new Error(`Network Error: ${response.statusText}`);
      }

      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
      console.error(`Error ${error}`);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [subCategoryName]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="products-container">
      <h2>Products in {subCategoryName}</h2>
      <div className="products-grid">
        {products.map((product, index) => (
          <div key={index} className="product-card">
            <Link to={`/ProductPage/${product.productName}`}>
              <img src={`/images/${product.productImage}`} alt={product.productName} onError={(e) => e.target.src = '/images/fallback-image.png'} />
              <p>{product.productName}</p>
              <p className={product.inStock ? "Instock" : "LowStock"}>
                {product.inStock ? "In Stock" : "Only a few left in stock - order soon."}
              </p>
              <p>${product.price.toFixed(2)}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubCategories;
