from supabase import Client, create_client
from env import api, url

api_url: str = url
key: str = api

def create_supabase_client() -> Client:
    supabase: Client = create_client(api_url, key)
    return supabase
