import React, { useState, useEffect,useCallback } from "react";
import { AddNewAddress, updateAddress,fetchCounties,fetchCountyTowns } from "../Data.js";
import "../../src/checkoupage.css";
import Dialogs from "./Dialogs.js";

const AddressForm = ({ userID,
     onUpdateAddresses,
       isEditing, 
       initialData,
       counties,
       setShowAddressForm
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
//   const [selectedTown, setSelectedTown] = useState(null);
const [countyTowns, setCountyTowns] = useState([]);
const [selectedTown, setselectedTown] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const[errors,setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);
  

//Get Towns based on the selected County
  useEffect(() => {
    const loadCountyTowns = async () => {
      if (selectedCounty) {
        const fetchedTowns = await fetchCountyTowns(selectedCounty);
        setCountyTowns(fetchedTowns);
      }
    };
    loadCountyTowns();
  }, [selectedCounty]);

  const handleCountyChange = async (e) =>{
    const countyID= e.target.value

    setSelectedCounty(countyID);

    setFormData((prevData)=>(
        {
            ...prevData,
            countyId : countyID,
            townId : "" //reset when county Changes
        }
    ))

  }


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));

    ValidateFormFields(name,value)
  };

  const ValidateFormFields =(name,value) =>{

    let error;
    const phoneRegex = /^\d{12}$/;

    switch (name) {
        case "name":
            error = value ? "" : `please provide ${name}, field is required`
            break;
        case "phoneNumber" :
           
           error = phoneRegex.test(value) ? "" : "phonenumber must be valid , please provide in the format 25412345678"
            break;    
        case "postalAddress" :
            error = value ? "" : `please provide ${name}, field is required`
                break;
        case "postalCode" :
             error = value ? "" : `please provide ${name}, field is required`
            break;
        case "extraInformation" :
            error = value ? "" : `please provide ${name}, field is required`
            break;
        default:
            break;
    }

    setErrors((prevErrors) => ({
        ...prevErrors,
        [name] : error
    }))

  } 

  const handleSubmitAddressForm = async (e) => {
    e.preventDefault();

    //block submission if they are errors present
    // if(Object.values(errors).some((error) => error)){
    //     return;
    // }

    const addressPayload = {
      userID: formData.userID,
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      postalAddress: formData.postalAddress,
      postalCode: formData.postalCode,
      county: counties.find((c) => c.countyId === Number(formData.countyId))?.countyName,
      town: countyTowns.find((c) => c.townId === Number(formData.townId))?.townName,
      extraInformation: formData.extraInformation,
      isDefault: formData.isDefault,
      ...(isEditing && {addressID: formData.addressID })
    };

    try {
      let response;
      if (isEditing) {
        response = await updateAddress(addressPayload);
      } else {
        response = await AddNewAddress(addressPayload);
      }

      if (response.responseCode === 200) {
        onUpdateAddresses(response.addresses); // Notify the parent with updated addresses
        setSuccessMessage(response.responseMessage);
        //set Timeout    
        //set show success Dialog to true
        setShowSuccessDialog(true)
        setShowAddressForm(false);
      } else {
        setErrorMessage(response.responseMessage);
        //show Error Dialog
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("An error occurred while saving the address. Please try again.");
    }
  };

  const handleCloseDialog = () =>{

    setShowSuccessDialog(false)
    setShowErrorDialog(false)

  }

  return (
    <>
      {showSuccessDialog && (
        <Dialogs
          message={successMessage}
          type="success"
          onClose={handleCloseDialog}
        />
      )}
  
      {showErrorDialog && (
        <Dialogs
          message={errorMessage}
          type="error"
          onClose={handleCloseDialog}
        />
      )}
  
      <form onSubmit={handleSubmitAddressForm}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          {errors.name && <span className="errors">{errors.name}</span>}
        </div>
  
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            placeholder="Enter phone number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          {errors.phoneNumber && <span className="errors">{errors.phoneNumber}</span>}
        </div>
  
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            placeholder="Street address or P.O. Box"
            name="postalAddress"
            value={formData.postalAddress}
            onChange={handleChange}
            required
          />
          {errors.postalAddress && <span className="errors">{errors.postalAddress}</span>}
        </div>
  
        <div className="form-group">
          <label>County</label>
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
  
        <div className="form-group">
          <label>Town</label>
          <select
            name="townId"
            value={formData.townId}
            onChange={handleChange}
            required
            disabled={!formData.countyId}
          >
            <option value="">Select Town</option>
            {countyTowns.filter((town) => town.countyId === Number(formData.countyId)).map((town) => (
              <option key={town.townId} value={town.townId}>
                {town.townName}
              </option>
            ))}
          </select>
        </div>
  
        <div className="form-group">
          <label>Postal Code</label>
          <input
            type="text"
            placeholder="Enter Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
          />
          {errors.postalCode && <span className="errors">{errors.postalCode}</span>}
        </div>

        <div className="form-group">
            <input
                type="text"
                placeholder="Apt, suite, unit, building, floor, etc."
                id="extraInformation"
                name="extraInformation"
                value={formData.extraInformation}
                onChange={handleChange}
            />
            {errors.extraInformation && <span className="errors">{errors.extraInformation}</span>}

        </div>
  
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="isDefault"
              //convert it to boolean
              checked={formData.isDefault === 1}
              onChange={(e) => setFormData((prev) => ({ ...prev, isDefault: e.target.checked ? 1 : 0 }))}
            />
            Make this my default address
          </label>
        </div>
  
        <button type="submit" className="save-address-btn">
          {isEditing ? "Update Address" : "Save Address"}
        </button>
      </form>
    </>
  );
  
};

export default AddressForm;
