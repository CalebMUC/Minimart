import React, { useState, useEffect } from "react";
import { DataGrid,GridActionsCellItem } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Modal from "../Modal"; // Ensure you have a Modal component
import "../../CSS/MerchantOrders.css"; // Import the CSS file
import { FaSearch,FaPrint,FaDownload,FaEdit } from "react-icons/fa";
import { FetchMerchants,GetAdminOrders,GetMerchantOrders,GetOrderDetails } from "../../Data";

const AdminOrders = () => {
  const { merchantId, orderID } = useParams(); // Get merchantId and orderID from URL
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
      orderID: "",
      productName: "",
      status: "",
      time: "",
    });
    
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [merchants, setMerchants] = useState([]);
  const [showMerchantsModal, setShowMerchantsModal] = useState(false);
  const [searchInputMerchants, setSearchInputMerchants] = useState("");
  const [selectedMerchantID, setSelectedMerchantID] = useState(null);

  // Fetch all merchants
  const GetAllMerchants = async () => {
    try {
      const response = await FetchMerchants();
      if (response) {
        setMerchants(response);
      }
    } catch (error) {
      console.error("Error fetching merchants:", error);
    }
  };

  useEffect(() => {
    GetAllMerchants();
  }, []);

  // Fetch orders based on merchantId and orderID
  const fetchOrders = async () => {
    try {
      const response = await GetAdminOrders() ;
     
       if(response.length > 0){
              setOrders(response);
            }else{
                Swal.fire({
              icon: "warning",
              title: "Error",
              text: "No Pending Orders",
            });
            }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch orders. Please try again later.",
      });
    }
  };

  // Fetch orders when merchantId or orderID changes (URL mode)
  useEffect(() => {
    // if (merchantId) {
      // If the page is called from a URL, hide the search-merchants section
      // because we already know the merchant from the URL
      fetchOrders();
    // }
  },[]);

  const handleGridSearch = () => {
    const { orderID, productName, status, time } = searchQuery;
  
    const filtered = orders.filter((order) => {
      const matchesOrderID = orderID
        ? order.orderId.toString().includes(orderID)
        : true;
  
      const matchesProductName = productName
        ? new RegExp(productName, "i").test(order.productName.toString()) // Case-insensitive LIKE
        : true;
  
      const matchesStatus = status ? order.status === status : true;
  
      return matchesOrderID && matchesProductName && matchesStatus;
    });
  
    setOrders(filtered); // Update the state with filtered orders
  };

  // Filter orders by search query
  // const searchedOrders = orders.filter(
  //   (order) =>
  //     order.orderID.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     order.status.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  // Handle merchant search input change
  const handleMerchantSearchChange = (e) => {
    setSearchInputMerchants(e.target.value);
  };

  // Handle merchant selection
  const handleMerchantSelect = (merchant) => {
    setShowMerchantsModal(false);
    setSelectedMerchantID(merchant.merchantID);
    // Fetch orders based on the selected merchant ID
    fetchOrders(merchant.merchantID, null);
  };
