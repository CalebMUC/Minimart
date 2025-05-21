import React, { useState, useEffect, useCallback, useContext } from "react";
import AddressSection from "./AddressSection";
import DeliveryModeSection from "./DeliveryModeSection";
import PaymentSection from "./PaymentSection";
import ItemsSection from "./ItemSection";
import OrderSummary from "./OrderSummarySection";
import { CheckOutContext } from './CheckOutContext.js';
import { fetchAddressesByUserID, fetchCounties, Order } from "../Data.js";
import { v4 as uuidv4 } from "uuid";
import Dialogs from "./Dialogs.js";
import { useLocation, useNavigate } from 'react-router-dom';

const MainCheckOutPage = () => {
  const navigate = useNavigate();

  // Initialize state from localStorage if available
  const initializeState = () => {
    const savedState = localStorage.getItem('checkoutState');
    return savedState ? JSON.parse(savedState) : {
      userID: localStorage.getItem("userID") || "",
      isLoading: false,
      addresses: [],
      counties: [],
      selectedAddress: null,
      isAddressSelected: false,
      deliveryModes: [],
      paymentDetails: [], // Always initialize as array
      selectedDeliveryMode: null,
      showDeliveryModeForm: false,
      deliveryScheduleDate: null,
      pickupStation: "",
      isDeliveryModeSelected: false,
      isDeliveryModeConfirmed: false,
      paymentMethods: [],
      selectedPaymentMethod: null,
      showPaymentForm: false,
      isPaymentMethodSelected: false,
      shippingCost: 81.03,
      totalOrderedAmount: 0,
      totalDeliveryFees: 0,
      totalPaymentAmount: 0,
      showAddressForm: false,
      showSuccessDialog: false,
      showErrorDialog: false,
      successMessage: "",
      errorMessage: ""
    };
  };
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

  const [state, setState] = useState(initializeState);
  const { checkOutData, subTotal } = useContext(CheckOutContext);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('checkoutState', JSON.stringify(state));
  }, [state]);

  // Helper function to update state
  const updateState = (newState) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  // Fetch Addresses
  useEffect(() => {
    const loadAddresses = async () => {
      if (state.userID) {
        updateState({ isLoading: true });
        try {
          const fetchedAddresses = await fetchAddressesByUserID(state.userID);
          updateState({ addresses: fetchedAddresses, isLoading: false });
        } catch (error) {
          console.error("Error fetching addresses:", error);
          updateState({ 
            errorMessage: "Failed to load addresses. Please try again.",
            showErrorDialog: true,
            isLoading: false 
          });
        }
      }
    };
    loadAddresses();
  }, [state.userID]);

  // Fetch Counties
  useEffect(() => {
    const loadCounties = async () => {
      updateState({ isLoading: true });
      try {
        const fetchedCounties = await fetchCounties();
        updateState({ counties: fetchedCounties, isLoading: false });
      } catch (error) {
        console.error("Error fetching counties:", error);
        updateState({ 
          errorMessage: "Failed to load counties. Please try again.",
          showErrorDialog: true,
          isLoading: false 
        });
      }
    };
    loadCounties();
  }, []);

  // Fetch Delivery Modes
  useEffect(() => {
    const modes = [
      { id: 1, name: "Pick Up Station", logo: "/Images/location.png" },
      { id: 2, name: "Home Delivery", logo: "/Images/homedelivery.png" },
    ];
    updateState({ deliveryModes: modes });
  }, []);

  // Update Delivery Modes Based on Selected Address
  useEffect(() => {
    if (state.selectedAddress) {
      const modes = [
        { id: 1, name: "Pick Up Station", logo: "/Images/location.png" },
        { id: 2, name: "Home Delivery", logo: "/Images/homedelivery.png" },
      ];
      updateState({ deliveryModes: modes });
    } else {
      updateState({ deliveryModes: [] });
    }
  }, [state.selectedAddress]);

  // Update Payment Methods Based on Selected Delivery Mode
  useEffect(() => {
    if (state.selectedDeliveryMode) {
      const methods = [
        { id: 1, name: "Mpesa", logo: "/Images/Mpesa.jpeg", paymentMethod: "Mpesa" },
        { id: 2, name: "Credit Card", logo: "/Images/card-logo-compact.gif", paymentMethod: "CreditCard" },
        { id: 3, name: "Pay on Delivery", logo: "/Images/delivery-track-icon.png", paymentMethod: "Cash" },
      ];
      updateState({ paymentMethods: methods });
    } else {
      updateState({ paymentMethods: [] });
    }
  }, [state.selectedDeliveryMode]);

  // Event Handlers
  const handleSelectDeliveryMode = (modeId) => {
    updateState({ 
      selectedDeliveryMode: modeId,
      isDeliveryModeSelected: true,
      errorMessage: state.isAddressSelected ? null : state.errorMessage,
      showErrorDialog: state.isAddressSelected ? false : state.showErrorDialog
    });

    if (modeId === 1) {
      updateState({ showDeliveryModeForm: true });
    } else if (modeId === 2) {
      handleConfirmDeliveryMode();
    }
  };

  const clearDeliveryMode = useCallback(() => {
    updateState({ 
      isDeliveryModeSelected: false,
      selectedDeliveryMode: null,
      showDeliveryModeForm: false 
    });
  }, []);

  const handleConfirmDeliveryMode = useCallback(() => {
    updateState({ isDeliveryModeConfirmed: true });
  }, []);

  const handleSelectPaymentMethod = (methodId) => {
    updateState({ 
      selectedPaymentMethod: methodId,
      showPaymentForm: true,
      isPaymentMethodSelected: true,
      errorMessage: null,
      showErrorDialog: false
    });
  };

  const handleCloseModal = () => {
    updateState({ 
      showAddressForm: false,
      showSuccessDialog: false,
      showErrorDialog: false 
    });
    window.history.pushState(null, "", "/MainCheckout");
  };

  const handleUpdateAddresses = useCallback(async () => {
    try {
      const updatedAddresses = await fetchAddressesByUserID(state.userID);
      updateState({ addresses: updatedAddresses });
    } catch (error) {
      console.error("Error updating addresses:", error);
      updateState({ 
        errorMessage: "Failed to update addresses. Please try again.",
        showErrorDialog: true 
      });
    }
  }, [state.userID]);

  const handleAddressSelection = useCallback((address) => {
    updateState({ 
      selectedAddress: address,
      isAddressSelected: true 
    });
  }, []);

  const handleAddNewAddress = () => {
    updateState({ 
      showAddressForm: true,
      selectedAddress: null 
    });
  };

  const HandleCloseDialog = () => {
    updateState({ showErrorDialog: false });
  };

  const handleEditAddress = useCallback((address) => {
    updateState({ 
      selectedAddress: address,
      showAddressForm: true,
      isAddressSelected: true 
    });
  }, []);

  const clearPaymentMethod = useCallback(() => {
    updateState({ 
      isPaymentMethodSelected: false,
      selectedPaymentMethod: null 
    });
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
      merchantId: product.merchantId
    }));
    
    updateState(prev => ({
      orderData: {
        paymentDetails: [], // Reset or maintain paymentDetails
        ...prev.orderData,
        products: productsArray,
      }
    }));
  }, []);

  // Update Order Data When CheckOutData Changes
  useEffect(() => {
    if (checkOutData) {
      const newOrderID = GenerateOrderID();
      updateState(prev => ({
        orderData: {
          ...prev.orderData,
          OrderID: newOrderID,
        }
      }));
      SetProducts(checkOutData);
    }
  }, [checkOutData, GenerateOrderID, SetProducts]);

  const calculateOrderTotal = () => {
    let totalAmount = 0;
    let deliveryFees = 0;
  
    const Zones = {
      "CBD": 100,
      "Zone2": 200,
      "Zone3": 300,
      "Zone4": 400,
    };
  
    let selectedZone = "CBD";
  
    checkOutData.forEach((product) => {
      totalAmount += product.price;
    });
  
    if (totalAmount > 2500 && selectedZone === "CBD") {
      deliveryFees = 0;
    } else {
      deliveryFees = Zones[selectedZone] || 400;
    }
  
    const totalPaymentAmount = totalAmount + deliveryFees;
  
    updateState({
      totalDeliveryFees: deliveryFees,
      totalOrderedAmount: totalAmount,
      totalPaymentAmount: totalPaymentAmount
    });
  };

  useEffect(() => {
    calculateOrderTotal();
  }, [subTotal]);

  const createPayload = () => {
    const orderID = GenerateOrderID();
  
    const products = checkOutData.map((product) => ({
      productID: product.productID,
      productName: product.productName,
      quantity: product.quantity,
      price: product.price,
      discount: 0,
      deliveryFee: 0,
      MerchantId: product.merchantId,
      imageUrl: ""
    }));
  
   // In createPayload: 
    const paymentDetails = [{
      paymentID: state.selectedPaymentMethod,
      paymentMethod: state.paymentMethods.find((method) => method.id === state.selectedPaymentMethod)?.name || "Unknown",
      paymentReference: parseInt(orderData.paymentDetails?.[0]?.phoneNumber) || 0, // Safe access
      phonenumber: parseInt(orderData.paymentDetails?.[0]?.phoneNumber) || 0, // Safe access
      amount: state.totalPaymentAmount,
    }];

   
  
    const shippingAddress = state.selectedAddress
      ? {
          name: state.selectedAddress.name,
          phonenumber: state.selectedAddress.phoneNumber,
          county: state.selectedAddress.county,
          town: state.selectedAddress.town,
          postalCode: state.selectedAddress.postalCode,
          address: state.selectedAddress.extraInformation || "",
        }
      : {};
  
    const deliveryMode = state.deliveryModes.find((mode) => mode.id === state.selectedDeliveryMode)?.name || "Unknown";
    const pickUpLocation = state.selectedDeliveryMode === 1
      ? {
          countyId: 0,
          townId: 0,
          deliveryStationId: 0,
        }
      : {};
  
    return {
      orderID: orderID,
      userID: parseInt(state.userID),
      orderedBy: localStorage.getItem("username"),
      products: products,
      totalOrderAmount: state.totalOrderedAmount,
      totalDeliveryFees: state.totalDeliveryFees,
      totalPaymentAmount: state.totalPaymentAmount,
      paymentDetails: paymentDetails,
      shippingAddress: shippingAddress,
      pickUpLocation: pickUpLocation,
      deliveryScheduleDate: state.deliveryScheduleDate || "",
      status: 1,
      paymentConfirmation: "Pending",
      totalTax: 0,
    };
  };
  
  const PlaceOrder = async () => {
    if (!state.isAddressSelected) {
      updateState({
        errorMessage: "Please Select Address to continue!",
        showErrorDialog: true
      });
      return;
    }
    if (!state.isDeliveryModeSelected) {
      updateState({
        errorMessage: "Please Select Delivery Mode to continue!",
        showErrorDialog: true
      });
      return;
    }
    if (!state.isPaymentMethodSelected) {
      updateState({
        errorMessage: "Please choose payment Mode to continue!",
        showErrorDialog: true
      });
      return;
    }
  
    const payload = createPayload();
    const orderData = { orders: [payload] };

    try {
      const response = await Order(orderData);

      if (response) {
        if (response.responseCode == 200) {
          updateState({
            successMessage: response.responseMessage,
            showSuccessDialog: true
          });
          // Clear checkout data after successful order
          localStorage.removeItem('checkoutState');
          setTimeout(() => {
            navigate('/ReturnsAndOrdersPage');
          }, 3000);
        } else {
          updateState({
            errorMessage: response.responseMessage,
            showErrorDialog: true
          });
        }
      }
    } catch (error) {
      console.error(error);
      updateState({
        errorMessage: "Please try Again",
        showErrorDialog: true
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left Section - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Section */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {state.isLoading ? (
                <div className="p-6 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <AddressSection
                  addresses={state.addresses}
                  selectedAddress={state.selectedAddress}
                  handleAddressSelection={handleAddressSelection}
                  handleEditAddress={handleEditAddress}
                  showAddressForm={state.showAddressForm}
                  setShowAddressForm={(value) => updateState({ showAddressForm: value })}
                  handleCloseModal={handleCloseModal}
                  onUpdateAddresses={handleUpdateAddresses}
                  counties={state.counties}
                  userID={state.userID}
                  handleAddNewAddress={handleAddNewAddress}
                />
              )}
            </div>

            {/* Delivery Mode Section */}
            {state.isAddressSelected && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <DeliveryModeSection
                  deliveryModes={state.deliveryModes}
                  selectedDeliveryMode={state.selectedDeliveryMode}
                  handleSelectDeliveryMode={handleSelectDeliveryMode}
                  setShowDeliveryModeForm={(value) => updateState({ showDeliveryModeForm: value })}
                  showDeliveryModeForm={state.showDeliveryModeForm}
                  isAddressSelected={state.isAddressSelected}
                  deliveryScheduleDate={state.deliveryScheduleDate}
                  setDeliveryScheduleDate={(date) => updateState({ deliveryScheduleDate: date })}
                  pickupStation={state.pickupStation}
                  setPickupStation={(station) => updateState({ pickupStation: station })}
                  selectedAddress={state.selectedAddress}
                  isDeliveryModeSelected={state.isDeliveryModeSelected}
                  setIsDeliveryModeSelected={(value) => updateState({ isDeliveryModeSelected: value })}
                  clearDeliveryMode={clearDeliveryMode}
                  handleConfirmDeliveryMode={handleConfirmDeliveryMode}
                  counties={state.counties}
                />
              </div>
            )}

            {/* Payment Section */}
            {state.isDeliveryModeConfirmed && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <PaymentSection
              paymentMethods={state.paymentMethods}
              selectedPaymentMethod={state.selectedPaymentMethod}
              handleSelectPaymentMethod={handleSelectPaymentMethod}
              showPaymentForm={state.showPaymentForm}
              setShowPaymentForm={(value) => updateState({ showPaymentForm: value })}
              setOrderData={setOrderData}
              orderData={orderData}
              subTotal={subTotal}
              shippingCost={state.shippingCost}
              isPaymentMethodSelected={state.isPaymentMethodSelected}
              clearPaymentMethod={clearPaymentMethod}
              setSelectedPaymentMethod={(method) => updateState({ selectedPaymentMethod: method })}
            />
              </div>
            )}

            {/* Items Section */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <ItemsSection 
                checkOutData={checkOutData}
                subTotal={subTotal}
                isPaymentMethodSelected={state.isPaymentMethodSelected}
              />
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-white shadow rounded-lg overflow-hidden sticky top-8">
              <OrderSummary
                checkOutData={checkOutData}
                totalOrderedAmount={state.totalOrderedAmount}
                totalDeliveryFees={state.totalDeliveryFees}
                totalPaymentAmount={state.totalPaymentAmount}
                PlaceOrder={PlaceOrder}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Success and Error Dialogs */}
      {state.showSuccessDialog && (
        <Dialogs 
          message={state.successMessage}
          type="success"
          onClose={() => updateState({ showSuccessDialog: false })}
        />
      )}
      {state.showErrorDialog && (
        <Dialogs 
          message={state.errorMessage}
          type="error"
          onClose={HandleCloseDialog}
        />
      )}
    </div>
  );
};

export default MainCheckOutPage;