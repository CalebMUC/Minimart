
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import packageInfo from "../../package.json";
import '../../src/CSS/ProductDetailPage.css';
import { cartContext } from "./CartContext";
import  ProductImageCarousel  from "./ProductImageCouresel";
import Dialogs from "./Dialogs.js";
import RecentlyViewed from "./RecentlyViewed.js";

const ProductDetail = () => {
  const { productName: encodedProductName, productID } = useParams(); // Extract both productName and productID
  const [product, setProduct] = useState(null);
  // const [productID, setProductID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userID, setUserID] = useState(localStorage.getItem('userID') || null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, updateCartCount } = useContext(cartContext);
  const [showSuccessDialog,setSuccessDialog] = useState(false);
  const [dialogMessage,setDialogMessage] = useState(null);
  const [boxContent,setBoxContent] = useState([])

  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    if (!product) return;
  
    // Get the recently viewed items from localStorage or initialize an empty array
    const savedProducts = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
  
    // Filter out the current product if it's already in the list
    const updatedProducts = savedProducts.filter(item => item.id !== product.productId);
  
    // Add the new product to the beginning of the list
    updatedProducts.unshift({
      id: product.productId,
      name: product.productName,
      image: product.imageUrl,
      price: product.price,
      rating: 4.3, // Example static rating
      reviews: 31088, // Example static review count
    });
  
    // Keep only the last 5 recently viewed products
    if (updatedProducts.length > 5) updatedProducts.pop();
  
    // Save the updated recently viewed list back to localStorage
    localStorage.setItem("recentlyViewed", JSON.stringify(updatedProducts));
  
    setRecentlyViewed(updatedProducts); // Update state for recently viewed items
  }, [product]);
  


  useEffect(() => {
    fetchAllProducts();
  }, [productID]);

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
      const matchedProduct = products.find((p) => p.productId  === productID);

      if (matchedProduct) {
        console.log( "mand",matchedProduct)
        setProduct(matchedProduct);

          // Parse the box content if it's a stringified array
          let parsedBoxContent;
          try {
            parsedBoxContent = JSON.parse(matchedProduct.box);
          } catch (error) {
            console.error("Failed to parse box content:", error);
            parsedBoxContent = [];
          }
          
          setBoxContent(Array.isArray(parsedBoxContent) ? parsedBoxContent : []);


        // setProductID(`${matchedProduct.productId}`);
// ;
//         console.log(productID)
//         console.log(matchedProduct.keyFeatures)

//         console.log(matchedProduct.specification)
      
        
      
      } else {
        setError("Product not found");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

 
//   const parseKeyValuePairs = (input) => {
//   if (!input) return [];

//   return input
//     .split(/[\r\n]+/) // Split by either \r\n or \n
//     .map(line => line.split("\t").map(item => item.trim())) // Split by tabs
//     .filter(([key, value]) => key && value); // Ensure both key and value exist
// };
// const parseKeyValuePairs = (data) => {
//   if (typeof data === 'string') {
//     try {
//       data = JSON.parse(data); // Parse stringified JSON if necessary
//     } catch (error) {
//       console.error('Failed to parse data:', error);
//       return [];
//     }
//   }else if(Array.isArray(data) ){
//     const arrayData = data
//     .filter(item => item.includes(':')) // Ensure the string has a colon
//     .map(item => {
//     const [key, value] = item.split(/:(.+)/); // Split on the first colon
//     return [key.trim(), value ? value.trim() : '']; // Trim whitespace
//      });
//   }
//   return Object.entries(data); // Convert object to array of key-value pairs
// };
// const parseKeyValuePairs = (data) => {
//   if (!Array.isArray(data)) return [];
  
//   // Map over each string and split at the first colon
//   return data
//     .filter(item => item.includes(':')) // Ensure the string has a colon
//     .map(item => {
//       const [key, value] = item.split(/:(.+)/); // Split on the first colon
//       return [key.trim(), value ? value.trim() : '']; // Trim whitespace
//     });
// };

const parseKeyValuePairs = (data) => {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data); // Parse stringified JSON if necessary
    } catch (error) {
      console.error('Failed to parse data:', error);
      return [];
    }
  }

  if (Array.isArray(data)) {
    return data
      .filter(item => item.includes(':') && !/^\d+\s*:/.test(item)) // Ensure the string has a colon and no leading numbers
      .map(item => {
        const [key, value] = item.split(/:(.+)/); // Split on the first colon
        return [key.trim(), value ? value.trim() : '']; // Trim whitespace
      });
  } else if (typeof data === 'object' && data !== null) {
    return Object.entries(data).map(([key, value]) => [key.trim(), String(value).trim()]);
  }

  return [];
};

const displayBoxContent =  (data) =>{


}



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

      // console.log(response.json());
      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      const data = await response.json();
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

        if(response.responseCode == 0 ){
          const newCount = parseInt(cartCount) + 1;
          updateCartCount(newCount);
        }

        setSuccessDialog(true)
        setDialogMessage(response.responseMessage);
        // alert(response.responseMessage);
      }
    }
  };

  const handleCloseDialog = async () =>{
    setSuccessDialog(false);
    setDialogMessage(null)
  }

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const productImages = [product.imageUrl];

  return (

    <div className="product-detail-container">

      {/* Error message shown inline, allowing users to edit the form */}

      {/* <div className="sidebarPDP"> */}
        {/* <img src={`${product.imageUrl}`} alt={product.productName} /> */}
        {/* call the ProductImageCorousel and pass the images */}

        <ProductImageCarousel images={productImages} />


        {/* //add viewed product to the RecentlyViewed */}

       
      {/* </div> */}

      <div className="product-details">
      {showSuccessDialog && <Dialogs
      message={dialogMessage}
       type="cart"
       onClose={handleCloseDialog} />}
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
            {product.productDescription.split("\n").map(point => point.trim()).filter(point => point.length > 0).map((feature, index) => (
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
    parseKeyValuePairs(product.keyFeatures).map(([key, value], index) => (
      <li key={index}>
        <strong>{key}:</strong> {value}
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
            {boxContent.length > 0 ? (
              boxContent.map((item, index) => (
                <li key={index}>{item.trim()}</li>
              ))
            ) : (
              <li>No items available</li>
            )}
          </ul>
        </div>


      </div>
    </div>
  );
};

export default ProductDetail;


