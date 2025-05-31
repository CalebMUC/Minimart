import React, { useEffect, useState } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { FaEdit, FaTrashAlt, FaPlus, FaTimes, FaCheckCircle, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import { FetchFeatures, fetchCategories, AddFeaturesAPI, FetchAllFeatures, FetchNestedCategories } from "../../Data";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Modal from "../Modal";

const ProductFeature = () => {
  const [nestedCategories, setNestedCategories] = useState([]);
  const [features, setFeatures] = useState([]);
  const [featureName, setFeatureName] = useState("");
  const [featureOption, setFeatureOption] = useState("");
  const [options, setOptions] = useState([]);
  const [featureList, setFeatureList] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    categoryId: "",
    subcategoryId: "",
    subSubcategoryId: "",
  });

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

  // Fetch all features
  useEffect(() => {
    const GetAllFeatures = async () => {
      try {
        const response = await FetchAllFeatures();
        setFeatures(
          response.map((feature) => ({
            ...feature,
            featureOptions: JSON.parse(feature.featureOptions) || { options: [] },
          }))
        );
      } catch (error) {
        console.error("Failed to fetch features:", error);
      }
    };
    GetAllFeatures();
  }, []);

  // Filter features based on search query
  const filteredFeatures = features.filter(feature => 
    feature.featureName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feature.featureOptions.options.some(option => 
      option.toLowerCase().includes(searchQuery.toLowerCase())
  ))

  // Handle category selection
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setFormData({
      ...formData,
      categoryId,
      subcategoryId: "",
      subSubcategoryId: "",
    });
  };

  // Handle subcategory selection
  const handleSubcategoryChange = (e) => {
    const subcategoryId = e.target.value;
    setFormData({
      ...formData,
      subcategoryId,
      subSubcategoryId: "",
    });
  };

  // Handle sub-subcategory selection
  const handleSubSubcategoryChange = (e) => {
    const subSubcategoryId = e.target.value;
    setFormData({
      ...formData,
      subSubcategoryId,
    });
  };

  // Get subcategories for the selected category
  const getSubcategories = () => {
    const selectedCategory = nestedCategories.find(
      (cat) => cat.categoryId === parseInt(formData.categoryId, 10)
    );
    return selectedCategory?.subCategories || [];
  };

  // Get sub-subcategories for the selected subcategory
  const getSubSubcategories = () => {
    const selectedSubcategory = getSubcategories().find(
      (sub) => sub.categoryId === parseInt(formData.subcategoryId, 10)
    );
    return selectedSubcategory?.subCategories || [];
  };

  // Open Modal
  const openModal = (feature = null) => {
    setModalOpen(true);
    if (feature) {
      setEditingFeature(feature);
      setFeatureName(feature.featureName);
      setOptions(feature.featureOptions.options);
      setFormData({
        categoryId: feature.categoryID || "",
        subcategoryId: feature.subCategoryID || "",
        subSubcategoryId: feature.subSubCategoryID || "",
      });
    } else {
      clearForm();
    }
  };

  // Close Modal
  const closeModal = () => {
    setModalOpen(false);
    setEditingFeature(null);
    clearForm();
  };

  // Clear Form Fields
  const clearForm = () => {
    setFeatureName("");
    setOptions([]);
    setFeatureOption("");
    setFormData({
      categoryId: "",
      subcategoryId: "",
      subSubcategoryId: "",
    });
  };

  // Add Feature Option
  const addFeatureOption = () => {
    if (featureOption.trim() && !options.includes(featureOption)) {
      setOptions([...options, featureOption.trim()]);
      setFeatureOption("");
    }
  };

  // Remove Feature Option
  const removeFeatureOption = (option) => {
    setOptions(options.filter((opt) => opt !== option));
  };

  // Save Feature
  const handleSaveFeature = async () => {
    if (!featureName.trim() || options.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Please provide a feature name and at least one option.",
        icon: "error",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    if (!formData.categoryId) {
      Swal.fire({
        title: "Error",
        text: "Please select a category.",
        icon: "error",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    const featureData = {
      featureName,
      featureOptions: { options },
      categoryId: parseInt(formData.categoryId),
      subcategoryId: parseInt(formData.subcategoryId) || null,
      subSubcategoryId: parseInt(formData.subSubcategoryId) || null,
    };

    // try {
    //   await AddFeaturesAPI(featureData);
    //   setFeatures([...features, featureData]);
    //   Swal.fire("Success", "Feature added successfully!", "success");
    //   closeModal();
    // } catch (error) {
    //   console.error("Failed to add feature:", error);
    //   Swal.fire("Error", "Failed to add feature.", "error");
    // }

    try {
      await AddFeaturesAPI(featureData);
      // const updatedFeatures = editingFeature 
      //   ? features.map(f => f.featureID === editingFeature.featureID ? featureData : f)
      //   : [...features, featureData];
      setFeatures([...features, featureData]);
      Swal.fire({
        title: "Success",
        text: `Feature ${editingFeature ? "updated" : "added"} successfully!`,
        icon: "success",
        confirmButtonColor: "#f59e0b",
      });
      closeModal();
    } catch (error) {
      console.error("Failed to save feature:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to save feature. Please try again.",
        icon: "error",
        confirmButtonColor: "#f59e0b",
      });
    }


  };

  // Delete Feature
  const handleDeleteFeature = async (featureId) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    });

    if (confirmDelete.isConfirmed) {
      try {
        // Replace with actual delete API call
        // await DeleteFeatureAPI(featureId);
        setFeatures(features.filter(f => f.featureID !== featureId));
        Swal.fire({
          title: "Deleted!",
          text: "Feature has been deleted.",
          icon: "success",
          confirmButtonColor: "#f59e0b",
        });
      } catch (error) {
        console.error("Failed to delete feature:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to delete feature.",
          icon: "error",
          confirmButtonColor: "#f59e0b",
        });
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Product Features</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-sm transition-colors duration-200"
        >
          <FaPlus className="mr-2" /> Add Feature
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search features or options..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Data Grid */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <DataGrid
          rows={filteredFeatures}
          columns={[
            { 
              field: "featureName", 
              headerName: "Feature Name", 
              width: 200,
              renderCell: (params) => (
                <div className="font-medium text-gray-800">{params.value}</div>
              )
            },
            { 
              field: "categoryName", 
              headerName: "Category", 
              width: 150 
            },
            { 
              field: "subCategoryName", 
              headerName: "SubCategory", 
              width: 150 
            },
            { 
              field: "subSubCategoryName", 
              headerName: "SubsubCategory", 
              width: 150 
            },
            {
              field: "featureOptions",
              headerName: "Options",
              width: 300,
              renderCell: (params) => (
                <div className="flex flex-wrap gap-1">
                  {params.value?.options.map((option, i) => (
                    <span key={i} className="bg-yellow-50 text-yellow-800 px-2 py-1 rounded text-xs">
                      {option}
                    </span>
                  ))}
                </div>
              ),
            },
            {
              field: "actions",
              headerName: "Actions",
              type: "actions",
              width: 120,
              getActions: (params) => [
                <GridActionsCellItem 
                  icon={<FaEdit className="text-yellow-600 hover:text-yellow-800" />}
                  label="Edit"
                  onClick={() => openModal(params.row)}
                />,
                <GridActionsCellItem
                  icon={<FaTrashAlt className="text-red-500 hover:text-red-700" />}
                  label="Delete"
                  onClick={() => handleDeleteFeature(params.row.featureID)}
                />,
              ],
            },
          ]}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          getRowId={(row) => row.featureID}
          autoHeight
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

      {/* Feature Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {editingFeature ? "Edit Feature" : "Add New Feature"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Category Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Category *</label>
                <select
                  value={formData.categoryId}
                  onChange={handleCategoryChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  required
                >
                  <option value="">Select Category</option>
                  {nestedCategories.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory Selection */}
              {formData.categoryId && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                  <select
                    value={formData.subcategoryId}
                    onChange={handleSubcategoryChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  >
                    <option value="">Select Subcategory</option>
                    {getSubcategories().map((sub) => (
                      <option key={sub.categoryId} value={sub.categoryId}>
                        {sub.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sub-Subcategory Selection */}
              {formData.subcategoryId && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Sub-Subcategory</label>
                  <select
                    value={formData.subSubcategoryId}
                    onChange={handleSubSubcategoryChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  >
                    <option value="">Select Sub-Subcategory</option>
                    {getSubSubcategories().map((subSub) => (
                      <option key={subSub.categoryId} value={subSub.categoryId}>
                        {subSub.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Feature Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Feature Name *</label>
                <input
                  type="text"
                  value={featureName}
                  onChange={(e) => setFeatureName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  placeholder="Enter feature name"
                  required
                />
              </div>

              {/* Feature Options */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Options *</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={featureOption}
                    onChange={(e) => setFeatureOption(e.target.value)}
                    className="flex-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    placeholder="Enter an option"
                    onKeyPress={(e) => e.key === 'Enter' && addFeatureOption()}
                  />
                  <button
                    type="button"
                    onClick={addFeatureOption}
                    className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg shadow-sm transition-colors duration-200"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>

              {/* Options List */}
              {options.length > 0 && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full">
                        <span className="text-sm">{option}</span>
                        <button
                          onClick={() => removeFeatureOption(option)}
                          className="ml-1 text-yellow-600 hover:text-yellow-800"
                        >
                          <FaTimes className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleSaveFeature}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors duration-200"
                >
                  {editingFeature ? "Update Feature" : "Save Feature"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFeature;