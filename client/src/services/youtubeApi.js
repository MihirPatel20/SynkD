import axios from 'axios';

const API_KEY = 'AIzaSyCpt_HkKZA77VDekYUH85hiQLboMyJW0CQ';
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

export const fetchVideos = async (query) => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                part: 'snippet',
                maxResults: 10,
                q: query,
                key: API_KEY,
                type: 'video'
            }
        });
        return response.data.items;
    } catch (error) {
        console.error('Error fetching videos from YouTube API:', error);
        throw error;
    }
};