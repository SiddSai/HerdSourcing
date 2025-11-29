from supabase import Client, create_client
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path="/Users/siddsai/Desktop/Programming/HerdSourcing/src/.env")

api = os.getenv("api")
url = os.getenv("url")

def create_supabase_client() -> Client:
    supabase: Client = create_client(url, api)
    return supabase
