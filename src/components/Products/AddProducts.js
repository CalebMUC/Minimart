import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaPlus, FaSearch, FaTimes,FaImage } from "react-icons/fa";
import Swal from "sweetalert2";
import { DataGrid,GridActionsCellItem } from "@mui/x-data-grid";
import Modal from "../Modal";
import { AddProduct, FetchAllCategories, FetchFeatures, FetchProducts, FetchMerchants, EditProduct, FetchNestedCategories } from "../../Data.js";
import packageInfo from "../../../package.json";

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

  const [nestedCategories, setNestedCategories] = useState([]);

  // Fetch categories on component mount
  // useEffect(() => {
  //   const loadCategories = async () => {
  //     try {
  //       const fetchedCategories = await FetchAllCategories();
  //       setCategories(fetchedCategories);
  //     } catch (error) {
  //       setError("Failed to load categories");
  //     }
  //   };
  //   loadCategories();
  // }, []);

  // Load nested categories
    useEffect(() => {
      const LoadNestedCategories = async () => {
        try {
          const response = await FetchNestedCategories();
          setNestedCategories(response);
        } catch (error) {
          console.error(error);
        }
      };
      LoadNestedCategories();
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
      console.log("API Response:", response);
      if (Array.isArray(response)) {
        setProducts(response);
        setFilteredProducts(response);
      } else {
        setError("Invalid data format received from FetchProducts");
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError("Failed to load products. Please try again later.");
    }
  };

  useEffect(() => {
    GetProducts();
  }, []);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  // Columns for the DataGrid
  const columns = [
    { field: "productId", headerName: "ProductID", width: 70 },
    { field: "productName", headerName: "Product Name", width: 150 },
    { field: "categoryName", headerName: "Category", width: 120 },
    { field: "subCategoryName", headerName: "Subcategory", width: 120 },
    { field: "price", headerName: "Price", width: 100 },
    { field: "stockQuantity", headerName: "Quantity", width: 100 },
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
    if (localStorage.getItem('token') != null && localStorage.getItem('userID') != null) {
      setCurrentProduct(product);
      setModalOpen(true);
    } else {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Please Login to continue adding Products!",
        showConfirmButton: true
      });
    }
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setCurrentProduct(null);
  };

  const handleGridSearch = async () => {
    const { productID, productName, category, subCategory } = searchQuery;
    const filtered = products.filter((product) => {
      const matchesProductID = productID ? product.productId.toString().includes(productID) : true;
      const matchesProductName = productName ? product.productName.toString(productName) : true;
      const matchesCategory = category ? product.categoryId === parseInt(category, 10) : true;
      const matchesSubCategory = subCategory ? product.subCategoryId === subCategory : true;

      return (
        matchesProductID &&
        matchesProductName &&
        matchesCategory &&
        matchesSubCategory
      );
    });

    setFilteredProducts(filtered);
  };

  // Handle save (add or edit)
  const handleSave = async (product) => {
    try {
      let response;

      if (currentProduct?.productId) {
        product.productID = currentProduct.productId;
        product.CreatedBy = localStorage.getItem("username");
        response = await EditProduct(product);
      } else {
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

        response = await AddProduct(finalData);
      }

      if (response.responseCode === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Product ${currentProduct?.productId ? "updated" : "added"} successfully!`,
          timer: 2000,
        });
        GetProducts();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `${response.responseMessage}!`,
          showConfirmButton: true,
        });
      }

      closeModal();
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
    const { categoryId, subCategoryId } = product;
    if (categoryId != null && subCategoryId != null) {
      // const categoryName = categories.find((cat) => cat.id === parseInt(categoryID))?.name || "";
      // const subcategoryName = subcategories.find((sub) => sub.id === parseInt(subcategory))?.name || "";

      const categoryName = product.categoryName;
      const subCategoryName = product.subCategoryName;
      const subSubCategoryName = product.subSubCategoryName;

      const catCode = categoryName.substring(0, 2).toUpperCase();
      const subCatCode = subCategoryName.substring(0, 2).toUpperCase();
      const subSubCatCode = subSubCategoryName !== "" ? subCategoryName.substring(0, 2).toUpperCase() : "";
      const uniqueNumber = String(Date.now()).slice(-4);

      const baseCode = subSubCatCode ? `${catCode}${subCatCode}${subSubCatCode}` : `${catCode}${subCatCode}`

      return `${baseCode}${uniqueNumber}`;
    }
    return "";
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products Management</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
        >
          <FaPlus className="mr-2" /> Add Product
        </button>
      </div>

      {/* Search Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <input
              type="text"
              placeholder="Product ID"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              value={searchQuery.productID}
              onChange={(e) => setSearchQuery({ ...searchQuery, productID: e.target.value })}
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Product Name"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              value={searchQuery.productName}
              onChange={(e) => setSearchQuery({ ...searchQuery, productName: e.target.value })}
            />
          </div>

          <div>
            <select
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              value={searchQuery.category}
              onChange={(e) => {
                setSearchQuery({ ...searchQuery, category: e.target.value, subCategory: "" });
                const selectedCategory = categories.find(cat => cat.id === parseInt(e.target.value));
                setSubcategories(selectedCategory ? selectedCategory.subcategoryids : []);
              }}
            >
              <option value="">-- Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm disabled:bg-gray-100"
              value={searchQuery.subCategory}
              onChange={(e) => setSearchQuery({ ...searchQuery, subCategory: e.target.value })}
              disabled={!searchQuery.category}
            >
              <option value="">-- Subcategory --</option>
              {subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              onClick={handleGridSearch}
              className="w-full flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
            >
              <FaSearch className="mr-2" /> Search
            </button>
          </div>
        </div>
      </div>

      {/* Data Grid */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={filteredProducts}

            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            getRowId={(row) => row.productId}
            checkboxSelection
            sx={{
              fontFamily : 'Inter, sans-serif',
              '& .MuiDataGrid-cell': {
                borderBottom: 'none',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#fef3c7',
                borderBottom: 'none',
              },
            }}
          />
        </div>
      </div>

      {/* Modal for adding/editing */}
      {isModalOpen && (
        <Modal isVisible={isModalOpen} onClose={closeModal}>
          <ProductForm
            product={currentProduct}
            merchants={merchants}
            nestedCategories={nestedCategories}
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

const ProductForm = ({
  product,
  merchants,
  nestedCategories,
  onSave,
  onCancel,
  isUploading,
  setIsUploading,
}) => {
  const initialFormData = product
    ? {
        ...product,
        merchantID: product.merchantID || 0,
        Quantity: product.stockQuantity || 0,
        categoryId: product.categoryId || "",
        subcategoryId: product.subCategoryId || "",
        subSubCategoryId : product.subSubCategoryId || "",
        boxContent: product.box ? JSON.parse(product.box) : [],
        SearchKeyword: product.searchKeyWord || "",
        productDetails: product.productDescription || "",
        productSpecifications: product.specification ? JSON.parse(product.specification) : [],
        productImages: product.imageUrlJson|| null,
        productFeatures: product.keyFeatures ? JSON.parse(product.keyFeatures) : {},
      }
    : {
        merchantID: 0,
        productName: "",
        productImages: [], // Changed from productImage to productImages array
        productDetails: "",
        productFeatures: {},
        productSpecifications: [],
        boxContent: [],
        price: "",
        discount: "",
        categoryId: "",
        Quantity: "",
        subcategoryId: "",
        subSubCategoryId : "",
        categoryName: "",
        subCategoryName: "",
        subSubCategoryName : "",
        CreatedBy: localStorage.getItem("username"),
        ProductID: "",
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
  const [subSubcategories, setSubSubcategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    if (product?.categoryId) {
      const selectedCategory = nestedCategories.find(
        cat => cat.categoryId === parseInt(product.categoryId)
      );
      
      if (selectedCategory) {
        setSubcategories(selectedCategory.subCategories || []);
        
        if (product.subCategoryId) {
          const selectedSubcategory = selectedCategory.subCategories?.find(
            sub => sub.categoryId === parseInt(product.subCategoryId)
          );
          setSubSubcategories(selectedSubcategory?.subCategories || []);
        }
      }
    }
  }, [product, nestedCategories]);

  useEffect(() => {
    if (product?.subCategoryId) {
      const requestData = {
        categoryID: product.categoryId,
        subCategoryID: product.subCategoryId,
        subSubCategoryId : 0
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

  useEffect(() => {
    if (product?.subSubCategoryId) {
      const requestData = {
        categoryID: product.categoryId,
        subCategoryID: product.subCategoryId,
        subSubCategoryId : product.subSubCategoryId
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

  useEffect(() => {
    if (product?.keyFeatures) {
      setSelectedFeatures(JSON.parse(product.keyFeatures));
    }
  }, [product]);

  const merchantName = merchants.find(
    (merchant) => merchant.merchantID === product?.merchantID
  )?.businessName || "";

  const handleMerchantSearchChange = (e) => {
    setSearchInputMerchants(e.target.value);
    setFormData((prevData) => ({
      ...prevData,
      merchantID: parseInt(selectedMerchantID)
    }));
  };

  const handleMerchantSelect = (merchant) => {
    setShowMerchantsModal(false);
    setSelectedMerchantID(merchant.merchantID);
    setSearchInputMerchants(merchant.businessName);
    setFormData((prevData) => ({
      ...prevData,
      merchantID: parseInt(merchant.merchantID)
    }));
  };

  const handleRadioChange = (featureName, option) => {
    setSelectedFeatures((prev) => ({
      ...prev,
      [featureName]: option
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSpecificationsChange = (e) => {
    const inputValue = e.target.value;
    const specificationArray = inputValue
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    setFormData((prevData) => ({
      ...prevData,
      productSpecifications: specificationArray,
    }));
  };

      const handleCategoryChange = async (e) => {
        const categoryId = e.target.value;
        const category = nestedCategories.find(cat => cat.categoryId === parseInt(categoryId));
        
        // Update form data first
        setFormData(prev => ({
          ...prev,
          categoryId,
          subcategoryId: "",
          subSubcategoryId: "",
          categoryName: category?.categoryName || ""
        }));
      
        // Then find and set subcategories based on the new categoryId
        const selectedCategory = nestedCategories.find(
          cat => cat.categoryId === parseInt(categoryId)
        );
        
        setSubcategories(selectedCategory?.subCategories || []);
        setSubSubcategories([]);
        
        // Reset features when category changes
        setFeatures([]);
      };
      
      // Update getSubcategories to not depend on formData
      const getSubcategories = (categoryId) => {
        if (!categoryId) {
          setSubcategories([]);
          return;
        }
        
        const selectedCategory = nestedCategories.find(
          cat => cat.categoryId === parseInt(categoryId)
        );
        
        setSubcategories(selectedCategory?.subCategories || []);
        setSubSubcategories([]);
      };
      
      // Similarly for getSubSubcategories
      const getSubSubcategories = (subcategoryId) => {
        if (!subcategoryId) {
          setSubSubcategories([]);
          return;
        }
        
        const selectedSubcategory = subcategories.find(
          sub => sub.categoryId === parseInt(subcategoryId)
        );
        
        setSubSubcategories(selectedSubcategory?.subCategories || []);
      };

      const handleSubcategoryChange = async (e) => {
        const subcategoryId = e.target.value;
        const subcategory = subcategories.find(sub => sub.categoryId === parseInt(subcategoryId));
        
        setFormData(prev => ({
          ...prev,
          subcategoryId,
          subSubcategoryId: "",
          subCategoryName: subcategory?.categoryName || ""
        }));
        
        // Update sub-subcategories directly
        const selectedSubcategory = subcategories.find(
          sub => sub.categoryId === parseInt(subcategoryId)
        );
        setSubSubcategories(selectedSubcategory?.subCategories || []);
        
        // Load features
        if (subcategoryId) {
          try {
            const requestData = {
              categoryID: formData.categoryId,
              subCategoryID: subcategoryId,
              subSubCategoryId: 0
            };
            const response = await FetchFeatures(requestData);
            setFeatures(response);
          } catch (error) {
            console.error("Failed to load features", error);
            setFeatures([]);
          }
        }
      };
      
      const handleSubSubCategoryChange = async (e) => {
        const subSubcategoryId = e.target.value;
        const subSubcategory = subSubcategories.find(sub => sub.categoryId === parseInt(subSubcategoryId));
        
        setFormData(prev => ({
          ...prev,
          subSubcategoryId,
          subSubCategoryName: subSubcategory?.categoryName || ""
        }));
        
        if (subSubcategoryId) {
          try {
            const requestData = {
              categoryID: formData.categoryId,
              subCategoryID: formData.subcategoryId,
              subSubCategoryID: subSubcategoryId
            };
            const response = await FetchFeatures(requestData);
            setFeatures(response);
          } catch (error) {
            console.error("Failed to load features", error);
            setFeatures([]);
          }
        }
      };

  const handleBoxContentChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      boxContent: value.split("\n").map((item) => item.trim()),
    }));
  };

  const handleAddFeature = () => {
    if (product?.keyFeatures) {
      setShowFeaturesModal(true);
    } else {
      if (features.length > 0) {
        setShowFeaturesModal(true);
      } else {
        Swal.fire({
          title: "Error",
          icon: "error",
          text: `Features not maintained for the selected category/subcategory`,
          showConfirmButton: true
        });
      }
    }
  };

  const handleImageChange = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      try {
        const uploadedImages = [];
        
        // Limit to 4 images
        const filesToUpload = Array.from(files).slice(0, 4);
        
        for (const file of filesToUpload) {
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
          uploadedImages.push(data.url);
        }
        
        setFormData((prevData) => ({
          ...prevData,
          productImages: [...prevData.productImages, ...uploadedImages].slice(0, 4), // Ensure max 4 images
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
        const finalPayload = {
          merchantID: parseInt(formData.merchantID, 10),
          productName: formData.productName,
          productID: formData.ProductID || "",
          categoryId: parseInt(formData.categoryId, 10),
          subCategoryId: formData.subcategoryId ? parseInt(formData.subcategoryId,10) : null,
          subSubCategoryId: formData.subSubCategoryId ? parseInt(formData.subSubCategoryId,10) : 0 ,
          searchKeyWord: formData.SearchKeyword,
          categoryName: formData.categoryName,
          subCategoryName: formData.subCategoryName,
          subSubCategoryName: formData.subSubCategoryName,
          createdBy: localStorage.getItem('username'),
          productDetails: formData.productDetails,
          productSpecifications: JSON.stringify(formData.productSpecifications),
          productFeatures: JSON.stringify(selectedFeatures),
          boxContent: JSON.stringify(formData.boxContent),
          price: parseFloat(formData.price),
          quantity: parseInt(formData.Quantity, 10),
          inStock : true,
          discount: parseFloat(formData.discount),
          //productImage: formData.productImage || "",
          imageUrls: JSON.stringify(formData.productImages), // Changed from productImage to imageUrls

        };
        onSave(finalPayload);
      }}
      className="space-y-4"
    >
      <div className="flex justify-between items-center border-b pb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          {product ? "Edit Product" : "Add Product"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Merchant Search */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Merchant *</label>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search by Merchant Name or ID"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              value={searchInputMerchants}
              onChange={handleMerchantSearchChange}
            />
            <button
              type="button"
              onClick={() => setShowMerchantsModal(true)}
              className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
            >
              <FaSearch />
            </button>
          </div>
        </div>

        {/* Product Name */}
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            value={formData.productName}
            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            required
          />
        </div>

        {/* Search Keyword */}
        <div>
          <label htmlFor="SearchKeyword" className="block text-sm font-medium text-gray-700 mb-1">
            Search Keyword *
          </label>
          <input
            type="text"
            id="searchKeyword"
            name="searchKeyword"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            value={formData.SearchKeyword}
            onChange={(e) => setFormData({ ...formData, SearchKeyword: e.target.value })}
            required
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            id="category"
            name="category"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            value={formData.categoryId}
            onChange={handleCategoryChange}
            required
          >
            <option value="">--- Select Category ---</option>
            {nestedCategories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        {subcategories.length > 0 && (
          <div>
            <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
              Subcategory {!subSubcategories.length ? '*' : ''}
            </label>
            <select
              id="subcategory"
              name="subcategory"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              value={formData.subcategoryId}
              onChange={handleSubcategoryChange}
              required={!subSubcategories.length}
            >
              <option value="">--- Select Subcategory ---</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.categoryId} value={subcategory.categoryId}>
                  {subcategory.categoryName}
                </option>
              ))}
            </select>
          </div>
        )}

         {/* Sub-subcategory */}
        {subSubcategories.length > 0 && (
          <div>
            <label htmlFor="subSubcategory" className="block text-sm font-medium text-gray-700 mb-1">
              Sub-subcategory *
            </label>
            <select
              id="subSubcategory"
              name="subSubcategory"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              value={formData.subSubcategoryId}
              onChange={handleSubSubCategoryChange}
              required
            >
              <option value="">--- Select Sub-subcategory ---</option>
              {subSubcategories.map((subsubcategory) => (
                <option key={subsubcategory.categoryId} value={subsubcategory.categoryId}>
                  {subsubcategory.categoryName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Product Images */}
        <div className="col-span-2">
          <label htmlFor="productImages" className="block text-sm font-medium text-gray-700 mb-2">
            Product Images (Max 4)
          </label>
          
          {/* Image Previews */}
          {formData.productImages.length > 0 ? (
            <div className="flex flex-wrap gap-4 mb-4">
              {formData.productImages.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={image}
                      alt={`Product preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updatedImages = [...formData.productImages];
                      updatedImages.splice(index, 1);
                      setFormData({ ...formData, productImages: updatedImages });
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  >
                    <FaTimes className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-gray-300 mb-4">
              <FaImage className="h-10 w-10 text-gray-400" />
            </div>
          )}
          
          {/* Upload Button */}
          <div className="flex items-center">
            <label
              htmlFor="productImages"
              className="cursor-pointer flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
            >
              <FaPlus className="mr-2" /> Upload Images
              <input
                id="productImages"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                multiple
                className="sr-only"
              />
            </label>
            <span className="ml-3 text-sm text-gray-500">
              {formData.productImages.length}/4 images selected
            </span>
          </div>
          {isUploading && (
            <div className="mt-2 text-sm text-yellow-600 flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading images...
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="col-span-2">
          <label htmlFor="productDetails" className="block text-sm font-medium text-gray-700 mb-1">
            Product Details *
          </label>
          <textarea
            id="productDetails"
            name="productDetails"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            value={formData.productDetails}
            onChange={(e) => setFormData({ ...formData, productDetails: e.target.value })}
            rows="4"
            required
          />
        </div>

        {/* Product Features */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Features
          </label>
          <button
            type="button"
            onClick={handleAddFeature}
            className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
          >
            <FaPlus className="mr-2" /> Add Product Feature
          </button>
          
          {Object.keys(selectedFeatures).length > 0 && (
            <div className="mt-3 bg-gray-50 p-3 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Features:</h4>
              <ul className="space-y-1">
                {Object.entries(selectedFeatures).map(([feature, value]) => (
                  <li key={feature} className="text-sm text-gray-600">
                    <span className="font-medium">{feature}:</span> {value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Product Specifications */}
        <div className="col-span-2">
          <label htmlFor="productSpecifications" className="block text-sm font-medium text-gray-700 mb-1">
            Product Specifications *
          </label>
          <textarea
            id="productSpecifications"
            name="productSpecifications"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            value={formData.productSpecifications.join("\n")}
            onChange={handleSpecificationsChange}
            rows="4"
            placeholder="Enter each specification on a new line. E.g., Operating System: Chrome OS"
            required
          />
        </div>

        {/* Box Content */}
        <div className="col-span-2">
          <label htmlFor="boxContent" className="block text-sm font-medium text-gray-700 mb-1">
            Box Content *
          </label>
          <textarea
            id="boxContent"
            name="boxContent"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            value={formData.boxContent.join("\n")}
            onChange={handleBoxContentChange}
            rows="3"
            placeholder="Enter each item on a new line."
            required
          />
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="Quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Quantity *
          </label>
          <input
            type="number"
            id="Quantity"
            name="Quantity"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            value={formData.Quantity}
            onChange={(e) => setFormData({ ...formData, Quantity: e.target.value })}
            min="1"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price *
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="price"
              name="price"
              className="appearance-none block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        {/* Discount */}
        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
            Discount *
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">%</span>
            </div>
            <input
              type="number"
              id="discount"
              name="discount"
              className="appearance-none block w-full pl-3 pr-7 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              min="0"
              max="100"
              required
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          {product ? "Update Product" : "Add Product"}
        </button>
      </div>

      {/* Merchants Modal */}
      {showMerchantsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Select Merchant</h3>
            </div>
            <div className="p-4">
              <input
                type="text"
                placeholder="Search merchants..."
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm mb-4"
                value={searchInputMerchants}
                onChange={handleMerchantSearchChange}
              />
              <ul className="divide-y divide-gray-200">
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
                      className="py-3 px-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleMerchantSelect(merchant)}
                    >
                      <div className="font-medium text-gray-900">{merchant.businessName}</div>
                      <div className="text-sm text-gray-500">
                        ID: {merchant.merchantID} | Status: {merchant.status}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setShowMerchantsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Features Modal */}
      {showFeaturesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Product Features</h3>
              <button
                onClick={() => setShowFeaturesModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-4 space-y-6">
              {features.map((feature) => (
                <div key={feature.featureName} className="space-y-2">
                  <h4 className="font-medium text-gray-900">{feature.featureName}</h4>
                  <div className="space-y-2">
                    {feature.featureOptions.options.map((option) => (
                      <label key={option} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={feature.featureName}
                          value={option}
                          onChange={() => handleRadioChange(feature.featureName, option)}
                          checked={selectedFeatures[feature.featureName] === option}
                          className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setShowFeaturesModal(false)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Save Features
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default AddProducts;