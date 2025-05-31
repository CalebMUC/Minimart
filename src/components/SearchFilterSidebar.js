import React, { useEffect, useState } from "react";
import Slider from "react-slider";

const SearchFilterSidebar = ({ features, setFilters, currentFilters,  priceRange,
  setPriceRange
 }) => {
  // const [priceRange, setPriceRange] = useState([10000, 200000]);
  const [tempPriceRange, setTempPriceRange] = useState([10000, 200000]);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    const maxPriceFeature = features.find(f => f.featureName === "MaxPrice");
    const minPriceFeature = features.find(f => f.featureName === "MinPrice");

    if (maxPriceFeature && minPriceFeature) {
      const maxPrice = Math.ceil(Number(maxPriceFeature.featureOptions.options[0])) || 200000;
      const minPrice = Math.floor(Number(minPriceFeature.featureOptions.options[0])) || 10000;
      setPriceRange([minPrice, maxPrice]);
      setTempPriceRange([minPrice, maxPrice]); 
    }
  }, [features]);

  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const handlePriceChange = (value) => {
    setTempPriceRange(value);
  };

  const applyPriceFilter = () => {
    setPriceRange(tempPriceRange);
    // setFilters(prev => ({
    //   ...prev,
    //   minPrice: tempPriceRange[0],
    //   maxPrice: tempPriceRange[1]
    // }));
  };

  const handleFilterChange = (filterType, value, isChecked) => {
    setFilters(prev => {
      const updated = { ...prev };
      
      if (isChecked) {
        updated[filterType] = updated[filterType] 
          ? [...updated[filterType], value] 
          : [value];
      } else {
        updated[filterType] = updated[filterType]?.filter(v => v !== value);
        if (!updated[filterType]?.length) delete updated[filterType];
      }
      
      return updated;
    });
  };

  const isChecked = (featureName, option) => {
    return currentFilters[featureName]?.includes(option) || false;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Filters</h2>
      
      {/* Price Filter with Apply Button */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('price')}
        >
          <h3 className="font-medium">Price</h3>
          <span>{expandedSections['price'] ? '−' : '+'}</span>
        </div>
        
        {expandedSections['price'] !== false && (
          <div className="mt-3">
            <Slider
              value={tempPriceRange}
              min={priceRange[0]}
              max={priceRange[1]}
              step={1}
              onChange={handlePriceChange}
              className="mb-2"
              thumbClassName="bg-blue-500 w-4 h-4 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300"
              trackClassName="bg-gray-200 h-1 rounded"
            />
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span className="py-5">KES {tempPriceRange[0].toLocaleString()}</span>
              <span className="py-5">KES {tempPriceRange[1].toLocaleString()}</span>
            </div>
            <button
              onClick={applyPriceFilter}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
            >
              Apply Price
            </button>
          </div>
        )}
      </div>

      {/* Other Filters */}
      {features
        .filter(f => !['MaxPrice', 'MinPrice'].includes(f.featureName))
        .map(feature => (
          <div key={feature.featureName} className="mb-6">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection(feature.featureName)}
            >
              <h3 className="font-medium">{feature.featureName}</h3>
              <span>{expandedSections[feature.featureName] ? '−' : '+'}</span>
            </div>
            
            {expandedSections[feature.featureName] !== false && (
              <ul className="mt-2 space-y-2">
                {feature.featureOptions.options.map(option => (
                  <li key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`${feature.featureName}-${option}`}
                      checked={isChecked(feature.featureName, option)}
                      onChange={(e) => handleFilterChange(
                        feature.featureName, 
                        option, 
                        e.target.checked
                      )}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label 
                      htmlFor={`${feature.featureName}-${option}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
    </div>
  );
};

export default SearchFilterSidebar;