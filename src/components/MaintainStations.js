import React, { useState } from 'react';

const MaintainStation = () => {
  // State for form data
  const [county, setCounty] = useState('');
  const [town, setTown] = useState({ countyId: '', name: '' });
  const [deliveryStation, setDeliveryStation] = useState({ townId: '', name: '' });

  // State for stored data
  const [counties, setCounties] = useState([]);
  const [towns, setTowns] = useState([]);

  // Handle County input change
  const handleCountyChange = (e) => setCounty(e.target.value);

  // Handle Town input change
  const handleTownChange = (e) => setTown({ ...town, [e.target.name]: e.target.value });

  // Handle Delivery Station input change
  const handleDeliveryStationChange = (e) => setDeliveryStation({ ...deliveryStation, [e.target.name]: e.target.value });

  // Save County
  const handleAddCounty = async () => {
    try {
      const response = await fetch('/api/counties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: county })
      });
      if (response.ok) {
        const newCounty = await response.json();
        setCounties([...counties, newCounty]);
        setCounty(''); // Clear input
      }
    } catch (error) {
      console.error('Error adding county:', error);
    }
  };

  // Save Town
  const handleAddTown = async () => {
    try {
      const response = await fetch('/api/towns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(town)
      });
      if (response.ok) {
        const newTown = await response.json();
        setTowns([...towns, newTown]);
        setTown({ countyId: '', name: '' }); // Clear input
      }
    } catch (error) {
      console.error('Error adding town:', error);
    }
  };

  // Save Delivery Station
  const handleAddDeliveryStation = async () => {
    try {
      const response = await fetch('/api/deliverystations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deliveryStation)
      });
      if (response.ok) {
        const newDeliveryStation = await response.json();
        setDeliveryStation({ townId: '', name: '' }); // Clear input
      }
    } catch (error) {
      console.error('Error adding delivery station:', error);
    }
  };

  return (
    <div>
      {/* Add County */}
      <div>
        <h3>Add County</h3>
        <input
          type="text"
          value={county}
          onChange={handleCountyChange}
          placeholder="County Name"
        />
        <button onClick={handleAddCounty}>Add County</button>
      </div>

      {/* Add Town */}
      <div>
        <h3>Add Town</h3>
        <select name="countyId" value={town.countyId} onChange={handleTownChange}>
          <option value="">Select County</option>
          {counties.map((county) => (
            <option key={county.id} value={county.id}>
              {county.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="name"
          value={town.name}
          onChange={handleTownChange}
          placeholder="Town Name"
        />
        <button onClick={handleAddTown}>Add Town</button>
      </div>

      {/* Add Delivery Station */}
      <div>
        <h3>Add Delivery Station</h3>
        <select name="townId" value={deliveryStation.townId} onChange={handleDeliveryStationChange}>
          <option value="">Select Town</option>
          {towns.map((town) => (
            <option key={town.id} value={town.id}>
              {town.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="name"
          value={deliveryStation.name}
          onChange={handleDeliveryStationChange}
          placeholder="Delivery Station Name"
        />
        <button onClick={handleAddDeliveryStation}>Add Delivery Station</button>
      </div>
    </div>
  );
};

export default MaintainStation;
