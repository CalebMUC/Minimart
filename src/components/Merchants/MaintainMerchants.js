import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Modal from "../Modal"; // Ensure you have a Modal component
import "../../CSS/Merchants/merchants.css"; // Import the CSS file
import { Typography } from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { FetchMerchants, AddMerchants, UpdateMerchants, FileUploads } from '../../Data'; // Import necessary functions

const MaintainMerchants = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentMerchant, setCurrentMerchant] = useState(null);
  const [merchants, setMerchants] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
        merchantID: "",
        merchantName : "",
        phone: "",
        status : "",
        businessType : "",
        businessNature : ""
      });

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

  // Columns for the DataGrid
  const columns = [
    { field: "merchantID", headerName: "Merchant ID", width: 100 },
    { field: "businessName", headerName: "Business Name", width: 150 },
    { field: "businessType", headerName: "Business Type", width: 120 },
    { field: "merchantName", headerName: "Merchant Name", width: 150 },
    { field: "businessNature", headerName: "Business Nature", width: 120 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 120 },
    { field: "address", headerName: "Address", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <Typography
          sx={{
            color: params.value === "Active" ? "green" : "red",
            fontSize: "10",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
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
          onClick={() => handleDelete(params.row.merchantID)}
        />,
      ],
    },
  ];

  // Open modal for adding/editing
  const openModal = (merchant = null) => {
    setCurrentMerchant(merchant);
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setCurrentMerchant(null);
  };

  // Handle save (add or edit)
  const handleSave = async (merchant) => {
    try {
      let response;
      if (merchant.merchantID) {
        // Update existing merchant
        response = await UpdateMerchants(merchant);
      } else {
        // Add new merchant
        response = await AddMerchants(merchant);
      }

      if (response) {
        if(response.responseStatusId === 200 ){
          Swal.fire({
            icon: "success",
            title: "Success",
            text: `Merchant ${merchant.merchantID ? "updated" : "added"} successfully!`,
            timer: 2000,
          });
          GetAllMerchants(); // Refresh the list
        }else{
          Swal.fire({
            icon: "error",
            title: "Error",
            text: `${response.responseMessage}!`,
            showConfirmButton : true
            // timer: 2000,
          });
        }
        
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save merchant. Please try again.",
      });
    }
    closeModal();
  };

  // Handle delete
  const handleDelete = (merchantID) => {
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
        setMerchants((prev) => prev.filter((m) => m.merchantID !== merchantID));
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Merchant has been deleted.",
          timer: 2000,
        });
      }
    });
  };

  return (
    <div className="maintain-merchants-container">
      <h1 className="maintain-merchants-title">Maintain Merchants</h1>
      <button onClick={() => openModal()} className="add-merchant-button">
        <FaPlus /> Add Merchant
      </button>

      {/* Search Merchants */}
            <div className="full-search-container">
              {/* Order ID Input */}
              <input
                type="text"
                placeholder="Order ID"
                className="full-search-input"
                value={searchQuery.merchantID}
                onChange={(e) => setSearchQuery({ ...searchQuery, merchantID: e.target.value })}
              />
      
              {/* Product Name Input */}
              <input
                type="text"
                placeholder="Merchant Name"
                className="full-search-input"
                value={searchQuery.merchantName}
                onChange={(e) => setSearchQuery({ ...searchQuery, merchantName: e.target.value })}
              />

            <select
                className="full-search-dropdown"
                value={searchQuery.businessType}
                onChange={(e) => setSearchQuery({ ...searchQuery, businessType: e.target.value })}
              >
              <option value="">--Business Type--</option>
              <option value="Sole Proprietorship">Sole Proprietorship</option>
              <option value="Partnership">Partnership</option>
              <option value="Limited Company">Limited Company</option>
              <option value="SME">Small Medium Enterprise</option>
              </select>

              <select
                className="full-search-dropdown"
                value={searchQuery.businessNature}
                onChange={(e) => setSearchQuery({ ...searchQuery, businessNature: e.target.value })}
              >
              <option value="">--BusinessNature--</option>
              <option value="Retail">Retail</option>
              <option value="Wholesale">Wholesale</option>
              <option value="Services">Services</option>
              <option value="Online">Online</option>
              </select>

              <input
                type="text"
                placeholder="794129559"
                className="full-search-input"
                value={searchQuery.phone}
                onChange={(e) => setSearchQuery({ ...searchQuery, phone: e.target.value })}
              />
      
              {/* Status Dropdown */}
              <select
                className="full-search-dropdown"
                value={searchQuery.status}
                onChange={(e) => setSearchQuery({ ...searchQuery, status: e.target.value })}
              >
                <option value="">--Status--</option>
                <option value="Active">Active</option>
                <option value="inActive">InActive</option>
                
              </select>
      
              {/* Time Dropdown */}
              
      
              {/* Search Button */}
              <button className="full-search-button">
                <FaSearch /> Search
              </button>
            </div>

      {/* Material-UI DataGrid */}
      <div className="data-grid-container">
        <DataGrid
          rows={merchants}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          getRowId={(row) => row.merchantID}
          checkboxSelection
        />
      </div>

      {/* Modal for adding/editing */}
      {isModalOpen && (
        <Modal isVisible={isModalOpen} onClose={closeModal}>
          <MerchantForm
            merchant={currentMerchant}
            onSave={handleSave}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </div>
  );
};

// Merchant Form Component
const MerchantForm = ({ merchant, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    merchant || {
      merchantID: 0,
      businessName: "",
      businessType: "",
      businessRegistrationNo: "",
      kraPin: "",
      businessNature: "",
      businessCategory: "",
      merchantName: "",
      email: "",
      phone: "",
      address: "",
      socialMedia: "",
      bankName: "",
      bankAccountNo: "",
      bankAccountName: "",
      mpesaPaybill: "",
      mpesaTillNumber: "",
      preferredPaymentChannel: "",
      kraPinCertificate: "",
      businessRegistrationCertificate: "",
      termsAndCondition: false,
      deliveryMethod: "",
      returnPolicy: false,
      status: "Active",
    }
  );

  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    validateField(name, value);
  };

  // Handle file uploads
  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const fileData = new FormData();
      fileData.append("file", file); // Append the file to FormData
  
      try {
        const response = await FileUploads(fileData);
        if (response) {
          setFormData((prevData) => ({
            ...prevData,
            [fieldName]: response.url, // Assuming the server returns the file URL
          }));
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Validate a field
  const validateField = (name, value) => {
    let error = "";
    if (!value) {
      error = "This field is required.";
    }
    setErrors({ ...errors, [name]: error });
    return error;
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
        text: "Please fill out all required fields correctly.",
      });
    }
  };

  // Validate all fields before submitting
  const validateAllFields = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if(key === "merchantID"){
        return;
      }
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <h3>{merchant ? "Edit Merchant" : "Add Merchant"}</h3>

      {/* Business Details Section */}
      <div className="form-section">
        <div className="section-header">
          <h4>Business Details</h4>
        </div>
        <div className="section-fields">
          <div className="form-group">
            <label>Business Name:</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              required
            />
            {errors.businessName && (
              <span className="error-message">{errors.businessName}</span>
            )}
          </div>
          <div className="form-group">
            <label>Business Type:</label>
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              required
            >
              <option value="">--Select--</option>
              <option value="Sole Proprietorship">Sole Proprietorship</option>
              <option value="Partnership">Partnership</option>
              <option value="Limited Company">Limited Company</option>
              <option value="SME">Small Medium Enterprise</option>
            </select>
            {errors.businessType && (
              <span className="error-message">{errors.businessType}</span>
            )}
          </div>
          <div className="form-group">
            <label>Business Registration No:</label>
            <input
              type="text"
              name="businessRegistrationNo"
              value={formData.businessRegistrationNo}
              onChange={handleChange}
              required
            />
            {errors.businessRegistrationNo && (
              <span className="error-message">{errors.businessRegistrationNo}</span>
            )}
          </div>
          <div className="form-group">
            <label>KRA PIN:</label>
            <input
              type="text"
              name="kraPin"
              value={formData.kraPin}
              onChange={handleChange}
              required
            />
            {errors.kraPin && (
              <span className="error-message">{errors.kraPin}</span>
            )}
          </div>
          <div className="form-group">
            <label>Business Nature:</label>
            <select
              name="businessNature"
              value={formData.businessNature}
              onChange={handleChange}
              required
            >
              <option value="">--Select--</option>
              <option value="Retail">Retail</option>
              <option value="Wholesale">Wholesale</option>
              <option value="Services">Services</option>
              <option value="Online">Online</option>
            </select>
            {errors.businessNature && (
              <span className="error-message">{errors.businessNature}</span>
            )}
          </div>
          <div className="form-group">
            <label>Business Category:</label>
            <select
              name="businessCategory"
              value={formData.businessCategory}
              onChange={handleChange}
              required
            >
              <option value="">--Select--</option>
              <option value="Computers">Computers</option>
              <option value="Electronics">Electronics</option>
              <option value="Accessories">Accessories</option>
              <option value="Fashion">Fashion</option>
              <option value="All Categories">All Categories</option>
            </select>
            {errors.businessCategory && (
              <span className="error-message">{errors.businessCategory}</span>
            )}
          </div>
        </div>
      </div>

      {/* Contact Details Section */}
      <div className="form-section">
        <div className="section-header">
          <h4>Contact Details</h4>
        </div>
        <div className="section-fields">
          <div className="form-group">
            <label>Merchant Name:</label>
            <input
              type="text"
              name="merchantName"
              value={formData.merchantName}
              onChange={handleChange}
              required
            />
            {errors.merchantName && (
              <span className="error-message">{errors.merchantName}</span>
            )}
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {errors.phone && (
              <span className="error-message">{errors.phone}</span>
            )}
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            {errors.address && (
              <span className="error-message">{errors.address}</span>
            )}
          </div>
          <div className="form-group">
            <label>Social Media:</label>
            <input
              type="text"
              name="socialMedia"
              value={formData.socialMedia}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Banking and Payment Details Section */}
      <div className="form-section">
        <div className="section-header">
          <h4>Banking and Payment Details</h4>
        </div>
        <div className="section-fields">
          <div className="form-group">
            <label>Bank Name:</label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              required
            />
            {errors.bankName && (
              <span className="error-message">{errors.bankName}</span>
            )}
          </div>
          <div className="form-group">
            <label>Bank Account No:</label>
            <input
              type="text"
              name="bankAccountNo"
              value={formData.bankAccountNo}
              onChange={handleChange}
              required
            />
            {errors.bankAccountNo && (
              <span className="error-message">{errors.bankAccountNo}</span>
            )}
          </div>
          <div className="form-group">
            <label>Bank Account Name:</label>
            <input
              type="text"
              name="bankAccountName"
              value={formData.bankAccountName}
              onChange={handleChange}
              required
            />
            {errors.bankAccountName && (
              <span className="error-message">{errors.bankAccountName}</span>
            )}
          </div>
          <div className="form-group">
            <label>M-Pesa Paybill:</label>
            <input
              type="text"
              name="mpesaPaybill"
              value={formData.mpesaPaybill}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>M-Pesa Till Number:</label>
            <input
              type="text"
              name="mpesaTillNumber"
              value={formData.mpesaTillNumber}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Preferred Payment Channel:</label>
            <select
              name="preferredPaymentChannel"
              value={formData.preferredPaymentChannel}
              onChange={handleChange}
              required
            >
              <option value="">--Select--</option>
              <option value="Bank">Bank</option>
              <option value="M-Pesa">M-Pesa</option>
            </select>
            {errors.preferredPaymentChannel && (
              <span className="error-message">{errors.preferredPaymentChannel}</span>
            )}
          </div>
        </div>
      </div>

      {/* Compliance and Documentation Section */}
      <div className="form-section">
        <div className="section-header">
          <h4>Compliance and Documentation</h4>
        </div>
        <div className="section-fields">
          <div className="form-group">
            <label>KRA PIN Certificate:</label>
            <input
              type="file"
              name="kraPinCertificate"
              onChange={(e) => handleFileUpload(e, "kraPinCertificate")}
            />
          </div>
          <div className="form-group">
            <label>Business Registration Certificate:</label>
            <input
              type="file"
              name="businessRegistrationCertificate"
              onChange={(e) => handleFileUpload(e, "businessRegistrationCertificate")}
            />
          </div>
          <div className="form-group">
            <label>Terms and Conditions:</label>
            <input
              type="checkbox"
              name="termsAndCondition"
              checked={formData.termsAndCondition}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Delivery and Handling Section */}
      <div className="form-section">
        <div className="section-header">
          <h4>Delivery and Handling</h4>
        </div>
        <div className="section-fields">
          <div className="form-group">
            <label>Delivery Method:</label>
            <select
              name="deliveryMethod"
              value={formData.deliveryMethod}
              onChange={handleChange}
              required
            >
              <option value="">--Select--</option>
              <option value="Pickup">Pickup</option>
              <option value="Delivery">Delivery</option>
            </select>
            {errors.deliveryMethod && (
              <span className="error-message">{errors.deliveryMethod}</span>
            )}
          </div>
          <div className="form-group">
            <label>Return Policy:</label>
            <input
              type="checkbox"
              name="returnPolicy"
              checked={formData.returnPolicy}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Form Buttons */}
      <div className="form-buttons">
        <button type="submit" className="save-button">
          Save
        </button>
        <button type="button" onClick={onCancel} className="cancel-button">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default MaintainMerchants;