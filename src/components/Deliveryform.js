import React, { useState, useCallback } from "react";
import packageInfo from "../../package.json";
import { fetchCountyTowns, fetchDeliveryStations } from "../Data";

const DeliveryForm = ({
  onPickupStationSelected,
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
  const [towns, setTowns] = useState([]);
  const [deliveryStations, setDeliveryStations] = useState([]);
  const [pickupStation, setPickupStation] = useState("");
  const [isLoading, setIsLoading] = useState({
    towns: false,
    stations: false
  });
  const [error, setError] = useState(null);

  const handleCountyChange = useCallback(async (e) => {
    const countyId = e.target.value;
    setFormData({
      countyId,
      townId: "",
      deliveryStationId: "",
    });
    setTowns([]);
    setDeliveryStations([]);
    setError(null);

    if (!countyId) return;

    setIsLoading(prev => ({...prev, towns: true}));
    // const loadTownsUrl = packageInfo.urls.LoadTowns.replace("{countyId}", countyId);
    
    try {
      const response = await fetchCountyTowns(parseInt(countyId));
      setTowns(response);
    } catch (error) {
      console.error("Error fetching towns:", error);
      setError("Failed to load towns. Please try again.");
    } finally {
      setIsLoading(prev => ({...prev, towns: false}));
    }
  }, []);

  const handleTownChange = useCallback(async (e) => {
    const townId = e.target.value;
    setFormData(prev => ({
      ...prev,
      townId,
      deliveryStationId: "",
    }));
    setDeliveryStations([]);
    setError(null);

    if (!townId) return;

    setIsLoading(prev => ({...prev, stations: true}));
    // const loadDeliveryStationsUrl = packageInfo.urls.LoadDeliveryStations.replace("{townId}", townId);
    
    try {
      const response = await fetchDeliveryStations(parseInt(townId));
 
      setDeliveryStations(response);
    } catch (error) {
      console.error("Error fetching delivery stations:", error);
      setError("Failed to load delivery stations. Please try again.");
    } finally {
      setIsLoading(prev => ({...prev, stations: false}));
    }
  }, []);

  const handleDeliveryStationChange = useCallback((e) => {
    const deliveryStationId = e.target.value;
    const deliveryName = e.target.options[e.target.selectedIndex]?.text || "";
    setPickupStation(deliveryName);
    setFormData(prev => ({
      ...prev,
      deliveryStationId,
    }));
  }, []);

  const handleUseDeliveryMode = useCallback(() => {
    if (pickupStation) {
      onPickupStationSelected(pickupStation);
      onConfirmDeliveryMode();
      onDeliveryModeSelection(false);
      setIsDeliveryModeSelected(true);
    }
  }, [pickupStation, onPickupStationSelected, onConfirmDeliveryMode, onDeliveryModeSelection, setIsDeliveryModeSelected]);

  return (
    <div className="bg-white p-6  max-w-md mx-auto">
      <h4 className="text-xl font-bold text-gray-500 mb-6">Select Your Pickup Location</h4>
      
      <form className="space-y-4">
        {/* County Selection */}
        <div className="space-y-2">
          <label htmlFor="countyId" className="block text-sm font-medium text-gray-700">
            County
          </label>
          <select
            name="countyId"
            value={formData.countyId}
            onChange={handleCountyChange}
            required
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
        <div className="space-y-2">
          <label htmlFor="townId" className="block text-sm font-medium text-gray-700">
            Town
          </label>
          <div className="relative">
            <select
              name="townId"
              value={formData.townId}
              onChange={handleTownChange}
              disabled={!formData.countyId || isLoading.towns}
              required
              className={`block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${(!formData.countyId || isLoading.towns) ? 'bg-gray-100 text-gray-500' : ''}`}
            >
              <option value="">{isLoading.towns ? 'Loading towns...' : 'Select Town'}</option>
              {towns.map((town) => (
                <option key={town.townId} value={town.townId}>
                  {town.townName}
                </option>
              ))}
            </select>
            {isLoading.towns && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Station Selection */}
        <div className="space-y-2">
          <label htmlFor="deliveryStationId" className="block text-sm font-medium text-gray-700">
            Delivery Station
          </label>
          <div className="relative">
            <select
              name="deliveryStationId"
              value={formData.deliveryStationId}
              onChange={handleDeliveryStationChange}
              disabled={!formData.townId || isLoading.stations}
              required
              className={`block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${(!formData.townId || isLoading.stations) ? 'bg-gray-100 text-gray-500' : ''}`}
            >
              <option value="">{isLoading.stations ? 'Loading stations...' : 'Select Delivery Station'}</option>
              {deliveryStations.map((station) => (
                <option key={station.deliveryStationId} value={station.deliveryStationId}>
                  {station.deliveryStationName}
                </option>
              ))}
            </select>
            {isLoading.stations && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="pt-4">
          <button
            type="button"
            onClick={handleUseDeliveryMode}
            disabled={!formData.deliveryStationId}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${!formData.deliveryStationId ? 'bg-yellow-300 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500'}`}
          >
            Confirm Pickup Location
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryForm;