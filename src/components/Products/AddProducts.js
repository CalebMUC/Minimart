import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Modal from "../Modal"; // Ensure you have a Modal component
import { AddProduct, fetchCategories, FetchFeatures,FetchProducts,FetchMerchants,EditProduct} from "../../Data.js";
import packageInfo from "../../../package.json";
import '../../CSS/productForm.css';
import { FaSearch } from "react-icons/fa";
import { parse } from "path-browserify";

const AddProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [features, setFeatures] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [merchants, setMerchants] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    productID: "",
    productName: "",
    category: "",
    subCategory: "",
  });
  const [filteredProducts, setFilteredProducts] = useState([]);
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

   // Fetch all merchants
    const GetAllMerchants = async () => {
      try {
        const response = await FetchMerchants();
        if (response) {
          setMerchants(response);
        }
      } catch (error) {
        console.error("Error fetching merchants:", error);
      }
    };
  
    useEffect(() => {
      GetAllMerchants();
    }, []);

    const GetProducts = async () => {
      try {
        const response = await FetchProducts();
        console.log("API Response:", response); // Log the response for debugging
        if (Array.isArray(response)) {
          setProducts(response);
          setFilteredProducts(response); // Initialize filteredProducts with products

        } else {
          setError("Invalid data format received from FetchProducts");
        }
      } catch (error) {
        console.error("Failed to fetch products:", error); // Log the error for debugging
        setError("Failed to load products. Please try again later.");
      }
    };

  useEffect(() => {
    GetProducts();
  }, []);

  useEffect(() => {
    setFilteredProducts(products); // Initialize filteredProducts with products
  }, [products]);

  // Columns for the DataGrid
  const columns = [
    { field: "productId", headerName: "ProductID", width: 70 },
    { field: "productName", headerName: "Product Name", width: 150 },
    { field: "category", headerName: "Category", width: 120 },
    { field: "subCategoryName", headerName: "Subcategory", width: 120 },
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
    if(localStorage.getItem('token') != null && localStorage.getItem('userID') != null){
      setCurrentProduct(product);
      setModalOpen(true);
    }else{
      Swal.fire({
        title : "Error",
        icon : "Error",
        text : "Please Login to continue adding Products!",
        showConfirmButton : true
        
      }
      )
    }
   
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setCurrentProduct(null);
  };

  const handleGridSearch = async () =>{
    const {productID,productName,category,subCategory} =  searchQuery;
    const filtered = products.filter((product)=>{
      const matchesProductID = 
      productID ? product.productId.toString().includes(productID): true

      const matchesProductName = productName ? 
      product.productName.toString(productName) : true
      const matchesCategory = category ?
       product.categoryId === parseInt(category,10) : true

       const matchesSubCategory = subCategory
       ? product.subCategoryId === subCategory
       : true;

       return(
        matchesProductID &&
        matchesProductName &&
        matchesCategory && 
        matchesSubCategory
       )

    })

    setFilteredProducts(filtered);

  }

  // Handle save (add or edit)
  const handleSave = async (product) => {
    try {
      let response;
  
      // Check if the product has an ID (indicating it's an edit operation)
      if (currentProduct?.productId) {
        // If editing, use the existing productID
        product.productID = currentProduct.productId;
        product.CreatedBy = localStorage.getItem("username"); 
        response = await EditProduct(product);
      } else {
        // If adding a new product, generate a productID
        const productID = generateProductID(product);
        if (!productID) {
          setError("Please select a category and subcategory.");
          return;
        }
  
        // Add the generated productID to the payload
        const finalData = {
          ...product,
          ProductID: productID,
          CreatedBy: localStorage.getItem("username"),
        };
  
        response = await AddProduct(finalData);
      }
  
      // Handle the response
      if (response.responseStatusId === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Product ${currentProduct?.productId ? "updated" : "added"} successfully!`,
          timer: 2000,
        });
        GetProducts(); // Refresh the product list
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `${response.responseMessage}!`,
          showConfirmButton: true,
        });
      }
  
      closeModal(); // Close the modal after saving
    } catch (error) {
      setError("Failed to save product");
      console.error("Error in handleSave:", error);
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
    if (categoryID != null && subcategory != null) {
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
  <button onClick={handleGridSearch} className="full-search-button">
    <FaSearch /> Search
  </button>
</div>
  
      {/* Material-UI DataGrid */}
      <div className="data-grid-container">
        <DataGrid
          rows={filteredProducts}
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
            merchants={merchants}
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
  merchants,
  categories,
  subcategories,
  onSave,
  onCancel,
  setSubcategories,
  isUploading,
  setIsUploading,
}) => {
  // Parse the product data correctly
  const initialFormData = product
  ? {
      ...product,
      merchantID: product.merchantID || 0, // Bind merchantID
      Quantity: product.inStock || 0, // Bind stockQuantity to Quantity
      categoryID: product.categoryId || "", // Bind categoryId to categoryID
      subcategory: product.subCategoryId || "", // Bind subcategory
      boxContent: product.box ? JSON.parse(product.box) : [], // Parse JSON string into array
      SearchKeyword: product.searchKeyWord || "", // Map searchKeyWord to SearchKeyword
      productDetails: product.productDescription || "", // Map productDescription to productDetails
      productSpecifications: product.specification ? JSON.parse(product.specification) : [], // Parse JSON string into array
      productImage: product.imageUrl || null, // Map imageUrl to productImage
      productFeatures: product.keyFeatures ? JSON.parse(product.keyFeatures) : {}, // Parse keyFeatures into an object
    }
  : {
      merchantID: 0,
      productName: "",
      productImage: null,
      productDetails: "",
      productFeatures: {},
      productSpecifications: [],
      boxContent: [],
      price: "",
      discount: "",
      categoryID: "",
      Quantity: "",
      subcategory: "",
      subCategoryName: "",
      CreatedBy: localStorage.getItem("username"),
      ProductID: "",
      category: "",
      SearchKeyword: "",
    };

  const [formData, setFormData] = useState(initialFormData);
  const [features, setFeatures] = useState([]);
  const [selectedCategoryId, setSelectedCategory] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategory] = useState(0);
  const [selectedFeatures, setSelectedFeatures] = useState({});
  const [error, setError] = useState(null);
  
  const [selectedMerchantID, setSelectedMerchantID] = useState(null);
  const [showMerchantsModal, setShowMerchantsModal] = useState(false);
  const [searchInputMerchants, setSearchInputMerchants] = useState("");
  const [showFeaturesModal, setShowFeaturesModal] = useState(false); 
  const [defaultSubcategoryId,setDefaultSubcategoryID] =  useState(0);

  //Fetch Subcategries when editing
  useEffect(()=>{
    if(product?.categoryId){

      const selectedCategory = categories.find((cat) => cat.id === parseInt(product.categoryId,10));
      if(selectedCategory && Array.isArray(selectedCategory.subcategoryids)){
        setSubcategories(selectedCategory.subcategoryids)
      }
    }
  },[product,categories,subcategories])

  // Fetch features for the selected subcategory when editing
  useEffect(() => {
    if (product?.subCategoryId) {
      const requestData = {
        categoryID: product.categoryId,
        subCategoryID: product.subCategoryId,
      };
      FetchFeatures(requestData)
        .then((response) => {
          setFeatures(response);
        })
        .catch((error) => {
          console.error("Failed to load features", error);
        });
    }
  }, [product]);

  
  // Initialize selectedFeatures with product.keyFeatures
  useEffect(() => {
    if (product?.keyFeatures) {
      setSelectedFeatures(JSON.parse(product.keyFeatures));
    }
  }, [product]);

    // Find the merchant name based on product.merchantID
    const merchantName = merchants.find(
      (merchant) => merchant.merchantID === product?.merchantID
    )?.businessName || "";
 


  // useEffect(() => {
  //   if (categories.length > 0) {
  //     loadDefaultSubcategory();
  //   }
  // }, [categories]); // Run this effect whenever `categories` changes
  
  // const loadDefaultSubcategory = async () => {
  //   if (categories.length > 0 && categories[0].subcategoryids && categories[0].subcategoryids.length > 0) {
  //     const defaultSubcategoryId = categories[0].subcategoryids[0].id;
  
  //     setDefaultSubcategoryID(defaultSubcategoryId);

  //     setSelectedCategory(categories[0].id)
  
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       categoryID: categories[0].id,
  //       subcategory: defaultSubcategoryId.toString(),
  //     }));
  
  //     setSubcategories(categories[0].subcategoryids);
  
  //     try {
  //       const requestData = {
  //         categoryID: categories[0].id,
  //         subCategoryID: defaultSubcategoryId,
  //       };
  //       const response = await FetchFeatures(requestData);
  //       setFeatures(response);
  //     } catch (error) {
  //       console.error("Failed to fetch features:", error);
  //     }
  //   }
  // };
  
    // Handle merchant search input change
    const handleMerchantSearchChange = (e) => {
      setSearchInputMerchants(e.target.value);
      setFormData((prevData)=>({
        ...prevData,
        merchantID : parseInt(selectedMerchantID)
    }))
    };
  
    // Handle merchant selection
    const handleMerchantSelect = (merchant) => {
      setShowMerchantsModal(false);
      setSelectedMerchantID(merchant.merchantID);
      setSearchInputMerchants(merchant.merchantName)
      setFormData((prevData)=>({
        ...prevData,
        merchantID : parseInt(merchant.merchantID)
    }))

    };

    const handleRadioChange = (featureName,option) =>{
      setSelectedFeatures((prev) =>({
        ...prev,
        [featureName]: option
      }))
    }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSpecificationsChange = (e) => {
    //const lines = e.target.value
      //.split("\n") // Split the text input into lines
      //.map(line => line.trim()) // Trim whitespace from each line
      //.filter(line => line !== ""); // Filter out empty lines

      const inputValue = e.target.value

      const specificationArray = inputValue
      .split("/n")
      .map((line)=> line.trim())
      .filter((line) => line !== "")
  
    setFormData((prevData) => ({
      ...prevData,
      productSpecifications:specificationArray ,  // Update state with the array of lines
    }));
  };

  // Handle category change
  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    const categoryName = e.target.options[e.target.selectedIndex]?.text || "";

    // Reset the features and subcategories
    setSelectedCategory(categoryId);
    setFeatures([]);
    setSubcategories([]);

    if (categoryId) {
      // Find selected category
      const selectedCategory = categories.find((cat) => cat.id === parseInt(categoryId, 10));
      if (selectedCategory && Array.isArray(selectedCategory.subcategoryids) && selectedCategory.subcategoryids.length > 0) {
        // Update the subcategories state
        setSubcategories(selectedCategory.subcategoryids);
      }

      // Update the form data with the selected category
      setFormData({
        ...formData,
        categoryID: categoryId,
        category: categoryName,
        subcategory: "", // Reset subcategory when category changes
      });
    } else {
      // If no category is selected, reset related fields
      setFormData({
        ...formData,
        categoryID: "",
        category: "",
        subcategory: "",
      });
    }
  };

  // Handle subcategory change
  const handleSubcategoryChange = async (e) => {
    const subCategoryId = parseInt(e.target.value, 10);
    const subCategoryName = e.target.options[e.target.selectedIndex]?.text || "";
    setSelectedSubCategory(subCategoryId);

    if(subCategoryId){
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
        subCategoryName : subCategoryName
      });
    }else{
      setFormData({
        ...formData,
        subcategory: "",
        subCategoryName : ""
      });
    }

   
  };

  // Handle box content change
  const handleBoxContentChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      boxContent: value.split("\n").map((item) => item.trim()),
    }));
  };

  const handleAddFeature = () =>{
    if(product?.keyFeatures){
      setShowFeaturesModal(true)
      
    }else{
      if(features.length > 0){
        setShowFeaturesModal(true)
      }else{
        Swal.fire({
          title : "Error",
          icon : "Error",
          text : `Features not maintained for the selected category/subcategory`,
          showConfirmButton : true
        })
      }
    }
   
  }

  // Handle image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      try {
        const imageData = new FormData();
        imageData.append("file", file);
        const response = await fetch(packageInfo.urls.UploadImages, {
          method: "POST",
          body: imageData,
        });
        if (!response.ok) {
          throw new Error("Failed to upload image");
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
          // Merge selectedFeatures into formData
          // Format the payload to match the expected structure
      const finalPayload = {
        merchantID: parseInt(formData.merchantID, 10), // Ensure it's a number
        productName: formData.productName,
        productID: formData.ProductID || "", // Ensure it's a string
        categoryID: parseInt(formData.categoryID, 10), // Ensure it's a number
        searchKeyWord: formData.SearchKeyword, // Map SearchKeyword to searchKeyWord
        category: formData.category,
        subcategory: formData.subcategory,
        subcategoryName: formData.subCategoryName,
        createdBy: localStorage.getItem('username'),
        productDetails: formData.productDetails,
        productSpecifications: JSON.stringify(formData.productSpecifications), // Convert array to JSON string
        productFeatures: JSON.stringify(selectedFeatures), // Convert object to JSON string
        boxContent: JSON.stringify(formData.boxContent), // Convert array to JSON string
        price: parseFloat(formData.price), // Ensure it's a number
        quantity: parseInt(formData.Quantity, 10), // Ensure it's a number
        discount: parseFloat(formData.discount), // Ensure it's a number
        productImage: formData.productImage || "", // Ensure it's a string
      };

      // Call onSave with the formatted payload
      onSave(finalPayload);
    }}
      className="product-form"
    >
      <h3 className="form-title">{product ? "Edit Product" : "Add Product"}</h3>

      <div className="product-form-grid">

        <div className="search-merchants">
          <input
            type="text"
            placeholder="Search by Merchant Name or ID"
            value={searchInputMerchants}
            onChange={handleMerchantSearchChange}
          />
          <button onClick={() => setShowMerchantsModal(true)}>
            <FaSearch />
          </button>
        </div>

         {/* Merchants Modal */}
      {showMerchantsModal && (
        <div className="search-modal">
          <div className="search-modal-content">
            <h4>Select Merchant</h4>
            <ul>
              {merchants
                .filter((merchant) =>
                  merchant.businessName
                    .toLowerCase()
                    .includes(searchInputMerchants.toLowerCase()) ||
                  merchant.merchantID.toString().includes(searchInputMerchants)
                )
                .map((merchant) => (
                  <li
                    key={merchant.merchantID}
                    onClick={() => handleMerchantSelect(merchant)}
                  >
                    {merchant.businessName} (ID: {merchant.merchantID}, Status:{" "}
                    {merchant.status})
                  </li>
                ))}
            </ul>
            <button onClick={() => setShowMerchantsModal(false)}>Close</button>
          </div>
        </div>
      )}


        {/* Product Name */}
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

        {/* Search Keyword */}
        <div className="product-form-group">
          <label htmlFor="SearchKeyword">Search Keyword</label>
          <input
            type="text"
            id="searchKeyword"
            name="searchKeyword"
            value={formData.SearchKeyword}
            onChange={(e) => setFormData({ ...formData, SearchKeyword: e.target.value })}
            required
          />
        </div>

        {/* Category */}
        <div className="product-form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.categoryID}
            onChange={handleCategoryChange}
            required
          >
            {/* <option value="" disabled>
              Select a category
            </option> */}

            <option value="">---Select---</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        {subcategories.length > 0 && ( 
          <div className="product-form-group">
            <label htmlFor="subcategory">Subcategory</label>
            <select
              id="subcategory"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleSubcategoryChange}
            >
              <option value="">---Select---</option>

              {subcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>
         )} 

        {/* Product Image */}
        {/* <div className="product-form-group">
          <label htmlFor="productImage">Product Image</label>
          <input
            type="file"
            id="productImage"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div> */}

        
        {/* Product Image */}
        <div className="product-form-group">
          <label htmlFor="productImage">Product Image</label>
          {formData.productImage && (
            <img
              src={formData.productImage}
              alt="Product"
              style={{ width: "100px", height: "50px", marginBottom: "10px" }}
            />
          )}
          <input
            type="file"
            id="productImage"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* Product Details */}
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

        {/* Add Product Feature Button */}
        <div className="form-group">
          <label htmlFor="productFeatures">Product Features</label>
          <button
            type="button"
            onClick={handleAddFeature}
            className="add-product-button"
          >
            <FaPlus />  Add Product Feature
          </button>
        </div>

        {/* Product Features Modal */}
        {showFeaturesModal && (
          <div className="search-modal">
            <div className="search-modal-content">
              <h3>Product Features</h3>
              <div>
                {features.map((feature) => (
                  <div key={feature.featureName}>
                    <h4>{feature.featureName}</h4>
                    <ul>
                      {feature.featureOptions.options.map((option) => (
                        <li key={option}>
                          <input
                            type="radio"
                            value={option}
                            onChange={() => handleRadioChange(feature.featureName, option)}
                            checked={selectedFeatures[feature.featureName] === option}
                          />{" "}
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <button className="search-close-button" onClick={() => setShowFeaturesModal(false)}>
                X
              </button>

            </div>
          </div>
        )}

      <div className="form-group">
        <label htmlFor="productSpecifications">Product Specifications(Fearures unique to the product)</label>
        <textarea
          id="productSpecifications"
          name="productSpecifications"
          value={formData.productSpecifications.join("\n")}
          onChange={handleSpecificationsChange}
          rows="4"
          placeholder="Enter each specification on a new line. E.g., Operating System: Chrome OS"
          required
        >
          
        </textarea>
        </div>

        {/* Box Content */}
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

        {/* Quantity */}
        <div className="product-form-group">
          <label htmlFor="Quantity">Quantity</label>
          {/* <select
            id="Quantity"
            name="Quantity"
            value={formData.Quantity}
            onChange={(e) => setFormData({ ...formData, Quantity: e.target.value })}
            required
          >
            <option value="" disabled>
              Select quantity
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select> */}

          <input
            type="number"
             id="Quantity"
            name="Quantity"
            value={formData.Quantity}
            onChange={(e) => setFormData({ ...formData, Quantity: e.target.value })}
            required
          />
        </div>

        {/* Price */}
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

        {/* Discount */}
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

      {/* Form Actions */}
      <div className="addproduct-form-actions">
        <button type="submit" className="save-button">
          Save
        </button>
      </div>
    </form>
  );
};

export default AddProducts;