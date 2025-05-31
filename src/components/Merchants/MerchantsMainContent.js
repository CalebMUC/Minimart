import React from "react";
import SaleSummary from "../Merchants/SaleSummary";
import RevenueProfits from "../Merchants/RevenueProfits";
import { Line, Bar } from "react-chartjs-2";
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
import { title } from "process";

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

const MerchantsMainContent = () => {
  // Data for Recent Sales (Line Chart)
  const recentSalesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Sales ($)",
        data: [1200, 1900, 3000, 2500, 2000, 3000, 3500],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

   // Data for Order Status (Line Chart)
   const orderData = [
    { month: "Jan", Delivered: 50, Cancelled: 20, Returned: 10 },
    { month: "Feb", Delivered: 40, Cancelled: 10, Returned: 5 },
    { month: "Mar", Delivered: 30, Cancelled: 10, Returned: 6 },
  ];
  const lineChartData = {
    labels: orderData.map((order) => order.month),
    datasets: [
      {
        label: "Delivered",
        data: orderData.map((order) => order.Delivered),
        borderColor: "#007bff", // Brighter blue
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        tension: 0.4,
        fill: true,
        pointStyle: "circle",
        pointBorderColor: "#007bff",
      },
      {
        label: "Cancelled",
        data: orderData.map((order) => order.Cancelled),
        borderColor: "#dc3545", // Darker red for better contrast
        backgroundColor: "rgba(220, 53, 69, 0.2)",
        tension: 0.4,
        fill: true,
        pointStyle: "rect",
        pointBorderColor: "#dc3545",
      },
      {
        label: "Returned",
        data: orderData.map((order) => order.Returned),
        borderColor: "#ffc107", // Brighter yellow
        backgroundColor: "rgba(255, 193, 7, 0.2)",
        tension: 0.4,
        fill: true,
        pointStyle: "triangle",
        pointBorderColor: "#ffc107",
      },
    ],
  };
  

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            weight: "bold",
          },
          boxWidth: 20, // Adjusts legend box size
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 16,
        },
      },
    },
    elements: {
      line: {
        borderWidth: 3, // Thicker lines
      },
      point: {
        radius: 5, // Bigger markers for visibility
        hoverRadius: 8, // Enlarges points on hover
        backgroundColor: "white", // White fill for contrast
        borderWidth: 3,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        ticks: {
          font: {
            size: 12,
          },
          autoSkip: false,
          maxRotation: 30, // Rotates labels for better readability
          minRotation: 30,
        },
        grid: {
          display: false, // Removes x-axis grid for clarity
        },
      },
      y: {
        title: {
          display: true,
          text: "Orders",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        ticks: {
          font: {
            size: 12,
          },
          stepSize: 10, // Controls interval between values
          beginAtZero: true,
        },
        grid: {
          color: "rgba(200, 200, 200, 0.2)", // Light grid lines for better readability
        },
      },
    },
  };
  
  

  // Data for Revenue and Profit (Bar Chart)
  const revenueProfitData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Revenue ($)",
        data: [5000, 7000, 8000, 6000, 9000, 10000, 12000],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Profit ($)",
        data: [2000, 3000, 4000, 2500, 5000, 6000, 8000],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  // Data for Best Selling Products (Table)
  const bestSellingProducts = [
    { id: 1, name: "Wool Shirt Heavy", unitsSold: 643 },
    { id: 2, name: "Wool Long Sleeve", unitsSold: 234 },
    { id: 3, name: "Wool Shorts", unitsSold: 78 },
    { id: 4, name: "Wool Socks", unitsSold: 45 },
  ];

  // Data for Order Status (Table)
  const orderStatus = [
    { id: 1, orderId: "ORD123", status: "Shipped", date: "2023-10-01" },
    { id: 2, orderId: "ORD124", status: "Pending", date: "2023-10-02" },
    { id: 3, orderId: "ORD125", status: "Delivered", date: "2023-10-03" },
    { id: 4, orderId: "ORD126", status: "Returned", date: "2023-10-04" },
  ];

  // Data for Customer Feedback (Table)
  const customerFeedback = [
    { id: 1, customer: "John Doe", rating: 4.5, comment: "Great product!" },
    { id: 2, customer: "Jane Smith", rating: 3.8, comment: "Good quality." },
    { id: 3, customer: "Alice Johnson", rating: 5.0, comment: "Excellent service." },
  ];

  const salesVolumeData = {
    labels: ["Oct 1", "Oct 2", "Oct 3", "Oct 4", "Oct 5", "Oct 6", "Oct 7"],
    datasets: [
      {
        label: "Sales Volume",
        data: [500, 700, 900, 1200, 800, 1000, 1254],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };
    // Metrics for Total Orders
    const totalOrders = 45;
    const deliveredPercentage = (35 / totalOrders) * 100; // Example: 35 delivered orders
    const cancelledPercentage = (5 / totalOrders) * 100; // Example: 5 cancelled orders
    const returnedPercentage = (5 / totalOrders) * 100; // Example: 5 returned orders

  return (
    <div className="container mx-auto p-6 bg-gray-100">
      <div className="flex bg-white justify-between shadow-lg mb-1">
        <h2 className="text-xl font-bold">OverView Dashboard</h2>
      </div>
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recent Sales */}
        <div className="bg-white p-6 shadow rounded-lg">
        <div className="flex text-blue-600 hover:text-blue-200 justify-end ">
            <span>View Report</span>
            </div>
          <h2 className="text-xl font-bold mb-4">Recent Sales</h2>
          <div className="h-64">
            <Line
              data={recentSalesData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* Total Monthly Sales */}
        {/* <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-bold mb-4">Total Monthly Sales</h2>
          <p className="text-3xl font-bold">$12,000</p>
          <p className="text-green-600">↑ 7.0%</p>
        </div> */}
          <div className="bg-white p-6 shadow rounded-lg">
            <div className="flex text-blue-600 hover:text-blue-200 justify-end ">
            <span>View Report</span>
            </div>
      {/* Total Sales Amount */}
      <h2 className="text-2xl font-bold">Total Monthly Sales</h2>
      <h2 className="text-2xl font-bold">$1,254</h2>
      <p className="text-gray-600">Today</p>

      {/* Comparison with Last Week */}
      <div className="mt-4">
        <p className="text-green-600 font-semibold">
          +229 vs same day last week
        </p>
      </div>

      {/* Sales Volume Chart */}
      <div className="mt-6">
        
        <h3 className="text-lg font-semibold mb-2">Sales Volume</h3>
        <div className="h-40">
          <Bar
            data={salesVolumeData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                },
                y: {
                  grid: {
                    display: false,
                  },
                  ticks: {
                    stepSize: 500,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>

    <div className="bg-white p-6 shadow rounded-lg">
    <div className="flex text-blue-600 hover:text-blue-200 justify-end ">
            <span>View Report</span>
            </div>
          <h2 className="text-xl font-bold mb-4">Total Orders</h2>
          <p className="text-3xl font-bold">{totalOrders}</p>

          {/* Metrics */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <p className="text-green-600">Delivered</p>
              <p className="text-green-600">{deliveredPercentage.toFixed(1)}%</p>
            </div>
            <div className="flex justify-between">
              <p className="text-yellow-600">Cancelled</p>
              <p className="text-yellow-600">{cancelledPercentage.toFixed(1)}%</p>
            </div>
            <div className="flex justify-between">
              <p className="text-red-600">Returned</p>
              <p className="text-red-600">{returnedPercentage.toFixed(1)}%</p>
            </div>
          </div>
            {/* Sales Volume Chart */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Sales Volume</h3>
        <div className="h-40">
          <Bar
            data={lineChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                },
                y: {
                  grid: {
                    display: false,
                  },
                  ticks: {
                    stepSize: 500,
                  },
                },
              },
            }}
          />
        </div>
      </div>
          {/* Line Chart */}
          {/* <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Order Status Trend</h2>
            <div className="h-64">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div> */}
        </div>

        {/* Revenue and Profit Breakdown */}
        <div className="bg-white p-6 shadow rounded-lg col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Revenue and Profit Breakdown</h2>
          <div className="h-64">
            <Bar
              data={revenueProfitData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* Best Selling Products */}
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-bold mb-4">Best Selling Products</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Product</th>
                <th className="text-right">Units Sold</th>
              </tr>
            </thead>
            <tbody>
              {bestSellingProducts.map((product) => (
                <tr key={product.id}>
                  <td className="text-left">{product.name}</td>
                  <td className="text-right">{product.unitsSold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Status */}
        <div className="bg-white p-6 shadow rounded-lg col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Order Status</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Order ID</th>
                <th className="text-left">Status</th>
                <th className="text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orderStatus.map((order) => (
                <tr key={order.id}>
                  <td className="text-left">{order.orderId}</td>
                  <td className="text-left">{order.status}</td>
                  <td className="text-left">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Customer Feedback */}
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-bold mb-4">Customer Feedback</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Customer</th>
                <th className="text-left">Rating</th>
                <th className="text-left">Comment</th>
              </tr>
            </thead>
            <tbody>
              {customerFeedback.map((feedback) => (
                <tr key={feedback.id}>
                  <td className="text-left">{feedback.customer}</td>
                  <td className="text-left">{feedback.rating}</td>
                  <td className="text-left">{feedback.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

       
      </div>
    </div>
  );

};

export default MerchantsMainContent;