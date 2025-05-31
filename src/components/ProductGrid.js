// ProductGrid.js
import React from "react";
import { Link } from 'react-router-dom';

const ProductGrid = ({ products, currentPage, totalPages, onPageChange }) => {
  const ProductCard = ({ product }) => {
    const discount = product.discount || 0.1; // Default 10% discount if not provided
    const discountedPrice = (product.price * (discount)).toFixed(2);
    const productImages = JSON.parse(product.imageUrl) || [];
    const firstImage = productImages[0] || '/placeholder-product.jpg';

    return (
      <div className="flex flex-col p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full">
        <Link 
          to={`/product/${encodeURIComponent(product.productName)}/${product.productId}`}
          className="flex flex-col h-full"
        >
          {/* Product Image */}
          <div className="relative flex-grow flex items-center justify-center mb-2 h-48">
            <img
              src={firstImage}
              alt={product.productName}
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = '/placeholder-product.jpg';
              }}
            />
            {discount > 0 && (
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                -{(discount).toFixed(0)}%
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="mt-auto">
            <h3 className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2 h-10">
              {product.productName}
            </h3>
            
            <div className="flex items-center mt-1">
              <div className="flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="text-xs text-gray-600 ml-1">4.5</span>
              </div>
              <span className="text-xs text-gray-500 ml-1">(30,000)</span>
            </div>

            <div className={`text-xs mt-1 ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </div>

            {discount > 0 ? (
              <>
                <div className="text-xs text-gray-500 line-through mt-1">
                  KES {product.price.toLocaleString()}
                </div>
                <div className="text-base font-bold text-gray-800">
                  KES {discountedPrice.toLocaleString()}
                </div>
              </>
            ) : (
              <div className="text-base font-bold text-gray-800 mt-1">
                KES {product.price.toLocaleString()}
              </div>
            )}
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product, index) => (
          <ProductCard key={`${product.productId}-${index}`} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            Previous
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-4 py-2 rounded-md ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                {pageNum}
              </button>
            );
          })}

          {totalPages > 5 && currentPage < totalPages - 2 && (
            <span className="px-2">...</span>
          )}

          {totalPages > 5 && currentPage < totalPages - 2 && (
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 rounded-md"
            >
              {totalPages}
            </button>
          )}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;