import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        if (query) {
            onSearch(query);
            setQuery('');
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <TextField
                label="Search for music videos"
                variant="outlined"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ flexGrow: 1, marginRight: '10px' }}
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>
                Search
            </Button>
        </div>
    );
};

export default SearchBar;