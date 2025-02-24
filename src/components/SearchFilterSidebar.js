import React, { useEffect, useState } from "react";
import Slider from "react-slider";
import "../../src/CSS/SearchFilterSideBar.css";

const SearchFilterSidebar = ({ features, setFilters }) => {
  const [priceRange, setPriceRange] = useState([0, 0]);

  // Extract and set min/max price from features
  useEffect(() => {
    const maxPriceFeature = features.find((feature) => feature.featureName === "MaxPrice");
    const minPriceFeature = features.find((feature) => feature.featureName === "MinPrice");

    if (maxPriceFeature && minPriceFeature) {
      const maxPrice = maxPriceFeature.featureOptions.options[0];
      const minPrice = minPriceFeature.featureOptions.options[0];

      setPriceRange([minPrice, maxPrice]);
    }
  }, [features]);

  // Update filters based on user selection
  const handleFilterChange = (filterType, value, isChecked) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev };

      if (isChecked) {
        // Add the filter value
        updatedFilters[filterType] = updatedFilters[filterType]
          ? [...updatedFilters[filterType], value]
          : [value];
      } else {
        // Remove the filter value
        updatedFilters[filterType] = updatedFilters[filterType]?.filter((item) => item !== value);
        if (!updatedFilters[filterType]?.length) delete updatedFilters[filterType];
      }

      return updatedFilters;
    });
  };

  // Update price range filter
  const handlePriceChange = (value) => {
    setPriceRange(value);
    setFilters((prev) => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1],
    }));
  };

  return (
    <div className="sidebar-search-page">
      <h3>Filters</h3>

      {/* Price Range Filter */}
      <div className="filter-section">
        <h4>Price Range</h4>
        <div className="slider-container">
          {/* Display selected price range */}
          <div className="price-range-display">
            <span>${priceRange[0]}</span> – <span>${priceRange[1]}</span>
          </div>

          {/* Price Range Slider */}
          <Slider
            value={priceRange}
            min={priceRange[0]}
            max={priceRange[1]}
            step={1}
            onChange={handlePriceChange}
            renderThumb={(props) => <div {...props} className="slider-thumb" />}
            renderTrack={(props, state) => (
              <div
                {...props}
                className={`slider-track ${state.index === 0 ? "left" : "right"}`}
              />
            )}
          />
        </div>
      </div>

      {/* Feature Filters */}
      {features
        .filter((feature) => feature.featureName !== "MaxPrice" && feature.featureName !== "MinPrice")
        .map((feature) => (
          <div key={feature.featureName} className="filter-section">
            <h4>{feature.featureName}</h4>
            <ul>
              {feature.featureOptions.options.map((option) => (
                <li key={option}>
                  <input
                    type="checkbox"
                    value={option}
                    onChange={(e) =>
                      handleFilterChange(feature.featureName, e.target.value, e.target.checked)
                    }
                  />
                  {option}
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
};

export default SearchFilterSidebar;
