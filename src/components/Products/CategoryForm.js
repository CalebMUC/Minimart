import React, { useState } from "react";
import Swal from "sweetalert2";
import "../../CSS/CategoryFormActual.css"; // Import the CSS file

const CategoryForm = ({ category, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    category || {
      categoryName: "",
      description: "",
      subcategories: [""],
    }
  );

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  // Handle subcategory changes
  const handleSubcategoryChange = (index, value) => {
    const updatedSubcategories = [...formData.subcategories];
    updatedSubcategories[index] = value;
    setFormData({ ...formData, subcategories: updatedSubcategories });
  };

  // Add a new subcategory field
  const addSubcategoryField = () => {
    setFormData({
      ...formData,
      subcategories: [...formData.subcategories, ""],
    });
  };

  // Validate a field
  const validateField = (name, value) => {
    let error = "";
    if (name === "categoryName" && !value.trim()) {
      error = "Category name is required.";
    }
    if (name === "description" && !value.trim()) {
      error = "Description is required.";
    }
    setErrors({ ...errors, [name]: error });
    return error;
  };

  // Validate all fields before submitting
  const validateAllFields = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateAllFields()) {
      onSave(formData);
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid Submission",
        text: "Please fill out all required fields.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="category-form-container">
      {/* Form Title */}
      <h3 className="category-form-title">Add Format</h3>

      {/* Category Name */}
      <div className="form-group">
        <label className="form-label">Category Name:</label>
        <input
          type="text"
          name="categoryName"
          value={formData.categoryName}
          onChange={handleChange}
          required
          className="form-input"
        />
        {errors.categoryName && (
          <span className="error-message">{errors.categoryName}</span>
        )}
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label">Description:</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="form-input"
        />
        {errors.description && (
          <span className="error-message">{errors.description}</span>
        )}
      </div>

      {/* Subcategories */}
      <div className="form-group">
        <label className="form-label">Subcategories:</label>
        {formData.subcategories.map((subcategory, index) => (
          <div key={index} className="subcategory-input">
            <input
              type="text"
              value={subcategory}
              onChange={(e) => handleSubcategoryChange(index, e.target.value)}
              placeholder="Subcategory name"
              required
              className="form-input"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addSubcategoryField}
          className="add-subcategory-button"
        >
          + Add Subcategory
        </button>
      </div>

      {/* Form Actions (Buttons) */}
      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="cancel-button"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="save-button"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;