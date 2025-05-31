import React, { useEffect, useRef, useContext, useState } from 'react';
import { CheckOutContext } from './CheckOutContext';
import { DeleteCartItems, GetCartItems, SaveItems, GetSimilarProducts, GetBoughtItems, GetSavedItems, GetPersonalizedRecommendations, GetComplementaryProducts, GetFrequentlyBought } from '../Data.js';
import Dialogs from "./Dialogs.js";
import CompareSimilarItems from "./Comparison.js";
import { cartContext } from "./CartContext";
import { Link, useNavigate } from 'react-router-dom';
import RecentlyViewed from "./RecentlyViewed";
import { FaSpinner, FaShoppingCart, FaHeart, FaShareAlt, FaTrash, FaArrowLeft, FaArrowRight, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ProductPage = () => {
  const { checkOutData, addItemTocheckOut, removeItemFromCheckout, subTotal } = useContext(CheckOutContext);
  const [products, setProducts] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [boughtProducts, setBoughtProducts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [personalizedItems, setPersonalizedItems] = useState([]);
  const [complementaryItems, setComplementaryItems] = useState([]);
  const [freqBoughtItems, setFreqBoughtItems] = useState([]);
  const [comparisonProductID, setComparisonProduct] = useState("");
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [cartID, setCartID] = useState(0);
  const { cartCount, updateCartCount } = useContext(cartContext);
  const [showSuccessDialog, setSuccessDialog] = useState(false);
  const [showErrorDialog, setErrorDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavedLoading, setIsSavedLoading] = useState(true);
  const [isBoughtLoading, setIsBoughtLoading] = useState(true);
  const [userId, setUserId] = useState(null);

    // New state for toggling sections
  const [showAllSaved, setShowAllSaved] = useState(false);
  const [showAllBought, setShowAllBought] = useState(false);
  const [showAllComplementary, setShowAllComplementary] = useState(false);
  const [showAllPersonalized, setShowAllPersonalized] = useState(false);
  const [showAllFreqBought, setShowAllFreqBought] = useState(false);

  // Ref for sticky checkout button
  const checkoutButtonRef = useRef(null);


  // Refs for carousels
  const savedItemsRef = useRef(null);
  const complementaryRef = useRef(null);
  const personalizedRef = useRef(null);
  const relatedRef = useRef(null);
  const buyAgainRef = useRef(null);

  const navigate = useNavigate();


  
  // Sticky checkout button effect
  useEffect(() => {
    const handleScroll = () => {
      if (checkoutButtonRef.current) {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Show sticky button when scrolled past the original checkout section
        if (scrollPosition > 200 && scrollPosition < documentHeight - windowHeight - 100) {
          checkoutButtonRef.current.classList.remove('hidden');
        } else {
          checkoutButtonRef.current.classList.add('hidden');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setUserId(localStorage.getItem("userID"));
  }, []);

  // Fetch cart items
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const requestData = { userID: parseInt(localStorage.getItem('userID')) };
        const response = await GetCartItems(requestData);
        setProducts(response);
        setCartID(response[0]?.cartID || 0);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [cartCount]);

  // Fetch saved items
  useEffect(() => {
    const fetchSavedItems = async () => {
      try {
        setIsSavedLoading(true);
        const userId = parseInt(localStorage.getItem("userID"));
        const response = await GetSavedItems(userId);
        setSavedProducts(response);
      } catch (error) {
        console.error("Error fetching saved items:", error);
      } finally {
        setIsSavedLoading(false);
      }
    };

    fetchSavedItems();
  }, []);

  // Fetch personalized recommendations
  useEffect(() => {
    const fetchPersonalizedItems = async () => {
      try {
        if (userId) {
          const response = await GetPersonalizedRecommendations(userId);
          setPersonalizedItems(response);
        }
      } catch (error) {
        console.error("Error fetching Personalized items:", error);
      }
    };

    fetchPersonalizedItems();
  }, [userId]);

  // Fetch bought items
  useEffect(() => {
    const fetchBoughtItems = async () => {
      try {
        setIsBoughtLoading(true);
        const requestData = {
          userID: localStorage.getItem("userID")
        };
        const response = await GetBoughtItems(requestData);
        setBoughtProducts(response);
      } catch (error) {
        console.error("Error fetching bought items:", error);
      } finally {
        setIsBoughtLoading(false);
      }
    };

    fetchBoughtItems();
  }, []);

  // Carousel scroll functions
  const scrollLeft = (ref) => {
    ref.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = (ref) => {
    ref.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  // Other handlers (checkout, delete, save, etc.)
  const handleChecking = async (product) => {
    const isAlreadySelected = checkOutData.some(item => item.productID === product.productID);
    isAlreadySelected ? removeItemFromCheckout(product.productID) : addItemTocheckOut({
      productID: product.productID,
      productName: product.productName,
      productImage: product.productImage,
      price: product.price,
      quantity: product.quantity,
      merchantId: product.merchantId
    });

    // Get complementary products when a product is selected
    try {
      const complementaryProducts = await GetComplementaryProducts(product.productID);
      setComplementaryItems(complementaryProducts);

      const freqBoughtTogether = await GetFrequentlyBought(product.productID);
      setFreqBoughtItems(freqBoughtTogether);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const DeselectItems = () => {
    checkOutData.forEach(item => removeItemFromCheckout(item.productID));
  };

  const handleCheckout = () => {
    checkOutData.length > 0 ? navigate("/MainCheckout") : alert('Please select items for checkout.');
  };

  const HandleDeleteCartItems = async (cartItemID, productID) => {
    try {
      const requestData = { cartID, cartItemID, productID };
      const response = await DeleteCartItems(requestData);
      if (response?.responseMessage) {
        updateCartCount(parseInt(cartCount) - 1);
        setSuccessDialog(true);
        setDialogMessage("Product Removed From Cart Successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const HandleSaveItems = async (productID, quantity) => {
    try {
      var requestData = {
        userId: parseInt(localStorage.getItem('userID')),
        productId: productID,
        savedOn: new Date(),
        quantity: quantity,
        isActive: true
      };
      const response = await SaveItems(requestData);
      setSavedProducts(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseDialog = () => {
    setSuccessDialog(false);
    setErrorDialog(false);
    setDialogMessage(null);
  };

  const handleOpenModal = async (e, productID) => {
    e.preventDefault();
    try {
      const similarProductsResponse = await GetSimilarProducts(productID, 5);
      setSimilarProducts(similarProductsResponse);
      setComparisonProduct(productID);
      setShowCompareModal(true);
    } catch (error) {
      console.error("Error fetching similar products:", error);
      setErrorDialog(true);
      setDialogMessage("Failed to load similar products");
    }
  };

  const handleCloseModal = () => {
    setShowCompareModal(false);
  };

  
  // Modified ProductCard component with responsive sizing
  const ProductCard = ({ product, showDiscount = true }) => {
    const discount = 0.10;
    const discountedPrice = (product.price * (1 - discount)).toFixed(2);
    const productImages = JSON.parse(product.productImage);
    const firstImage = productImages[0];
  
    return (
      <div className="w-full sm:w-48 p-2 sm:p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
        {showDiscount && (
          <div className="absolute bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{(discount * 100).toFixed(0)}%
          </div>
        )}
        <Link to={`/product/${encodeURIComponent(product.productName)}/${product.productID}`}>
          <img 
            src={firstImage} 
            alt={product.productName}
            className="w-full h-32 sm:h-40 object-contain" 
          />
          <div className="mt-2 sm:mt-3 space-y-1">
            <h3 className="text-xs sm:text-sm font-medium hover:underline line-clamp-2">{product.productName}</h3>
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
            <div className="text-sm sm:text-base font-bold text-gray-800">
              KSH {showDiscount ? discountedPrice.toLocaleString() : product.price.toLocaleString()}
            </div>
          </div>
        </Link>
      </div>
    );
  };

   // Helper component for recommendation sections
  const RecommendationSection = ({ 
    title, 
    items, 
    isLoading, 
    showAll, 
    setShowAll,
    showDiscount = true 
  }) => {
    if (!items || items.length === 0) return null;

    const visibleItems = showAll ? items : items.slice(0, 4);
    const isMobile = window.innerWidth < 640;

    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">{title}</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <FaSpinner className="animate-spin text-yellow-500 text-2xl" />
          </div>
        ) : (
          <>
            {isMobile ? (
              <div className="grid grid-cols-2 gap-3">
                {visibleItems.map((product, index) => (
                  <ProductCard key={index} product={product} showDiscount={showDiscount} />
                ))}
              </div>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => scrollLeft(relatedRef)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-yellow-50"
                >
                  <FaArrowLeft className="text-yellow-600" />
                </button>
                <div 
                  className="flex gap-4 overflow-x-auto py-2 scrollbar-hide"
                >
                  {items.map((product, index) => (
                    <ProductCard key={index} product={product} showDiscount={showDiscount} />
                  ))}
                </div>
                <button 
                  onClick={() => scrollRight(relatedRef)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-yellow-50"
                >
                  <FaArrowRight className="text-yellow-600" />
                </button>
              </div>
            )}
            
            {items.length > 4 && isMobile && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="mt-4 text-yellow-600 hover:text-yellow-700 flex items-center text-sm"
              >
                {showAll ? (
                  <>
                    <span>Show Less</span>
                    <FaChevronUp className="ml-1" />
                  </>
                ) : (
                  <>
                    <span>Show More</span>
                    <FaChevronDown className="ml-1" />
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      {/* Dialogs */}
      {showSuccessDialog && <Dialogs message={dialogMessage} type="cart" onClose={handleCloseDialog} />}
      {showErrorDialog && <Dialogs message={dialogMessage} type="error" onClose={handleCloseDialog} />}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Shopping Cart Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
              {products.length > 0 && (
                <button 
                  onClick={DeselectItems}
                  className="text-yellow-600 hover:text-yellow-700 text-sm"
                >
                  Deselect all items
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <FaSpinner className="animate-spin text-yellow-500 text-4xl" />
              </div>
            ) : products.length > 0 ? (
              products.map((product, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 py-4 border-b border-gray-200">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={checkOutData.some(item => item.productID === product.productID)}
                      onChange={() => handleChecking(product)}
                      className="h-5 w-5 text-yellow-600 rounded focus:ring-yellow-500"
                    />
                  </div>
                  <div className="flex-1 flex flex-col md:flex-row gap-4">
                    <img 
                      src={JSON.parse(product.productImage)[0]} 
                      alt={product.productName}
                      className="w-32 h-32 object-contain bg-white p-2 border border-gray-200 rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-800">{product.productName}</h3>
                      <p className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                        {product.inStock ? "In Stock" : "Only a few left in stock - order soon."}
                      </p>
                      <div className="flex items-center mt-2">
                        <label className="mr-2 text-sm">Qty:</label>
                        <select
                          value={product.quantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value);
                            setProducts(products.map((p, i) =>
                              i === index ? { ...p, quantity: newQuantity } : p
                            ));
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          {[...Array(10).keys()].map(n => (
                            <option key={n} value={n + 1}>{n + 1}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-3">
                        <button 
                          onClick={(e) => { e.preventDefault(); HandleDeleteCartItems(product.cartItemID, product.productID); }}
                          className="flex items-center text-sm text-gray-600 hover:text-yellow-600"
                        >
                          <FaTrash className="mr-1" /> Remove
                        </button>
                        <button 
                          onClick={(e) => { e.preventDefault(); HandleSaveItems(product.productID, product.quantity); }}
                          className="flex items-center text-sm text-gray-600 hover:text-yellow-600"
                        >
                          <FaHeart className="mr-1" /> Save for later
                        </button>
                        <button 
                          onClick={(e) => handleOpenModal(e, product.productID)}
                          className="flex items-center text-sm text-gray-600 hover:text-yellow-600"
                        >
                          Compare with similar items
                        </button>
                        <button className="flex items-center text-sm text-gray-600 hover:text-yellow-600">
                          <FaShareAlt className="mr-1" /> Share
                        </button>
                      </div>
                    </div>
                    <div className="text-lg font-bold">KSH{product.price.toFixed(2)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <img src="../Images/11329060.png" alt="Empty Cart" className="w-40 mb-6" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
                <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
                <button 
                  onClick={() => navigate('/')} 
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>

          {/* Saved Items Section */}
          {/* <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Saved Items</h2>
            {isSavedLoading ? (
              <div className="flex justify-center items-center h-32">
                <FaSpinner className="animate-spin text-yellow-500 text-2xl" />
              </div>
            ) : savedProducts.length > 0 ? (
              <div className="relative">
                <button 
                  onClick={() => scrollLeft(savedItemsRef)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-yellow-50"
                >
                  <FaArrowLeft className="text-yellow-600" />
                </button>
                <div 
                  ref={savedItemsRef}
                  className="flex gap-4 overflow-x-auto py-2 scrollbar-hide"
                >
                  {savedProducts.map((product, index) => (
                    <ProductCard key={index} product={product} />
                  ))}
                </div>
                <button 
                  onClick={() => scrollRight(savedItemsRef)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-yellow-50"
                >
                  <FaArrowRight className="text-yellow-600" />
                </button>
              </div>
            ) : (
              <p className="text-gray-500">You have no saved items.</p>
            )}
          </div> */}

          {/* Buy Again Section */}
          {/* {boughtProducts.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Buy Again</h2>
              {isBoughtLoading ? (
                <div className="flex justify-center items-center h-32">
                  <FaSpinner className="animate-spin text-yellow-500 text-2xl" />
                </div>
              ) : (
                <div className="relative">
                  <button 
                    onClick={() => scrollLeft(buyAgainRef)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-yellow-50"
                  >
                    <FaArrowLeft className="text-yellow-600" />
                  </button>
                  <div 
                    ref={buyAgainRef}
                    className="flex gap-4 overflow-x-auto py-2 scrollbar-hide"
                  >
                    {boughtProducts.map((product, index) => (
                      <ProductCard key={index} product={product} showDiscount={false} />
                    ))}
                  </div>
                  <button 
                    onClick={() => scrollRight(buyAgainRef)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-yellow-50"
                  >
                    <FaArrowRight className="text-yellow-600" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div> */}

        
      {/* Sticky Checkout Button (mobile only) */}
      {checkOutData.length > 0 && (
        <div 
          ref={checkoutButtonRef}
          className="fixed hidden bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-50 md:hidden"
        >
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">
                {checkOutData.length} items: <span className="font-bold">KSH{subTotal.toFixed(2)}</span>
              </p>
            </div>
            <button 
              onClick={handleCheckout}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-bold py-2 px-4 rounded-lg text-sm"
            >
              Proceed to checkout
            </button>
          </div>
        </div>
      )}

        {/* Sidebar */}
        <div className="lg:w-80 space-y-6">
          {/* Checkout Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <p className="text-lg font-medium">
                Subtotal ({checkOutData.length} items): <span className="font-bold">KSH{subTotal.toFixed(2)}</span>
              </p>
            </div>
            <button 
              onClick={handleCheckout} 
              disabled={checkOutData.length === 0}
              className={`w-full py-3 rounded-lg font-bold ${checkOutData.length > 0 ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              Proceed to checkout
            </button>
          </div>

          {/* Recently Viewed */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recently Viewed</h2>
            <RecentlyViewed />
          </div>
        </div>
      </div>

        {/* Modified Recommendations Sections */}
      <div className="mt-8 space-y-4 sm:space-y-6">
        {/* Saved Items */}
        <RecommendationSection
          title="Your Saved Items"
          items={savedProducts}
          isLoading={isSavedLoading}
          showAll={showAllSaved}
          setShowAll={setShowAllSaved}
        />

        {/* Buy Again */}
        <RecommendationSection
          title="Buy Again"
          items={boughtProducts}
          isLoading={isBoughtLoading}
          showAll={showAllBought}
          setShowAll={setShowAllBought}
          showDiscount={false}
        />

        {/* Complementary Products */}
        <RecommendationSection
          title="Complement your products for a better experience"
          items={complementaryItems}
          isLoading={false}
          showAll={showAllComplementary}
          setShowAll={setShowAllComplementary}
        />

        {/* Personalized Recommendations */}
        <RecommendationSection
          title="Personalized based on your shopping trends"
          items={personalizedItems}
          isLoading={false}
          showAll={showAllPersonalized}
          setShowAll={setShowAllPersonalized}
        />

        {/* Frequently Bought Together */}
        <RecommendationSection
          title="Customers who bought this also bought"
          items={freqBoughtItems}
          isLoading={false}
          showAll={showAllFreqBought}
          setShowAll={setShowAllFreqBought}
        />
      </div>

      {/* Recommendations Sections */}
      {/* <div className="mt-8 space-y-8">
        {/* Complementary Products - Only show if items exist 
        {complementaryItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Complement your products for a better experience</h2>
            <div className="relative">
              <button 
                onClick={() => scrollLeft(complementaryRef)}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-yellow-50"
              >
                <FaArrowLeft className="text-yellow-600" />
              </button>
              <div 
                ref={complementaryRef}
                className="flex gap-4 overflow-x-auto py-2 scrollbar-hide"
              >
                {complementaryItems.map((product, index) => (
                  <ProductCard key={index} product={product} />
                ))}
              </div>
              <button 
                onClick={() => scrollRight(complementaryRef)}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-yellow-50"
              >
                <FaArrowRight className="text-yellow-600" />
              </button>
            </div>
          </div>
        )}

        {/* Personalized Recommendations - Only show if items exist }
        {personalizedItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Personalized based on your shopping trends</h2>
            <div className="relative">
              <button 
                onClick={() => scrollLeft(personalizedRef)}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-yellow-50"
              >
                <FaArrowLeft className="text-yellow-600" />
              </button>
              <div 
                ref={personalizedRef}
                className="flex gap-4 overflow-x-auto py-2 scrollbar-hide"
              >
                {personalizedItems.map((product, index) => (
                  <ProductCard key={index} product={product} />
                ))}
              </div>
              <button 
                onClick={() => scrollRight(personalizedRef)}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-yellow-50"
              >
                <FaArrowRight className="text-yellow-600" />
              </button>
            </div>
          </div>
        )}

        {/* Frequently Bought Together - Only show if items exist }
        {freqBoughtItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Customers who bought this also bought</h2>
            <div className="relative">
              <button 
                onClick={() => scrollLeft(relatedRef)}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-yellow-50"
              >
                <FaArrowLeft className="text-yellow-600" />
              </button>
              <div 
                ref={relatedRef}
                className="flex gap-4 overflow-x-auto py-2 scrollbar-hide"
              >
                {freqBoughtItems.map((product, index) => (
                  <ProductCard key={index} product={product} />
                ))}
              </div>
              <button 
                onClick={() => scrollRight(relatedRef)}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-yellow-50"
              >
                <FaArrowRight className="text-yellow-600" />
              </button>
            </div>
          </div>
        )}*/}
        
      </div> 

      {/* Comparison Modal */}
      {showCompareModal && (
        <CompareSimilarItems
          product={products.find(p => p.productID === comparisonProductID)}
          similarProducts={similarProducts}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ProductPage;