import React, { useState, useEffect } from "react";
import { AddNewAddress, updateAddress, fetchCountyTowns } from "../Data.js";
import Dialogs from "./Dialogs.js";

const AddressForm = ({
  userID,
  onUpdateAddresses,
  isEditing,
  initialData,
  counties,
  setShowAddressForm,
}) => {
  const [formData, setFormData] = useState({
    addressID: initialData?.addressID || "",
    name: initialData?.name || "",
    phoneNumber: initialData?.phoneNumber || "",
    postalAddress: initialData?.postalAddress || "",
    postalCode: initialData?.postalCode || "",
    countyId: initialData?.countyId || "",
    townId: initialData?.townId || "",
    extraInformation: initialData?.extraInformation || "",
    isDefault: initialData?.isDefault || 0,
    userID: localStorage.getItem("userID") || "",
  });

  const [selectedCounty, setSelectedCounty] = useState(null);
  const [countyTowns, setCountyTowns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.countyId) {
        setSelectedCounty(initialData.countyId);
      }
    }
    setShowModal(true); // Show modal when component mounts
  }, [initialData]);

  // Get Towns based on the selected County
  useEffect(() => {
    const loadCountyTowns = async () => {
      if (selectedCounty) {
        setIsLoading(true);
        try {
          const fetchedTowns = await fetchCountyTowns(selectedCounty);
          setCountyTowns(fetchedTowns);
        } catch (error) {
          console.error("Error fetching towns:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadCountyTowns();
  }, [selectedCounty]);

  const handleCountyChange = async (e) => {
    const countyID = e.target.value;
    setSelectedCounty(countyID);

    setFormData((prevData) => ({
      ...prevData,
      countyId: countyID,
      townId: "", // reset when county changes
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    validateFormFields(name, value);
  };

  const validateFormFields = (name, value) => {
    let error;
    const phoneRegex = /^\d{12}$/;

    switch (name) {
      case "name":
        error = value ? "" : "Please provide your full name";
        break;
      case "phoneNumber":
        error = phoneRegex.test(value) ? "" : "Phone number must be valid (25412345678)";
        break;
      case "postalAddress":
        error = value ? "" : "Please provide your address";
        break;
      case "postalCode":
        error = value ? "" : "Please provide postal code";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

 const handleSubmitAddressForm = async (e) => {
  e.preventDefault();

  // Validate all fields before submission
  const requiredFields = ["name", "phoneNumber", "postalAddress", "postalCode", "countyId", "townId"];
  let isValid = true;
  const newErrors = {};

  requiredFields.forEach((field) => {
    if (!formData[field]) {
      newErrors[field] = "This field is required";
      isValid = false;
    }
  });

  if (!isValid) {
    setErrors(newErrors);
    return;
  }

  const addressPayload = {
    userID: formData.userID,
    name: formData.name,
    phoneNumber: formData.phoneNumber,
    postalAddress: formData.postalAddress,
    postalCode: formData.postalCode,
    county: counties.find((c) => c.countyId === Number(formData.countyId))?.countyName,
    town: countyTowns.find((c) => c.townId === Number(formData.townId))?.townName,
    extraInformation: formData.extraInformation,
    isDefault: formData.isDefault == 1 ? true : false,
    ...(isEditing && { addressID: formData.addressID }), // Only include addressID when editing
  };

  setIsLoading(true);
  try {
    let response;
    if (isEditing) {
      // Call updateAddress when editing
      response = await updateAddress(addressPayload);
    } else {
      // Call AddNewAddress when adding
      response = await AddNewAddress(addressPayload);
    }

    if (response.responseCode === 200) {
      onUpdateAddresses(response.addresses);
      setSuccessMessage(response.responseMessage);
      setShowSuccessDialog(true);
      setTimeout(() => {
        setShowModal(false);
        setShowAddressForm(false);
      }, 1500);
    } else {
      setErrorMessage(response.responseMessage);
      setShowErrorDialog(true);
    }
  } catch (error) {
    console.error(error);
    setErrorMessage("An error occurred while saving the address. Please try again.");
    setShowErrorDialog(true);
  } finally {
    setIsLoading(false);
  }
};

  const handleCloseDialog = () => {
    setShowSuccessDialog(false);
    setShowErrorDialog(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowAddressForm(false);
  };

  if (!showModal) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        {/* Modal Container */}
        <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
          {/* Modal Content */}
          <div className="bg-yellow-50 p-4 rounded-t-lg border-b border-yellow-200">
            <h3 className="text-lg font-semibold text-blue-800">
              {isEditing ? "Edit Address" : "Add New Address"}
            </h3>
          </div>

          <div className="p-4">
            {showSuccessDialog && (
              <Dialogs message={successMessage} type="success" onClose={handleCloseDialog} />
            )}

            {showErrorDialog && (
              <Dialogs message={errorMessage} type="error" onClose={handleCloseDialog} />
            )}

            <form onSubmit={handleSubmitAddressForm} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">Phone Number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-yellow-100 text-blue-800 text-sm">
                    +254
                  </span>
                  <input
                    type="text"
                    placeholder="712345678"
                    name="phoneNumber"
                    value={formData.phoneNumber?.replace(/^254/, "") || ""}
                    onChange={(e) => {
                      handleChange({
                        target: {
                          name: "phoneNumber",
                          value: `254${e.target.value.replace(/\D/g, "")}`,
                        },
                      });
                    }}
                    maxLength="9"
                    className="appearance-none flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">Address</label>
                <input
                  type="text"
                  placeholder="Street address or P.O. Box"
                  name="postalAddress"
                  value={formData.postalAddress}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                />
                {errors.postalAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.postalAddress}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">County</label>
                  <select
                    name="countyId"
                    value={formData.countyId}
                    onChange={handleCountyChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  >
                    <option value="">Select County</option>
                    {counties.map((county) => (
                      <option key={county.countyId} value={county.countyId}>
                        {county.countyName}
                      </option>
                    ))}
                  </select>
                  {errors.countyId && (
                    <p className="mt-1 text-sm text-red-600">{errors.countyId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">Town</label>
                  <select
                    name="townId"
                    value={formData.townId}
                    onChange={handleChange}
                    disabled={!formData.countyId || isLoading}
                    className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm ${
                      !formData.countyId || isLoading ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  >
                    <option value="">Select Town</option>
                    {countyTowns
                      .filter((town) => town.countyId === Number(formData.countyId))
                      .map((town) => (
                        <option key={town.townId} value={town.townId}>
                          {town.townName}
                        </option>
                      ))}
                  </select>
                  {errors.townId && <p className="mt-1 text-sm text-red-600">{errors.townId}</p>}
                  {isLoading && formData.countyId && (
                    <p className="mt-1 text-xs text-gray-500">Loading towns...</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">Postal Code</label>
                <input
                  type="text"
                  placeholder="Enter Postal Code"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                />
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Additional Information (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Apt, suite, unit, building, floor, etc."
                  name="extraInformation"
                  value={formData.extraInformation}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault === 1}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isDefault: e.target.checked ? 1 : 0 }))
                  }
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-blue-800">Make this my default address</label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-blue-800 bg-white hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : isEditing ? (
                    "Update Address"
                  ) : (
                    "Save Address"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressForm;