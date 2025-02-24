import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Modal from "../Modal"; // Ensure you have a Modal component
import { AddProduct, fetchCategories, FetchFeatures,FetchProducts } from "../../Data.js";
import packageInfo from "../../../package.json";
import '../../CSS/productForm.css';
import { FaSearch } from "react-icons/fa";

const AddProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [features, setFeatures] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState({
    productID: "",
    productName: "",
    category: "",
    subCategory: "",
  });

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

  useEffect(() => {
    const GetProducts = async () => {
      try {
        const response = await FetchProducts();
        console.log("API Response:", response); // Log the response for debugging
        if (Array.isArray(response)) {
          setProducts(response);
        } else {
          setError("Invalid data format received from FetchProducts");
        }
      } catch (error) {
        console.error("Failed to fetch products:", error); // Log the error for debugging
        setError("Failed to load products. Please try again later.");
      }
    };
    GetProducts();
  }, []);

  // Columns for the DataGrid
  const columns = [
    { field: "productId", headerName: "ProductID", width: 70 },
    { field: "productName", headerName: "Product Name", width: 150 },
    { field: "category", headerName: "Category", width: 120 },
    { field: "subcategoryid", headerName: "Subcategory", width: 120 },
    { field: "price", headerName: "Price", width: 100 },
    { field: "inStock", headerName: "Quantity", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<FaEdit />}
          label="Edit"
          onClick={() => openModal(params.row)}
        />,
        <GridActionsCellItem
          icon={<FaTrashAlt />}
          label="Delete"
          onClick={() => handleDelete(params.row.id)}
        />,
      ],
    },
  ];

  // Open modal for adding/editing
  const openModal = (product = null) => {
    setCurrentProduct(product);
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setCurrentProduct(null);
  };

  // Handle save (add or edit)
  const handleSave = async (product) => {
    try {
      const productID = generateProductID(product);
      if (!productID) {
        setError("Please select a category and subcategory.");
        return;
      }

      const finalData = {
        ...product,
        ProductID: productID,
        CreatedBy: localStorage.getItem("username"),
      };

      const response = await AddProduct(finalData);
      setProducts((prev) =>
        product.id
          ? prev.map((p) => (p.id === product.id ? product : p))
          : [...prev, { ...product, id: Date.now() }]
      );
      closeModal();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Product ${product.id ? "updated" : "added"} successfully!`,
        timer: 2000,
      });
    } catch (error) {
      setError("Failed to save product");
    }
  };

  // Handle delete
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Product has been deleted.",
          timer: 2000,
        });
      }
    });
  };

  // Generate a unique product ID
  const generateProductID = (product) => {
    const { categoryID, subcategory } = product;
    if (categoryID && subcategory) {
      const categoryName = categories.find((cat) => cat.id === parseInt(categoryID))?.name || "";
      const subcategoryName = subcategories.find((sub) => sub.id === parseInt(subcategory))?.name || "";
      const catCode = categoryName.substring(0, 2).toUpperCase();
      const subCatCode = subcategoryName.substring(0, 2).toUpperCase();
      const uniqueNumber = Date.now();
      return `${catCode}${subCatCode}${uniqueNumber}`;
    }
    return "";
  };

  return (
    <div className="products-container">
      <h1 className="products-title">Products</h1>
  
      <button onClick={() => openModal()} className="add-product-button">
        <FaPlus /> Add Product
      </button>

      <div className="full-search-container">
  {/* Product ID Input */}
  <input
    type="text"
    placeholder="ProductID"
    className="full-search-input"
    value={searchQuery.productID}
    onChange={(e) => setSearchQuery({ ...searchQuery, productID: e.target.value })}
  />

  {/* Product Name Input */}
  <input
    type="text"
    placeholder="Product Name"
    className="full-search-input"
    value={searchQuery.productName}
    onChange={(e) => setSearchQuery({ ...searchQuery, productName: e.target.value })}
  />

  {/* Category Dropdown */}
  <select
    className="full-search-dropdown"
    value={searchQuery.category}
    onChange={(e) => {
      setSearchQuery({ ...searchQuery, category: e.target.value, subCategory: "" });
      // Fetch subcategories based on the selected category
      const selectedCategory = categories.find(cat => cat.id === parseInt(e.target.value));
      setSubcategories(selectedCategory ? selectedCategory.subcategoryids : []);
    }}
  >
    <option value="">--Category--</option>
    {categories.map((cat) => (
      <option key={cat.id} value={cat.id}>
        {cat.name}
      </option>
    ))}
  </select>

  {/* Subcategory Dropdown */}
  <select
    className="full-search-dropdown"
    value={searchQuery.subCategory}
    onChange={(e) => setSearchQuery({ ...searchQuery, subCategory: e.target.value })}
    disabled={!searchQuery.category} // Disable if no category is selected
  >
    <option value="">--SubCategory--</option>
    {subcategories.map((sub) => (
      <option key={sub.id} value={sub.id}>
        {sub.name}
      </option>
    ))}
  </select>

  {/* Search Button */}
  <button className="full-search-button">
    <FaSearch /> Search
  </button>
</div>
  
      {/* Material-UI DataGrid */}
      <div className="data-grid-container">
        <DataGrid
          rows={products}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          getRowId={(row) => row.productId}
          checkboxSelection
        />
      </div>
  
      {/* Modal for adding/editing */}
      {isModalOpen && (
        <Modal isVisible={isModalOpen} onClose={closeModal}>
          <ProductForm
            product={currentProduct}
            categories={categories}
            subcategories={subcategories}
            onSave={handleSave}
            onCancel={closeModal}
            setSubcategories={setSubcategories}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
          />
        </Modal>
      )}
    </div>
  );
  
};

// Product Form Component
const ProductForm = ({
    product,
    categories,
    subcategories,
    onSave,
    onCancel,
    setSubcategories,
    isUploading,
    setIsUploading,
  }) => {
    const [formData, setFormData] = useState(
      product || {
        productName: "",
        productImage: null,
        productDetails: "",
        productFeatures: "",
        productSpecifications: [],
        boxContent: [],
        price: "",
        discount: "",
        categoryID: 0,
        Quantity: "",
        subcategory: "",
        CreatedBy: localStorage.getItem("username"),
        ProductID: "",
        category: "",
        SearchKeyword: "",
      }
    );
  
    const [features, setFeatures] = useState([]);
    const [selectedCategoryId, setSelectedCategory] = useState(null);
    const [selectedSubCategoryId, setSelectedSubCategory] = useState(null);
    const [selectedFeatures, setSelectedFeatures] = useState({});
    const [error, setError] = useState(null);
  
    // Handle input changes
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleCategoryChange = async (e) => {
      const categoryId = parseInt(e.target.value, 10);
      const categoryName = e.target.options[e.target.selectedIndex]?.text || "";
  
      // Reset the features and subcategories
      setSelectedCategory(categoryId);
      setFeatures([]);
      setSubcategories([]);
  
      // Find selected category
      const selectedCategory = categories.find((cat) => cat.id === categoryId);
      if (selectedCategory && Array.isArray(selectedCategory.subcategoryids) && selectedCategory.subcategoryids.length > 0) {
        const defaultSubcategoryId = selectedCategory.subcategoryids[0].id.toString();
  
        // Update the form data with the default subcategory
        setFormData({
          ...formData,
          categoryID: categoryId,
          category: categoryName,
          subcategory: defaultSubcategoryId, // Automatically set to the first subcategory
        });
  
        // Update the subcategories state
        setSubcategories(selectedCategory.subcategoryids);
  
        // Fetch features for the default subcategory
        try {
          const requestData = {
            categoryID: categoryId,
            subCategoryID: defaultSubcategoryId,
          };
  
          const response = await FetchFeatures(requestData);
          setFeatures(response); // Set fetched features
        } catch (error) {
          console.error("Failed to fetch features for subcategory:", error);
        }
      } else {
        // If no subcategories exist, reset related fields
        setFormData({
          ...formData,
          categoryID: categoryId,
          category: categoryName,
          subcategory: "", // Clear subcategory ID if none available
        });
      }
    };
  
    const handleSubcategoryChange = async (e) => {
      const subCategoryId = parseInt(e.target.value, 10);
      setSelectedSubCategory(subCategoryId);
  
      try {
        const requestData = {
          categoryID: selectedCategoryId,
          subCategoryID: subCategoryId,
        };
        const response = await FetchFeatures(requestData);
        setFeatures(response);
      } catch (error) {
        console.error("Failed to load features", error);
      }
  
      setFormData({
        ...formData,
        subcategory: subCategoryId.toString(),
      });
    };
  
    const handleCheckBoxChange = (featurename, option) => {
      setSelectedFeatures((prev) => {
        const updatedFeatures = { ...prev };
        if (!updatedFeatures[featurename]) {
          updatedFeatures[featurename] = [];
        }
  
        if (updatedFeatures[featurename].includes(option)) {
          updatedFeatures[featurename] = updatedFeatures[featurename].filter(
            (item) => item !== option
          );
        } else {
          updatedFeatures[featurename].push(option);
        }
  
        if (updatedFeatures[featurename].length === 0) {
          delete updatedFeatures[featurename];
        }
  
        return updatedFeatures;
      });
    };
  
    const handleRadioChange = (featureName, option) => {
      setSelectedFeatures((prev) => ({
        ...prev,
        [featureName]: option,
      }));
    };
  
    const handleSpecificationsChange = (e) => {
      const { value } = e.target;
      const specifications = value.split("\n").reduce((acc, line) => {
        const [key, val] = line.split(":").map((item) => item.trim());
        if (key && val) {
          acc[key] = val;
        }
        return acc;
      }, {});
  
      setFormData((prevData) => ({
        ...prevData,
        productSpecifications: JSON.stringify(specifications),
      }));
    };
  
    const handleBoxContentChange = (e) => {
      const { value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        boxContent: value.split("\n").map((item) => item.trim()),
      }));
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
  
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(formData);
        }}
        className="product-form"
      >
         <h3 className="form-title">{product ? "Edit Product" : "Add Product"}</h3> 

        <div className="product-form-grid">

          <div className="product-form-group">
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
  
          <div className="product-form-group">
            <label htmlFor="SearchKeyword">Search Keyword</label>
            <input
              type="text"
              id="searchKeyword"
              name="searchKeyword"
              value={formData.searchKeyword}
              onChange={(e) => setFormData({ ...formData, SearchKeyword: e.target.value })}
              required
            />
          </div>
  
          <div className="product-form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.categoryID}
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
            <div className="product-form-group">
              <label htmlFor="subcategory">Subcategory (Optional)</label>
              <select
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleSubcategoryChange}
              >
                {subcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>
          )}
  
          <div className="product-form-group">
            <label htmlFor="productImage">Product Image</label>
            <input
              type="file"
              id="productImage"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>
  
          <div className="product-form-group">
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
  
          <div className="product-form-group">
            <label htmlFor="productFeatures">Product Features</label>
            <div className="features-list">
              {features.map((feature) => (
                <div key={feature.featureName} className="feature-item">
                  <h4>{feature.featureName}</h4>
                  <ul>
                    {feature.featureOptions.options.map((option) => (
                      <li key={option}>
                        <input
                          type="radio"
                          value={feature.featureName}
                          onChange={(e) => handleRadioChange(feature.featureName, option)}
                          checked={selectedFeatures[feature.featureName] === option}
                        />{" "}
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
  
          <div className="product-form-group">
            <label htmlFor="productSpecifications">Product Specifications</label>
            <textarea
              id="productSpecifications"
              name="productSpecifications"
              value={formData.productSpecifications}
              onChange={handleSpecificationsChange}
              rows="4"
              placeholder="Enter each specification on a new line. E.g., Operating System: Chrome OS"
              required
            ></textarea>
          </div>
  
          <div className="product-form-group">
            <label htmlFor="boxContent">Box Content</label>
            <textarea
              id="boxContent"
              name="boxContent"
              value={formData.boxContent.join("\n")}
              onChange={handleBoxContentChange}
              rows="3"
              placeholder="Enter each item on a new line."
              required
            ></textarea>
          </div>
  
          <div className="product-form-group">
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
  
          <div className="product-form-group">
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
  
          <div className="product-form-group">
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

         
        </div>

        <div className="addproduct-form-actions">
                {/* <button type="button" onClick={onCancel} className="cancel-button">
                Cancel
                </button> */}
                <button type="submit" className="save-button">
                Save
                </button>
            </div>

      </form>
      
    );
  };

export default AddProducts;