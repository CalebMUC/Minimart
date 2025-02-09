import React from "react";
import Modal from "./Modal";
import AddressForm from "./AddressForm";

const AddressSection = ({
  addresses,
  selectedAddress,
  handleAddressSelection,
  handleEditAddress,
  showAddressForm,
  setShowAddressForm,
  successMessage,
  errorMessage,
  handleCloseModal,
  onUpdateAddresses,
  fetchAddressesByUserID,
  counties,
  setSelectedCounty,
  userID,
  handleAddNewAddress,
  handleUpdateAddresses
}) => {
  return (
    <div className="address-section">
      <h2>1. Choose a shipping address</h2>

      {/* Link to toggle address form */}
      <div>
        <a href="#change-address" onClick={handleAddNewAddress}>
          {showAddressForm ? "Cancel" : "Add New Address"}
        </a>
      </div>

      {/* Address List */}
      {!showAddressForm ? (
        <div className="address-list">
          {addresses.map((address) => (
            <div
              key={address.addressID}
              className={`address-item ${
                selectedAddress && selectedAddress.addressID === address.addressID ? "selected" : ""
              }`}
              style={{
                border:
                  selectedAddress && selectedAddress.addressID === address.addressID
                    ? "1px solid orange"
                    : "1px solid #ddd",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
                backgroundColor:
                  selectedAddress && selectedAddress.addressID === address.addressID
                    ? "#fdf3e6"
                    : "#fff",
              }}
            >
              <input
                type="radio"
                name="address"
                checked={selectedAddress && selectedAddress.addressID === address.addressID}
                onChange={() => handleAddressSelection(address)}
                style={{ marginRight: "10px" }}
              />
              <strong>{address.name}</strong>, {address.county}, {address.town}, {address.postalCode},{" "}
              {address.postalAddress} <br />
              <a
                href="#edit"
                onClick={() => handleEditAddress(address)}
                style={{ color: "#007bff", textDecoration: "none", marginLeft: "10px" }}
              >
                Edit address
              </a>
            </div>
          ))}
        </div>
      ) : (
        // Address Form in Modal
        <Modal isVisible={showAddressForm} onClose={handleCloseModal}>
          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <h2>Enter a new shipping address</h2>
          <AddressForm 
          userID={userID} 
          handleEditAddress={handleEditAddress} 
          onUpdateAddresses={onUpdateAddresses}
          counties ={counties} 
          setSelectedCounty={setSelectedCounty}
          setShowAddressForm={setShowAddressForm}
          isEditing={Boolean(selectedAddress)} // Set true if editing
          initialData={selectedAddress || null} // Pass initial data if editing
          />
        </Modal>
      )}
    </div>
  );
};

export default AddressSection;
