import React, { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "../../CSS/MerchantOrders.css";
import { FaPrint, FaSearch, FaEdit } from "react-icons/fa";
import { FetchMerchants, GetMerchantOrders, GetOrderDetails } from "../../Data";
import OrderModal from '../OrderModal';

const MerchantOrders = () => {
  const { merchantId, orderID } = useParams();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState({
    orderID: "",
    productName: "",
    status: "",
    time: "",
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [merchants, setMerchants] = useState([]);

  const [orderStatus] = useState([
    "Processing",
    "Pending Confirmation",
    "Waiting to be Shipped",
    "Shipped",
    "Available For Pickup",
    "Delivered",
    "Return In Progress",
    "Returned",
    "Refunded"
  ]);
  useEffect(() => {
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
    GetAllMerchants();
  }, []);

  const fetchOrders = async (merchantId, orderID) => {
    try {
      const requestData = {
        MerchantId: merchantId,
        OrderID: orderID === "null" ? "" : orderID
      };
      const response = await GetMerchantOrders(requestData);
      if (response.length > 0) {
        setOrders(response);
        setFilteredOrders(response);
      } else {
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

  useEffect(() => {
    if (merchantId) {
      fetchOrders(merchantId, orderID);
    }
  }, [merchantId, orderID]);

  const handleGridSearch = () => {
    const { orderID, productName, status } = searchQuery;
    const filtered = orders.filter((order) => {
      const matchesOrderID = orderID ? order.orderId.toString().includes(orderID) : true;
      const matchesProductName = productName ? new RegExp(productName, "i").test(order.productName.toString()) : true;
      const matchesStatus = status ? order.status === status : true;
      return matchesOrderID && matchesProductName && matchesStatus;
    });
    setFilteredOrders(filtered);
  };

  const handleEditOrder = (order) => {
    setUpdateModalOpen(true);
  };

  const handleViewOrderDetails = async (OrderId) => {
    try {
      const orderDetails = await GetOrderDetails(OrderId);
      if (orderDetails.length > 0) {
        setSelectedOrder(orderDetails[0]);
        setModalOpen(true);
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

  const handleUpdateOrderStatus = (status) => {
    // Implement the logic to update the order status
    console.log("Updating order status to:", status);
    setUpdateModalOpen(false);
  };

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
          onClick={() => handleEditOrder(params.row)}
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

      <div className="full-search-container">
        <input
          type="text"
          placeholder="Order ID"
          className="full-search-input"
          value={searchQuery.orderID}
          onChange={(e) => setSearchQuery({ ...searchQuery, orderID: e.target.value })}
        />
        <input
          type="text"
          placeholder="Product Name"
          className="full-search-input"
          value={searchQuery.productName}
          onChange={(e) => setSearchQuery({ ...searchQuery, productName: e.target.value })}
        />
        <select
          className="full-search-dropdown"
          value={searchQuery.status}
          onChange={(e) => setSearchQuery({ ...searchQuery, status: e.target.value })}
        >
          <option value="">--Status--</option>
          {orderStatus.map((status, index) => (
            <option key={index} value={status}>{status}</option>
          ))}
        </select>
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
        <button onClick={handleGridSearch} className="full-search-button">
          <FaSearch /> Search
        </button>
      </div>

      <div className="data-grid-container">
        <DataGrid
          rows={filteredOrders}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          checkboxSelection
          getRowId={(row) => row.orderId}
        />
      </div>

      {isModalOpen && selectedOrder && (
        <OrderModal
          show={isModalOpen}
          onClose={() => setModalOpen(false)}
          order={selectedOrder}
        />
      )}

      {isUpdateModalOpen && (
        <UpdateOrderModal
          show={isUpdateModalOpen}
          onClose={() => setUpdateModalOpen(false)}
          onUpdate={handleUpdateOrderStatus}
        />
      )}
    </div>
  );
};

const UpdateOrderModal = ({ show, onClose, onUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [orderStatus] = useState([
    "Processing",
    "Pending Confirmation",
    "Waiting to be Shipped",
    "Shipped",
    "Available For Pickup",
    "Delivered",
    "Return In Progress",
    "Returned",
    "Refunded"
  ]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    {/* Modal Container */}
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4">Update Order Status</h2>

      {/* Status Dropdown */}
      <select
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
      >
        <option value="">Select Status</option>
        {orderStatus.map((status, index) => (
          <option key={index} value={status}>
            {status}
          </option>
        ))}
      </select>

      {/* Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="bg-blue-300 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={() => onUpdate(selectedStatus)}
        >
          Update
        </button>
      </div>
    </div>
  </div>
  );
};

export default MerchantOrders;