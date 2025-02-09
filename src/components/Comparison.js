import React, { useState } from "react";
import Modal from './Modal.js'; 
import { Link, useNavigate } from 'react-router-dom';
import '../../src/Comparison.css';

const CompareSimilarItems =({product,similarProducts,onClose}) =>{


 const discount = 0.10; // 10% discount for now, can be dynamically passed later
 const discountedPrice = (product.price * (1 - discount)).toFixed(2);
 

return(
    <Modal isVisible={true} onClose={onClose}>
        <div className="comparisom_Main_Page">
            
                <div className="current_page">
                    <div className="product_card">

                    <Link to={`/product/${encodeURIComponent(product.productName)}/${product.productID}`}>
                       
                       {/* Discount tag */}
                       { <div className="discount-tag">
                         -{(discount * 100).toFixed(0)}%
                       </div> }

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

                     <p>{product.name}</p>
                    <p><strong>Price:</strong> ${product.price}</p>
                    <p><strong>Customer Rating:</strong> ⭐ {5}</p>
                    <p><strong>Sold By:</strong> Minimart stores</p>

                    </div>
                </div>
                {/* compare similar products */}
                {/* Similar Products Section */}
        <div className="compare-products">
          {similarProducts.map((similarProduct, index) => (
            <div key={index} className="product-card">
              <img
                src={similarProduct.productImage}
                alt={similarProduct.productName}
                className="product-image"
              />
              <div className="product-name">{similarProduct.productName}</div>
              <div className="product-rating">⭐ {similarProduct.rating} ({similarProduct.reviews || 0})</div>
              <div className="price">KSH {similarProduct.price.toLocaleString()}</div>
            </div>
          ))}
        </div>
        </div>
    </Modal>
         
)

}
export default CompareSimilarItems
