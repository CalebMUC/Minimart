import React, { useState, useEffect, useCallback, useContext } from "react";
import AddressSection from "./AddressSection";
import DeliveryModeSection from "./DeliveryModeSection";
import PaymentSection from "./PaymentSection";
import ItemsSection from "./ItemSection";
import OrderSummary from "./OrderSummarySection";
import "../../src/CSS/checkoupage.css";
import { CheckOutContext } from './CheckOutContext.js';
import { fetchAddressesByUserID, fetchCounties,Order } from "../Data.js";
import { v4 as uuidv4 } from "uuid";
import Dialogs from "./Dialogs.js";
import { useLocation,useNavigate } from 'react-router-dom';
const MainCheckOutPage = () => {

  const navigate = useNavigate();

  // State Management
  const [userID, setUserID] = useState(localStorage.getItem("userID") || "");
  const [isLoading, setIsLoading] = useState(false);

  // Address State
  const [addresses, setAddresses] = useState([]);
  const [counties, setCounties] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAddressSelected, setAddressSelected] = useState(false);

  // Delivery Mode State
  const [deliveryModes, setDeliveryModes] = useState([]);
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState(null);
  const [showDeliveryModeForm, setShowDeliveryModeForm] = useState(false);
  const [deliveryScheduleDate, setDeliveryScheduleDate] = useState(null);
  const [pickupStation, setPickupStation] = useState("");
  const [isDeliveryModeSelected, setIsDeliveryModeSelected] = useState(false);
  const [isDeliveryModeConfirmed, setIsDeliveryModeConfirmed] = useState(false);

  // Payment State
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isPaymentMethodSelected, setIsPaymentMethodSelected] = useState(false);
  const [shippingCost, setShippingCost] = useState(81.03);

  // Order Summary State
  const { checkOutData, subTotal } = useContext(CheckOutContext);
  const [totalOrderedAmount, setTotalOrderedAmount] = useState(0);
  const [totalDeliveryFees, setTotalDeliveryFees] = useState(0);
  const [totalPaymentAmount, setTotalPaymentAmount] = useState(0);

  // Order Data State
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

  // Modal and Dialog State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch Addresses
  useEffect(() => {
    const loadAddresses = async () => {
      if (userID) {
        setIsLoading(true);
        try {
          const fetchedAddresses = await fetchAddressesByUserID(userID);
          setAddresses(fetchedAddresses);
        } catch (error) {
          console.error("Error fetching addresses:", error);
          setErrorMessage("Failed to load addresses. Please try again.");
          setShowErrorDialog(true);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadAddresses();
  }, [userID]);

  // Fetch Counties
  useEffect(() => {
    const loadCounties = async () => {
      setIsLoading(true);
      try {
        const fetchedCounties = await fetchCounties();
        setCounties(fetchedCounties);
      } catch (error) {
        console.error("Error fetching counties:", error);
        setErrorMessage("Failed to load counties. Please try again.");
        setShowErrorDialog(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadCounties();
  }, []);

  // Fetch Delivery Modes
  useEffect(() => {
    const loadDeliveryModes = () => {
      const modes = [
        { id: 1, name: "Pick Up Station", logo: "/Images/location.png" },
        { id: 2, name: "Home Delivery", logo: "/Images/homedelivery.png" },
      ];
      setDeliveryModes(modes);
    };
    loadDeliveryModes();
  }, []);

  // Update Delivery Modes Based on Selected Address
  useEffect(() => {
    if (selectedAddress) {
      setDeliveryModes([
        { id: 1, name: "Pick Up Station", logo: "/Images/location.png" },
        { id: 2, name: "Home Delivery", logo: "/Images/homedelivery.png" },
      ]);
    } else {
      setDeliveryModes([]);
    }
  }, [selectedAddress]);

  // Update Payment Methods Based on Selected Delivery Mode
  useEffect(() => {
    if (selectedDeliveryMode) {
      setPaymentMethods([
        { id: 1, name: "Mpesa", logo: "/Images/Mpesa.jpeg", paymentMethod: "Mpesa" },
        { id: 2, name: "Credit Card", logo: "/Images/card-logo-compact.gif", paymentMethod: "CreditCard" },
        { id: 3, name: "Pay on Delivery", logo: "/Images/delivery-track-icon.png", paymentMethod: "Cash" },
      ]);
    } else {
      setPaymentMethods([]);
    }
  }, [selectedDeliveryMode]);

  // Event Handlers
  const handleSelectDeliveryMode = (modeId) => {
    setSelectedDeliveryMode(modeId);
    setIsDeliveryModeSelected(true);

    if(isAddressSelected){
      setErrorMessage(null)
      setShowErrorDialog(false)
    }

    if (modeId === 1) {
      setShowDeliveryModeForm(true);
    } else if (modeId === 2) {
      handleConfirmDeliveryMode();
    }
  };

  const clearDeliveryMode = useCallback(() => {
    setIsDeliveryModeSelected(false);
    setSelectedDeliveryMode(null);
    setShowDeliveryModeForm(false);
  }, []);

  const handleConfirmDeliveryMode = useCallback(() => {
    setIsDeliveryModeConfirmed(true);
  }, []);

  const handleSelectPaymentMethod = (methodId) => {
    setSelectedPaymentMethod(methodId);
    setShowPaymentForm(true);
    setIsPaymentMethodSelected(true)
    if(isDeliveryModeSelected){
      setErrorMessage(null)
      setShowErrorDialog(false)
    }
    setErrorMessage(null)
    setShowErrorDialog(false)
  };

  const handleCloseModal = () => {
    setShowAddressForm(false);
    setShowSuccessDialog(false);
    setShowErrorDialog(false);
    window.history.pushState(null, "", "/MainCheckout");
  };

  const handleUpdateAddresses = useCallback(async () => {
    try {
      const updatedAddresses = await fetchAddressesByUserID(userID);
      setAddresses(updatedAddresses);
    } catch (error) {
      console.error("Error updating addresses:", error);
      setErrorMessage("Failed to update addresses. Please try again.");
      setShowErrorDialog(true);
    }
  }, [userID]);

  const handleAddressSelection = useCallback((address) => {
    setSelectedAddress(address);
    setAddressSelected(true);
    
  }, []);

  const handleAddNewAddress = () => {
    setShowAddressForm(true);
    setSelectedAddress(null);
  };

  const HandleCloseDialog =() =>{
    setShowErrorDialog(false)
  }

  const handleEditAddress = useCallback((address) => {
    setSelectedAddress(address);
    setShowAddressForm(true);
    setAddressSelected(true);
  }, []);

    const clearPaymentMethod = useCallback(() => {
    setIsPaymentMethodSelected(false);
    setSelectedPaymentMethod(null);
  }, []);

  // Generate Order ID
  const GenerateOrderID = useCallback(() => {
    const timestamp = new Date().getTime();
    const uuid = uuidv4();
    return `ORD-${timestamp}-${uuid.substring(0, 4)}`;
  }, []);

  // Set Products in Order Data
  const SetProducts = useCallback((checkOutData) => {
    const productsArray = checkOutData.map((product) => ({
      productID: product.productID,
      productName: product.productName,
      quantity: product.quantity,
      price: product.price,
      discount: 0,
      deliveryFee: 0,
    }));
    setOrderData((prevOrderData) => ({
      ...prevOrderData,
      products: productsArray,
    }));
  }, []);

  // Update Order Data When CheckOutData Changes
  useEffect(() => {
    if (checkOutData) {
      const newOrderID = GenerateOrderID();
      setOrderData((prevOrderData) => ({
        ...prevOrderData,
        OrderID: newOrderID,
      }));
      SetProducts(checkOutData);
    }
  }, [checkOutData, GenerateOrderID, SetProducts]);

  const calculateOrderTotal = () => {
    let totalAmount = 0;
    let deliveryFees = 0;
  
    // Define delivery zones and their corresponding fees
    const Zones = {
      "CBD": 100, // Within CBD
      "Zone2": 200, // 5 km away from CBD
      "Zone3": 300, // 10 to 15 km away
      "Zone4": 400, // 20 km away from CBD
    };
  
    // Hardcoded selected zone (replace this with dynamic logic based on customer address)
    let selectedZone = "CBD"; // Example: Dynamically determine this based on the customer's address
  
    // Calculate the total order amount
    checkOutData.forEach((product) => {
      totalAmount += product.price;
    });
  
    // Calculate delivery fees
    if (totalAmount > 2500 && selectedZone === "CBD") {
      // Free delivery for orders above KES 2500 within CBD
      deliveryFees = 0;
    } else {
      // Use the zone-based delivery fee
      deliveryFees = Zones[selectedZone] || 400; // Default to KES 400 if zone is not found
    }
  
    // Calculate the total payment amount
    const totalPaymentAmount = totalAmount + deliveryFees;
  
    // Update state
    setTotalDeliveryFees(deliveryFees);
    setTotalOrderedAmount(totalAmount);
    setTotalPaymentAmount(totalPaymentAmount);
  };

  useEffect(()=>{
    calculateOrderTotal();
  },[subTotal])

  const createPayload = () => {
    // Generate OrderID
    const orderID = GenerateOrderID();
  
    // Array of products
    const products = checkOutData.map((product) => ({
      productID: product.productID,
      productName: product.productName,
      quantity: product.quantity,
      price: product.price,
      discount: 0,
      deliveryFee: 0,
    }));
  
    // Prepare payment details
    const paymentDetails = [
      {
        paymentID: selectedPaymentMethod,
        paymentMethod: paymentMethods.find((method) => method.id === selectedPaymentMethod)?.name || "Unknown",
        paymentReference: orderData.paymentDetails[0]?.phoneNumber || "",
        phonenumber: orderData.paymentDetails[0]?.phoneNumber || "",
        amount: totalPaymentAmount,
      }
    ];
  
    // Prepare shipping address
    const shippingAddress = selectedAddress
      ? {
          name: selectedAddress.name,
          phonenumber: selectedAddress.phoneNumber,
          county: selectedAddress.county,
          town: selectedAddress.town,
          postalCode: selectedAddress.postalCode,
          address: selectedAddress.extraInformation || "",
        }
      : {};
  
    // Prepare delivery details
    const deliveryMode = deliveryModes.find((mode) => mode.id === selectedDeliveryMode)?.name || "Unknown";
    const pickUpLocation = selectedDeliveryMode === 1
      ? {
          // countyId: selectedPickUpLocation.countyId || 0,
          countyId: 0,
          townId: 0,
          deliveryStationId: 0,
        }
      : {};
  
    // Create the final payload
    const payload = {
      orderID: orderID,
      userID: parseInt(userID), // Ensure userID is an integer
      orderedBy : localStorage.getItem("userName"),
      products: products,
      totalOrderAmount: totalOrderedAmount,
      totalDeliveryFees: totalDeliveryFees,
      totalPaymentAmount: totalPaymentAmount,
      paymentDetails: paymentDetails,
      shippingAddress: shippingAddress,
      // deliveryMode: deliveryMode,
      pickUpLocation: pickUpLocation,
      deliveryScheduleDate: deliveryScheduleDate || "", // Optional
      status: 1,
      paymentConfirmation: "Pending",
      totalTax: 0,
    };
  
    return payload;
  };
  
  const PlaceOrder = async () => {
    // Validation checks
    if (!isAddressSelected) {
      setErrorMessage("Please Select Address to continue!");
      setShowErrorDialog(true);
      return;
    }
    if (!isDeliveryModeSelected) {
      setErrorMessage("Please Select Delivery Mode to continue!");
      setShowErrorDialog(true);
      return;
    }
    if (!isPaymentMethodSelected) {
      setErrorMessage("Please choose payment Mode to continue!");
      setShowErrorDialog(true);
      return;
    }
  
    const payload = createPayload();
  
    const orderData = {
      orders: [payload]
    };

    try{

      var response = await Order(orderData);

      if(response){
        if(response.responseStatusId == 200){
          setSuccessMessage(response.responseMessage);
          setShowSuccessDialog(true)
          setTimeout(() => {
              navigate('/ReturnsAndOrdersPage');  // Replace with actual route for 'Returns and Orders' page
           }, 3000);
        }else{
          setErrorMessage(response.responseMessage)
          setShowErrorDialog(true)
        }
      }


    }catch(error){
      console.error(error);
      setErrorMessage("Please try Again")
      setShowErrorDialog(true)
    }
  
  };
  
  

  return (
    <div className="Checkout-MainContainer">
      {/* Left Section */}
      <div className="left-section">
        {isLoading ? (
          <p>Loading addresses...</p>
        ) : (
          <AddressSection
            addresses={addresses}
            selectedAddress={selectedAddress}
            handleAddressSelection={handleAddressSelection}
            handleEditAddress={handleEditAddress}
            showAddressForm={showAddressForm}
            setShowAddressForm={setShowAddressForm}
            handleCloseModal={handleCloseModal}
            onUpdateAddresses={handleUpdateAddresses}
            counties={counties}
            userID={userID}
            handleAddNewAddress={handleAddNewAddress}
          />
        )}
        <hr />

        {isLoading ? (
          <p>Load DeliveryModes</p>
        ) : (
          <>
            {isAddressSelected && (
              <DeliveryModeSection
                deliveryModes={deliveryModes}
                selectedDeliveryMode={selectedDeliveryMode}
                handleSelectDeliveryMode={handleSelectDeliveryMode}
                setShowDeliveryModeForm={setShowDeliveryModeForm}
                showDeliveryModeForm={showDeliveryModeForm}
                isAddressSelected={isAddressSelected}
                deliveryScheduleDate={deliveryScheduleDate}
                setDeliveryScheduleDate={setDeliveryScheduleDate}
                pickupStation={pickupStation}
                setPickupStation={setPickupStation}
                selectedAddress={selectedAddress}
                isDeliveryModeSelected={isDeliveryModeSelected}
                setIsDeliveryModeSelected = {setIsDeliveryModeSelected}
                clearDeliveryMode={clearDeliveryMode}
                handleConfirmDeliveryMode={handleConfirmDeliveryMode}
                counties={counties}

              />
            )}
          </>
        )}
        <hr />

        {isDeliveryModeConfirmed && (
          <PaymentSection
            paymentMethods={paymentMethods}
            selectedPaymentMethod={selectedPaymentMethod}
            handleSelectPaymentMethod={handleSelectPaymentMethod}
            showPaymentForm={showPaymentForm}
            setShowPaymentForm={setShowPaymentForm}
            setOrderData={setOrderData}
            orderData={orderData}
            subTotal={subTotal}
            shippingCost={shippingCost}
            isPaymentMethodSelected={isPaymentMethodSelected}
            clearPaymentMethod={clearPaymentMethod}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
          />
        )}
        <hr />

        <ItemsSection 
        checkOutData={checkOutData}
        subTotal={subTotal}
        isPaymentMethodSelected={isPaymentMethodSelected}
         />
      </div>

      {/* Right Section */}
      <div className="right-section">
         {/* Success and Error Dialogs */}
      {showSuccessDialog && (
        <div className="dialog success">
          <p>{successMessage}</p>
          <button onClick={() => setShowSuccessDialog(false)}>Close</button>
        </div>
      )}
      {showErrorDialog && (

        <Dialogs message={errorMessage}
        type="error"
        onClose={HandleCloseDialog}
        />
        // <div className="dialog error">
        //   <p>{errorMessage}</p>
        //   <button onClick={() => setShowErrorDialog(false)}>Close</button>
        // </div>
      )}
        <OrderSummary
          checkOutData={checkOutData}
          totalOrderedAmount={totalOrderedAmount}
          totalDeliveryFees={totalDeliveryFees}
          totalPaymentAmount={totalPaymentAmount}
          PlaceOrder={PlaceOrder}
        />
      </div>

     
    </div>
  );
};

export default MainCheckOutPage;