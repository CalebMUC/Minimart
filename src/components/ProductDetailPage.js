import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { cartContext } from "./CartContext";
import ProductImageCarousel from "./ProductImageCouresel";
import Dialogs from "./Dialogs";
import RecentlyViewed from "./RecentlyViewed";
import { AddCartItems, FetchProducts } from "../Data";

const ProductDetail = () => {
  const { productName: encodedProductName, productID } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userID, setUserID] = useState(localStorage.getItem('userID') || null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, updateCartCount } = useContext(cartContext);
  const [showSuccessDialog, setSuccessDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState(null);
  const [boxContent, setBoxContent] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const [expandedDetails,setExpandedDetails] = useState(false)
  const [expandedFeatures,setExpandedFeatures] = useState(false)
  const detailsRef = useRef(null);
  const featuresRef = useRef(null);

  // Check if content exceeds max height
  const [showDetailsToggle, setShowDetailsToggle] = useState(false);
  const [showFeaturesToggle, setShowFeaturesToggle] = useState(false);


  useEffect(()=>{
    if(detailsRef.current){
      setShowDetailsToggle(detailsRef.current.scrollHeight > 300)
    }

    if(featuresRef.current){
      setShowDetailsToggle(featuresRef.current.scrollHeight > 300)
    }

  },[product])

  useEffect(() => {
    if (!product) return;
  
    const savedProducts = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    const updatedProducts = savedProducts.filter(item => item.id !== product.productId);
  
    updatedProducts.unshift({
      id: product.productId,
      name: product.productName,
      image: product.imageUrl,
      price: product.price,
      rating: 4.3,
      reviews: 31088,
    });
  
    if (updatedProducts.length > 5) updatedProducts.pop();
    localStorage.setItem("recentlyViewed", JSON.stringify(updatedProducts));
    setRecentlyViewed(updatedProducts);
  }, [product]);

  useEffect(() => {
    fetchAllProducts();
  }, [productID]);

  const fetchAllProducts = async () => {
    try {
      const products = await FetchProducts();
      const matchedProduct = products.find((p) => p.productId === productID);

      if (matchedProduct) {
        setProduct(matchedProduct);
        let parsedBoxContent;
        try {
          parsedBoxContent = JSON.parse(matchedProduct.box);
        } catch (error) {
          console.error("Failed to parse box content:", error);
          parsedBoxContent = [];
        }
        setBoxContent(Array.isArray(parsedBoxContent) ? parsedBoxContent : []);
      } else {
        setError("Product not found");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const parseKeyValuePairs = (data) => {
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (error) {
        console.error('Failed to parse data:', error);
        return [];
      }
    }

    if (Array.isArray(data)) {
      return data
        .filter(item => item.includes(':') && !/^\d+\s*:/.test(item))
        .map(item => {
          const [key, value] = item.split(/:(.+)/);
          return [key.trim(), value ? value.trim() : ''];
        });
    } else if (typeof data === 'object' && data !== null) {
      return Object.entries(data).map(([key, value]) => [key.trim(), String(value).trim()]);
    }

    return [];
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    setUserID(localStorage.getItem('userID'));

    if (!userID || !token) {
      navigate('/Login', { state: { from: location } });
    } else {
      const requestData = {
        UserID: userID,
        ProductID: productID,
        Quantity: quantity,
      }
      const response = await AddCartItems(requestData);

      if (response && response.responseMessage) {
        if(response.responseCode == 0 ){
          const newCount = parseInt(cartCount) + 1;
          updateCartCount(newCount);
        }
        setSuccessDialog(true);
        setDialogMessage(response.responseMessage);
      }
    }
  };

  const handleCloseDialog = async () => {
    setSuccessDialog(false);
    setDialogMessage(null);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 my-4" role="alert">
        <p>Product not found</p>
      </div>
    );
  }

  const productImages = JSON.parse(product.imageUrl);

  return (
    <div className="product-detail-container bg-gray-50 p-6">
      {showSuccessDialog && (
        <Dialogs
          message={dialogMessage}
          type="cart"
          onClose={handleCloseDialog}
        />
      )}

      <div className="flex flex-col md:flex-row gap-1">
        {/* Left Side - Product Images */}
        <div className="md:w-1/3 bg-white p-4 rounded-lg shadow-sm">
          <ProductImageCarousel images={productImages} />
        </div>

        {/* Middle - Product Details */}
        <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl  text-gray-800 mb-2">{product.productName}</h3>
          <h3 className="text-xl font-semibold text-yellow-600 mb-3">KSH {Number(product.price).toLocaleString()}</h3>
          <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {product.inStock ? 'In stock' : 'Out of stock'}
          </p>

          <div className="my-6">
            <label htmlFor="quantitySelect" className="block text-sm font-medium text-gray-700 mb-1">Quantity:</label>
            <select
              id="quantitySelect"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="block w-20 mt-1 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 rounded-md"
            >
              {[...Array(product.stockQuantity).keys()].map(i => (
                <option key={i} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleAddToCart}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300"
          >
            ADD TO CART
          </button>

          <hr className="my-6 border-gray-200" />

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Product Details</h2>

              <div ref={detailsRef} 
              className={`overflow:hidden transition-all duration-300 ${expandedDetails ? '' : 'max-h-[300px]'}`}
              style={{maskImage : expandedDetails ? 'none' : 'linear-gradient(to bottom,black 80%,transparent 100%)',
                WebkitMaskImage : expandedDetails ? 'none' : 'linear-gradient(to bottom,black 80%,transparent 100%)'
              }}
              >
                 <ul className="space-y-2">
                  {product.productDescription.split("\n").map(point => point.trim()).filter(point => point.length > 0).map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-gray-700">{feature.trim()}</span>
                    </li>
                  ))}
                </ul>

              </div>

              {showDetailsToggle && (
              <button 
                onClick={() => setExpandedDetails(!expandedDetails)}
                className="text-yellow-600 hover:text-yellow-700 text-sm font-medium mt-2 focus:outline-none"
              >
                {expandedDetails ? 'See Less' : 'See More'}
              </button>
            )}

           
          </div>
        </div>

        {/* Right Side - Features */}
        <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-sm flex flex-col">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Features</h2>
          
          <div className="flex-grow overflow-hidden relative">
            <div 
              ref={featuresRef}
              className={`overflow-hidden transition-all duration-300 ${expandedFeatures ? '' : 'max-h-[600px]'}`}
              style={{
                maskImage: expandedFeatures ? 'none' : 'linear-gradient(to bottom, black 80%, transparent 100%)',
                WebkitMaskImage: expandedFeatures ? 'none' : 'linear-gradient(to bottom, black 80%, transparent 100%)'
              }}
            >
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Key Features</h3>
                <hr className="border-yellow-200 mb-3" />
                <ul className="space-y-2">
                  {parseKeyValuePairs(product.keyFeatures).length > 0 ? (
                    parseKeyValuePairs(product.keyFeatures).map(([key, value], index) => (
                      <li key={index} className="text-gray-700">
                        <span className="font-medium font-semibold">{key}:</span> {value}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No key features available</li>
                  )}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Specifications</h3>
                <hr className="border-yellow-200 mb-3" />
                <ul className="space-y-2">
                  {parseKeyValuePairs(product.specification).length > 0 ? (
                    parseKeyValuePairs(product.specification).map((spec, index) => (
                      <li key={index} className="text-gray-700">
                        <span className="font-medium font-semibold">{spec[0]}:</span> {spec[1]}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No specifications available</li>
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">What's In the Box</h3>
                <hr className="border-yellow-200 mb-3" />
                <ul className="space-y-2">
                  {boxContent.length > 0 ? (
                    boxContent.map((item, index) => (
                      <li key={index} className="text-gray-700">{item.trim()}</li>
                    ))
                  ) : (
                    <li className="text-gray-500">No items available</li>
                  )}
                </ul>
              </div>
            </div>
            {showFeaturesToggle && (
              <button 
                onClick={() => setExpandedFeatures(!expandedFeatures)}
                className="text-yellow-600 hover:text-yellow-700 text-sm font-medium mt-2 focus:outline-none"
              >
                {expandedFeatures ? 'See Less' : 'See More'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recently Viewed - Maintained at bottom as in original */}
      {/* <div className="mt-8">
        <RecentlyViewed />
      </div> */}
    </div>
  );
};

export default ProductDetail;