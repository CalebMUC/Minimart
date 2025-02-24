// ProductGrid.js
import React from "react";
import '../../src/CSS/SearchPage.css';
import "../../src/CSS/Mainpage.css";
import { Link, useNavigate } from 'react-router-dom';

const ProductGrid = ({ products, currentPage, totalPages, onPageChange }) => {
  return (
    <div className="product-grid-container">
      <div className="product-grid">
        {products.map((product,index) => (


          // <div key={product.id} className="product-card">
          //   <img src={product.imageUrl} alt={product.name} />
          //   <h3>{product.name}</h3>
          //   <p>Price: ${product.price}</p>
          //   <button>Add to Cart</button>
          // </div>
           <div key={index} className="item">
           <Link to={`/product/${encodeURIComponent(product.productName)}/${product.productID}`}>
          
             {/* Discount tag */}
             {/* <div className="discount-tag">
               -{(discount * 100).toFixed(0)}%
             </div> */}

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
             {/* <div className="discounted-price">
               KSH {discountedPrice.toLocaleString()}
             </div> */}
           </Link>
         </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductGrid;
