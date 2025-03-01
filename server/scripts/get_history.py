#!/usr/bin/env python3
import sys
import json
from ytmusicapi import YTMusic

def get_history(cookies_file):
    # Load cookies from file
    with open(cookies_file, 'r') as f:
        cookies = json.load(f)
    
    # Convert cookies to header format expected by ytmusicapi
    headers = {
        'cookie': '; '.join([f"{k}={v}" for k, v in cookies.items()])
    }
    
    # Initialize YTMusic with headers
    ytmusic = YTMusic(headers_raw=headers)
    
    # Get history
    history = ytmusic.get_history()
    
    # Format the history data
    formatted_history = []
    for item in history:
        try:
            video_id = item.get('videoId')
            if not video_id:
                continue
                
            formatted_item = {
                'videoId': video_id,
                'title': item.get('title', ''),
                'artist': item.get('artists', [{}])[0].get('name', '') if item.get('artists') else '',
                'thumbnail': item.get('thumbnails', [{}])[-1].get('url', '') if item.get('thumbnails') else '',
                'playCount': 1,  # Default to 1, actual count not provided by API
                'lastPlayed': item.get('played', ''),
                'playlists': []  # This would need to be populated separately
            }
            formatted_history.append(formatted_item)
        except Exception as e:
            print(f"Error processing item: {e}", file=sys.stderr)
    
    return formatted_history

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python get_history.py <cookies_file>", file=sys.stderr)
        sys.exit(1)
    
    cookies_file = sys.argv[1]
    try:
        history = get_history(cookies_file)
        print(json.dumps(history))
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
