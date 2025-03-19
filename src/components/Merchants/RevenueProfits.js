import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

// Pie chart data
const pieChartData = {
  labels: ["Revenue", "Profit", "Expenses"],
  datasets: [
    {
      label: "Amount ($)",
      data: [12000, 8000, 4000],
      backgroundColor: [
        "rgba(75, 192, 192, 0.6)",
        "rgba(255, 99, 132, 0.6)",
        "rgba(54, 162, 235, 0.6)",
      ],
      borderColor: [
        "rgba(75, 192, 192, 1)",
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

// Pie chart options
const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Revenue vs Profit",
    },
  },
};

const RevenueProfits = () => {
  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Revenue & Profits</h2>
      <div style={{ height: "400px" }}>
        <Pie data={pieChartData} options={pieChartOptions} />
      </div>
    </div>
  );
};

export default RevenueProfits;