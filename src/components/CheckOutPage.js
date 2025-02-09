// import React, { useState, useEffect, useCallback, useMemo, useContext} from "react";
// import '../../src/checkoupage.css';
// import { useLocation,useNavigate } from 'react-router-dom';
// import { SaveAddresses, GetAddress, Order } from '../Data.js';
// import packageInfo from "../../package.json";
// import { v4 as uuidv4 } from 'uuid';
// import Modal from './Modal.js'; 
// import Dialogs from "./Dialogs.js";
// import DeliveryForm from "./Deliveryform.js";
// import AddressForm from "./AddressForm.js";
// import { CheckOutContext } from './CheckOutContext.js';
// import CreditCardForm from "./CreditCardForm.js";
// import { fetchCountryCodes, fetchCounties,fetchCountyTowns,fetchAddress } from '../Data.js'; 

// const fetchPaymentMethods = async () => {
//   return [
//     { id: 1, name: "Pay with Mpesa", logo: "/Images/Mpesa.jpeg", paymentMethod: "Mpesa" },
//     { id: 2, name: "Pay with Credit Card", logo: "/Images/card-logo-compact.gif", paymentMethod: "CreditCard" },
//     { id: 3, name: "Pay on Delivery", logo: "/Images/delivery-track-icon.png", paymentMethod: "Cash" },
//   ];
// };

// const fetchDeliveryModes = async () => {
//   return [
//     { id: 1, name: "Pick Up Station", logo: "/Images/location.png" },
//     { id: 2, name: "Home Delivery", logo: "/Images/homedelivery.png" },
//   ];
// };


// const CheckOutPage = () => {

//   const { checkOutData, subTotal } = useContext(CheckOutContext);
//  // State declarations
//   const [paymentData, setPaymentData] = useState({
//     phoneNumber: "",
//     TillNumber: "",
//   });

//   const [orderData, setOrderData] = useState({
//     OrderID: "",
//     paymentDetails: [],
//     products: [],
//     status: "",
//     PaymentConfirmation: "",
//     totalPaymentAmount: 0,
//     totalDeliveryFees: 0,
//     totalTax: 0,
//     shippingAddress: "",
//     deliveryMode: "",
//     pickupLocation: ""
//   });

//   const [addresses, setAddress] = useState([]); // Initialize as an array

//   const [showAddressForm, setShowAddressForm] = useState(false);
//   const [showPaymentForm, setPaymentForm] = useState(false);
//   const [showDeliveryModeForm, setShowDeliveryModeForm] = useState(false);
//   const [isDefaultAddress, setDefault] = useState(false);
//   const [paymentMethods, setPaymentMethods] = useState([]);
//   const [deliveryModes, setDeliveryModes] = useState([]);
//   const [counties, setCounties] = useState([]);
//   const [countyId, setCountyId] = useState(0);
  
//   const [pickupstation,setPickupStation] = useState(null);
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
//   const [selectedDeliveryMode, setSelectedDeliveryMode] = useState(null);
  
//   const [shippingCost, setShippingCost] = useState(81.03);
 
//   const [taxRate] = useState(0.16); // 16% tax rate
//   const [defaultDeliveryFee] = useState(100); // Default delivery fee
//   const [totalDeliveryFees, setTotalDeliveryFees] = useState(0);
//   const [totalTax, setTotalTax] = useState(0);
//   const [totalOrderedAmount, setTotalOrderedAmount] = useState(0);
//   const [totalPaymentAmount, setTotalPaymentAmount] = useState(0);
//   let subtotalAmount = 0
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [isEditing,setIsEditing] = useState(false);
//   const [showSuccessDialog, setShowSuccessDialog] = useState(false);
//   const [showDialog, setShowDialog] = useState(false);
//   const [showErrorDialog, setShowErrorDialog] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   const navigate = useNavigate(); 


//   // Step Completion States
//   const [isAddressSelected, setIsAddressSelected] = useState(false);
//   const [isPaymentMethodSelected, setIsPaymentMethodSelected] = useState(false);
//   const [isDeliveryModeSelected, setIsDeliveryModeSelected] = useState(false);
//   const [deliveryScheduleDate, setDeliveryScheduleDate] = useState(null);

