import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchInput, setSearchInput] = useState('');
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    const handleSearch = () => {
        onSearch(searchInput);
    };
    return (

        <div className="search-input">
            <input
                type="text"
                placeholder="Search for music..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
        </div>

    );
};

export default SearchBar;
