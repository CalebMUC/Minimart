import React, { useState, useEffect } from "react";
import '../../src/AddCategories.css';
import { fetchCategories, FetchFeatures, AddEditCategories } from '../Data.js'; 
import Dialogs from "./Dialogs.js";

const AddCategories = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubcategories, setNewSubcategories] = useState([""]);
  const [addingNewCategory, setAddingNewCategory] = useState(true);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    categoryID: 0,
    categoryName: "",
    SubcategoryName: [],
    productName : "",
    description : ""
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

  // Update form data and load subcategories when selectedCategoryId changes
  useEffect(() => {
    if (selectedCategoryId) {
      const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);

      setFormData((prevData) => ({
        ...prevData,
        categoryID: selectedCategoryId,
        categoryName: selectedCategory?.name || "",
        SubcategoryName: selectedCategory?.subcategories || []
      }));

      setSubcategories(selectedCategory?.subcategories || []);
    }
  }, [selectedCategoryId, categories]);

  const handleSelectionChange = () => {
    setAddingNewCategory(!addingNewCategory);
    setSelectedCategoryId(null);
    setNewCategoryName("");
    setNewSubcategories([""]);
    setFormData({
      categoryID: 0,
      categoryName: "",
      SubcategoryName: []
    });
  };

  const addSubcategoryField = () => {
    setNewSubcategories([...newSubcategories, ""]);
  };

  const handleSubcategoryChange = (index, value) => {
    const updatedSubcategories = [...newSubcategories];
    updatedSubcategories[index] = value;
    setNewSubcategories(updatedSubcategories);

    setFormData((prevData) => ({
      ...prevData,
      SubcategoryName: updatedSubcategories
    }));
  };

  const handleCategoryChange = (e) => {
    setSelectedCategoryId(parseInt(e.target.value, 10));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalData = {
      categoryID: addingNewCategory ? 0 : selectedCategoryId,
      categoryName: addingNewCategory ? newCategoryName : formData.categoryName,
      productName : formData.productName != undefined ? formData.productName : "" ,
      description : formData.description !=  undefined ? formData.description : "",
      SubcategoryName: newSubcategories.filter((sub) => sub)

    };

    try {
      const response = await AddEditCategories(finalData);
      setSuccessMessage('Category added successfully');
      setShowSuccessDialog(true);
      // alert("Category saved successfully!");
    } catch (error) {
      setError("Failed to add product");
      //console.error("Error saving category:", error);
    }

    // Reset form
    setNewCategoryName("");
    setNewSubcategories([""]);
    setSelectedCategoryId(null);
    setFormData({
      categoryID: 0,
      categoryName: "",
      SubcategoryName: [],
      productName : "",
      description : ""
    });
  };

  const HandleCloseDialog = () => {
    setShowSuccessDialog(false);
  };

  return (
    <div className="form-container">
      <h2 className="form-title">
        {addingNewCategory ? "Add New Category" : "Update Existing Category"}
      </h2>
      <button className="toggle-button" onClick={handleSelectionChange}>
        {addingNewCategory ? "Switch to Update Existing" : "Switch to Add New"}
      </button>

      {showSuccessDialog && 
      <Dialogs message={successMessage}
      type="success"
      onClose={HandleCloseDialog}
       />}

      <form onSubmit={handleSubmit} className="form-card">
      {addingNewCategory ? (
  <>
    <div className="form-group">
      <label className="form-label">New Category Name:</label>
      <input
        type="text"
        className="form-input"
        value={newCategoryName}
        onChange={(e) => {
          setNewCategoryName(e.target.value);
          setFormData((prevData) => ({
            ...prevData,
            categoryName: e.target.value,
          }));
        }}
        required
      />
    </div>

     <div className="form-group">
      <label className="form-label">Description</label>
      <input
        type="text"
        className="form-input"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        placeholder="Enter a brief description"
        required
      />
    </div>



   
  </>
) : (
<>
  <div className="form-group">
    <label className="form-label">Select Existing Category:</label>
    <select
      className="form-select"
      value={selectedCategoryId || ""}
      onChange={handleCategoryChange}
      required
    >
      <option value="">-- Select Category --</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  </div>
 
  <div className="form-group">
      <label className="form-label">Product Name</label>
      <input
        type="text"
        className="form-input"
        value={formData.productName}
        onChange={(e) =>
          setFormData({ ...formData, productName: e.target.value })
        }
        placeholder="Enter product name"
        required
      />
    </div>
    </>
)}


        <h3 className="subcategories-title">Add Subcategories</h3>
        {newSubcategories.map((subcategory, index) => (
          <div key={index} className="form-group">
            <input
              type="text"
              className="form-input"
              value={subcategory}
              onChange={(e) => handleSubcategoryChange(index, e.target.value)}
              placeholder="Subcategory name"
              required
            />
          </div>
        ))}

        

        <button
          type="button"
          className="add-button"
          onClick={addSubcategoryField}
        >
          + Add Another Subcategory
        </button>

        <button type="submit" className="submit-button">
          Save Category
        </button>
        {error && <p className="error-message">{error}</p>} {/* Display errors if any */}
      </form>
    </div>
  );
};

export default AddCategories;
