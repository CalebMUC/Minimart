import React from 'react';

const Tabs = ({ tabs, selectedTab, onSelect }) => {
  return (
    <div className="flex space-x-6 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ${
            selectedTab === tab
              ? 'border-yellow-500 text-yellow-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => onSelect(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;