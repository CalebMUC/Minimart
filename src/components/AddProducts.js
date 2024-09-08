import React, { useState, useEffect } from "react";
import '../../src/AddProducts.css';
// Import the API methods
import { AddProduct, fetchCategories } from '../Data.js'; 
import packageInfo from "../../package.json";

const AddProducts = () => {
  const [formData, setFormData] = useState({
    productName: "",
    productImage: null,  // This will hold the image file
    productDetails: "",
    productFeatures: "",
    productSpecifications: "",
    boxContent: "",
    price: "",
    discount: "",
    category: "",   // Category selection
    Quantity: "",
    subcategory: "" // Subcategory selection
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]); // Subcategories state
  const [error, setError] = useState(null); // Error handling
  const [isUploading, setIsUploading] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories(); // Fetch categories from API
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setError("Failed to load categories");
      }
    };

    loadCategories();
  }, []);

  // Handle category change and reset subcategories if a new category is selected
  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setFormData({
      ...formData,
      category: selectedCategoryId,
      subcategory: "", // Reset subcategory when category changes
    });

    // Find the selected category and set subcategories if available
    const selectedCategory = categories.find(cat => cat.id === parseInt(selectedCategoryId));
    if (selectedCategory && selectedCategory.subcategoryids.length > 0) {
      setSubcategories(selectedCategory.subcategoryids);
    } else {
      setSubcategories([]); // Clear subcategories if none exist
    }
  };

  // Handle subcategory change
  const handleSubcategoryChange = (e) => {
    setFormData({
      ...formData,
      subcategory: e.target.value,
    });
  };

  // Handle image file change and save the image name
  const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (file) {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(packageInfo.urls.UploadImages, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setFormData({
        ...formData,
        productImage: data.url, // Save the uploaded image URL
      });
      setIsUploading(false);
    } catch (uploadError) {
      console.error("Image upload failed:", uploadError);
      setError("Failed to upload image");
      setIsUploading(false);
    }
  }
};


  // Submit form data to the API
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const finalData = {
        ...formData,
        productImage: formData.productImage, // Only image name is sent
      };

      // Log the final data for verification
      console.log(finalData);

      // Call the AddProduct API method with the final form data
      const response = await AddProduct(finalData);
      console.log("Product added successfully:", response);
    } catch (error) {
      console.error("Error adding product:", error);
      setError("Failed to add product");
    }
  };

  return (
    <div className="add-product-container">
      <div className="login-header">
        <div className="logo">
          <img src="../images/shopping-bag.png" alt="Logo" />
        </div>
        <div className="details">
          <h2>Welcome to Minimart</h2>
        </div>
      </div>

      <h2>Add New Product</h2>
      {error && <p className="error-message">{error}</p>} {/* Display errors if any */}
      
      <form className="add-product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="productName">Product Name</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleCategoryChange}
            required
          >
            <option value="" disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory selection, shown only if subcategories exist */}
        {subcategories.length > 0 && (
          <div className="form-group">
            <label htmlFor="subcategory">Subcategory</label>
            <select
              id="subcategory"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleSubcategoryChange}
              required
            >
              <option value="" disabled>Select a subcategory</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="productImage">Product Image</label>
          <input
            type="file"
            id="productImage"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="productDetails">Product Details</label>
          <textarea
            id="productDetails"
            name="productDetails"
            value={formData.productDetails}
            onChange={(e) => setFormData({ ...formData, productDetails: e.target.value })}
            rows="4"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="productFeatures">Product Features</label>
          <textarea
            id="productFeatures"
            name="productFeatures"
            value={formData.productFeatures}
            onChange={(e) => setFormData({ ...formData, productFeatures: e.target.value })}
            rows="3"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="productSpecifications">Product Specifications</label>
          <textarea
            id="productSpecifications"
            name="productSpecifications"
            value={formData.productSpecifications}
            onChange={(e) => setFormData({ ...formData, productSpecifications: e.target.value })}
            rows="3"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="boxContent">Box Content</label>
          <textarea
            id="boxContent"
            name="boxContent"
            value={formData.boxContent}
            onChange={(e) => setFormData({ ...formData, boxContent: e.target.value })}
            rows="3"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="Quantity">Quantity</label>
          <select
            id="Quantity"
            name="Quantity"
            value={formData.Quantity}
            onChange={(e) => setFormData({...formData, Quantity : e.target.value})}
            required
          >
            <option value="" disabled>Add Quantity</option>
            {[...Array(10).keys()].map(i => (
              <option key={i} value={i + 1}> {i + 1}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            id="price"
            name="price"
            type="number"
            placeholder="Enter price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="discount">Discount</label>
          <input
            id="discount"
            name="discount"
            type="number"
            placeholder="Discount in %"
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">Add Product</button>
        </div>
      </form>
    </div>
  );
};

export default AddProducts;
