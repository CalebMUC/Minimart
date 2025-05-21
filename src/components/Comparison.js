import React from "react";
import Modal from './Modal.js'; 
import { Link } from 'react-router-dom';
import { FaTimes, FaShoppingCart, FaHeart, FaShareAlt, FaChevronRight } from 'react-icons/fa';
import { FiCheckCircle } from 'react-icons/fi';

const CompareSimilarItems = ({ product, similarProducts, onClose }) => {
  const discount = 0.10;
  const discountedPrice = (product.price * (1 - discount)).toFixed(2);
  const productImages = JSON.parse(product.productImage);
  const firstImage = productImages[0];

  // Sample features for comparison - replace with your actual data
  const comparisonFeatures = [
    { name: "Brand", value: product.brand || "Generic" },
    { name: "Model", value: product.model || "Standard" },
    { name: "Color", value: product.color || "Black" },
    { name: "Warranty", value: product.warranty || "1 Year" },
    { name: "Weight", value: product.weight || "500g" },
  ];

  return (
    <Modal isVisible={true} onClose={onClose} className="max-w-6xl">
      <div className="bg-white rounded-lg overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-gray-200 p-4 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Compare Similar Items</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Current Product Column */}
          <div className="border-r border-gray-200 p-4">
            <div className="flex flex-col items-center mb-4">
              <div className="relative w-full">
                <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                  -{(discount * 100).toFixed(0)}%
                </div>
                <img
                  src={firstImage}
                  alt={product.productName}
                  className="w-full h-48 object-contain mx-auto"
                />
              </div>
              <Link 
                to={`/product/${encodeURIComponent(product.productName)}/${product.productID}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 mt-2 line-clamp-2 text-center"
              >
                {product.productName}
              </Link>
              <div className={`text-xs mt-1 ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </div>
              <div className="flex items-center text-xs text-yellow-500 mt-1">
                ⭐{4.5} ({30000})
              </div>
              <div className="text-xs text-gray-500 line-through mt-1">
                Was KSH {product.price.toLocaleString()}
              </div>
              <div className="text-lg font-bold text-gray-800 mt-1">
                KSH {discountedPrice.toLocaleString()}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 mt-4">
              <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 py-2 px-4 rounded text-sm font-medium flex items-center justify-center">
                <FaShoppingCart className="mr-2" /> Add to Cart
              </button>
              <button className="w-full border border-gray-300 hover:bg-gray-100 text-gray-800 py-2 px-4 rounded text-sm font-medium flex items-center justify-center">
                <FaHeart className="mr-2 text-red-500" /> Add to List
              </button>
              <button className="w-full border border-gray-300 hover:bg-gray-100 text-gray-800 py-2 px-4 rounded text-sm font-medium flex items-center justify-center">
                <FaShareAlt className="mr-2 text-blue-500" /> Share
              </button>
            </div>

            {/* Product Highlights */}
            <div className="mt-6">
              <h3 className="text-sm font-bold text-gray-800 mb-2">Highlights</h3>
              <ul className="text-xs space-y-1">
                {product.productDescription?.split("\n").filter(Boolean).slice(0, 5).map((item, i) => (
                  <li key={i} className="flex items-start">
                    <FiCheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{item.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Similar Products Columns */}
          {similarProducts.slice(0, 3).map((similarProduct, index) => {
            const similarImages = JSON.parse(similarProduct.imageUrl || "[]");
            const similarFirstImage = similarImages[0] || "";
            const similarDiscountedPrice = (similarProduct.price * (1 - discount)).toFixed(2);

            return (
              <div 
                key={index} 
                className={`p-4 ${index < 2 ? 'border-r border-gray-200' : ''}`}
              >
                <div className="flex flex-col items-center mb-4">
                  <div className="relative w-full">
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                      -{(discount * 100).toFixed(0)}%
                    </div>
                    <img
                      src={similarFirstImage}
                      alt={similarProduct.productName}
                      className="w-full h-48 object-contain mx-auto"
                    />
                  </div>
                  <Link 
                    to={`/product/${encodeURIComponent(similarProduct.productName)}/${similarProduct.productID}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 mt-2 line-clamp-3 text-center"
                  >
                    {similarProduct.productName}
                  </Link>
                  <div className={`text-xs mt-1 ${similarProduct.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {similarProduct.inStock ? "In Stock" : "Out of Stock"}
                  </div>
                  <div className="flex items-center text-xs text-yellow-500 mt-1">
                    ⭐{similarProduct.rating || 4.0} ({similarProduct.reviews || 1000})
                  </div>
                  <div className="text-xs text-gray-500 line-through mt-1">
                    Was KSH {similarProduct.price.toLocaleString()}
                  </div>
                  <div className="text-lg font-bold text-gray-800 mt-1">
                    KSH {similarDiscountedPrice.toLocaleString()}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 mt-4">
                  <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 py-2 px-4 rounded text-sm font-medium flex items-center justify-center">
                    <FaShoppingCart className="mr-2" /> Add to Cart
                  </button>
                  <button className="w-full border border-gray-300 hover:bg-gray-100 text-gray-800 py-2 px-4 rounded text-sm font-medium flex items-center justify-center">
                    <FaHeart className="mr-2 text-red-500" /> Add to List
                  </button>
                  <button className="w-full border border-gray-300 hover:bg-gray-100 text-gray-800 py-2 px-4 rounded text-sm font-medium flex items-center justify-center">
                    <FaShareAlt className="mr-2 text-blue-500" /> Share
                  </button>
                </div>

                {/* Product Highlights */}
                <div className="mt-6">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Highlights</h3>
                  <ul className="text-xs space-y-1">
                    {similarProduct.productDescription?.split("\n").filter(Boolean).slice(0, 5).map((item, i) => (
                      <li key={i} className="flex items-start">
                        <FiCheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{item.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="border-t border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-gray-500 w-1/5">Features</th>
                <th className="text-center p-3 text-sm font-medium text-gray-500 w-1/5">Current Item</th>
                {similarProducts.slice(0, 3).map((product, index) => (
                  <th key={index} className="text-center p-3 text-sm font-medium text-gray-500 w-1/5">
                    Option {index + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {comparisonFeatures.map((feature, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-3 text-sm font-medium text-gray-900">{feature.name}</td>
                  <td className="p-3 text-sm text-center">{feature.value}</td>
                  {similarProducts.slice(0, 3).map((similarProduct, j) => (
                    <td key={j} className="p-3 text-sm text-center">
                      {similarProduct[feature.name.toLowerCase()] || feature.value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 flex justify-between items-center">
          <button 
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Close Comparison
          </button>
          <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
            See more similar items <FaChevronRight className="ml-1" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CompareSimilarItems;