//   // Derived data using useMemo
//   // const totalBeforeTax = useMemo(() => subtotal + shippingCost, [subtotal, shippingCost]);
//   // const orderTotal = useMemo(() => totalBeforeTax + tax, [totalBeforeTax, tax]);

  
//   // Load initial data
//   useEffect(() => {
//     //loadAddress();
//     loadPaymentMethods();
//     loadDeliveryModes();
    
//     // Fetch country codes and counties on component mount
//     loadCountryCodes();
//     loadCounties();
//     // loadCountyTowns();

//     if (checkOutData) {
//       const newOrderID = GenerateOrderID();
//       setOrderData((prevOrderData) => ({
//         ...prevOrderData,
//         OrderID: newOrderID,
//       }));
//       SetProducts(checkOutData); // Ensure checkOutData is available before setting products
//     }

//     setUserID();
//   }, [checkOutData]);

//     // Recalculate totals whenever subtotal, delivery mode, or tax changes
//     // useEffect(() => {
//     //   calculateOrderTotals();
//     // }, [subtotal, selectedDeliveryMode]);

//     useEffect(() => {
//       handleDeliveryModeData();
     
//     }, [selectedDeliveryMode, formData, addresses]);

//     useEffect(() => {
//       if (!deliveryScheduleDate) {
//         const currentDate = new Date();
//         const deliveryDays = 5;
//         const scheduledDelivery = new Date(currentDate.setDate(currentDate.getDate() + deliveryDays));
//         setDeliveryScheduleDate(scheduledDelivery.toISOString().split('T')[0]); // Store in the correct format
//       }
//     }, [deliveryScheduleDate]);

    
//   useEffect(() => {
//     const getAddress = async () => {
//       const fetchedAddress = await fetchAddress(localStorage.getItem('userID'));
//       console.log(fetchedAddress)
//       if (Array.isArray(fetchedAddress)) { // Check if the fetched address is an array
//         setAddress(fetchedAddress);
//       } else {
//         console.warn('Fetched address is not an array:', fetchedAddress);
//       }
//     };

//     getAddress();
//   }, []);

//     const calculateOrderTotals = useCallback(() => {
//       const subtotalAmount = parseFloat(subTotal) || 0;
//       const deliveryFees = selectedDeliveryMode === 1 ? 50 : defaultDeliveryFee; // Pickup station vs. home delivery
//       const tax = subtotalAmount * taxRate;
//       const totalDeliveryFeesAmount = parseFloat(deliveryFees) || 0;
//       const total = subtotalAmount + totalDeliveryFeesAmount + tax;
    
//       setTotalDeliveryFees(totalDeliveryFeesAmount); // Update delivery fees state
//       setTotalTax(tax); // Update tax state
//       setTotalOrderedAmount(subtotalAmount); // Update subtotal
//       setTotalPaymentAmount(total); // Update total payment
    
//       setOrderData((prevOrderData) => ({
//         ...prevOrderData,
//         totalOrderAmount: subtotalAmount,
//         totalDeliveryFees: totalDeliveryFeesAmount,
//         totalTax: tax,
//         totalPaymentAmount: total,
//       }));
//     }, [subTotal, selectedDeliveryMode, taxRate, defaultDeliveryFee]);
    
//     // Make sure this function is called after subtotal or delivery mode changes.
//     useEffect(() => {
//       calculateOrderTotals();
//     }, [subTotal, selectedDeliveryMode, calculateOrderTotals]);
    


//   // Fetch and load country codes
//   const loadCountryCodes = async () => {
//     const codes = await fetchCountryCodes();
//     setCountryCodes(codes); // Set state with fetched country codes
//   };

//   // Fetch and load counties
//   const loadCounties = async () => {
//     const countiesData = await fetchCounties();
//     setCounties(countiesData); // Set state with fetched counties
//   };

//   // Log state updates to help debugging
//   useEffect(() => {
//     console.log('Updated country codes:', countryCodes);
//   }, [countryCodes]);

//   // Load towns whenever the countyId changes
// useEffect(() => {
//   if (countyId) {
//     const loadCountyTowns = async () => {
//       const townsData = await fetchCountyTowns(countyId);
//       setCountyTowns(townsData); // Set state with fetched towns
//     };

