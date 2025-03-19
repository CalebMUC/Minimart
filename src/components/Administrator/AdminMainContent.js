import React, {useState} from "react";
import { Line, Bar } from "react-chartjs-2";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"
import { FaCalendarAlt } from 'react-icons/fa'; // Calendar icon

import { useNotifications } from "../Notifications/NotificatonContext";

import {
  FaTachometerAlt,
  FaBell,
  FaChartLine,
  FaUsers,
  FaStore,
  FaShoppingCart,
  FaMoneyBill,
  FaDollarSign,
  FaChartBar,
  FaThumbsUp,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  scales,
} from "chart.js";
import RecentActivity from "./RecentActivity";
import { Link } from "react-router-dom";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminMainContent = () => {
    const {unreadCount,notifications} = useNotifications();
  // Dummy data for demonstration
  const dashboardData = {
    totalSales: 125000,
    totalOrders: { daily: 1200, monthly: 36000 },
    totalMerchants: 450,
    totalUsers: { existing: 10000, new: 500 },
    mostVisitedPage: "Online Store",
    salesByTraffic: { organic: 60000, paid: 40000, social: 25000 },
    revenueBreakdown: { revenue: 150000, profit: 50000 },
    bestPerformingMerchant: "Merchant XYZ",
  };

  const [selectedDate, setSelectedDate] = useState(new Date()); // State to store the selected date
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // State to control calendar visibility
  const [newUsersOnDate,setNewUsersOnDate] = useState(0)
  const [existingUsersOnDate,setExistingUsersOnDate] = useState(0)
  const mockData =[
    { date :   '2025-03-11',existingUsers : 3607,newUsers : 400},
    {date : '2025-03-10' ,existingUsers : 2070,newUsers : 400},
    { date : '2025-03-09',existingUsers : 1600,newUsers : 670},
    { date :   '2025-03-08',existingUsers : 960,newUsers : 400}

]

  const fetchUsers = async (date)=>{

    const datekey = date.toISOString().split('T')[0];
    const selectedData = mockData.find((mockdata)=>mockdata.date == datekey) 
    if(selectedData){
        setExistingUsersOnDate(data.existingUsers || 0)
        setNewUsersOnDate(data.NewUsers || 0)
    }

 
    }
       

  


// Handle date selection
const handleDateChange = (date) => {
    setSelectedDate(date);
    // fetchUsersForDate(date);
    setIsCalendarOpen(false); // Close the calendar after selecting a date

  };
   // Toggle calendar visibility
   const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };
  const visitorsToday = [0, 20, 45, 30, 25, 15, 5]; // Example data
  const visitorsYesterday = [0, 30, 50, 40, 30, 20, 10];

  const data = {
    labels: ["12am", "4am", "8am", "12pm", "4pm", "8pm", "11pm"],
    datasets: [
      {
        label: "Today",
        data: visitorsToday,
        borderColor: "#6D28D9",
        backgroundColor: "rgba(109, 40, 217, 0.2)",
        tension: 0.4,
      },
      {
        label: "Yesterday",
        data: visitorsYesterday,
        borderColor: "#D1D5DB",
        backgroundColor: "rgba(209, 213, 219, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: false } },
    },
  };

  // Data for the Line Chart (Sales Trends)
  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Total Sales",
        data: [50000, 60000, 70000, 80000, 90000, 100000, 125000],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  var SalesOptions = {
    responsive : true,
    maintainAspectRatio : false,
    plugins : {
        legend : {
            display:false
        }
    },
    scales : {
        x : {grid : {display : false}},
        y : {grid : {display : false}}
    }
  }

  // Data for the Bar Chart (Orders Per Month)
  const ordersData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Orders",
        data: [2000, 3000, 4000, 3500, 5000, 4500, 6000],
        borderColor: "#6D28D9",
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        tension : 0.4
      },
    ],
  };
  const orderDataOptions = {
    responsive : true,
    maintainAspectRatio : false,
    plugins :{
        legend :{
            display : false
        }
    },
    scales : {
        x : {grid : {display : false}},
        y : {grid : {display : false}}
    }
  }

  const newMerchants = [5, 10, 15, 25, 20, 30, 40];
  const existingMerchants = [50, 57, 69, 52, 70, 95, 80];
  const exitingMerchants = [2, 4, 3, 5, 6, 4, 3];

  const merchatData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "New Merchants",
        data: newMerchants,
        borderColor: "#34D399",
        backgroundColor: "rgba(52, 211, 153, 0.2)",
        tension: 0.4,
      },
      {
        label: "Existing Merchants",
        data: existingMerchants,
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
      },
      {
        label: "Exiting Merchants",
        data: exitingMerchants,
        borderColor: "#EF4444",
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const merchantOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: false } },
    },
  };

  // Data for the Bar Chart (Sales by Traffic)
  const trafficData = {
    labels: ["Organic", "Paid", "Social"],
    datasets: [
      {
        label: "Sales by Traffic",
       
        data: [
          dashboardData.salesByTraffic.organic,
          dashboardData.salesByTraffic.paid,
          dashboardData.salesByTraffic.social,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
            <Link to="/Notifications/notifications">
             <div className="relative">
                <FaBell className="text-2xl text-gray-600 cursor-pointer hover:text-blue-600" />
                {notifications.length > 0 &&(
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {notifications.length}
                </span>
                )}
             </div>
            </Link>
           
          
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Refresh Data
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

      <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-700">Total online store visitors</h2>
        <a href="#" className="text-blue-600 text-xs">View report</a>
      </div>

      {/* Visitor Count & Percentage Change */}
      <div className="flex items-center mt-2">
        <h1 className="text-3xl font-bold text-gray-900">452</h1>
        <span className="ml-2 text-sm text-red-500">↓ 9.6%</span>
      </div>

      {/* Chart */}
      <div className="h-24 mt-2">
        <Line data={data} options={options} />
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-4 mt-2 text-xs">
        <div className="flex items-center text-gray-400">
          <span className="w-2 h-2 bg-gray-400 rounded-full mr-1"></span>Yesterday
        </div>
        <div className="flex items-center text-purple-600">
          <span className="w-2 h-2 bg-purple-600 rounded-full mr-1"></span>Today
        </div>
      </div>
    </div>
        {/* Total Sales */}
        <div className="bg-white p-6 rounded-lg shadow-md">
           <div className="flex justify-between items-center">
              <h2 className="text-sm  font-semibold text-gray-700">Total Sales</h2>
              <a href="#" className="text-blue-600 text-xs">View report</a>
           </div>
          
          {/* Metrics */}
          <div className="flex items-center mt-2">
            <p className=" text-2xl font-bold  text-gray-600">${dashboardData.totalSales.toLocaleString()}</p>
            <span className="ml-2 text-sm text-Green-500"> 9.6%</span>
          </div>
          {/* Chart */}
          <div className="h-24 mt-2">
            <Line data={salesData} options={SalesOptions}/>
          </div>
          {/* Legend */}
          <div className="flex justify-center space-x-4 text-xs mt-2">
            <div className="flex items-center text-gray-400">
                <span className="w-2 h-2 text-gray-700 rounded-full mr-1"></span>Previous Month
            </div>
          </div>

        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
                <h2 className="text-sm font-semibold text-gray-700">Total Orders</h2>
                <a href="#" className="text-blue-600 text-xs">View report</a>
            </div>
          <div className="flex items-center space-x-4 mt-2">
              <p className="text-gray-600">
                Daily: {dashboardData.totalOrders.daily.toLocaleString()}
                <span className="text-sm ml-2 text-green-500">25%</span>
                <br />
                Monthly: {dashboardData.totalOrders.monthly.toLocaleString()}
                <span className="text-sm ml-2 text-green-500">25%</span>
              </p>
            
          </div>
          {/* Chart */}
          <div className="h-24 mt-2">
           <Line data={ordersData} options={orderDataOptions}/>
          </div>
          <div className="flex justify-center space-x-4 mt-2 text-xs">
            <div className="flex items-center text-gray-400">
                 <span className="w-2 h-2 bg-gray-400 rounded-full mr-1"></span>Last Month
            </div>
            <div className="flex items-center text-purple-600">
                <span className="w-2 h-2 bg-purple-600 rounded-full mr-1"></span>March
            </div>
      </div>

        </div>

        {/* Total Merchants */}
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-700">Merchant Statistics</h2>
        <a href="#" className="text-blue-600 text-xs">View report</a>
      </div>

      {/* Stats Overview */}
      <div className="flex justify-between items-center mt-2">
        <div className="text-green-500">
          <h3 className="text-xl font-bold text-green-700">40 ↑</h3>
          <p className="text-xs">New Merchants</p>
        </div>
        <div className="text-blue-500">
          <h3 className="text-xl font-bold text-green-700">80 ↑</h3>
          <p className="text-xs">Existing Merchants</p>
        </div>
        <div className="text-red-500">
          <h3 className="text-xl font-bold text-red-500">3 ↓</h3>
          {/* criteria tp determine a domant user */}
          <p className="text-xs">Domant Merchants</p> 
        </div>
      </div>

      {/* Chart */}
      <div className="h-42 mt-3">
        <Line data={merchatData} options={merchantOptions} />
      </div>
      <div className="flex items-center text-gray-400">
            <span className="w-2 h-2 bg-gray-400 rounded-full mr-1"></span>Last Month
     </div>
        <div className="flex items-center text-purple-600">
            <span className="w-2 h-2 bg-purple-600 rounded-full mr-1"></span>March
        </div>
    </div>

        {/* Total Users */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
                    <FaUsers className="text-3xl text-orange-600" />
                    <div>
                        <h2 className="text-xl font-bold">Total Users</h2>
                        <div className="text-gray-600 text-sm  mt-2">
                                <div className="flex justify-between items-center">
                                <p className="text-green-400 mr-2">↑ 25%</p>
                                Existing: {dashboardData.totalUsers.existing.toLocaleString()}
                                </div>
                                <div className="flex justify-between items-center">
                                <p className="text-green-400 mr-2">↑ 25%</p>
                                New: {dashboardData.totalUsers.new.toLocaleString()}
                                </div>
                        </div>
                    </div>
                    
            </div>
            <div className="flex flex-end mt-6 relative">
                    <button
                        onClick={toggleCalendar}
                        className="flex items-center text-blue-4    00 hover:text-blue-200 focus:outline-none"
                        >
                        <FaCalendarAlt className="text-2xl" />
                        <span className="ml-2 text-gray-600">Select Date</span>
                        </button>

                        {/* Calendar Popover */}
                        {isCalendarOpen && (
                        <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                            <Calendar
                            onChange={handleDateChange}
                            value={selectedDate}
                            />
                        </div>
                        )}
                    </div>
                    <div className="mt-2">
                        <h3 className="text-gray-700 text-sm font-semibold mb-2">
                            New User Trend
                        </h3>
                        {
                            mockData.map((item,index)=>{
                                const prevUsers = index > 0 ? mockData[index - 1].newUsers : null;
                                const percentChange = prevUsers !== null ?
                                (((item.newUsers - prevUsers)/prevUsers) * 100).toFixed(1)
                                : null;

                                return(
                                    <div key={index} className="flex justify-between text-sm text-gray-600 p-1">
                                        <span className="text-sm">{item.date}</span>
                                        <span className="text-sm">{item.newUsers}</span>
                                        {
                                            percentChange !== null  &&(
                                                <span className={`text-xs font-medium ${
                                                    percentChange >= 0 ? "text-green-600" : "text-red-600"
                                                }`}>
                                                    {percentChange >= 0 ? "↑" : "↓" }{Math.abs(percentChange)}%
                                                </span>
                                            )
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
    </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Line Chart - Sales Trends */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Sales Trends</h2>
          <Line
            data={salesData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Monthly Sales Trends" },
              },
            }}
          />
        </div>

        {/* Bar Chart - Orders Per Month */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Orders Per Month</h2>
          <Bar
            data={ordersData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Monthly Orders" },
              },
            }}
          />
        </div>
      </div>

      {/* Bar Chart - Sales by Traffic */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Sales by Traffic</h2>
        <Bar
          data={trafficData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Sales by Traffic Source" },
            },
          }}
        />
      </div>

      {/* Additional Features Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Additional Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          {/* <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">New user registered: John Doe</li>
              <li className="text-gray-600">Order #1234 placed</li>
              <li className="text-gray-600">Merchant XYZ updated their store</li>
            </ul>
          </div> */}
          <RecentActivity/>

          {/* Top Products */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Top Products</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">Product A - 500 sales</li>
              <li className="text-gray-600">Product B - 450 sales</li>
              <li className="text-gray-600">Product C - 400 sales</li>
            </ul>
          </div>

          {/* System Health */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">System Health</h3>
            <p className="text-gray-600">All systems operational</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMainContent;