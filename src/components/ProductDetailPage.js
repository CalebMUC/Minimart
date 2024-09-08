import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import packageInfo from "../../package.json";
import '../../src/ProductDetailPage.css';
import { cartContext } from "./CartContext";

const ProductDetail = () => {
  const { ProductName } = useParams();
  const [product, setProduct] = useState(null);
  const [productID, setProductID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userID, setUserID] = useState(localStorage.getItem('userID') || null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, updateCartCount } = useContext(cartContext);

  useEffect(() => {
    fetchAllProducts();
  }, [ProductName]);

  const fetchAllProducts = async () => {
    try {
      const response = await fetch(packageInfo.urls.GetAllProducts, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const products = await response.json();
      const matchedProduct = products.find((p) => p.productName === ProductName);

      if (matchedProduct) {
        console.log(matchedProduct)
        setProduct(matchedProduct);
        
        setProductID(`${matchedProduct.productId}`);
;
        console.log(productID)
      } else {
        setError("Product not found");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const parseKeyValuePairs = (input) => {
  if (!input) return [];

  return input
    .split(/[\r\n]+/) // Split by either \r\n or \n
    .map(line => line.split("\t").map(item => item.trim())) // Split by tabs
    .filter(([key, value]) => key && value); // Ensure both key and value exist
};


  const saveToCart = async () => {
    try {
      const response = await fetch(packageInfo.urls.AddCartItems, {
        method: "POST",
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserID: userID,
          ProductID: productID,
          Quantity: quantity,
        }),
      });

      console.log(response.ok);
      // console.log(response.json());
      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      setError("Error adding to cart");
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    setUserID(localStorage.getItem('userID'));

    if (!userID || !token) {
      navigate('/Login', { state: { from: location } });
    } else {
      const response = await saveToCart();
      
      console.log(response);

      if (response && response.responseMessage) {
        const newCount = parseInt(cartCount) + 1;
        updateCartCount(newCount);
        alert(response.responseMessage);
      }
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="product-detail-container">
      <div className="sidebarPDP">
        <img src={`/images/${product.imageUrl}`} alt={product.productName} />
      </div>

      <div className="product-details">
        <div className="details">
          <h2>{product.productName}</h2>
          <h3>KSH {Number(product.price).toLocaleString()}</h3>
          <p className={product.inStock > 1 ? "in-stock" : "out-of-stock"}>
            {product.inStock > 1 ? "In stock" : "Out of stock"}
          </p>
          
          <div className="quantity">
            <label htmlFor="quantitySelect">Quantity:</label>
            <select
              id="quantitySelect"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            >
              {[...Array(5).keys()].map(i => (
                <option key={i} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>

          <button className="my-button" onClick={handleAddToCart}>ADD TO CART</button>
        </div>
        <hr />
        <div>
          <h2>Product Details</h2>
          <ul>
            {product.productDescription.split(/\\r\\n|\\n/).map((feature, index) => (
              <li key={index}>{feature.trim()}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="features">
        <h2>Features</h2>
        <div className="key-features">
          <h3>Key Features</h3>
          <hr />
          <ul>
            {parseKeyValuePairs(product.keyFeatures).length > 0 ? (
              parseKeyValuePairs(product.keyFeatures).map((feature, index) => (
                <li key={index}>
                  <strong>{feature[0]}:</strong> {feature[1]}
                </li>
              ))
            ) : (
              <li>No key features available</li>
            )}
          </ul>
        </div>

        <div className="specifications">
          <h3>Specifications</h3>
          <hr />
          <ul>
            {parseKeyValuePairs(product.specification).length > 0 ? (
              parseKeyValuePairs(product.specification).map((spec, index) => (
                <li key={index}>
                  <strong>{spec[0]}:</strong> {spec[1]}
                </li>
              ))
            ) : (
              <li>No specifications available</li>
            )}
          </ul>
        </div>

        <div className="box-contents">
          <h3>What's In the Box</h3>
          <hr />
          <ul>
            {parseKeyValuePairs(product.box).length > 0 ? (
              parseKeyValuePairs(product.box).map((item, index) => (
                <li key={index}>
                  {item[0]}: {item[1]}
                </li>
              ))
            ) : (
              <li>No box contents available</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
