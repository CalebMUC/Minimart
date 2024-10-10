import React, { useState, useEffect, useCallback, useMemo, useContext} from "react";
import '../../src/checkoupage.css';
import { useLocation,useNavigate } from 'react-router-dom';
import { SaveAddresses, GetAddress, Order } from '../Data.js';
import packageInfo from "../../package.json";
import { v4 as uuidv4 } from 'uuid';
import Modal from './Modal.js'; 
import Dialogs from "./Dialogs.js";
import { CheckOutContext } from './CheckOutContext.js';

const fetchAddress = async (userId) => {
  try {
    const response = await fetch(`https://localhost:44334/api/Entities/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch address');
    }

    const data = await response.json();
    return data; // Ensure this returns an array of addresses
  } catch (error) {
    console.error('Error fetching address:', error);
    return null; // Return null if there's an error
  }
};

const fetchPaymentMethods = async () => {
  return [
    { id: 1, name: "Pay with Mpesa", logo: "/Images/Mpesa.jpeg", paymentMethod: "Mpesa" },
    { id: 2, name: "Pay with Credit Card", logo: "/Images/card-logo-compact.gif", paymentMethod: "CreditCard" },
    { id: 3, name: "Pay on Delivery", logo: "/Images/delivery-track-icon.png", paymentMethod: "Cash" },
  ];
};

const fetchDeliveryModes = async () => {
  return [
    { id: 1, name: "Pick Up Station", logo: "/Images/location.png" },
    { id: 2, name: "Home Delivery", logo: "/Images/homedelivery.png" },
  ];
};

const fetchCounties = async () => {
  try {
    const response = await fetch(packageInfo.urls.LoadCounties);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Fetched counties data:", data); // Logging raw data
    return data;
  } catch (error) {
    console.error("Error fetching counties:", error);
    return []; // Return an empty array in case of an error
  }
};
const fetchCountyTowns= async (countyId) => {
  try {
    const response = await fetch(packageInfo.urls.LoadTowns.replace("{countyId}", countyId));
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Fetched counties data:", data); // Logging raw data
    return data;
  } catch (error) {
    console.error("Error fetching counties:", error);
    return []; // Return an empty array in case of an error
  }
};
// Simulated saveAddress function
const saveAddress = async (newAddress) => {
  const response = await fetch(`https://your-api-url.com/user/add-address`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newAddress),
  });

  if (!response.ok) {
    throw new Error('Failed to save address');
  }
};


const fetchCountryCodes = async () => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();
    const codes = data
      .map((country) => ({
        name: country.name.common,
        code: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ""),
      }))
      .filter((country) => country.code);
    return codes;
  } catch (error) {
    console.error("Error fetching country codes:", error);
  }
};