//     loadCountyTowns();
//   }
// }, [countyId]); // Trigger fetch when countyId changes


//   useEffect(() => {
//     console.log('Updated counties:', counties);
//   }, [counties]);

//   // Functions
//   const SetProducts = useCallback(
//     (checkOutData) => {
//       const productsArray = checkOutData.map((product) => ({
//         productID: product.productID,
//         productName: product.productName,
//         quantity: product.quantity,
//         price: product.price,
//         discount:0,
//         //valueAddedTax: product.tax,
//         deliveryFee: 0,  // Add deliveryFee and discount
//       }));

//       setOrderData((prevOrderData) => ({
//         ...prevOrderData,
//         products: productsArray,
//       }));
//     },
//     [setOrderData]
//   );

//   const GenerateOrderID = useCallback(() => {
//     const timestamp = new Date().getTime();
//     const uuid = uuidv4();
//     const orderId = `ORD-${timestamp}-${uuid.substring(0, 4)}`;
//     return orderId;
//   }, []);

//   const setUserID = useCallback(() => {
//     setOrderData((prevOrderData) => ({
//       ...prevOrderData,
//       userID: parseInt(localStorage.getItem('userID')),
//       orderedBy : localStorage.getItem('username'),
//       status : 1
//     }));
//     setFormData((prevdata)=>({
//       ...prevdata,
//       userID: localStorage.getItem('userID'),
//     }))
//   }, []);


//   const loadPaymentMethods = useCallback(async () => {
//     const methods = await fetchPaymentMethods();
//     setPaymentMethods(methods);
//   }, []);

//   const loadDeliveryModes = useCallback(async () => {
//     const modes = await fetchDeliveryModes();
//     setDeliveryModes(modes);
//   }, []);
  
//   // Event handlers
//   const handleChangeAddress = useCallback(() => {
//     //clear formdata in react
//     setFormData({
//       addressID : 0,
//       name: "",
//       phoneNumber: "",
//       extraInformation: "",
//       postalAddress : "",
//       postalCode: "",
//       isDefault: 0, 
//       userID : "",
//       town : "",
//       county:""

//     });
//     setIsEditing(false)
//     setShowAddressForm(!showAddressForm);
//   }, [showAddressForm]);


//   const handleSelectPaymentMethod = useCallback(
//     (methodId,paymentMethod) => {
//       setSelectedPaymentMethod(methodId);
//       setPaymentMethodName(paymentMethod);
//       setIsPaymentMethodSelected(true);
//       setPaymentForm(true);
 
//     },
//     [subTotal, shippingCost, paymentData.phoneNumber]
//   );


//   const handleSelectDeliveryMode = useCallback(
//     (modeId) => {
//       setSelectedDeliveryMode(modeId);
//       setIsDeliveryModeSelected(true);
//       setShowDeliveryModeForm(true);
//       setOrderData((prevData) => ({
//         ...prevData,
//         deliveryMode: modeId === 1 ? "Pick Up Station" : "Home Delivery",
//       }));
//     },
//     [setOrderData]
//   );

//   const handleDeliveryModeData = useCallback(() => {
//     if (selectedDeliveryMode === 1) {
//       // Pickup Station selected
//       setOrderData((prevData) => ({
//         ...prevData,
//         pickupLocation: {
//           countyId: parseInt(formData.countyId),
//           townId: parseInt(formData.townId),
//           deliveryStationId: parseInt(formData.deliveryStationId),
//         },
//       }));
//     } else if (selectedDeliveryMode === 2 && selectedAddress) {
//       // Home Delivery selected and selectedAddress is set
//       setOrderData((prevData) => ({
//         ...prevData,
//         shippingAddress:{
//           name : `${selectedAddress.name}`,
//           address : `${selectedAddress.postalAddress}`,
//           county : `${selectedAddress.county}`,
//           town : `${selectedAddress.town}`,
//           postalCode : `${selectedAddress.postalCode}`,
//           phonenumber : `${selectedAddress.phoneNumber}`
          
//         } 
        
//       }));
//     }
//   }, [selectedDeliveryMode, formData, selectedAddress, setOrderData]);

