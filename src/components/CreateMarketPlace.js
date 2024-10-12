import React, { useState } from 'react';
import '../../src/MarketPlace.css';

const Marketplace = () => {
    const [formData, setFormData] = useState({
        businessName: '',
        businessType: 'Retail',
        location: '',
        email: '',
        phone: '',
        description: '',
        logo: null,
        category: 'Electronics',
      });
    
      // Handle input changes
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      // Handle file input changes (for logo)
      const handleFileChange = (e) => {
        setFormData({ ...formData, logo: e.target.files[0] });
      };
    
      // Submit the form
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data submitted:', formData);
        // Here you can add API integration to send data to your backend
      };
    
      // Reset the form
      const handleReset = () => {
        setFormData({
          businessName: '',
          businessType: 'Retail',
          location: '',
          email: '',
          phone: '',
          description: '',
          logo: null,
          category: 'Electronics',
        });
      };
  return (
    <div className="marketplace-creation">
      <div className="background">
        {/* Add any background-related elements or images */}
      </div>
      <div className="form-container">
      <h2>Create Your Marketplace</h2>
      <div className='start'>Start selling on our platform today</div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="businessName">Business Name</label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleInputChange}
            placeholder="Enter your business name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="businessType">Type of Business</label>
          <select
            id="businessType"
            name="businessType"
            value={formData.businessType}
            onChange={handleInputChange}
          >
            <option>Retail</option>
            <option>Wholesale</option>
            <option>Digital Services</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="City, Country"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Business Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter business email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter phone number"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Business Description</label>
          <textarea
            id="description"
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your business"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="logo">Upload Business Logo</label>
          <input type="file" id="logo" name="logo" onChange={handleFileChange} />
        </div>

        <div className="form-group">
          <label htmlFor="category">Store Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
          >
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Home Appliances</option>
          </select>
        </div>

        <div className="buttons">
          <button type="submit" className="primary">Create Marketplace</button>
          <button type="button" className="secondary" onClick={handleReset}>Reset Fields</button>
        </div>
      </form>

      <footer>
        By creating a marketplace, you agree to our terms of service and privacy policy.
      </footer>
      </div>
    </div>
  );
};

export default Marketplace;
