import React, { useEffect, useRef, useContext } from 'react';
import { CheckOutContext } from './CheckOutContext'; // Importing the checkout context
import { Link, useNavigate } from 'react-router-dom';
import packageInfo from '../../package.json';
import '../../src/ProductPage.css';

const ProductPage = () => {
  const { checkOutData, addItemTocheckOut, removeItemFromCheckout, subTotal } = useContext(CheckOutContext); // Using the context

  // State for storing fetched products
  const [products, setProducts] = React.useState([]);

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
        console.log(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

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
      navigate("/checkout");
    } else {
      alert('Please select items for checkout.');
    }
  };

  return (
    <div className="pageContent">
      <div className="outer-container">
        <div className="container1">
          <div className="CartItems">
            <h1>Shopping Cart</h1>
            <a href="#deselect" onClick={DeselectItems}>Deselect all items</a>

            {products.map((product, index) => (
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
                    <a href="#delete">Remove</a>
                    <a href="#saveForLater">Save for later</a>
                    <a href="#compare">Compare with similar items</a>
                    <a href="#share">Share</a>
                  </div>
                </div>
                <div className="Price">
                  <p>${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="SavedItems">
            <div className="carouselContainer">
              <h1>Your Saved Items</h1>
              <div className="carousel">
                <button className="scrollBtn left" onClick={() => scrollLeft(savedItemsRef)}>
                  &#8249;
                </button>
                <div className="carouselContent" ref={savedItemsRef}>
                  {products.map((product, index) => (
                    <div key={index} className="item">
                      <Link to={`/ProductPage/${product.productName}`}>
                        <img src={`/images/${product.productImage}`} alt={product.productName} />
                        <p>{product.productName}</p>
                        <p className={product.inStock ? "Instock" : "LowStock"}>
                          {product.inStock ? "In Stock" : "Only a few left in stock - order soon."}
                        </p>
                        <p>${product.price.toFixed(2)}</p>
                      </Link>
                    </div>
                  ))}
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
            <h2>Subtotal ({checkOutData.length} items): ${subTotal.toFixed(2)}</h2>
            <button onClick={handleCheckout} disabled={checkOutData.length === 0}>
              Proceed to checkout
            </button>
          </div>
          <div className="RecentlyViewed">
            <h3>Recently Viewed Items</h3>
          </div>
        </div>
      </div>

      <div className="container3">
        <div className="Complementary">
          <h2>Complement your products for a better experience</h2>
          <div className="carouselContainer">
            <div className="carousel">
              <button className="cont-scrollBtn left" onClick={() => scrollLeft(complementaryRef)}>
                &#8249;
              </button>
              <div className="carouselContent" ref={complementaryRef}>
                {products.map((product, index) => (
                  <div key={index} className="item">
                    <Link to={`/ProductPage/${product.productName}`}>
                      <img src={`/images/${product.productImage}`} alt={product.productName} />
                      <p>{product.productName}</p>
                      <p className={product.inStock ? "Instock" : "LowStock"}>
                        {product.inStock ? "In Stock" : "Only a few left in stock - order soon."}
                      </p>
                      <p>${product.price.toFixed(2)}</p>
                    </Link>
                  </div>
                ))}
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
                {products.map((product, index) => (
                  <div key={index} className="item">
                    <Link to={`/ProductPage/${product.productName}`}>
                      <img src={`/images/${product.productImage}`} alt={product.productName} />
                      <p>{product.productName}</p>
                      <p className={product.inStock ? "Instock" : "LowStock"}>
                      {product.inStock ? "In Stock" : "Only a few left in stock - order soon."}
                      </p>
                      <p>${product.price.toFixed(2)}</p>
                    </Link>
                  </div>
                ))}
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
                {products.map((product, index) => (
                  <div key={index} className="item">
                    <Link to={`/ProductPage/${product.productName}`}>
                      <img src={`/images/${product.productImage}`} alt={product.productName} />
                      <p>{product.productName}</p>
                      <p className={product.inStock ? "Instock" : "LowStock"}>
                        {product.inStock ? "In Stock" : "Only a few left in stock - order soon."}
                      </p>
                      <p>${product.price.toFixed(2)}</p>
                    </Link>
                  </div>
                ))}
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