//   const resetPaymentAndItems = useCallback(() => {
//     loadPaymentMethods();
//     setIsPaymentMethodSelected(false);
//   }, [loadPaymentMethods]);

//   const clearPaymentMethod = useCallback(() => {
//     loadPaymentMethods();
//     setIsPaymentMethodSelected(false);
//     setSelectedPaymentMethod(null);
//   }, [loadPaymentMethods]);

//   const clearDeliveryMode = useCallback(() => {
//     loadDeliveryModes();
//     setIsDeliveryModeSelected(false);
//     setSelectedDeliveryMode(null);
//   }, [loadDeliveryModes]);

//   // Function to handle updating the order with the selected address data
//   const handleAddressData = useCallback((address) => {
//     setOrderData((prevData) => ({
//       ...prevData,
//       // shippingAddress: `${address.name}, ${address.PostalAddress}, ${address.county}, ${address.town}, ${address.postalCode}`,
//       shippingAddress:{
//         Name : `${address.name}`,
//         address : `${address.postalAddress}`,
//         county : `${address.county}`,
//         town : `${address.town}`,
//         postalCode : `${address.postalCode}`,
//         phonenumber : `${address.phoneNumber}`
        
//       }
//     }));
//   }, [setOrderData]);

//     // Function to handle address selection
//     const handleAddressSelection = (address) => {
//       setIsAddressSelected(true);
//       setSelectedAddress(address); // Set the selected address
//       handleAddressData(address);  // Update order data with selected address
//     };


//   const PlaceOrder = useCallback(async () => {
//     try {
//       // Create a temporary order object that includes the updated deliveryScheduleDate
//       const updatedOrderData = {
//         orders: [  // Wrap the order data inside an "orders" array
//           {
//             ...orderData,  // Ensure this object contains fields like "orderID", "userID", "status", etc.
//             deliveryScheduleDate: deliveryScheduleDate || new Date().toISOString().split('T')[0],  // Ensure it's set
//           }
//         ]
//       };
  
//       // Make the API call with the updated order data
//       const response = await Order(updatedOrderData);
  
//       if (response && response.responseStatusId === 200
//       ) {
//         // Display success dialog using Dialog component
//         setSuccessMessage("Order placed successfully!");
//         setShowDialog(true);  // Show success dialog
  
//         // Redirect after 3 seconds
//         setTimeout(() => {
//           navigate('/ReturnsAndOrdersPage');  // Replace with actual route for 'Returns and Orders' page
//         }, 3000);
//       } else {
//         throw new Error("Failed to place order");
//       }
//     } catch (error) {
//       console.error("Error placing order", error);
//       setErrorMessage("Failed to place the order. Please try again.");
//       setShowDialog(true);  // Show error dialog
//     }
//   }, [orderData, deliveryScheduleDate, navigate]);
  
  
//   const handleCloseModal = () => {
    
//     setShowAddressForm(false);
//     setErrorMessage(false);
//     setSuccessMessage(false);
//     setShowSuccessDialog(false);
//     setShowErrorDialog(false)

//   // Change the URL back to the checkout page without reloading
//   window.history.pushState(null, '', '/checkout');
//   };
  

//   return (
//     <div className="Checkout-MainContainer">


//       <div className="left-section">
//             {showDialog && (
//             <Dialogs 
//               message={successMessage || errorMessage} 
//               type={successMessage ? 'success' : 'error'} 
//               onClose={() => setShowDialog(false)} 
//             />

