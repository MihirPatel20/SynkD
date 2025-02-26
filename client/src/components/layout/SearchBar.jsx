import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <Paper
            component="form"
            onSubmit={handleSearch}
            sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: { xs: '100%', sm: '400px', md: '500px' }
            }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search for music"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <IconButton type="submit" sx={{ p: '10px' }}>
                <SearchIcon />
            </IconButton>
        </Paper>
    );
};

export default SearchBar;