const handleViewOrderDetails = async (OrderId) => {
    try {
      const orderDetails = await GetOrderDetails(OrderId);
      if (orderDetails.length > 0) {
        setSelectedOrder(orderDetails[0]); // Set first order detail
        setModalOpen(true); // Open modal after setting state
      } else {
        Swal.fire({
          icon: "warning",
          title: "No Details",
          text: "No order details found!",
        });
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch order details.",
      });
    }
  };
  // Columns for the DataGrid
  const columns = [
    { field: "orderId", headerName: "Order ID", width: 200 },
    { field: "productName", headerName: "Product Name", width: 150 },
    { field: "quantity", headerName: "Quantity", width: 100 },
    { field: "price", headerName: "Price", width: 100 },
    { field: "status", headerName: "Status", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<FaEdit />}
          label="Edit"
          // onClick={() => handleEditOrder(params.row)}
        />,
        <GridActionsCellItem
          icon={<FaPrint />}
          label="View Details"
          onClick={() => handleViewOrderDetails(params.row.orderId)}
        />
        
      ],
    },
  ];

  return (
    <div className="merchant-orders-container">
      <h1 className="merchant-orders-title">Merchant Orders</h1>

      {/* Search Merchants (only show if not called from URL) */}
      {!merchantId && (
        <div className="search-merchants">
          <input
            type="text"
            placeholder="Search by Merchant Name or ID"
            value={searchInputMerchants}
            onChange={handleMerchantSearchChange}
          />
          <button onClick={() => setShowMerchantsModal(true)}>
            <FaSearch />
          </button>
        </div>
      )}

      {/* Merchants Modal */}
      {showMerchantsModal && (
        <div className="search-modal">
          <div className="search-modal-content">
            <h4>Select Merchant</h4>
            <ul>
              {merchants
                .filter((merchant) =>
                  merchant.businessName
                    .toLowerCase()
                    .includes(searchInputMerchants.toLowerCase()) ||
                  merchant.merchantID.toString().includes(searchInputMerchants)
                )
                .map((merchant) => (
                  <li
                    key={merchant.merchantID}
                    onClick={() => handleMerchantSelect(merchant)}
                  >
                    {merchant.businessName} (ID: {merchant.merchantID}, Status:{" "}
                    {merchant.status})
                  </li>
                ))}
            </ul>
            <button onClick={() => setShowMerchantsModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Search Orders */}
      <div className="full-search-container">
        {/* Order ID Input */}
        <input
          type="text"
          placeholder="Order ID"
          className="full-search-input"
          value={searchQuery.orderID}
          onChange={(e) => setSearchQuery({ ...searchQuery, orderID: e.target.value })}
        />

        {/* Product Name Input */}
        <input
          type="text"
          placeholder="Product Name"
          className="full-search-input"
          value={searchQuery.productName}
          onChange={(e) => setSearchQuery({ ...searchQuery, productName: e.target.value })}
        />

        {/* Status Dropdown */}
        <select
          className="full-search-dropdown"
          value={searchQuery.status}
          onChange={(e) => setSearchQuery({ ...searchQuery, status: e.target.value })}
        >
          <option value="">--Status--</option>
          <option value="Pending">Pending</option>
          <option value="Active">Active</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {/* Time Dropdown */}
        <select
          className="full-search-dropdown"
          value={searchQuery.time}
          onChange={(e) => setSearchQuery({ ...searchQuery, time: e.target.value })}
        >
          <option value="">--Time--</option>
          <option value="1hr">1hr ago</option>
          <option value="2hrs">2hrs ago</option>
          <option value="5hrs">5hrs ago</option>
          <option value="1day">1 day ago</option>
        </select>

        {/* Search Button */}
        <button onClick={handleGridSearch} className="full-search-button">
          <FaSearch /> Search
        </button>
      </div>


      {/* Material-UI DataGrid */}
      <div className="data-grid-container">
          <DataGrid
                  // rows={searchedOrders}
                  rows={orders}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10]}
                  checkboxSelection
                  getRowId={(row)=>row.orderId}
                />
      </div>

      {/* Order Details Modal */}
      {isModalOpen && (
        <Modal isVisible={isModalOpen} onClose={() => setModalOpen(false)}>
          <OrderDetails order={selectedOrder} />
        </Modal>
      )}
    </div>
  );
};

// Order Details Component
const OrderDetails = ({ order }) => {
  if (!order) return null;

  return (
    <div className="order-details-modal">
      <h3>Order Details</h3>
      <div>
        <p>
          <strong>Order ID:</strong> {order.orderID}
        </p>
        <p>
          <strong>Product Name:</strong> {order.productName}
        </p>
        <p>
          <strong>Quantity:</strong> {order.quantity}
        </p>
        <p>
          <strong>Price:</strong> ${order.price}
        </p>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        <p>
          <strong>Customer Name:</strong> {order.customerName}
        </p>
        <p>
          <strong>Customer Email:</strong> {order.customerEmail}
        </p>
        <p>
          <strong>Shipping Address:</strong> {order.shippingAddress}
        </p>
      </div>
    </div>
  );
};

export default AdminOrders;