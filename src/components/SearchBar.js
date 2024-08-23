import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-bar">
      <label htmlFor="search">Search: </label>
      <input
        type="text"
        id="search"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search by product name..."
      />
    </div>
  );
};

export default SearchBar;