//             )}
//             {/* Shipping Address Section */}
//             <div className="address-section">
//               <h2>1. Choose a shipping address</h2>
//               {/* Toggles the address form */}
//               <div>
//                 <a href="#change-address" onClick={handleChangeAddress}>
//                   {showAddressForm ? "Cancel" : "Change Address"}
//                 </a>
//               </div>
//               {/* If the address form is not selected, choose fetched address */}
//               {!showAddressForm ? (
//                 <div className="address-list">
//                 {addresses.map((address) => (
//               <div
//                 key={address.addressID}
//                 className={`address-item ${selectedAddress && selectedAddress.addressID === address.addressID ? 'selected' : ''}`}
//                 style={{
//                   border: selectedAddress && selectedAddress.addressID === address.addressID ? '1px solid orange' : '1px solid #ddd',
//                   padding: '10px',
//                   marginBottom: '10px',
//                   borderRadius: '5px',
//                   backgroundColor: selectedAddress && selectedAddress.addressID === address.addressID ? '#fdf3e6' : '#fff',
//                 }}
//               >
//             <input
//               type="radio"
//               name="address"
//               checked={selectedAddress && selectedAddress.addressID === address.addressID}
//               onChange={() => handleAddressSelection(address)}
//               style={{ marginRight: '10px' }}
//             />
//             <strong>{address.name}</strong>, {address.county}, {address.town}, {address.postalCode}, {address.postalAddress} <br />
//             <a href="#edit" onClick={() => handleEditAddress(address)} style={{ color: '#007bff', textDecoration: 'none', marginLeft: '10px' }}>
//               Edit address
//             </a>
//           </div>
//         ))}

//            </div>
//           ) : (
//             <Modal isVisible={showAddressForm} onClose={handleCloseModal}>
//             {showSuccessDialog && <Dialogs 
//             message={successMessage} 
//             type="success"
//             onClose={handleCloseModal}
//             />}

//           <h2>Enter a new shipping address</h2>

//           {/* Error message shown inline, allowing users to edit the form */}
//           {showErrorDialog && <Dialogs message={errorMessage} type="error" />}

//                <AddressForm/> 
          
//         </Modal>

//           )}
//         </div>

//         <hr />

//         {/* Delivery Mode Section */}
//         <div className={`delivery-section ${!isAddressSelected ? "disabled" : ""}`}>
//           <h2>2. Delivery Mode</h2>
//           {isAddressSelected && (
//             <div className="delivery-mode-options">
//               {deliveryModes.map((mode) => (
//                 <div key={mode.id} className="delivery-option">
//                   <input
//                     type="radio"
//                     name="deliveryMode"
//                     checked={selectedDeliveryMode === mode.id}
//                     onChange={() => {
//                       handleSelectDeliveryMode(mode.id);
//                       handleDeliveryModeData();
//                     }}
//                   />
//                   <div className="delivery-mode-logo">
//                     <img src={mode.logo} alt={mode.name} />
//                   </div>
//                   <div className="delivery-mode-name">
//                     <p>{mode.name}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Conditional Rendering based on selected delivery mode */}
//           {/* Modal component */}
//           {selectedDeliveryMode === 1 && 
//         <Modal
//           isVisible={showDeliveryModeForm}
//           onClose={() => setShowDeliveryModeForm(false)}
//         >
//         {/* This is the form that gets rendered inside the modal */}
//         <DeliveryForm/>

//       </Modal>
//     }

//           {selectedDeliveryMode === 2 && (
//             <div className="home-delivery-info">
//               <h3>Home Delivery</h3>
//               <p>Your order will be delivered to your default address.</p>
//             </div>
//           )}

//           {/* Display selected delivery mode */}
//           {isDeliveryModeSelected && selectedDeliveryMode && (
//             <div className="selected-delivery">
//               <div className="schedule-delivery">
//                 {(() => {
//                   const currentDate = new Date();
//                   const deliveryDays = 5;
//                   const scheduledDelivery = new Date(currentDate);
//                   scheduledDelivery.setDate(currentDate.getDate() + deliveryDays);

//                   // Set the delivery schedule date in state
//                   if (!deliveryScheduleDate) {
//                     setDeliveryScheduleDate(scheduledDelivery);
                    
//                   }

//                   return <p>Delivery Scheduled on {scheduledDelivery.toDateString()}</p>;
//                 })()}
//               </div>

//               <div className="delivery-info">
//               <p>
//                 {selectedDeliveryMode === 1 ? (
//                   `Pick up your order from ${pickupstation}`
//                 ) : (
//                   `Your Order will be delivered to:
//                   ${selectedAddress.name}, ${selectedAddress.county}, ${selectedAddress.town}, ${selectedAddress.extraInformation}`
//                 )}
//               </p>
//             </div>

