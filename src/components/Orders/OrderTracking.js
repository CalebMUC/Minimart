import React from "react";
import { FaShippingFast, FaCheckCircle, FaBox, FaHome } from "react-icons/fa";

const OrderTracking = () => {
  const orderStatus = "Shipped"; // Example status

  const statusSteps = [
    { 
      label: "Order Placed", 
      icon: <FaHome />, 
      completed: true,
      date: "18/3/2025",
      message: "Product has been successfully placed in order."
    },
    { 
      label: "Packed", 
      icon: <FaBox />,
      completed: orderStatus === "Packed" || orderStatus === "Shipped" || orderStatus === "Delivered",
      date: "19/3/2025",
      message: "Product has been packed and is ready to be shipped."
    },
    { 
      label: "Shipped", 
      icon: <FaShippingFast />,
      completed: orderStatus === "Shipped" || orderStatus === "Delivered",
      date: "20/3/2025",
      message: "Product has been shipped and is in transit."
    },
    { 
      label: "Available for Pickup", 
      icon: <FaShippingFast />, 
      completed: orderStatus === "Pickup" || orderStatus === "Delivered",
      date: "21/3/2025",
      message: "Product is ready for pickup."
    },
    { 
      label: "Delivered", 
      icon: <FaCheckCircle />, 
      completed: orderStatus === "Delivered",
      date: "22/3/2025",
      message: "Product has been delivered to the client in good condition."
    },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto">
        
        {/* Order Details */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Order #273</h1>
          <p className="text-gray-500">Placed on 02/12/2025, 11:42</p>

          {/* Order Status Steps - Arranged Horizontally */}
          <div className="mt-6 relative flex items-center justify-between">
            {statusSteps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center">
                
                {/* Step Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md 
                  ${step.completed ? "bg-green-500 text-white" : "bg-gray-300 text-gray-500"}`}>
                  {step.icon}
                </div>

                {/* Step Label & Date */}
                <div className="flex flex-col items-center mt-2">
                  <span className={`text-md font-medium ${step.completed ? "text-green-600" : "text-gray-500"}`}>
                    {step.label}
                  </span>
                  <span className="text-sm text-gray-400">{step.date}</span>
                  {step.completed && <FaCheckCircle className="text-green-500 text-lg mt-1" />}
                </div>

                {/* Horizontal Connector Line */}
                {index !== statusSteps.length - 1 && (
                  <div className="absolute left-full top-6 w-24 h-1 bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Messages Section - Styled Like SMS Chat Bubbles */}
        <div className="mt-6 bg-white shadow-lg rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Tracking Updates</h2>
          <div className="flex flex-col space-y-4">
            {statusSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-4">
                
                {/* Message Icon */}
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 shadow-md">
                  {step.icon}
                </div>

                {/* Message Bubble */}
                <div className={`p-4 text-sm rounded-lg shadow-md max-w-sm ${step.completed ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"} relative`}>
                  <p>{step.message}</p>
                  <span className="text-xs text-gray-500 block mt-2">{step.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderTracking;