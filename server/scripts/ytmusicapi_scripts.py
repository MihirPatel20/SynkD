import json
import sys
import ast
from ytmusicapi import YTMusic, OAuthCredentials

def initialize_ytmusic(client_id, client_secret, access_token, refresh_token):
    try:
        credentials = {
            "scope": "https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/youtube.readonly openid https://www.googleapis.com/auth/userinfo.email",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "Bearer",
        }
        return YTMusic(auth=credentials, oauth_credentials=OAuthCredentials(client_id=client_id, client_secret=client_secret))
    except Exception as e:
        return {"success": False, "error": f"Failed to initialize YTMusic: {str(e)}"}

def execute_ytmusic_function(client_id, client_secret, access_token, refresh_token, function_name, *args):
    ytmusic = initialize_ytmusic(client_id, client_secret, access_token, refresh_token)
    if isinstance(ytmusic, dict) and not ytmusic.get("success"):
        return ytmusic
    try:
        result = getattr(ytmusic, function_name)(*args)
        return {"success": True, "data": result}
    except AttributeError:
        return {"success": False, "error": f"Function '{function_name}' not found in YTMusic", "args": args}
    except Exception as e:
        return {"success": False, "error": f"Error executing {function_name}: {str(e)}", "args": args}

def parse_arg(arg):
    try:
        return ast.literal_eval(arg)
    except (ValueError, SyntaxError):
        return arg.split(',') if ',' in arg else arg

if __name__ == "__main__":
    if len(sys.argv) < 6:
        print(json.dumps({"success": False, "error": "Client ID, Client Secret, Access token, Refresh token, and function name are required"}))
        sys.exit(1)

    client_id = sys.argv[1]
    client_secret = sys.argv[2]
    access_token = sys.argv[3]
    refresh_token = sys.argv[4]
    function_name = sys.argv[5]
    args = [parse_arg(arg) for arg in sys.argv[6:]]

    result = execute_ytmusic_function(client_id, client_secret, access_token, refresh_token, function_name, *args)
    print(json.dumps(result))