//               <a href="#clear-delivery" onClick={clearDeliveryMode}>
//                 Clear Delivery Mode Selection
//               </a>
//             </div>
//           )}
//         </div>

//         <hr />

//         {/* Payment Method Section */}
//         <div className={`payment-section ${!selectedDeliveryMode ? "disabled" : ""}`}>
//           <h2>3. Payment method</h2>
//           {selectedDeliveryMode && (
//             <div className="payment-method">
//               {paymentMethods.map((method) => (
//                 <div key={method.id} className="payment-option">
//                   <input
//                     type="radio"
//                     name="paymentMethod"
//                     checked={selectedPaymentMethod === method.id}
//                     onChange={() => handleSelectPaymentMethod(method.id,method.paymentMethod)}
//                   />
//                   <div className="payment-method-logo">
//                     <img src={method.logo} alt={method.name} />
//                   </div>
//                   <div className="payment-method-name">
//                     <p>{method.name}</p>
//                   </div>
//                 </div>
//               ))}

//               {/* Mpesa Payment Form */}
//               {selectedPaymentMethod && showPaymentForm && selectedPaymentMethod === 1 && (
//                 <Modal isVisible={showPaymentForm}
//                 onClose={() => setPaymentForm(false)}
//                 >
//                   <MpesaForm/>
//                 </Modal>
//               )}

//               {/* Credit Card Payment Form */}
//               {selectedPaymentMethod && showPaymentForm && selectedPaymentMethod === 2 && (
//                 <Modal isVisible={showPaymentForm}
//                 onClose={() => setPaymentForm(false)}
//                 >
//                   <CreditCardForm/>
//                 </Modal>
//               )}
//             </div>
//           )}

//           {/* Display selected payment method */}
//           {isPaymentMethodSelected && selectedPaymentMethod && (
//             <div className="selected-payment">
//               <a href="#clear-payment" onClick={clearPaymentMethod}>Clear Payment Method Selection</a>
//             </div>
//           )}
//         </div>

//         <hr />

//         {/* Items and Shipping Section */}
//         <div className={`items-section ${!isPaymentMethodSelected ? "disabled" : ""}`}>
//           <h2>4. Items and shipping</h2>
//           {checkOutData && checkOutData.length > 0 ? (
//             <div className="items-list">
//               {checkOutData.map((item, index) => (
//                 <div key={index} className="productItem">
//                   <div className="productImage">
//                     <img src={`${item.productImage}`} alt={item.productName} />
//                   </div>
//                   <div className="productDetails">
//                     <p>{item.productName}</p>
//                     <p>{item.quantity} pcs</p>
//                   </div>
//                 </div>
//               ))}
//               <div className="subtotal-section">
//                 <p>Subtotal: Ksh {subTotal}</p>
//               </div>
//             </div>
//           ) : (
//             <p>No items in the checkout.</p>
//           )}
//         </div>
//       </div>

//       <div className="right-section">
//         <div className="order-summary">
//           <h2>Order Summary</h2>
//           <div className="summary-item">
//             <span>Items ({checkOutData?.length || 0}):</span>
//             <span>Ksh {totalOrderedAmount.toFixed(2)}</span> {/* Subtotal */}
//           </div>
//           <div className="summary-item">
//             <span>Shipping & handling:</span>
//             <span>Ksh {totalDeliveryFees.toFixed(2)}</span> {/* Delivery Fees */}
//           </div>
//           <div className="summary-item">
//             <span>Total before tax:</span>
//             <span>Ksh {(totalOrderedAmount + totalDeliveryFees).toFixed(2)}</span> {/* Total before tax */}
//           </div>
//           <div className="summary-item">
//             <span>Estimated tax:</span>
//             <span>Ksh {totalTax.toFixed(2)}</span> {/* Tax */}
//           </div>
//           <div className="order-total">
//             <span>Order total:</span>
//             <span>Ksh {totalPaymentAmount.toFixed(2)}</span> {/* Total Payment Amount */}
//           </div>
//           <button
//             className="checkout-btn"
//             onClick={PlaceOrder}
//             disabled={!isPaymentMethodSelected || !isAddressSelected || !isDeliveryModeSelected}
//           >
//             Place your order
//           </button>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default CheckOutPage;