const CheckOutPage = () => {
  // const location = useLocation();
  // const { checkOutData, subtotal } = location.state || {};

  const { checkOutData, subTotal } = useContext(CheckOutContext);


 // State declarations
const [formData, setFormData] = useState({
  addressID : "",
  name: "",                // Maps to 'name' from API
  phoneNumber: "",          // Maps to 'phonenumber' from API
  postalAddress: "",        // Maps to 'postalAddress' from API
  county: "",               // Maps to 'county' from API
  town: "",                 // Maps to 'town' from API
  postalCode: "",           // Maps to 'postalCode' from API
  isDefault: 0,        // Add this if applicable to your form
  extraInformation : "",
  userID : "",
  town : "",
  county:""
})


  const [paymentData, setPaymentData] = useState({
    phoneNumber: "",
    TillNumber: "",
  });

  const [orderData, setOrderData] = useState({
    OrderID: "",
    paymentDetails: [],
    products: [],
    status: "",
    PaymentConfirmation: "",
    totalPaymentAmount: 0,
    totalDeliveryFees: 0,
    totalTax: 0,
    shippingAddress: "",
    deliveryMode: "",
    pickupLocation: ""
  });

  const [addresses, setAddress] = useState([]); // Initialize as an array

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setPaymentForm] = useState(false);
  const [showDeliveryModeForm, setShowDeliveryModeForm] = useState(false);
  const [isDefaultAddress, setDefault] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [deliveryModes, setDeliveryModes] = useState([]);
  const [counties, setCounties] = useState([]);
  const [towns, setTowns] = useState([]);
  const [Countytowns, setCountyTowns] = useState([]);
  const [countyId, setCountyId] = useState(0);
  const [deliveryStations, setDeliveryStations] = useState([]);
  const [countryCodes, setCountryCodes] = useState([]);
  const [pickupstation,setPickupStation] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+254");
  const [shippingCost, setShippingCost] = useState(81.03);
  // const [totalOrderedAmount, SettotalOrderedAmount] = useState(0.0);
  // const [totalDeliveryFees, settotalDeliveryFees] = useState(0.0);
  // const [totalPaymentAmount, SettotalPaymentAmount] = useState(0.0);
  // const [totalTax, SettotalTax] = useState(0.0);
  const [taxRate] = useState(0.16); // 16% tax rate
  const [defaultDeliveryFee] = useState(100); // Default delivery fee
  const [totalDeliveryFees, setTotalDeliveryFees] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [totalOrderedAmount, setTotalOrderedAmount] = useState(0);
  const [totalPaymentAmount, setTotalPaymentAmount] = useState(0);
  let subtotalAmount = 0
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isEditing,setIsEditing] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate(); 


  // Step Completion States
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [isPaymentMethodSelected, setIsPaymentMethodSelected] = useState(false);
  const [isDeliveryModeSelected, setIsDeliveryModeSelected] = useState(false);
  const [deliveryScheduleDate, setDeliveryScheduleDate] = useState(null);

  // Derived data using useMemo
  // const totalBeforeTax = useMemo(() => subtotal + shippingCost, [subtotal, shippingCost]);
  // const orderTotal = useMemo(() => totalBeforeTax + tax, [totalBeforeTax, tax]);

  
  // Load initial data
  useEffect(() => {
    //loadAddress();
    loadPaymentMethods();
    loadDeliveryModes();
    
    // Fetch country codes and counties on component mount
    loadCountryCodes();
    loadCounties();
    // loadCountyTowns();

    if (checkOutData) {
      const newOrderID = GenerateOrderID();
      setOrderData((prevOrderData) => ({
        ...prevOrderData,
        OrderID: newOrderID,
      }));
      SetProducts(checkOutData); // Ensure checkOutData is available before setting products
    }

    setUserID();
  }, [checkOutData]);

    // Recalculate totals whenever subtotal, delivery mode, or tax changes
    // useEffect(() => {
    //   calculateOrderTotals();
    // }, [subtotal, selectedDeliveryMode]);

    useEffect(() => {
      handleDeliveryModeData();
     
    }, [selectedDeliveryMode, formData, addresses]);

    useEffect(() => {
      if (!deliveryScheduleDate) {
        const currentDate = new Date();
        const deliveryDays = 5;
        const scheduledDelivery = new Date(currentDate.setDate(currentDate.getDate() + deliveryDays));
        setDeliveryScheduleDate(scheduledDelivery.toISOString().split('T')[0]); // Store in the correct format
      }
    }, [deliveryScheduleDate]);

    
  useEffect(() => {
    const getAddress = async () => {
      const fetchedAddress = await fetchAddress(localStorage.getItem('userID'));
      console.log(fetchedAddress)
      if (Array.isArray(fetchedAddress)) { // Check if the fetched address is an array
        setAddress(fetchedAddress);
      } else {
        console.warn('Fetched address is not an array:', fetchedAddress);
      }
    };

    getAddress();
  }, []);

    const calculateOrderTotals = useCallback(() => {
      const subtotalAmount = parseFloat(subTotal) || 0;
      const deliveryFees = selectedDeliveryMode === 1 ? 50 : defaultDeliveryFee; // Pickup station vs. home delivery
      const tax = subtotalAmount * taxRate;
      const totalDeliveryFeesAmount = parseFloat(deliveryFees) || 0;
      const total = subtotalAmount + totalDeliveryFeesAmount + tax;
    
      setTotalDeliveryFees(totalDeliveryFeesAmount); // Update delivery fees state
      setTotalTax(tax); // Update tax state
      setTotalOrderedAmount(subtotalAmount); // Update subtotal
      setTotalPaymentAmount(total); // Update total payment
    
      setOrderData((prevOrderData) => ({
        ...prevOrderData,
        totalOrderAmount: subtotalAmount,
        totalDeliveryFees: totalDeliveryFeesAmount,
        totalTax: tax,
        totalPaymentAmount: total,
      }));
    }, [subTotal, selectedDeliveryMode, taxRate, defaultDeliveryFee]);
    
    // Make sure this function is called after subtotal or delivery mode changes.
    useEffect(() => {
      calculateOrderTotals();
    }, [subTotal, selectedDeliveryMode, calculateOrderTotals]);
    

   
  


  // Fetch and load country codes
  const loadCountryCodes = async () => {
    const codes = await fetchCountryCodes();
    setCountryCodes(codes); // Set state with fetched country codes
  };

  // Fetch and load counties
  const loadCounties = async () => {
    const countiesData = await fetchCounties();
    setCounties(countiesData); // Set state with fetched counties
  };
 // Fetch and load counties
