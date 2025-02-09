import React, { useState, useCallback } from "react";
import "../../src/checkoupage.css";
import packageInfo from "../../package.json"

const DeliveryForm = ({onPickupStationSelected,
  onConfirmDeliveryMode,
  counties,
  onDeliveryModeSelection,
  setIsDeliveryModeSelected
}) => {
  const [formData, setFormData] = useState({
    countyId: "",
    townId: "",
    deliveryStationId: "",
  });
  // const [counties, setCounties] = useState([]); // Populate with actual data
  const [towns, setTowns] = useState([]);
  const [deliveryStations, setDeliveryStations] = useState([]);
  const [pickupStation, setPickupStation] = useState("");
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState(null);

  const handleCountyChange = useCallback(async (e) => {
    const countyId = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      countyId,
      townId: "",
      deliveryStationId: "",
    }));
    setTowns([]); // Reset towns when county changes
    setDeliveryStations([]); // Reset delivery stations

    const loadTownsUrl = packageInfo.urls.LoadTowns.replace("{countyId}", countyId);
    try {
      const response = await fetch(loadTownsUrl);
      if (!response.ok) throw new Error(`Failed to fetch towns: ${response.statusText}`);
      const data = await response.json();
      setTowns(data);
    } catch (error) {
      console.error("Error fetching towns:", error);
    }
  }, []);

  const handleTownChange = useCallback(async (e) => {
    const townId = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      townId,
      deliveryStationId: "",
    }));
    setDeliveryStations([]); // Reset delivery stations

    const loadDeliveryStationsUrl = packageInfo.urls.LoadDeliveryStations.replace("{townId}", townId);
    try {
      const response = await fetch(loadDeliveryStationsUrl);
      if (!response.ok) throw new Error(`Failed to fetch delivery stations: ${response.statusText}`);
      const data = await response.json();
      setDeliveryStations(data);
    } catch (error) {
      console.error("Error fetching delivery stations:", error);
    }
  }, []);

  const handleDeliveryStationChange = useCallback((e) => {
    const deliveryStationId = e.target.value;
    const deliveryName = e.target.options[e.target.selectedIndex]?.text || "";
    setPickupStation(deliveryName);
    setFormData((prevData) => ({
      ...prevData,
      deliveryStationId,
    }));
  }, []);

  const handleUseDeliveryMode = useCallback(() => {
    if(pickupStation){
      onPickupStationSelected(pickupStation)
      onConfirmDeliveryMode(); // Notify parent that delivery mode is confirmed
      onDeliveryModeSelection(false);//notify parent yo close the Delivery form
      setIsDeliveryModeSelected(true)

    }
  }, [pickupStation,onPickupStationSelected,onConfirmDeliveryMode,onDeliveryModeSelection]);

  return (
    <div className="pickup-form">
      <h3>Select your pickup location:</h3>
      <form>
        {/* County Selection */}
        <div className="form-group">
          <label htmlFor="countyId">County:</label>
          <select
            name="countyId"
            value={formData.countyId}
            onChange={handleCountyChange}
            required
          >
            <option value="">Select County</option>
            {counties.map((county) => (
              <option key={county.countyId} value={county.countyId}>
                {county.countyName}
              </option>
            ))}
          </select>
        </div>

        {/* Town Selection */}
        <div className="form-group">
          <label htmlFor="townId">Town:</label>
          <select
            name="townId"
            value={formData.townId}
            onChange={handleTownChange}
            disabled={!formData.countyId}
            required
          >
            <option value="">Select Town</option>
            {towns.map((town) => (
              <option key={town.townId} value={town.townId}>
                {town.townName}
              </option>
            ))}
          </select>
        </div>

        {/* Delivery Station Selection */}
        <div className="form-group">
          <label htmlFor="deliveryStationId">Delivery Station:</label>
          <select
            name="deliveryStationId"
            value={formData.deliveryStationId}
            onChange={handleDeliveryStationChange}
            disabled={!formData.townId}
            required
          >
            <option value="">Select Delivery Station</option>
            {deliveryStations.map((station) => (
              <option key={station.deliveryStationId} value={station.deliveryStationId}>
                {station.deliveryStationName}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleUseDeliveryMode}
          disabled={!formData.deliveryStationId}
        >
          Use this Delivery Mode
        </button>
      </form>
    </div>
  );
};

export default DeliveryForm;
