import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../../CSS/CategoryFormActual.css"; // Import the CSS file

const CategoryForm = ({ category, categories, onSave, onCancel }) => {
  const initialFormData = category
    ? {
        ...category,
        categoryName: category.categoryName,
        slug: category.slug,
        description: category.description || "",
        parentCategoryId: category.parentCategoryId || null,
        isActive: category.isActive,
      }
    : {
        categoryName: "",
        slug: "",
        description: "",
        parentCategoryId: null,
        isActive: true,
      };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  // Handle parent category selection
  const handleParentCategoryChange = (e) => {
    const parentCategoryId = e.target.value ? parseInt(e.target.value) : null;
    setFormData({ ...formData, parentCategoryId });
  };

  // Handle slug generation from category name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Replace special characters with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  };

  // Automatically generate slug when category name changes
  useEffect(() => {
    if (formData.categoryName) {
      setFormData((prevData) => ({
        ...prevData,
        slug: generateSlug(formData.categoryName),
      }));
    }
  }, [formData.categoryName]);

  // Validate a field
  const validateField = (name, value) => {
    let error = "";
    if (name === "categoryName" && !value.trim()) {
      error = "Please add field, Category name is required.";
    }
    if (name === "slug" && !value.trim()) {
      error = "Please add field, Slug is required, cannot include special characters.";
    }
    if (name === "description" && !value.trim()) {
      error = "Please add field, Description is required.";
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
      const finalPayload = {
        categoryId: formData.categoryId ?  parseInt(formData.categoryId, 10) : 0,
        categoryName: formData.categoryName,
        slug: formData.slug,
        description: formData.description,
        parentCategoryId:
          formData.parentCategoryId != null
            ? parseInt(formData.parentCategoryId, 10)
            : null,
        isActive: formData.isActive,
        userName: localStorage.getItem("username"),
      };
      onSave(finalPayload);
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
      <h3 className="category-form-title">
        {category ? "Edit Category" : "Add Category"}
      </h3>

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

      {/* Parent Category Dropdown */}
      <div className="form-group">
        <label className="form-label">Parent Category:</label>
        <select
          name="parentCategoryId"
          value={formData.parentCategoryId || ""}
          onChange={handleParentCategoryChange}
          className="form-input"
        >
          <option value="">-- Select Parent Category --</option>
          {/* {categories
            .filter((cat) => !cat.parentCategoryId) // Only show top-level categories
            .map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.categoryName}
              </option>
            ))} */}

{categories.map((cat) => (
      <option key={cat.categoryId} value={cat.categoryId}>
        {cat.categoryName}
      </option>
    ))}
        </select>
      </div>

      {/* Slug */}
      <div className="form-group">
        <label className="form-label">Slug (SEO Friendly):</label>
        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          required
          className="form-input"
        />
        {errors.slug && (
          <span className="error-message">{errors.slug}</span>
        )}
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label">Description:</label>
        <textarea
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="form-input"
          rows={3}
        />
        {errors.description && (
          <span className="error-message">{errors.description}</span>
        )}
      </div>

      {/* Form Actions (Buttons) */}
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="cancel-button">
          Cancel
        </button>
        <button type="submit" className="save-button">
          Save
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;