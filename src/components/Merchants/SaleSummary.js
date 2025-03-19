import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Line chart data
const lineChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Sales",
      data: [65, 59, 80, 81, 56, 55, 40],
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      fill: true,
    },
  ],
};

// Line chart options
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Monthly Sales Trend",
    },
  },
};

const SaleSummary = () => {
  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Sales Summary</h2>
      <div style={{ height: "400px" }}>
        <Line data={lineChartData} options={lineChartOptions} />
      </div>
    </div>
  );
};

export default SaleSummary;