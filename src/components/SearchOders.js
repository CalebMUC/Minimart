import React from 'react';

const SearchOrders = ({ onSearch }) => {
  const [query, setQuery] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="search-orders">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search all orders"
      />
      <button onClick={handleSearch}>Search Orders</button>
    </div>
  );
};

export default SearchOrders;
