import React, { useState } from 'react';

const Tabs = ({ tabs, selectedTab, onSelect }) => {
  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`tab-button ${selectedTab === tab ? 'active' : ''}`}
          onClick={() => onSelect(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
