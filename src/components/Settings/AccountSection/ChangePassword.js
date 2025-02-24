import React, { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa"; // Added FaEye import
import "../../../CSS/AccountSection.css";

const ChangePassword = () => {
  // State for form data
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State for validation errors
  const [errors, setErrors] = useState({});

  // State to toggle password visibility for each field
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Update form data
    validateField(name, value); // Validate the field
  };

  // Validate individual fields
  const validateField = (name, value) => {
    let error = "";
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    switch (name) {
      case "currentPassword":
        error = value.length < 8 ? "Password must be at least 8 characters long." : "";
        break;
      case "newPassword":
        error = !passwordPattern.test(value)
          ? "Weak: Must be 8 characters long, include uppercase, lowercase, number, and special character."
          : "";
        break;
      case "confirmPassword":
        error = formData.newPassword !== value ? "Passwords do not match." : "";
        break;
      default:
        error = "";
        break;
    }

    // Update errors state
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));

    return error;
  };

  // Toggle password visibility for a specific field
  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields before submission
    let isValid = true;
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) isValid = false;
    });

    if (!isValid) {
      alert("Please fix the errors before submitting.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    alert("Password changed successfully!");
    console.log("Form Data:", formData); // Log form data for debugging
  };

  return (
    <div className="main-change-password">
      <h2 className="section-title">Change Password</h2>
      <form onSubmit={handleSubmit} className="change-password-form">
        {/* Current Password Field */}
        <div className="change-form-group">
          <label>Current Password:</label>
          <div className="password-input-container">
            <input
              type={showPassword.currentPassword ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="form-input"
              required
            />
            <span
              className="toggle-password"
              onClick={() => togglePasswordVisibility("currentPassword")}
            >
              {showPassword.currentPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.currentPassword && <div className="error">{errors.currentPassword}</div>}
        </div>

        {/* New Password Field */}
        <div className="change-form-group">
          <label>New Password:</label>
          <div className="password-input-container">
            <input
              type={showPassword.newPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="form-input"
              required
            />
            <span
              className="toggle-password"
              onClick={() => togglePasswordVisibility("newPassword")}
            >
              {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.newPassword && <div className="error">{errors.newPassword}</div>}
        </div>

        {/* Confirm New Password Field */}
        <div className="change-form-group">
          <label>Confirm New Password:</label>
          <div className="password-input-container">
            <input
              type={showPassword.confirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
              required
            />
            <span
              className="toggle-password"
              onClick={() => togglePasswordVisibility("confirmPassword")}
            >
              {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;