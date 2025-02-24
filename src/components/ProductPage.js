import React, { useEffect, useRef, useContext, useState } from 'react';
import { CheckOutContext } from './CheckOutContext'; // Importing the checkout context
import { DeleteCartItems,SaveItems} from '../Data.js';
import Dialogs from "./Dialogs.js";
import CompareSimilarItems from "./Comparison.js";
import { cartContext } from "./CartContext";
import { Link, useNavigate } from 'react-router-dom';
import packageInfo from '../../package.json';
import RecentlyViewed from "./RecentlyViewed";
import '../../src/CSS/ProductPage.css';

const ProductPage = () => {
  const { checkOutData, addItemTocheckOut, removeItemFromCheckout, subTotal } = useContext(CheckOutContext); // Using the context

  // State for storing fetched products
  const [products, setProducts] = React.useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const [cartID,setCartID] = useState(0);

  const { cartCount, updateCartCount } = useContext(cartContext);
  const [showSuccessDialog,setSuccessDialog] = useState(false);
  const [showErrorDialog,setErrorDialog] = useState(false);
  const [dialogMessage,setDialogMessage] = useState(null);

  // const [cartItemID,setCartItemID] = useState(0);

  // Refs for each carousel container
  const savedItemsRef = useRef(null);
  const complementaryRef = useRef(null);
  const personalizedRef = useRef(null);
  const relatedRef = useRef(null);

  // Fetch the products data on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(packageInfo.urls.GetCartItemsUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            accept: '*/*',
          },
          body: JSON.stringify({
            userID: localStorage.getItem('userID'),
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
        setCartID(data[0].cartID)
        console.log(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

   // Fetch the products data on component mount
   useEffect(() => {
    const fetchSavedItems = async () => {
      try {
        const response = await fetch(packageInfo.urls.GetSavedItems
        //   , {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     accept: '*/*',
        //   },
        //   body: JSON.stringify({
        //     userID: localStorage.getItem('userID'),
        //   }),
        // }
      );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSavedProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchSavedItems();
  }, []);

  const handleOpenModal = (e) => {
    e.preventDefault();
    setShowCompareModal(true);
  };

  const handleCloseModal = () => {
    setShowCompareModal(false);
  };

  const handleCloseDialog = async () =>{
    setSuccessDialog(false);
    setDialogMessage(null);
    setErrorDialog(false)
  }


  // Function to handle item selection
  const handleChecking = (product) => {
    const isAlreadySelected = checkOutData.some(item => item.productID === product.productID);
    
    if (isAlreadySelected) {
      removeItemFromCheckout(product.productID);
    } else {
      addItemTocheckOut({
        productID: product.productID,
        productName: product.productName,
        productImage: product.productImage,
        price: product.price,
        quantity: product.quantity
      });
    }
  };

  // Function to deselect all items
  const DeselectItems = () => {
    checkOutData.forEach(item => removeItemFromCheckout(item.productID)); // Clear all selected items
  };

  // Scroll functions that accept a ref as a parameter
  const scrollLeft = (ref) => {
    ref.current.scrollBy({
      left: -300,
      behavior: 'smooth',
    });
  };

  const scrollRight = (ref) => {
    ref.current.scrollBy({
      left: 300,
      behavior: 'smooth',
    });
  };

  const navigate = useNavigate();

  // Function to handle checkout
  const handleCheckout = () => {
    if (checkOutData.length > 0) {
      navigate("/MainCheckout");
    } else {
      alert('Please select items for checkout.');
    }
  };

  const HandleDeleteCartItems = async (cartItemID,productID) =>{
    
    try{
       // Construct the requestData object
       const requestData = {
        cartID: cartID, 
        cartItemID: cartItemID,
        productID : productID
      };

      var response =  await DeleteCartItems(requestData);

      if (response && response.responseMessage) {
        const newCount = parseInt(cartCount) - 1;
        updateCartCount(newCount);
        setSuccessDialog(true)
        setDialogMessage("Product Removed  From cart succesfully");
        // alert(response.responseMessage);
      }

    }catch(error){
      console.error(error)
    }

  }

  const HandleSaveItems = async (productID) =>{
    
    try{
       // Construct the requestData object
       const requestData = {
        productID : productID
      };

      var response =  await SaveItems(requestData);

      if (response.responseCode == 200 && response.responseMessage) {
       
        setSuccessDialog(true)
        setErrorDialog(false)
        setDialogMessage(response.responseMessage);
        // alert(response.responseMessage);
      }else if(response.responseCode == 500 && response.responseMessage){
        setSuccessDialog(false)
        setErrorDialog(true)
        setDialogMessage("Failed to save Product");
      }

    }catch(error){
      console.error(error)
    }

  }

  return (
    <div className="pageContent">
      <div className="outer-container">
        <div className="container1">
            <div className="CartItems">
            {showSuccessDialog && <Dialogs
                message={dialogMessage}
                type="cart"
                onClose={handleCloseDialog} />}

                {showErrorDialog && <Dialogs
                message={dialogMessage}
                type="error"
                onClose={handleCloseDialog} />}

              <h1>Shopping Cart</h1>
              {/* /{products.length > 0 && ( */}
              <a href="#deselect" onClick={DeselectItems}>Deselect all items</a>
              {/* //)} */}

              {products.length > 0 ? (
                products.map((product, index) => (
                  <div key={index} className="productItem">
                    
                    <div className="CheckBox">
                      <input
                        type="checkbox"
                        id="productCheckBox"
                        checked={checkOutData.some(item => item.productID === product.productID)}
                        onChange={() => handleChecking(product)}
                      />
                    </div>
                    <div className="productImage">
                      <img src={`${product.productImage}`} alt={product.productName} />
                    </div>
                    <div className="productDetails">
                      <p>{product.productName}</p>
                      <p className={product.inStock ? "Instock" : "LowStock"}>
                        {product.inStock ? "In Stock" : "Only a few left in stock - order soon."}
                      </p>
                      <div className="Quantity">
                        <label htmlFor={`quantitySelect${index}`}>Qty:</label>
                        <select
                          id={`quantitySelect${index}`}
                          value={product.quantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value);
                            setProducts(products.map((p, i) =>
                              i === index ? { ...p, quantity: newQuantity } : p
                            ));
                          }}
                        >
                          {[...Array(10).keys()].map((n) => (
                            <option key={n} value={n + 1}>
                              {n + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="Actions">
                        <a href="#delete" onClick={ (e) =>{
                          e.preventDefault();
                          HandleDeleteCartItems(product.cartItemID,product.productID)
                          }}>Remove
                          </a>
                        <a href="#saveForLater" onClick={(e) =>{
                          e.preventDefault();
                          HandleSaveItems(product.productID)}}>
                          Save for later
                          </a>
                        <a href="#compare" onClick={
                         handleOpenModal
                          
                        }>Compare with similar items</a>

                         {/* Conditionally render the modal */}
                        {showCompareModal && (
                          <CompareSimilarItems
                            product={product}
                            similarProducts={similarProducts}
                            onClose={handleCloseModal} // Pass onClose as a prop to close the modal
                          />
                        )}
                        <a href="#share">Share</a>
                      </div>
                    </div>
                    <div className="Price">
                      <p>${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="emptyCart">
                  <img src="../Images/11329060.png" alt="Empty Cart" />
                  
                  <h2>Your Cart is Empty</h2>
                  <p>Looks like you haven't added anything to your cart yet.</p>
                  <button onClick={() => navigate('/')} className="startShoppingBtn">
                    Start Shopping
                  </button>
                </div>
              )}
            </div>


          <div className="SavedItems">
            <div className="carouselContainer">
              <h1>Your Saved Items</h1>
              <div className="carousel">
                <button className="scrollBtn left" onClick={() => scrollLeft(savedItemsRef)}>
                  &#8249;
                </button>
                <div className="carouselContent" ref={savedItemsRef}>
                {savedProducts.map((product, index) => {
                    const discount = 0.10; // 10% discount for now, can be dynamically passed later
                    const discountedPrice = (product.price * (1 - discount)).toFixed(2);

                    return (
                      <div key={index} className="item">
                      <Link to={`/product/${encodeURIComponent(product.productName)}/${product.productID}`}>
                       
                          {/* Discount tag */}
                          <div className="discount-tag">
                            -{(discount * 100).toFixed(0)}%
                          </div>

                          {/* Product image */}
                          <img
                            src={`${product.imageUrl}`}
                            alt={product.productName}
                            className="product-image" // Apply a class for consistent styling
                          />

                          {/* Product name (ellipsis after 3 lines) */}
                          <div className="product-name">
                            {product.productName}

                          </div>

                          {/* Stock information */}
                          <div className={product.inStock ? "Instock" : "LowStock"}>
                            {product.inStock
                              ? "In Stock"
                              : "Only a few left in stock - order soon."}
                          </div>
                          <div className="product-rating">
                            {/* ⭐{product.rating} ({product.reviews}) */}
                            ⭐{4.5} ({30000})
                        </div>
                          {/* Original price with strike-through */}
                          <div className="original-price">
                            <s>Was KSH {product.price.toLocaleString()}</s>
                          </div>

                          {/* Price after discount */}
                          <div className="discounted-price">
                            KSH {discountedPrice.toLocaleString()}
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
                <button className="scrollBtn right" onClick={() => scrollRight(savedItemsRef)}>
                  &#8250;
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebarp">
        <div className="CheckOut">
          <p>Subtotal ({checkOutData.length} items): ${subTotal.toFixed(2)}</p>
          <button className='checkOutButton' onClick={handleCheckout} disabled={checkOutData.length === 0}>
            Proceed to checkout
          </button>
        </div>

          <aside className="RecentlyViewed">
            <RecentlyViewed/>
          </aside>
        </div>
      </div>

      <div className="containerpp3">
        <div className="Complementary">
          <h2>Complement your products for a better experience</h2>
          <div className="carouselContainer">
            <div className="carousel">
              <button className="cont-scrollBtn left" onClick={() => scrollLeft(complementaryRef)}>
                &#8249;
              </button>
              <div className="carouselContent" ref={complementaryRef}>
                  {products.map((product, index) => {
                    const discount = 0.10; // 10% discount for now, can be dynamically passed later
                    const discountedPrice = (product.price * (1 - discount)).toFixed(2);

                    return (
                      <div key={index} className="item">
                      <Link to={`/product/${encodeURIComponent(product.productName)}/${product.productID}`}>
                       
                          {/* Discount tag */}
                          <div className="discount-tag">
                            -{(discount * 100).toFixed(0)}%
                          </div>

                          {/* Product image */}
                          <img
                            src={`${product.productImage}`}
                            alt={product.productName}
                            className="product-image" // Apply a class for consistent styling
                          />

                          {/* Product name (ellipsis after 3 lines) */}
                          <div className="product-name">
                            {product.productName}

                          </div>

                          {/* Stock information */}
                          <div className={product.inStock ? "Instock" : "LowStock"}>
                            {product.inStock
                              ? "In Stock"
                              : "Only a few left in stock - order soon."}
                          </div>
                          <div className="product-rating">
                            {/* ⭐{product.rating} ({product.reviews}) */}
                            ⭐{4.5} ({30000})
                        </div>
                          {/* Original price with strike-through */}
                          <div className="original-price">
                            <s>Was KSH {product.price.toLocaleString()}</s>
                          </div>

                          {/* Price after discount */}
                          <div className="discounted-price">
                            KSH {discountedPrice.toLocaleString()}
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              <button className="cont-scrollBtn right" onClick={() => scrollRight(complementaryRef)}>
                &#8250;
              </button>
            </div>
          </div>
        </div>

        <div className="Personalized">
          <h2>Personalized based on your shopping trends</h2>
          <div className="carouselContainer">
            <div className="carousel">
              <button className="scrollBtn left" onClick={() => scrollLeft(personalizedRef)}>
                &#8249;
              </button>
              <div className="carouselContent" ref={personalizedRef}>
              {products.map((product, index) => {
                    const discount = 0.10; // 10% discount for now, can be dynamically passed later
                    const discountedPrice = (product.price * (1 - discount)).toFixed(2);

                    return (
                      <div key={index} className="item">
                      <Link to={`/product/${encodeURIComponent(product.productName)}/${product.productID}`}>
                       
                          {/* Discount tag */}
                          <div className="discount-tag">
                            -{(discount * 100).toFixed(0)}%
                          </div>

                          {/* Product image */}
                          <img
                            src={`${product.productImage}`}
                            alt={product.productName}
                            className="product-image" // Apply a class for consistent styling
                          />

                          {/* Product name (ellipsis after 3 lines) */}
                          <div className="product-name">
                            {product.productName}

                          </div>

                          {/* Stock information */}
                          <div className={product.inStock ? "Instock" : "LowStock"}>
                            {product.inStock
                              ? "In Stock"
                              : "Only a few left in stock - order soon."}
                          </div>
                          <div className="product-rating">
                            {/* ⭐{product.rating} ({product.reviews}) */}
                            ⭐{4.5} ({30000})
                        </div>
                          {/* Original price with strike-through */}
                          <div className="original-price">
                            <s>Was KSH {product.price.toLocaleString()}</s>
                          </div>

                          {/* Price after discount */}
                          <div className="discounted-price">
                            KSH {discountedPrice.toLocaleString()}
                          </div>
                        </Link>
                      </div>
                    );
                  })}
              </div>
              <button className="scrollBtn right" onClick={() => scrollRight(personalizedRef)}>
                &#8250;
              </button>
            </div>
          </div>
        </div>

        <div className="Related">
          <h2>Customers who bought this also bought</h2>
          <div className="carouselContainer">
            <div className="carousel">
              <button className="scrollBtn left" onClick={() => scrollLeft(relatedRef)}>
                &#8249;
              </button>
              <div className="carouselContent" ref={relatedRef}>
              {products.map((product, index) => {
                    const discount = 0.10; // 10% discount for now, can be dynamically passed later
                    const discountedPrice = (product.price * (1 - discount)).toFixed(2);

                    return (
                      <div key={index} className="item">
                      <Link to={`/product/${encodeURIComponent(product.productName)}/${product.productID}`}>
                       
                          {/* Discount tag */}
                          <div className="discount-tag">
                            -{(discount * 100).toFixed(0)}%
                          </div>

                          {/* Product image */}
                          <img
                            src={`${product.productImage}`}
                            alt={product.productName}
                            className="product-image" // Apply a class for consistent styling
                          />

                          {/* Product name (ellipsis after 3 lines) */}
                          <div className="product-name">
                            {product.productName}

                          </div>

                          {/* Stock information */}
                          <div className={product.inStock ? "Instock" : "LowStock"}>
                            {product.inStock
                              ? "In Stock"
                              : "Only a few left in stock - order soon."}
                          </div>
                          <div className="product-rating">
                            {/* ⭐{product.rating} ({product.reviews}) */}
                            ⭐{4.5} ({30000})
                        </div>
                          {/* Original price with strike-through */}
                          <div className="original-price">
                            <s>Was KSH {product.price.toLocaleString()}</s>
                          </div>

                          {/* Price after discount */}
                          <div className="discounted-price">
                            KSH {discountedPrice.toLocaleString()}
                          </div>
                        </Link>
                      </div>
                    );
                  })}
              </div>
              <button className="scrollBtn right" onClick={() => scrollRight(relatedRef)}>
                &#8250;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

