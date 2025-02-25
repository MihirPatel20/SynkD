// src/components/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import createYoutubeApiInstance from '../services/youtubeApi';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  
  useEffect(() => {
    const tokens = JSON.parse(localStorage.getItem('yt_tokens'));
    const youtubeApi = createYoutubeApiInstance(tokens.access_token);
    
    const fetchPlaylists = async () => {
      try {
        const userPlaylists = await youtubeApi.getUserPlaylists();
        setPlaylists(userPlaylists);
      } catch (error) {
        console.error('Error fetching playlists:', error);
        if (error.response?.status === 401) {
          // Handle token expiration
          logout();
        }
      }
    };

    fetchPlaylists();
  }, []);

  return (
    <div>
      <h1>Welcome {user.name}</h1>
      <button onClick={logout}>Logout</button>
      
      <h2>Your Playlists</h2>
      {playlists.map(playlist => (
        <div key={playlist.id}>
          <h3>{playlist.snippet.title}</h3>
          <p>{playlist.snippet.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
