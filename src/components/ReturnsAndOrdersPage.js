import React, { useState, useEffect, useCallback } from 'react';
import Tabs from './Tabs';
import OrderList from './OrderList';
import SearchOrders from './SearchOders';
import { GetOrders } from '../Data';

const OrderStatusEnum = {
  PROCESSING: { value: 1, display: 'Processing', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
  NOT_YET_SHIPPED: { value: 2, display: 'Not Yet Shipped', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
  SHIPPED: { value: 3, display: 'Shipped', color: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
  DELIVERED: { value: 4, display: 'Delivered', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
  CANCELLED: { value: 5, display: 'Cancelled', color: 'bg-red-100 text-red-800 hover:bg-red-200' },
  RETURNED: { value: 6, display: 'Returned', color: 'bg-orange-100 text-orange-800 hover:bg-orange-200' },
};

const fetchOrdersByTab = async (tab) => {
  const statusEnum = {
    'Orders': OrderStatusEnum.PROCESSING.value,
    'Buy Again': null,
    'Not Yet Shipped': OrderStatusEnum.NOT_YET_SHIPPED.value,
    'Shipped': OrderStatusEnum.SHIPPED.value,
    'Delivered Orders': OrderStatusEnum.DELIVERED.value,
    'Returned Orders': OrderStatusEnum.RETURNED.value,
    'Cancelled Orders': OrderStatusEnum.CANCELLED.value,
  }[tab];

  try {
    const requestData = {
      status: statusEnum, 
      userID: parseInt(localStorage.getItem('userID'))
    };
    const response = await GetOrders(requestData);
    return response;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

const StatusBadge = ({ status }) => {
  const statusInfo = Object.values(OrderStatusEnum).find(s => s.value === status);
  if (!statusInfo) return null;

  return (
    <span 
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color} transition-colors duration-200`}
    >
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
  const [filteredOrders, setFilteredOrders] = useState([]);

  const tabs = ['Orders', 'Buy Again', 'Not Yet Shipped', 'Cancelled Orders', 'Returned Orders', 'Delivered Orders'];

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let response = await fetchOrdersByTab(selectedTab);
      if (selectedTab === 'Buy Again') {
        response = response.filter(order => 
          order.status === OrderStatusEnum.DELIVERED.value && 
          order.isReorderable
        );
      }
      setOrders(response);
      setFilteredOrders(response);
    } catch (err) {
      setError('Failed to fetch orders. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedTab, timeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = useCallback((query) => {
    if (!query.trim()) {
      setFilteredOrders(orders);
      return;
    }
    const lowerCaseQuery = query.toLowerCase();
    const filtered = orders.filter(order => 
      order.id.toString().includes(lowerCaseQuery) ||
      order.productName.toLowerCase().includes(lowerCaseQuery) ||
      order.status.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredOrders(filtered);
  }, [orders]);

  const handleTimeRangeChange = useCallback((newRange) => {
    setTimeRange(newRange);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8 font-sans">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Your Orders</h1>
        
        {/* Tabs with horizontal scroll on mobile */}
        <div className="overflow-x-auto mb-4 sm:mb-6">
          <div className="border-b border-gray-200 min-w-max sm:min-w-0">
            <Tabs 
              tabs={tabs} 
              selectedTab={selectedTab} 
              onSelect={setSelectedTab} 
              className="flex space-x-2 sm:space-x-6"
            />
          </div>
        </div>

        {/* Filters and search - stacked on mobile */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
          <div className="relative w-full sm:w-48">
            <select
              id="timeRange"
              className="block w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
            >
              <option value="3 months">Past 3 months</option>
              <option value="6 months">Past 6 months</option>
              <option value="1 year">Past year</option>
              <option value="2025">2025</option>
            </select>
          </div>

          <SearchOrders 
            onSearch={handleSearch} 
            className="w-full sm:w-64"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 mb-4 sm:mb-6 text-sm sm:text-base">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <>
            {filteredOrders.length > 0 ? (
              <OrderList orders={filteredOrders} StatusBadge={StatusBadge} />
            ) : (
              <div className="text-center py-8 sm:py-12">
                <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-base sm:text-lg font-medium text-gray-900">No {selectedTab} available</h3>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                  {selectedTab === 'Buy Again' ? 
                    "You don't have any items available to buy again." :
                    `You don't have any ${selectedTab.toLowerCase()} in the past ${timeRange}.`
                  }
                </p>
                {timeRange === '3 months' && (
                  <button 
                    onClick={() => setTimeRange('2025')}
                    className="mt-3 px-3 py-1.5 sm:px-4 sm:py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-xs sm:text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    View orders in 2025
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(ReturnsAndOrdersPage);