import React, { useEffect, useState } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { FaEdit, FaTrashAlt, FaPlus, FaTimes, FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import { FetchFeatures, fetchCategories, AddFeaturesAPI, FetchAllFeatures, FetchNestedCategories } from "../../Data";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import "../../CSS/Products/productFeatures.css";
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

  // Form data for selected category, subcategory, and sub-subcategory
  const [formData, setFormData] = useState({
    categoryId: "",
    subcategoryId: "",
    subSubcategoryId: "",
  });

  // Load nested categories on component mount
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
  const openModal = () => {
    setModalOpen(true);
    clearForm();
  };

  // Close Modal
  const closeModal = () => {
    setModalOpen(false);
    setEditingFeature(null);
  };

  // Clear Form Fields
  const clearForm = () => {
    setFeatureName("");
    setOptions([]);
    setFeatureOption("");
  };

  // Add Feature Option
  const addFeatureOption = () => {
    if (featureOption.trim() && !options.includes(featureOption)) {
      setOptions([...options, featureOption.trim()]);
      setFeatureOption("");
    }
  };

  // Add Feature to List
  const addFeatureToList = () => {
    if (!featureName.trim() || options.length === 0) {
      Swal.fire("Error", "Please provide a feature name and at least one option.", "error");
      return;
    }

    const newFeature = {
      featureName,
      featureOptions: { options },
    };

    const existingFeatureIndex = featureList.findIndex(
      (feature) => feature.featureName === featureName
    );

    if (existingFeatureIndex !== -1) {
      const updatedFeatureList = [...featureList];
      updatedFeatureList[existingFeatureIndex] = newFeature;
      setFeatureList(updatedFeatureList);
    } else {
      setFeatureList([...featureList, newFeature]);
    }

    clearForm();
  };

  // Remove Feature from List
  const removeFeatureList = (featureToRemove) => {
    const updatedFeatureList = featureList.filter(
      (feature) => feature.featureName !== featureToRemove.featureName
    );
    setFeatureList(updatedFeatureList);
  };

  // Remove Feature Option
  const removeFeatureOption = (option) => {
    setOptions(options.filter((opt) => opt !== option));
  };

  // Save Feature
  const handleSaveFeature = async () => {
    if (!featureName.trim() || options.length === 0) {
      Swal.fire("Error", "Please provide a feature name and at least one option.", "error");
      return;
    }

    const newFeature = {
      featureName,
      featureOptions: { options },
      categoryId: formData.categoryId,
      subcategoryId: formData.subcategoryId,
      subSubcategoryId: formData.subSubcategoryId,
    };

    try {
      await AddFeaturesAPI(newFeature);
      setFeatures([...features, newFeature]);
      Swal.fire("Success", "Feature added successfully!", "success");
      closeModal();
    } catch (error) {
      console.error("Failed to add feature:", error);
      Swal.fire("Error", "Failed to add feature.", "error");
    }
  };

  // Delete Feature
  const handleDeleteFeature = async (featureName) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${featureName}". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (confirmDelete.isConfirmed) {
      try {
        // API Call to delete feature (replace with actual function)
        // await DeleteFeatureAPI(featureName);
        setFeatures(features.filter((f) => f.featureName !== featureName));
        Swal.fire("Deleted", "Feature has been deleted.", "success");
      } catch (error) {
        console.error("Failed to delete feature:", error);
        Swal.fire("Error", "Failed to delete feature.", "error");
      }
    }
  };

  return (
    <div className="product-feature-container">
      <h1 className="product-feature-heading">Maintain Features</h1>

      <button onClick={openModal} className="product-feature-button">
        <FaPlus className="mr-2" /> Add Feature
      </button>

      {/* Data Grid */}
      <div className="mt-6">
        <DataGrid
          rows={features}
          columns={[
            { field: "featureName", headerName: "Feature Name", width: 200 },
            { field: "categoryName", headerName: "Category Name", width: 200 },
            {
              field: "featureOptions",
              headerName: "Options",
              width: 300,
              renderCell: (params) => params.value?.options.join(", ") || "",
            },
            {
              field: "actions",
              headerName: "Actions",
              type: "actions",
              width: 100,
              getActions: (params) => [
                <GridActionsCellItem icon={<FaEdit />} label="Edit" onClick={() => openModal()} />,
                <GridActionsCellItem icon={<FaTrashAlt />} label="Delete" onClick={() => handleDeleteFeature(params.row.featureName)} />,
              ],
            },
          ]}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          getRowId={(row) => row.featureID}
          checkboxSelection
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal isVisible={isModalOpen} onClose={closeModal}>
          <form className="product-feature-form">
            <h2 className="product-feature-heading">Add New Feature</h2>

            {/* Category Dropdown */}
            <div className="form-group">
              <label>Category</label>
              <select value={formData.categoryId} onChange={handleCategoryChange}>
                <option value="">Select Category</option>
                {nestedCategories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Dropdown */}
            {formData.categoryId && (
              <div className="form-group">
                <label>Subcategory</label>
                <select value={formData.subcategoryId} onChange={handleSubcategoryChange}>
                  <option value="">Select Subcategory</option>
                  {getSubcategories().map((sub) => (
                    <option key={sub.categoryId} value={sub.categoryId}>
                      {sub.categoryName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sub-Subcategory Dropdown */}
            {formData.subcategoryId && (
              <div className="form-group">
                <label>Sub-Subcategory</label>
                <select value={formData.subSubcategoryId} onChange={handleSubSubcategoryChange}>
                  <option value="">Select Sub-Subcategory</option>
                  {getSubSubcategories().map((subSub) => (
                    <option key={subSub.categoryId} value={subSub.categoryId}>
                      {subSub.categoryName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Feature Name Input */}
            <div className="form-group">
              <label>Feature Name</label>
              <input
                type="text"
                value={featureName}
                onChange={(e) => setFeatureName(e.target.value)}
                placeholder="Enter feature name"
                required
              />
            </div>

            {/* Feature Option Input */}
            <div className="form-group">
              <label>Feature Option</label>
              <div className="flex">
                <input
                  type="text"
                  value={featureOption}
                  onChange={(e) => setFeatureOption(e.target.value)}
                  placeholder="Enter an option"
                />
                <button
                  type="button"
                  className="ml-2 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition"
                  onClick={addFeatureOption}
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            {/* Options List */}
            <Stack direction="row" spacing={1}>
              {options.map((option, index) => (
                <Chip
                  key={index}
                  label={option}
                  onDelete={() => removeFeatureOption(option)}
                  color="transparent"
                />
              ))}
            </Stack>

            {/* Add Feature to List Button */}
            <button
              type="button"
              className="product-feature-button"
              onClick={addFeatureToList}
            >
              Add Feature
            </button>

            {/* Features to Submit List */}
            <h3>Features to Submit</h3>
            <ul className="features-list">
              {featureList.map((feature, index) => (
                <li key={index} onClick={() => setFeatureName(feature.featureName)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">
                        <FaCheckCircle />
                      </span>
                      <span>{feature.featureName}:</span> {feature.featureOptions.options.join(", ")}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFeatureList(feature);
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Save Features Button */}
            <button
              type="button"
              className="save-button"
              onClick={handleSaveFeature}
            >
              Save Features
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ProductFeature;