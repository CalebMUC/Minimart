import React, { useState, useEffect } from 'react';
import Tabs from './Tabs';
import OrderList from './OrderList';
import SearchOrders from './SearchOders';
import packageInfo from '../../package.json';

const OrderStatusEnum = {
  PROCESSING: { value: 2, display: 'Processing', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
  NOT_YET_SHIPPED: { value: 2, display: 'Not Yet Shipped', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
  SHIPPED: { value: 3, display: 'Shipped', color: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
  DELIVERED: { value: 4, display: 'Delivered', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
  CANCELLED: { value: 5, display: 'Cancelled', color: 'bg-red-100 text-red-800 hover:bg-red-200' },
  RETURNED: { value: 6, display: 'Returned', color: 'bg-orange-100 text-orange-800 hover:bg-orange-200' },
};

const fetchOrdersByTab = async (tab) => {
  const statusEnum = {
    'Orders': OrderStatusEnum.PROCESSING.value,
    'Not Yet Shipped': OrderStatusEnum.NOT_YET_SHIPPED.value,
    'Shipped': OrderStatusEnum.SHIPPED.value,
    'Delivered Orders': OrderStatusEnum.DELIVERED.value,
    'Returned Orders': OrderStatusEnum.RETURNED.value,
    'Cancelled Orders': OrderStatusEnum.CANCELLED.value,
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
        userID: parseInt(localStorage.getItem('userID'))
      })
    });
    
    if (!response.ok) throw new Error('Failed to fetch orders');
    return await response.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

const StatusBadge = ({ status }) => {
  const statusInfo = Object.values(OrderStatusEnum).find(s => s.value === status);
  
  if (!statusInfo) return null;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color} transition-colors duration-200`}>
      {statusInfo.display}
    </span>
  );
};

const ReturnsAndOrdersPage = () => {
  const [selectedTab, setSelectedTab] = useState('Orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('3 months');

  const tabs = ['Orders', 'Buy Again', 'Not Yet Shipped', 'Cancelled Orders', 'Returned Orders', 'Delivered Orders'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchOrdersByTab(selectedTab);
        setOrders(response);
      } catch (err) {
        setError('Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTab, timeRange]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Orders</h1>
        
        <Tabs tabs={tabs} selectedTab={selectedTab} onSelect={setSelectedTab} />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-auto">
            <select
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="3 months">Past 3 months</option>
              <option value="6 months">Past 6 months</option>
              <option value="1 year">Past year</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>

          <SearchOrders 
            onSearch={(query) => {
              // Implement search functionality
            }} 
            className="w-full sm:w-auto"
          />
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {orders.length > 0 ? (
              <OrderList orders={orders} StatusBadge={StatusBadge} />
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No {selectedTab} available</h3>
                <p className="mt-1 text-sm text-gray-500">You don't have any {selectedTab.toLowerCase()} in the past {timeRange}.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReturnsAndOrdersPage;