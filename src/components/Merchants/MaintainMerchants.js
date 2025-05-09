import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaPlus, FaSearch, FaFileUpload, FaCheck, FaTimes } from "react-icons/fa";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Modal from "../Modal";
import { Typography } from "@mui/material";
import { FetchMerchants, AddMerchants, UpdateMerchants, FileUploads } from '../../Data';

const MaintainMerchants = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentMerchant, setCurrentMerchant] = useState(null);
  const [merchants, setMerchants] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    merchantID: "",
    merchantName: "",
    phone: "",
    status: "",
    businessType: "",
    businessNature: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Fetch all merchants
  const GetAllMerchants = async () => {
    setIsLoading(true);
    try {
      const response = await FetchMerchants();
      if (response) {
        setMerchants(response);
      }
    } catch (error) {
      console.error("Error fetching merchants:", error);
      showNotification('error', 'Failed to load merchants. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    GetAllMerchants();
  }, []);

  // Show notification
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };

  // Columns for the DataGrid
  const columns = [
    { field: "merchantID", headerName: "Merchant ID", width: 120 },
    { field: "businessName", headerName: "Business Name", width: 180 },
    { field: "businessType", headerName: "Business Type", width: 150 },
    { field: "merchantName", headerName: "Merchant Name", width: 180 },
    { field: "businessNature", headerName: "Business Nature", width: 150 },
    { field: "email", headerName: "Email", width: 220 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "address", headerName: "Address", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          params.value === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {params.value}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<FaEdit className="text-blue-500" />}
          label="Edit"
          onClick={() => openModal(params.row)}
        />,
        <GridActionsCellItem
          icon={<FaTrashAlt className="text-red-500" />}
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
        response = await UpdateMerchants(merchant);
      } else {
        response = await AddMerchants(merchant);
      }

      if (response) {
        if(response.responseStatusId === 200) {
          showNotification('success', `Merchant ${merchant.merchantID ? "updated" : "added"} successfully!`);
          GetAllMerchants();
        } else {
          showNotification('error', response.responseMessage || 'Operation failed');
        }
      }
    } catch (error) {
      showNotification('error', 'Failed to save merchant. Please try again.');
    }
    closeModal();
  };

  // Handle delete
  const handleDelete = (merchantID) => {
    setMerchants((prev) => prev.filter((m) => m.merchantID !== merchantID));
    showNotification('success', 'Merchant has been deleted.');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out transform ${
          notification.show ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className={`rounded-md p-4 ${
            notification.type === 'success' ? 'bg-green-50' : 'bg-red-50'
          } shadow-lg`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {notification.type === 'success' ? (
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  notification.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Merchants Management</h1>
        <button 
          onClick={() => openModal()} 
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FaPlus className="mr-2" /> Add Merchant
        </button>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Merchant ID</label>
            <input
              type="text"
              placeholder="Search ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery.merchantID}
              onChange={(e) => setSearchQuery({ ...searchQuery, merchantID: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Merchant Name</label>
            <input
              type="text"
              placeholder="Search name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery.merchantName}
              onChange={(e) => setSearchQuery({ ...searchQuery, merchantName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery.businessType}
              onChange={(e) => setSearchQuery({ ...searchQuery, businessType: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="Sole Proprietorship">Sole Proprietorship</option>
              <option value="Partnership">Partnership</option>
              <option value="Limited Company">Limited Company</option>
              <option value="SME">Small Medium Enterprise</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Nature</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery.businessNature}
              onChange={(e) => setSearchQuery({ ...searchQuery, businessNature: e.target.value })}
            >
              <option value="">All Natures</option>
              <option value="Retail">Retail</option>
              <option value="Wholesale">Wholesale</option>
              <option value="Services">Services</option>
              <option value="Online">Online</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              placeholder="Search phone"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery.phone}
              onChange={(e) => setSearchQuery({ ...searchQuery, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery.status}
              onChange={(e) => setSearchQuery({ ...searchQuery, status: e.target.value })}
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="inActive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            <FaSearch className="mr-2" /> Search
          </button>
        </div>
      </div>

      {/* DataGrid Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="h-[600px] w-full">
          <DataGrid
            rows={merchants}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            getRowId={(row) => row.merchantID}
            checkboxSelection
            loading={isLoading}
            sx={{
              fontFamily : 'Inter, sans-serif',
              border: 0,
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f3f4f6',
                color: '#374151',
                fontSize: '0.875rem',
                fontWeight: '600',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #e5e7eb',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#f9fafb',
              },
            }}
          />
        </div>
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    validateField(name, value);
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const fileData = new FormData();
      fileData.append("file", file);

      try {
        const response = await FileUploads(fileData);
        if (response) {
          setFormData((prevData) => ({
            ...prevData,
            [fieldName]: response.url,
          }));
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setErrorMessage('Failed to upload file. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const validateField = (name, value) => {
    let error = "";
    if (!value && name !== "merchantID" && name !== "socialMedia" && 
        name !== "mpesaPaybill" && name !== "mpesaTillNumber") {
      error = "This field is required";
    }
    setErrors({ ...errors, [name]: error });
    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    if (validateAllFields()) {
      try {
        await onSave(formData);
      } catch (error) {
        setErrorMessage('Failed to save merchant. Please try again.');
      }
    } else {
      setErrorMessage('Please fill out all required fields correctly.');
    }
    
    setIsSubmitting(false);
  };

  const validateAllFields = () => {
    const newErrors = {};
    let isValid = true;
    
    Object.keys(formData).forEach((key) => {
      if (key === "merchantID" || key === "socialMedia" || 
          key === "mpesaPaybill" || key === "mpesaTillNumber") return;
          
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
        {merchant ? "Edit Merchant" : "Add New Merchant"}
      </h3>

      {/* Business Details Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-lg font-medium text-gray-700 mb-4">Business Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border ${errors.businessName ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-yellow-200"} focus:outline-none focus:ring-2 focus:border-yellow-500`}
            />
            {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Type *</label>
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border ${errors.businessType ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-yellow-200"} focus:outline-none focus:ring-2 focus:border-yellow-500`}
            >
              <option value="">Select Business Type</option>
              <option value="Sole Proprietorship">Sole Proprietorship</option>
              <option value="Partnership">Partnership</option>
              <option value="Limited Company">Limited Company</option>
              <option value="SME">Small Medium Enterprise</option>
            </select>
            {errors.businessType && <p className="text-red-500 text-xs mt-1">{errors.businessType}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registration No *</label>
            <input
              type="text"
              name="businessRegistrationNo"
              value={formData.businessRegistrationNo}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border ${errors.businessRegistrationNo ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-yellow-200"} focus:outline-none focus:ring-2 focus:border-yellow-500`}
            />
            {errors.businessRegistrationNo && <p className="text-red-500 text-xs mt-1">{errors.businessRegistrationNo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">KRA PIN *</label>
            <input
              type="text"
              name="kraPin"
              value={formData.kraPin}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border ${errors.kraPin ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-yellow-200"} focus:outline-none focus:ring-2 focus:border-yellow-500`}
            />
            {errors.kraPin && <p className="text-red-500 text-xs mt-1">{errors.kraPin}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Nature *</label>
            <select
              name="businessNature"
              value={formData.businessNature}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border ${errors.businessNature ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-yellow-200"} focus:outline-none focus:ring-2 focus:border-yellow-500`}
            >
              <option value="">Select Business Nature</option>
              <option value="Retail">Retail</option>
              <option value="Wholesale">Wholesale</option>
              <option value="Services">Services</option>
              <option value="Online">Online</option>
            </select>
            {errors.businessNature && <p className="text-red-500 text-xs mt-1">{errors.businessNature}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Category *</label>
            <select
              name="businessCategory"
              value={formData.businessCategory}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border ${errors.businessCategory ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-yellow-200"} focus:outline-none focus:ring-2 focus:border-yellow-500`}
            >
              <option value="">Select Category</option>
              <option value="Computers">Computers</option>
              <option value="Electronics">Electronics</option>
              <option value="Accessories">Accessories</option>
              <option value="Fashion">Fashion</option>
              <option value="All Categories">All Categories</option>
            </select>
            {errors.businessCategory && <p className="text-red-500 text-xs mt-1">{errors.businessCategory}</p>}
          </div>
        </div>
      </div>

      {/* Contact Details Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-lg font-medium text-gray-700 mb-4">Contact Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Merchant Name *</label>
            <input
              type="text"
              name="merchantName"
              value={formData.merchantName}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border ${errors.merchantName ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-yellow-200"} focus:outline-none focus:ring-2 focus:border-yellow-500`}
            />
            {errors.merchantName && <p className="text-red-500 text-xs mt-1">{errors.merchantName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border ${errors.email ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-yellow-200"} focus:outline-none focus:ring-2 focus:border-yellow-500`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border ${errors.phone ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-yellow-200"} focus:outline-none focus:ring-2 focus:border-yellow-500`}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border ${errors.address ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-yellow-200"} focus:outline-none focus:ring-2 focus:border-yellow-500`}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Social Media</label>
            <input
              type="text"
              name="socialMedia"
              value={formData.socialMedia}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500"
            />
          </div>
        </div>
      </div>

      {/* Banking and Payment Details Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-lg font-medium text-gray-700 mb-4">Banking & Payment</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border ${errors.bankName ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-yellow-200"} focus:outline-none focus:ring-2 focus:border-yellow-500`}
            />
            {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account No *</label>
            <input
              type="text"
              name="bankAccountNo"
              value={formData.bankAccountNo}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border ${errors.bankAccountNo ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-yellow-200"} focus:outline-none focus:ring-2 focus:border-yellow-500`}
            />
            {errors.bankAccountNo && <p className="text-red-500 text-xs mt-1">{errors.bankAccountNo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Name *</label>
            <input
              type="text"
              name="bankAccountName"
              value={formData.bankAccountName}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border ${errors.bankAccountName ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-yellow-200"} focus:outline-none focus:ring-2 focus:border-yellow-500`}
            />
            {errors.bankAccountName && <p className="text-red-500 text-xs mt-1">{errors.bankAccountName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Paybill</label>
            <input
              type="text"
              name="mpesaPaybill"
              value={formData.mpesaPaybill}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Till</label>
            <input
              type="text"
              name="mpesaTillNumber"
              value={formData.mpesaTillNumber}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Channel *</label>
            <select
              name="preferredPaymentChannel"
              value={formData.preferredPaymentChannel}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border ${errors.preferredPaymentChannel ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-yellow-200"} focus:outline-none focus:ring-2 focus:border-yellow-500`}
            >
              <option value="">Select Channel</option>
              <option value="Bank">Bank</option>
              <option value="M-Pesa">M-Pesa</option>
            </select>
            {errors.preferredPaymentChannel && <p className="text-red-500 text-xs mt-1">{errors.preferredPaymentChannel}</p>}
          </div>
        </div>
      </div>

      {/* Compliance and Documentation Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-lg font-medium text-gray-700 mb-4">Compliance & Documents</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">KRA PIN Certificate</label>
            <div className="flex items-center">
              <label className="flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg border border-gray-300 cursor-pointer hover:bg-blue-50">
                <FaFileUpload className="text-2xl mb-2" />
                <span className="text-sm">Upload File</span>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => handleFileUpload(e, "kraPinCertificate")}
                />
              </label>
              {isUploading && <span className="ml-2 text-sm text-gray-500">Uploading...</span>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Registration</label>
            <div className="flex items-center">
              <label className="flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg border border-gray-300 cursor-pointer hover:bg-blue-50">
                <FaFileUpload className="text-2xl mb-2" />
                <span className="text-sm">Upload File</span>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => handleFileUpload(e, "businessRegistrationCertificate")}
                />
              </label>
              {isUploading && <span className="ml-2 text-sm text-gray-500">Uploading...</span>}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="termsAndCondition"
              checked={formData.termsAndCondition}
              onChange={handleChange}
              className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Accept Terms & Conditions</label>
          </div>
        </div>
      </div>

      {/* Delivery and Handling Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-lg font-medium text-gray-700 mb-4">Delivery & Handling</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Method *</label>
            <select
              name="deliveryMethod"
              value={formData.deliveryMethod}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border ${errors.deliveryMethod ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-yellow-200"} focus:outline-none focus:ring-2 focus:border-yellow-500`}
            >
              <option value="">Select Method</option>
              <option value="Pickup">Pickup</option>
              <option value="Delivery">Delivery</option>
            </select>
            {errors.deliveryMethod && <p className="text-red-500 text-xs mt-1">{errors.deliveryMethod}</p>}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="returnPolicy"
              checked={formData.returnPolicy}
              onChange={handleChange}
              className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Accept Return Policy</label>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{errorMessage}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Form Buttons */}
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-48 items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-center text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              {/* <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg> */}
              Save
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default MaintainMerchants;