import React, { useState, useEffect } from 'react';
import Tabs from './Tabs';
import OrderList from './OrderList';
import SearchOrders from './SearchOders';
import '../../src/CSS/OrderReturns.css';
import packageInfo from '../../package.json';

const OrderStatusEnum = {
  PROCESSING: 1,
  NOT_YET_SHIPPED: 2,
  SHIPPED: 3,
  DELIVERED: 4,
  CANCELLED: 5,
  RETURNED: 6,
  // Add other statuses as needed
};

// Example API fetch function (replace with your real API call)
const fetchOrdersByTab = async (tab) => {
  // Map tab to the enum value
  const statusEnum = {
    'Orders': OrderStatusEnum.PROCESSING,
    'Not Yet Shipped': OrderStatusEnum.NOT_YET_SHIPPED,
    'Shipped': OrderStatusEnum.SHIPPED,
    'Delivered Orders': OrderStatusEnum.DELIVERED,
    'Returned Orders': OrderStatusEnum.RETURNED,
    'Cancelled Orders': OrderStatusEnum.CANCELLED,
  }[tab];

  try {
    const response = await fetch(packageInfo.urls.GetOrders, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "*/*"
      },
      body: JSON.stringify({
        status: statusEnum, 
        userID: parseInt(localStorage.getItem('userID')) // Pass both statusEnum and userID
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    
    const orders = await response.json();
    return orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
    
};

// Mock orders in case of testing
const ordersMock = {
  Orders: [{ id: 1, 
    orderDate: '2024-09-20', 
    status: 'Shipped', 
    total: 120.99,
  products: [
                {
                    "productID": "COLA1725806633595",
                    "productName": "jumper Laptop, 16 Inch Laptops, Alder Lake-N100 Quad Core CPU(Up to 3.4GHz), 16GB RAM 512GB SSD, Notebook Computer with FHD IPS 1920x1200 Display, 4 Speakers, 38WH Battery, Cooling System, USB3.0*2.",
                    "quantity": 1,
                    "price": 400000,
                    "deliveryFee": 0
                },
                {
                    "productID": "EL001726321123981",
                    "productName": "[Auto Focus/4K Support] Projector with WiFi 6 and Bluetooth 5.2, YABER Pro V9 600 ANSI Native 1080P Outdoor Movie Projector, Auto 6D Keystone & 50% Zoom, Home Theater Projector for Phone/TV Stick/PC",
                    "quantity": 1,
                    "price": 120000,
                    "deliveryFee": 0
                },
                {
                    "productID": "EL001726321536511",
                    "productName": "Compressed Air Duster, 3-Gear to 100000RPM Electric Air Duster Portable Cordless Air Blower with LED Light, for Cleaning Keyboard & PC, Air Cleaning Kit-no Canned air dusters-Rechargeable (Black)",
                    "quantity": 1,
                    "price": 45000,
                    "deliveryFee": 0
                }
            ],
            shippingAddress: {
                "Name": "Dennis Muchiri",
                "address": "undefined",
                "county": "Nairobi",
                "town": "Nairobi",
                "postalCode": "09890"
            },
            paymentDetails: [
                {
                    "paymentID": 1,
                    "paymentReference": "0794129559",
                    "amount": 565000
                }
            ],
           }],
  'Buy Again': [],
  'Not Yet Shipped': [{ id: 2, orderDate: '2024-09-25', status: 'Processing', total: 89.99 }],
  'Cancelled Orders': [],
};

// Main component
const ReturnsAndOrdersPage = () => {
  const [selectedTab, setSelectedTab] = useState('Orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tabs = ['Orders', 'Buy Again', 'Not Yet Shipped', 'Cancelled Orders', 'Returned Orders', 'Delivered Orders'];

  // Fetch data when tab changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null); // Clear any previous error

      try {
        const response = await fetchOrdersByTab(selectedTab);
         setOrders(response);
        
      } catch (err) {
        setError('Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchMockData = () =>{
      setLoading(true);
      setError(null);
      try{
        //await new Promise((resolve) => setTimeout(resolve,500));
        const mockData= ordersMock[selectedTab] || [];
        setOrders(mockData);
      }catch(err){
        setError("Failed");
      }finally{
        setLoading(false)
      }
    }
    //fetchMockData();
    fetchData();
  }, [selectedTab]);

  return (
    <div className="orders-page">
      <h1>Your Orders</h1>
      <Tabs tabs={tabs} selectedTab={selectedTab} onSelect={setSelectedTab} />

      <div className="orders-controls">
        <select className="order-time-range">
          <option>Past 3 months</option>
          <option>Past 6 months</option>
          <option>Past year</option>
        </select>

        <SearchOrders onSearch={(query) => { /* Handle search query */ }} />
      </div>

      {loading && <p>Loading {selectedTab}...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <>
          {orders.length > 0 ? (
            <OrderList orders={orders} />
          ) : (
            <p>No {selectedTab} available</p>
          )}
        </>
      )}

 
    </div>
  );
};

export default ReturnsAndOrdersPage;
