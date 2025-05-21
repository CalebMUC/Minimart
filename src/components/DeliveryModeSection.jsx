import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import DeliveryForm from "./Deliveryform";

const DeliveryModeSection = ({
  deliveryModes,
  selectedDeliveryMode,
  handleSelectDeliveryMode,
  showDeliveryModeForm,
  setShowDeliveryModeForm,
  isAddressSelected,
  deliveryScheduleDate,
  setDeliveryScheduleDate,
  pickupStation,
  setPickupStation,
  selectedAddress,
  isDeliveryModeSelected,
  setIsDeliveryModeSelected,
  clearDeliveryMode,
  handleConfirmDeliveryMode,
  counties
}) => {
  const [scheduledDate, setScheduledDate] = useState(null);

  // Calculate delivery date when component mounts or selectedDeliveryMode changes
  useEffect(() => {
    if (selectedDeliveryMode && !deliveryScheduleDate) {
      const currentDate = new Date();
      const deliveryDays = 5;
      const scheduledDelivery = new Date(currentDate);
      scheduledDelivery.setDate(currentDate.getDate() + deliveryDays);
      setScheduledDate(scheduledDelivery);
      setDeliveryScheduleDate(scheduledDelivery);
    }
  }, [selectedDeliveryMode, deliveryScheduleDate, setDeliveryScheduleDate]);

  return (
    <div className={`p-6 bg-white rounded-lg shadow-md mb-6 ${!isAddressSelected ? "opacity-50 pointer-events-none" : ""}`}>
      <h2 className="text-xl font-bold text-gray-800 mb-4">2. Delivery Mode</h2>

      <div className="space-y-4">
        {deliveryModes.map((mode) => (
          <div 
            key={mode.id} 
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${selectedDeliveryMode === mode.id ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"}`}
            onClick={() => handleSelectDeliveryMode(mode.id)}
          >
            <input
              type="radio"
              name="deliveryMode"
              checked={selectedDeliveryMode === mode.id}
              onChange={() => {}}
              className="h-5 w-5 text-orange-500 focus:ring-orange-400"
            />
            <div className="ml-3 flex-shrink-0">
              <img src={mode.logo} alt={mode.name} className="h-10 w-10 object-contain" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">{mode.name}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedDeliveryMode === 1 && showDeliveryModeForm && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    {/* Modal Container */}
    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
      {/* Close Button */}
      <button
        onClick={() => setShowDeliveryModeForm(false)}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100 transition-colors"
        aria-label="Close modal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      
      <DeliveryForm 
        onPickupStationSelected={(station) => setPickupStation(station)}
        onConfirmDeliveryMode={handleConfirmDeliveryMode}
        onDeliveryModeSelection={setShowDeliveryModeForm}
        setIsDeliveryModeSelected={setIsDeliveryModeSelected}
        counties={counties}
      />
    </div>
  </div>
)}

      {selectedDeliveryMode === 2 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Home Delivery</h3>
          <p className="text-sm text-blue-600">Your order will be delivered to your default address.</p>
        </div>
      )}

      {isDeliveryModeSelected && selectedDeliveryMode && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700">
              Delivery Scheduled on {scheduledDate?.toDateString()}
            </p>
          </div>

          <div className="p-3 bg-orange-50 border border-orange-100 rounded-md shadow-sm mb-3">
            <p className="text-sm text-gray-800">
              {selectedDeliveryMode === 1 ? (
                `Pick up your order from ${pickupStation}`
              ) : (
                `Your Order will be delivered to:
                ${selectedAddress.name}, ${selectedAddress.county}, ${selectedAddress.town}, ${selectedAddress.extraInformation}`
              )}
            </p>
          </div>

          <button
            onClick={clearDeliveryMode}
            className="text-sm text-orange-600 hover:text-orange-800 font-medium hover:underline"
          >
            Clear Delivery Mode Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default DeliveryModeSection;