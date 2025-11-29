from fastapi import APIRouter, HTTPException, status
from app.models import Profile
from db.supabase import create_supabase_client

router = APIRouter(prefix="/profiles", tags=["profiles"])
supabase = create_supabase_client()

def profile_exists(key: str = "email", value: str = None):
    resp = (
        supabase
        .from_("profiles")
        .select("id")
        .eq("email", email)
        .execute()
    )
    return bool(resp.data)

@router.post("/create", status_code = status.HTTP_201_CREATED)
def create_profile(profile: Profile):
    try: 
        profile_email = profile.email.lower()

        if profile_exists("email", profile_email):
            return {"message": "Profile already exists"}

        resp = supabase.from_("profiles")\
            .insert({"name": profile.name,
                      "email": profile_email,
                      "major": profile.major,
                      "year": profile.year,
                      "bio": profile.bio,
                      "skills": profile.skills,
                      "interests": profile.interests}).execute()
        
        print("DEBUG:", resp)

        if resp.error or not resp.data:
            print("Supabase error:", resp.error)
            return {"message": "Profile creation failed"}
        else:
            return {"message" : "Profile created successfully"}
    except Exception as e:
        print("Error:", e)
        return {"message": "Profile creation failed"}
