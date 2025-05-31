import React, { useEffect, useState } from "react";
import '../../src/CSS/RecentlyViewed.css';

const RecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const viewedProducts = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    console.log(viewedProducts); // Check recently viewed items here
    setRecentlyViewed(viewedProducts);
  }, []);
  
  return (
    <div className="recently-viewed-container">
      <h2>Recently Viewed</h2>
      {recentlyViewed.length > 0 ? (
        recentlyViewed.map((viewedProduct) => (
          <div key={viewedProduct.id} className="recently-viewed-item">
            <img
              src={viewedProduct.image}
              alt={viewedProduct.name}
              className="product-image"
            />
            <div className="product-info">
              <p className="product-name">{viewedProduct.name}</p>
              <p className="product-rating">
                ⭐{viewedProduct.rating} ({viewedProduct.reviews})
              </p>
              <p className="product-price">{viewedProduct.price}</p>
              <button className="add-to-cart-btn">Add to cart</button>
            </div>
          </div>
        ))
      ) : (
        <p>No recently viewed products</p>
      )}
    </div>
  );
};

export default RecentlyViewed;
