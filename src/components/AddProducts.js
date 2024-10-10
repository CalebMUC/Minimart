import React, { useState, useEffect } from "react";
import '../../src/AddProducts.css';
import { AddProduct, fetchCategories } from '../Data.js'; 
import packageInfo from "../../package.json";
import Dialogs from "./Dialogs.js";

const AddProducts = () => {
  const [formData, setFormData] = useState({
    productName: "",
    productImage: null,
    productDetails: "",
    productFeatures: "",
    productSpecifications: "",
    boxContent: "",
    price: "",
    discount: "",
    categoryID: 0,
    Quantity: "",
    subcategory: "",
    CreatedBy: "",
    ProductID: "",
    category: "",
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        setError("Failed to load categories");
      }
    };
    loadCategories();
  }, []);

  // Set CreatedBy field with logged-in user's name
  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      setError("No user is logged in.");
    }
    setFormData((prevData) => ({
      ...prevData,
      CreatedBy: username,
    }));
  }, []);

  // Handle category selection change
  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const categoryName = e.target.options[e.target.selectedIndex].text;

    setFormData({
      ...formData,
      categoryID: selectedCategoryId,
      category: categoryName,
      subcategory: "", // Reset subcategory when category changes
    });

    // Find selected category and update subcategories
    const selectedCategory = categories.find(cat => cat.id === parseInt(selectedCategoryId));
    if (selectedCategory && selectedCategory.subcategoryids.length > 0) {
      setSubcategories(selectedCategory.subcategoryids);
    } else {
      setSubcategories([]); // No subcategories
    }
  };

  // Handle subcategory selection change
  const handleSubcategoryChange = (e) => {
    setFormData({
      ...formData,
      subcategory: e.target.value,
    });
  };

  // Generate unique ProductID based on category and subcategory
  const generateProductID = () => {
    const { categoryID, subcategory } = formData;
    if (categoryID) {
      const categoryName = categories.find(cat => cat.id === parseInt(categoryID))?.name || "";
      const subcategoryName = subcategories.find(sub => sub.id === parseInt(subcategory))?.name || "";
      const catCode = categoryName.substring(0, 2).toUpperCase();
      const subCatCode = subcategoryName ? subcategoryName.substring(0, 2).toUpperCase() : '00';
      const uniqueNumber = Date.now();
      return `${catCode}${subCatCode}${uniqueNumber}`;
    }
    return "";
  };

  // Handle image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      try {
        const imageData = new FormData();
        imageData.append('file', file);
        const response = await fetch(packageInfo.urls.UploadImages, {
          method: 'POST',
          body: imageData,
        });
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
        const data = await response.json();
        setFormData((prevData) => ({
          ...prevData,
          productImage: data.url,
        }));
        setIsUploading(false);
      } catch (uploadError) {
        setError("Failed to upload image");
        setIsUploading(false);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const productID = generateProductID();
    if (!formData.categoryID) {
      setError("Please select a category.");
      return;
    }

    if (!formData.productImage) {
      setError("Please upload an image before submitting.");
      return;
    }

    const finalData = {
      ...formData,
      productImage: formData.productImage,
      ProductID: productID,
    };

    try {
      const response = await AddProduct(finalData);
      setSuccessMessage('Product added successfully');
      setShowSuccessDialog(true);
      setFormData({
        productName: "",
        productImage: null,
        productDetails: "",
        productFeatures: "",
        productSpecifications: "",
        boxContent: "",
        price: "",
        discount: "",
        categoryID: 0,
        Quantity: "",
        subcategory: "",
        CreatedBy: localStorage.getItem('username'),
        ProductID: "",
        category: "",
      });
    } catch (error) {
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

      {showSuccessDialog && <Dialogs message={successMessage} />}

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
            value={formData.categoryID} // Bound to categoryID instead of category name
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

        {subcategories.length > 0 && (
          <div className="form-group">
            <label htmlFor="subcategory">Subcategory (Optional)</label>
            <select
              id="subcategory"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleSubcategoryChange}
            >
              <option value="">No subcategory</option>
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
            onChange={(e) => setFormData({ ...formData, Quantity: e.target.value })}
            required
          >
            <option value="" disabled>Select quantity</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="discount">Discount</label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
            required
          />
        </div>

        <button type="submit" disabled={isUploading}>Add Product</button>

        {error && <p className="error-message">{error}</p>} {/* Display errors if any */}
      </form>
    </div>
  );
};

export default AddProducts;