//  const loadCountyTowns = async () => {
//   const townsData = await fetchCountyTowns(countyId);
//   setCountyTowns(townsData); // Set state with fetched counties
// };
  // Log state updates to help debugging
  useEffect(() => {
    console.log('Updated country codes:', countryCodes);
  }, [countryCodes]);

  // Load towns whenever the countyId changes
useEffect(() => {
  if (countyId) {
    const loadCountyTowns = async () => {
      const townsData = await fetchCountyTowns(countyId);
      setCountyTowns(townsData); // Set state with fetched towns
    };

    loadCountyTowns();
  }
}, [countyId]); // Trigger fetch when countyId changes


  useEffect(() => {
    console.log('Updated counties:', counties);
  }, [counties]);

  // Functions
  const SetProducts = useCallback(
    (checkOutData) => {
      const productsArray = checkOutData.map((product) => ({
        productID: product.productID,
        productName: product.productName,
        quantity: product.quantity,
        price: product.price,
        discount:0,
        //valueAddedTax: product.tax,
        deliveryFee: 0,  // Add deliveryFee and discount
      }));

      setOrderData((prevOrderData) => ({
        ...prevOrderData,
        products: productsArray,
      }));
    },
    [setOrderData]
  );

  const GenerateOrderID = useCallback(() => {
    const timestamp = new Date().getTime();
    const uuid = uuidv4();
    const orderId = `ORD-${timestamp}-${uuid.substring(0, 4)}`;
    return orderId;
  }, []);

  const setUserID = useCallback(() => {
    setOrderData((prevOrderData) => ({
      ...prevOrderData,
      userID: parseInt(localStorage.getItem('userID')),
      orderedBy : localStorage.getItem('username'),
      status : 1
    }));
    setFormData((prevdata)=>({
      ...prevdata,
      userID: localStorage.getItem('userID'),
    }))
  }, []);

  // const loadAddress = useCallback(async () => {
  //   const addressData = await fetchAddress();
  //   setAddress(addressData);
  // }, []);

  const loadPaymentMethods = useCallback(async () => {
    const methods = await fetchPaymentMethods();
    setPaymentMethods(methods);
  }, []);

  const loadDeliveryModes = useCallback(async () => {
    const modes = await fetchDeliveryModes();
    setDeliveryModes(modes);
  }, []);

  // const loadCountryCodes = useCallback(async () => {
  //   const codes = await fetchCountryCodes();
  //   setCountryCodes(codes);
  // }, []);

  // const loadCounties = useCallback(async () => {
  //   const data = await fetchCounties();
  //   if (data && data.length > 0) {
  //     console.log("Setting counties with data:", data);
  //     setCounties(data);
  //   } else {
  //     console.warn("No counties data to set or data is empty.");
  //   }
  // }, []); // Ensure setCounties is a dependency
  
  // Event handlers
  const handleChangeAddress = useCallback(() => {
    //clear formdata in react
    setFormData({
      addressID : 0,
      name: "",
      phoneNumber: "",
      extraInformation: "",
      postalAddress : "",
      postalCode: "",
      isDefault: 0, 
      userID : "",
      town : "",
      county:""

    });
    setIsEditing(false)
    setShowAddressForm(!showAddressForm);
  }, [showAddressForm]);


  const handleEditAddress = useCallback((address) => {
    setCountyId(address.countyId); // This triggers fetching the towns
  
    setFormData({
      addressID : address.addressID,
      name: address.name,
      phoneNumber: address.phoneNumber,
      postalAddress: address.postalAddress,
      countyId: address.countyId,  // Assuming this should be selected dynamically
      townId: address.townId,      // Pre-select the town based on address
      postalCode: address.postalCode,
      extraInformation: address.extraInformation,
      isDefault: address.isDefault || 0,
    });
  
    setIsEditing(true);
    setShowAddressForm(true); // Open form for editing
  });
  

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    },
    [setFormData]
  );

  const handleDefaultAddress = useCallback(() => {
    setDefault((prevDefault) => !prevDefault); // Toggles the "default" state

    setFormData((prevData) => ({
      ...prevData,
      isDefault: !isDefaultAddress ? 1 : 0, // Set isDefault based on the toggled value
    }));

    setDefault((prevValue) => !prevValue); // Update isDefaultAddress state
  }, [isDefaultAddress, setFormData]);

  const handleCountyChange = useCallback(
    async (e) => {
      console.log("County changed"); // Check if this logs when county is changed
      const countyId = e.target.value;
      setCountyId(countyId)
      setFormData((prevData) => ({
        ...prevData,
        countyId,
        townId: "",
        deliveryStationId: "",
      }));
  
      let loadTownsUrl = packageInfo.urls.LoadTowns.replace("{countyId}", countyId);
  
      try {
        const response = await fetch(loadTownsUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch towns: ${response.statusText}`);
        }
        const data = await response.json();
        setTowns(data);
        setDeliveryStations([]); // Reset stations when county changes
      } catch (error) {
        console.error("Error fetching towns:", error);
      }
    },
    [setFormData, setTowns, setDeliveryStations]
  );

  const handleCountyTownChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      townId: e.target.value,
    }));
  };
  

  const handleTownChange = useCallback(
    async (e) => {
      const townId = e.target.value;
      setFormData((prevData) => ({ ...prevData, townId, deliveryStationId: "" }));

      let loadDeliveryStationsUrl = packageInfo.urls.LoadDeliveryStations.replace("{townId}", townId);

      try {
        const response = await fetch(loadDeliveryStationsUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch delivery stations: ${response.statusText}`);
        }
        const data = await response.json();
        setDeliveryStations(data);
      } catch (error) {
        console.error("Error fetching delivery stations:", error);
      }
    },
    [setFormData, setDeliveryStations]
  );

  const handleDeliveryStationChange = useCallback(
    (e) => {
      const deliveryStationId = e.target.value;
      const deliveryName = e.target.options[e.target.selectedIndex].text; // Get the text (name)

      setPickupStation(deliveryName);

      setFormData((prevData) => ({ ...prevData, deliveryStationId }));
    },
    [setFormData]
  );

  const handleSelectPaymentMethod = useCallback(
    (methodId) => {
      setSelectedPaymentMethod(methodId);
      setIsPaymentMethodSelected(true);
      setPaymentForm(true);
  
  
      // setOrderData((prevData) => ({
      //   ...prevData,
      //   paymentDetails: [
      //     {
      //       paymentID: methodId,
      //       paymentReference: paymentData.phoneNumber, // Using paymentData.phoneNumber
      //       amount: totalOrderedAmount,
      //     },
      //   ],
      // }));
    },
    [subTotal, shippingCost, paymentData.phoneNumber]
  );

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
  
    setPaymentData((prevData) => ({
      ...prevData,
      [name]: value, // Dynamically update phoneNumber or other fields
    }));
  };

  const handleSelectDeliveryMode = useCallback(
    (modeId) => {
      setSelectedDeliveryMode(modeId);
      setIsDeliveryModeSelected(true);
      setShowDeliveryModeForm(true);
      setOrderData((prevData) => ({
        ...prevData,
        deliveryMode: modeId === 1 ? "Pick Up Station" : "Home Delivery",
      }));
    },
    [setOrderData]
  );

  const handleDeliveryModeData = useCallback(() => {
    if (selectedDeliveryMode === 1) {
      // Pickup Station selected
      setOrderData((prevData) => ({
        ...prevData,
        pickupLocation: {
          countyId: parseInt(formData.countyId),
          townId: parseInt(formData.townId),
          deliveryStationId: parseInt(formData.deliveryStationId),
        },
      }));
    } else if (selectedDeliveryMode === 2 && selectedAddress) {
      // Home Delivery selected and selectedAddress is set
      setOrderData((prevData) => ({
        ...prevData,
        shippingAddress:{
          name : `${selectedAddress.name}`,
          address : `${selectedAddress.postalAddress}`,
          county : `${selectedAddress.county}`,
          town : `${selectedAddress.town}`,
          postalCode : `${selectedAddress.postalCode}`,
          phonenumber : `${selectedAddress.phoneNumber}`
          
        } 
        
      }));
    }
  }, [selectedDeliveryMode, formData, selectedAddress, setOrderData]);

  const UsethisMode = useCallback(
    (selectedDeliveryMode) => {
      if (selectedDeliveryMode === 1 || selectedDeliveryMode === 2) {
        setShowDeliveryModeForm(false);
        setDeliveryModes(deliveryModes.filter(mode => mode.id === selectedDeliveryMode));
      }
    },
    [deliveryModes]
  );

  const usethisOption = useCallback(() => {
    // Ensure the selected payment method is one of the available options
    if (selectedPaymentMethod === 1 || selectedPaymentMethod === 2) {
      setPaymentForm(false);
      
      // Filter the selected payment method (already handled in your code)
      setPaymentMethods(paymentMethods.filter(method => method.id === selectedPaymentMethod));
  
      // Calculate total order amount
      //const totalOrderedAmount = subtotal + shippingCost;
  
      // Update orderData with the selected payment method and payment reference (phone number)
      setOrderData((prevData) => ({
        ...prevData,
        paymentDetails: [
          {
            paymentID: selectedPaymentMethod,
            paymentReference: paymentData.phoneNumber, // Ensure this is captured from the form
            amount: totalOrderedAmount, // Use calculated order total here
          },
        ],
      }));
    }
  }, [selectedPaymentMethod, paymentMethods, subTotal, shippingCost, paymentData.phoneNumber]);
  

  const resetPaymentAndItems = useCallback(() => {
    loadPaymentMethods();
    setIsPaymentMethodSelected(false);
  }, [loadPaymentMethods]);

  const clearPaymentMethod = useCallback(() => {
    loadPaymentMethods();
    setIsPaymentMethodSelected(false);
    setSelectedPaymentMethod(null);
  }, [loadPaymentMethods]);

  const clearDeliveryMode = useCallback(() => {
    loadDeliveryModes();
    setIsDeliveryModeSelected(false);
    setSelectedDeliveryMode(null);
  }, [loadDeliveryModes]);

  // Function to handle updating the order with the selected address data
  const handleAddressData = useCallback((address) => {
    setOrderData((prevData) => ({
      ...prevData,
      // shippingAddress: `${address.name}, ${address.PostalAddress}, ${address.county}, ${address.town}, ${address.postalCode}`,
      shippingAddress:{
        Name : `${address.name}`,
        address : `${address.postalAddress}`,
        county : `${address.county}`,
        town : `${address.town}`,
        postalCode : `${address.postalCode}`,
        phonenumber : `${address.phoneNumber}`
        
      }
    }));
  }, [setOrderData]);

    // Function to handle address selection
    const handleAddressSelection = (address) => {
      setIsAddressSelected(true);
      setSelectedAddress(address); // Set the selected address
      handleAddressData(address);  // Update order data with selected address
    };

  // const PlaceOrder = useCallback(async () => {
  //   try {
  //     // Create a temporary order object that includes the updated deliveryScheduleDate
  //     const updatedOrderData = {
  //       ...orderData,
  //       deliveryScheduleDate: deliveryScheduleDate || new Date().toISOString().split('T')[0], // Ensure it's set
  //     };
  
  //     // Make the API call with the updated order data
  //     const response = await Order(updatedOrderData);
  //     console.log("Order placed successfully", response);
  //   } catch (error) {
  //     console.error("Error placing order", error);
  //   }
  // }, [orderData, deliveryScheduleDate]);

  const PlaceOrder = useCallback(async () => {
    try {
      // Create a temporary order object that includes the updated deliveryScheduleDate
      const updatedOrderData = {
        orders: [  // Wrap the order data inside an "orders" array
          {
            ...orderData,  // Ensure this object contains fields like "orderID", "userID", "status", etc.
            deliveryScheduleDate: deliveryScheduleDate || new Date().toISOString().split('T')[0],  // Ensure it's set
          }
        ]
      };
  
      // Make the API call with the updated order data
      const response = await Order(updatedOrderData);
  
      if (response && response.responseStatusId === 200
      ) {
        // Display success dialog using Dialog component
        setSuccessMessage("Order placed successfully!");
        setShowDialog(true);  // Show success dialog
  
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate('/ReturnsAndOrdersPage');  // Replace with actual route for 'Returns and Orders' page
        }, 3000);
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order", error);
      setErrorMessage("Failed to place the order. Please try again.");
      setShowDialog(true);  // Show error dialog
    }
  }, [orderData, deliveryScheduleDate, navigate]);
  
  
  const handleCloseModal = () => {
    
    setShowAddressForm(false);
    setErrorMessage(false);
    setSuccessMessage(false);
    setShowSuccessDialog(false);
    setShowErrorDialog(false)

  // Change the URL back to the checkout page without reloading
  window.history.pushState(null, '', '/checkout');
  };

  const handleSubmitAddressForm = async (e) => {
    e.preventDefault();
    
    try {
      // Map the selected County ID and Town ID to their names
      const selectedCounty = counties.find(county => county.countyId === Number(formData.countyId));

      const selectedTown = Countytowns.find(town => town.townId === Number(formData.townId));
  
      // Prepare the payload to include county and town names
    
  
      if(isEditing) {
        const addressPayload = {
          addressID: formData.addressID || 0,
          userID: localStorage.getItem('userID')|| 0,
          name: formData.name,
          phonenumber: formData.phoneNumber,
          postalAddress: formData.postalAddress,
          county: selectedCounty ? selectedCounty.countyName : "",  // Use county name
          town: selectedTown ? selectedTown.townName : "",           // Use town name
          extraInformation: formData.extraInformation,
          isDefault: formData.isDefault ? 1 : 0,
          postalCode: formData.postalCode
        };
        // Update existing address
        await updateAddress(addressPayload);
      } else {
        const addressPayload = {
          // addressID: formData.addressID || 0,
          userID: localStorage.getItem('userID') || 0,
          name: formData.name,
          phonenumber: formData.phoneNumber,
          postalAddress: formData.postalAddress,
          county: selectedCounty ? selectedCounty.countyName : "",  // Use county name
          town: selectedTown ? selectedTown.townName : "",           // Use town name
          extraInformation: formData.extraInformation,
          isDefault: formData.isDefault ? 1 : 0,
          postalCode: formData.postalCode
        };
        // Add a new address
        await AddNewAddress(addressPayload);
      }
    } catch (error) {
      console.error("Error saving address", error);
    }
  };
  
  
  const updateAddress = async (data) => {
    try {
      const response = await fetch(packageInfo.urls.UpdateAddress, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update address: ${response.status}`);
      }
  
      const updatedAddress = await response.json();
  
      // Update only the modified address in the addresses array
      setAddress((prevAddresses) =>
        prevAddresses.map((addr) =>
          addr.addressID === updatedAddress.addressID ? updatedAddress : addr
        )
      );
  
      setSuccessMessage("Address edited successfully");
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Error updating address:", error);
      setErrorMessage("Failed to update the address. Please try again.");
      setShowErrorDialog(true);
    }
  };
  
  
  const AddNewAddress = async (data) => {
    try {
      const response = await fetch(packageInfo.urls.AddNewAddress, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify(data),  // Directly pass formData, not wrapped in { data }
      });
  
      if (!response.ok) {
        throw new Error(`Failed to add new address: ${response.status}`);
      }
  
      const addedData = await response.json();
      setAddress(addedData);
  
      setSuccessMessage("Address added successfully");
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Error adding new address:", error);
      setErrorMessage("Failed to add the new address. Please try again.");
      setShowErrorDialog(true);
    }
  };
  

  return (
    <div className="MainContainer">


      <div className="left-section">
      {showDialog && (
      <Dialogs 
        message={successMessage || errorMessage} 
        type={successMessage ? 'success' : 'error'} 
        onClose={() => setShowDialog(false)} 
      />

    )}
        {/* Shipping Address Section */}
        <div className="address-section">
          <h2>1. Choose a shipping address</h2>
          {/* Toggles the address form */}
          <div>
            <a href="#change-address" onClick={handleChangeAddress}>
              {showAddressForm ? "Cancel" : "Change Address"}
            </a>
          </div>
          {/* If the address form is not selected, choose fetched address */}
          {!showAddressForm ? (
             <div className="address-list">
            {addresses.map((address) => (
          <div
            key={address.addressID}
            className={`address-item ${selectedAddress && selectedAddress.addressID === address.addressID ? 'selected' : ''}`}
            style={{
              border: selectedAddress && selectedAddress.addressID === address.addressID ? '1px solid orange' : '1px solid #ddd',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '5px',
              backgroundColor: selectedAddress && selectedAddress.addressID === address.addressID ? '#fdf3e6' : '#fff',
            }}
          >
            <input
              type="radio"
              name="address"
              checked={selectedAddress && selectedAddress.addressID === address.addressID}
              onChange={() => handleAddressSelection(address)}
              style={{ marginRight: '10px' }}
            />
            <strong>{address.name}</strong>, {address.county}, {address.town}, {address.postalCode}, {address.postalAddress} <br />
            <a href="#edit" onClick={() => handleEditAddress(address)} style={{ color: '#007bff', textDecoration: 'none', marginLeft: '10px' }}>
              Edit address
            </a>
          </div>
        ))}

           </div>
          ) : (
            <Modal isVisible={showAddressForm} onClose={handleCloseModal}>
  {showSuccessDialog && <Dialogs 
  message={successMessage} 
  type="success"
  onClose={handleCloseModal}
   />}

  <h2>Enter a new shipping address</h2>

  {/* Error message shown inline, allowing users to edit the form */}
  {showErrorDialog && <Dialogs message={errorMessage} type="error" />}

  <form onSubmit={handleSubmitAddressForm}>
    <div className="form-group">
      <label>Full name (First and Last name)</label>
      <input
        type="text"
        placeholder="Caleb M"
        name="name"
        id="name"
        value={formData.name}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>Phone number</label>
      <input
        type="text"
        placeholder="Enter phone number"
        name="phoneNumber"
        id="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>Address</label>
      <input
        type="text"
        placeholder="Street address or P.O. Box"
        name="postalAddress"
        id="postalAddress"
        value={formData.postalAddress}
        onChange={handleChange}
      />
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
        onChange={handleCountyTownChange}
        disabled={!Countytowns.length}
        required
      >
        <option value="">Select Town</option>
        {Countytowns.map((town) => (
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
        id="postalCode"
        name="postalCode"
        value={formData.postalCode}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>
        <input type="checkbox" onChange={handleDefaultAddress} /> Make this my default
        address
      </label>
    </div>

    <div className="form-group">
      <button type="submit" className="save-address-btn">
        {isEditing ? "Update Address" : "Save Address"}
      </button>
    </div>
  </form>
</Modal>

          )}
        </div>

        <hr />

        {/* Delivery Mode Section */}
        <div className={`delivery-section ${!isAddressSelected ? "disabled" : ""}`}>
          <h2>2. Delivery Mode</h2>
          {isAddressSelected && (
            <div className="delivery-mode-options">
              {deliveryModes.map((mode) => (
                <div key={mode.id} className="delivery-option">
                  <input
                    type="radio"
                    name="deliveryMode"
                    checked={selectedDeliveryMode === mode.id}
                    onChange={() => {
                      handleSelectDeliveryMode(mode.id);
                      handleDeliveryModeData();
                    }}
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
          )}

          {/* Conditional Rendering based on selected delivery mode */}
          {/* Modal component */}
          {selectedDeliveryMode === 1 && 
      <Modal
        isVisible={showDeliveryModeForm}
        onClose={() => setShowDeliveryModeForm(false)}
      >
        {/* This is the form that gets rendered inside the modal */}
        <div className="pickup-form">
          <h3>Select your pickup location:</h3>
          <form onSubmit={(e) => e.preventDefault()}>
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
              onClick={() => UsethisMode(selectedDeliveryMode)}
              disabled={!formData.deliveryStationId}
            >
              Use this Delivery Mode
            </button>
          </form>
        </div>
      </Modal>
}

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

                  return <p>Delivery Scheduled on {scheduledDelivery.toDateString()}</p>;
                })()}
              </div>

              <div className="delivery-info">
              <p>
                {selectedDeliveryMode === 1 ? (
                  `Pick up your order from ${pickupstation}`
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

        <hr />

        {/* Payment Method Section */}
        <div className={`payment-section ${!selectedDeliveryMode ? "disabled" : ""}`}>
          <h2>3. Payment method</h2>
          {selectedDeliveryMode && (
            <div className="payment-method">
              {paymentMethods.map((method) => (
                <div key={method.id} className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={selectedPaymentMethod === method.id}
                    onChange={() => handleSelectPaymentMethod(method.id)}
                  />
                  <div className="payment-method-logo">
                    <img src={method.logo} alt={method.name} />
                  </div>
                  <div className="payment-method-name">
                    <p>{method.name}</p>
                  </div>
                </div>
              ))}

              {/* Mpesa Payment Form */}
              {selectedPaymentMethod && showPaymentForm && selectedPaymentMethod === 1 && (
                <Modal isVisible={showPaymentForm}
                onClose={() => setPaymentForm(false)}
                >
                <div className="payment-form">
                  <h3>Enter Mpesa Details</h3>
                  <form>
                    <div className="form-group">
                      <label>Mpesa Number</label>
                      <div className="phone-input">
                        <select
                          value={selectedCountryCode}
                          onChange={(e) => setSelectedCountryCode(e.target.value)}
                        >
                          {countryCodes.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.name} ({country.code})
                            </option>
                          ))}
                        </select>
                        <input type="text"
                          name="phoneNumber"  // Bind input to the phoneNumber field in paymentData
                          value={paymentData.phoneNumber}
                          onChange={handlePaymentInputChange}  // Handle input change
                          placeholder="794129556"
                          />
                      </div>
                    </div>
                    <button
                      onClick={() => usethisOption(selectedPaymentMethod)}
                      type="button"
                    >
                      Use this Option
                    </button>
                  </form>
                </div>
                </Modal>
              )}

              {/* Credit Card Payment Form */}
              {selectedPaymentMethod && showPaymentForm && selectedPaymentMethod === 2 && (
                <Modal isVisible={showPaymentForm}
                onClose={() => setPaymentForm(false)}
                >
                <div className="payment-form">
                  <h3>Enter Credit Card Details</h3>
                  <form>
                    <div className="form-group">
                      <label>Name on card</label>
                      <input type="text" placeholder="Caleb M" />
                    </div>
                    <div className="form-group">
                      <label>Card Number</label>
                      <input type="text" placeholder="xxxx-xxxx-xxxx-xxxx" />
                    </div>
                    <div className="form-group">
                      <label>Expiration date</label>
                      <input type="text" placeholder="MM/YY" />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input type="text" placeholder="123" />
                    </div>
                    <button
                      onClick={() => usethisOption(selectedPaymentMethod)}
                      type="button"
                    >
                      Use this Option
                    </button>
                  </form>
                </div>
                </Modal>
              )}
            </div>
          )}

          {/* Display selected payment method */}
          {isPaymentMethodSelected && selectedPaymentMethod && (
            <div className="selected-payment">
              <a href="#clear-payment" onClick={clearPaymentMethod}>Clear Payment Method Selection</a>
            </div>
          )}
        </div>

        <hr />

        {/* Items and Shipping Section */}
        <div className={`items-section ${!isPaymentMethodSelected ? "disabled" : ""}`}>
          <h2>4. Items and shipping</h2>
          {checkOutData && checkOutData.length > 0 ? (
            <div className="items-list">
              {checkOutData.map((item, index) => (
                <div key={index} className="productItem">
                  <div className="productImage">
                    <img src={`${item.productImage}`} alt={item.productName} />
                  </div>
                  <div className="productDetails">
                    <p>{item.productName}</p>
                    <p>{item.quantity} pcs</p>
                  </div>
                </div>
              ))}
              <div className="subtotal-section">
                <p>Subtotal: Ksh {subTotal}</p>
              </div>
            </div>
          ) : (
            <p>No items in the checkout.</p>
          )}
        </div>
      </div>

      <div className="right-section">
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-item">
            <span>Items ({checkOutData?.length || 0}):</span>
            <span>Ksh {totalOrderedAmount.toFixed(2)}</span> {/* Subtotal */}
          </div>
          <div className="summary-item">
            <span>Shipping & handling:</span>
            <span>Ksh {totalDeliveryFees.toFixed(2)}</span> {/* Delivery Fees */}
          </div>
          <div className="summary-item">
            <span>Total before tax:</span>
            <span>Ksh {(totalOrderedAmount + totalDeliveryFees).toFixed(2)}</span> {/* Total before tax */}
          </div>
          <div className="summary-item">
            <span>Estimated tax:</span>
            <span>Ksh {totalTax.toFixed(2)}</span> {/* Tax */}
          </div>
          <div className="order-total">
            <span>Order total:</span>
            <span>Ksh {totalPaymentAmount.toFixed(2)}</span> {/* Total Payment Amount */}
          </div>
          <button
            className="checkout-btn"
            onClick={PlaceOrder}
            disabled={!isPaymentMethodSelected || !isAddressSelected || !isDeliveryModeSelected}
          >
            Place your order
          </button>
        </div>
      </div>

    </div>
  );
};

export default CheckOutPage;
