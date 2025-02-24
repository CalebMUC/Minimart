import React, {useState} from "react";
import Modal from "./Modal";
import DeliveryForm from "./Deliveryform";
import '../../src/CSS/checkoupage.css';

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
  
  return (
    <div className={`delivery-section ${!isAddressSelected ? "disabled" : ""}`}>
      <h2>2. Delivery Mode</h2>

      <div className="delivery-mode-options">
        {deliveryModes.map((mode) => (
          <div key={mode.id} className="delivery-option">
            <input
              type="radio"
              name="deliveryMode"
              checked={selectedDeliveryMode === mode.id}
              onChange={() => handleSelectDeliveryMode(mode.id)}
            />
            <div className="delivery-mode-logo">
              <img src={mode.logo} alt={mode.name} />
            </div>
            <div className="delivery-mode-name">
              <p>{mode.name}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedDeliveryMode === 1 && (
        <Modal isVisible={showDeliveryModeForm} onClose={() => setShowDeliveryModeForm(false)}>
          <DeliveryForm 
            onPickupStationSelected={(station)=>setPickupStation(station)}
            onConfirmDeliveryMode={handleConfirmDeliveryMode}
            onDeliveryModeSelection={setShowDeliveryModeForm}
            setIsDeliveryModeSelected = {setIsDeliveryModeSelected}
            counties={counties}

          />
        </Modal>
      )}
       {selectedDeliveryMode === 2 && (
            <div className="home-delivery-info">
              <h3>Home Delivery</h3>
              <p>Your order will be delivered to your default address.</p>
            </div>
            
          )}

           {/* Display selected delivery mode */}
         {isDeliveryModeSelected && selectedDeliveryMode && (
            <div className="selected-delivery">
              <div className="schedule-delivery">
                {(() => {
                  const currentDate = new Date();
                  const deliveryDays = 5;
                  const scheduledDelivery = new Date(currentDate);
                  scheduledDelivery.setDate(currentDate.getDate() + deliveryDays);

                  // Set the delivery schedule date in state
                  if (!deliveryScheduleDate) {
                    setDeliveryScheduleDate(scheduledDelivery);
                    
                  }

                  setIsDeliveryModeSelected(true)

                  return <p>Delivery Scheduled on {scheduledDelivery.toDateString()}</p>;
                })()}
              </div>

              <div className="delivery-info">
              <p>
                {selectedDeliveryMode === 1 ? (
                  `Pick up your order from ${pickupStation}`
                ) : (
                  `Your Order will be delivered to:
                  ${selectedAddress.name}, ${selectedAddress.county}, ${selectedAddress.town}, ${selectedAddress.extraInformation}`
                )}
              </p>
            </div>

              <a href="#clear-delivery" onClick={clearDeliveryMode}>
                Clear Delivery Mode Selection
              </a>
            </div>
          )}
    </div>
  );
};

export default DeliveryModeSection;
