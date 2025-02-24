import React, { useState, useEffect, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import Modal from "../../Modal";
import AddressForm from "../../AddressForm";
import { fetchAddressesByUserID, fetchCounties } from "../../../Data";
import "../../../CSS/AccountSection.css"; // Import the CSS file

const BillingAddress = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    streetAddress: "",
    county: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [counties, setCounties] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [userID, setUserID] = useState(localStorage.getItem("userID") || "");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch Counties
  useEffect(() => {
    const loadCounties = async () => {
      setIsLoading(true);
      try {
        const fetchedCounties = await fetchCounties();
        setCounties(fetchedCounties);
      } catch (error) {
        console.error("Error fetching counties:", error);
        setErrorMessage("Failed to load counties. Please try again.");
        setShowErrorDialog(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadCounties();
  }, []);

  useEffect(()=>{
    handleUpdateAddresses();
  },[])

  const handleUpdateAddresses = useCallback(async () => {
    try {
      const updatedAddresses = await fetchAddressesByUserID(userID);
      setAddresses(updatedAddresses);
    } catch (error) {
      console.error("Error updating addresses:", error);
      setErrorMessage("Failed to update addresses. Please try again.");
      setShowErrorDialog(true);
    }
  }, [userID]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    setIsModalOpen(false);
    setShowSuccessDialog(true);
    setSuccessMessage("Address saved successfully!");
  };

  // Handle editing an address
  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    setFormData(address);
    setIsModalOpen(true);
  };

  // Open modal for adding a new address
  const handleModalOpen = () => {
    setSelectedAddress(null);
    setFormData({
      fullName: "",
      phoneNumber: "",
      email: "",
      streetAddress: "",
      county: "",
      city: "",
      postalCode: "",
      country: "",
    });
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="main-billing-address">
      <div className="add-billing-address">
        <button onClick={handleModalOpen}>
          <FaPlus /> Add Billing Address
        </button>
      </div>

      {/* Cards to show Billing Addresses */}
      <div className="billing-address-cards">
        <ul className="billing-address-list">
          {addresses.map((address) => (
            <li key={address.id} className="address-card">
              <p><strong>Name:</strong> {address.name}</p>
              <p><strong>Phone:</strong> {address.phoneNumber}</p>
              <p><strong>Email:</strong> {address.email}</p>
              <p><strong>Address:</strong> {address.extraInformation} , {address.postalCode}</p>  
              <p><strong>City:</strong> {address.town}</p>
              <p><strong>County:</strong> {address.county}</p>
              {/* <p><strong>City:</strong> {address.county}</p> */}
              <div className="billing-address-actions">
                <a
                  href="#edit"
                  onClick={(e) => {
                    e.preventDefault();
                    handleEditAddress(address);
                  }}
                >
                  Edit
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal for adding/editing addresses */}
      <Modal isVisible={isModalOpen} onClose={handleCloseModal}>
        <AddressForm
          userID={userID}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          counties={counties}
          isEditing={Boolean(selectedAddress)}
          initialData={selectedAddress || null}
        />
      </Modal>

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="dialog success-dialog">
          <p>{successMessage}</p>
          <button onClick={() => setShowSuccessDialog(false)}>Close</button>
        </div>
      )}

      {/* Error Dialog */}
      {showErrorDialog && (
        <div className="dialog error-dialog">
          <p>{errorMessage}</p>
          <button onClick={() => setShowErrorDialog(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default BillingAddress;