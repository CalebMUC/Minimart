import React  from "react";
import Modal from "./Modal";
import AddressForm from "./AddressForm";
import { useState } from "react";

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
  handleUpdateAddresses,
  isLoading
}) => {
  const [showAllAddresses, setShowAllAddresses] = useState(false);

  const toggleAddressDisplay = () => {
    setShowAllAddresses(!showAllAddresses);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Choose a shipping address</h2>

      {/* Add New Address Button */}
      <button
        onClick={handleAddNewAddress}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 transition-colors"
      >
        {showAddressForm ? "Cancel" : "+ Add New Address"}
      </button>

      {/* Display selected address with change button */}
      {selectedAddress && !showAllAddresses && (
        <div className="mb-4">
          <div className="p-4 border border-orange-400 bg-orange-50 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-800">{selectedAddress.name}</h3>
              {selectedAddress.isDefault === 1 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Default
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm">
              {selectedAddress.postalAddress}, {selectedAddress.town}, {selectedAddress.county}
            </p>
            <p className="text-gray-600 text-sm">{selectedAddress.postalCode}</p>
            <p className="text-gray-600 text-sm">{selectedAddress.phoneNumber}</p>
            <div className="flex justify-between mt-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditAddress(selectedAddress);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
              >
                Edit address
              </button>
              <button
                onClick={toggleAddressDisplay}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                Change address
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Address List - shown when no address selected, or when user clicks "Change" */}
      {!showAddressForm && !isLoading && (showAllAddresses || !selectedAddress) && (
        <div className="space-y-3">
          {addresses.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No addresses saved yet. Add your first address to continue.
            </div>
          ) : (
            addresses.map((address) => (
              <div
                key={address.addressID}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedAddress?.addressID === address.addressID
                    ? "border-orange-400 bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => {
                  handleAddressSelection(address);
                  setShowAllAddresses(false);
                }}
              >
                <div className="flex items-start">
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddress?.addressID === address.addressID}
                    onChange={() => {}}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-800">{address.name}</h3>
                      {address.isDefault === 1 && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      {address.postalAddress}, {address.town}, {address.county}
                    </p>
                    <p className="text-gray-600 text-sm">{address.postalCode}</p>
                    <p className="text-gray-600 text-sm">{address.phoneNumber}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAddress(address);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm mt-2 transition-colors"
                    >
                      Edit address
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Address Form */}
      {showAddressForm && (
        <AddressForm
          userID={userID}
          handleEditAddress={handleEditAddress}
          onUpdateAddresses={onUpdateAddresses}
          counties={counties}
          setSelectedCounty={setSelectedCounty}
          setShowAddressForm={setShowAddressForm}
          isEditing={Boolean(selectedAddress)}
          initialData={selectedAddress || null}
        />
      )}
    </div>
  );
};

export default AddressSection;