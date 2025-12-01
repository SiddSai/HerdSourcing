from fastapi import APIRouter, HTTPException, status
from app.models import Project
from db.supabase import create_supabase_client

