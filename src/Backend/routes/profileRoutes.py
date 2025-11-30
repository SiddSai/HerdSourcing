from fastapi import APIRouter, HTTPException, status
from app.models import Profile
from db.supabase import create_supabase_client

router = APIRouter(prefix="/profiles", tags=["profiles"])
supabase = create_supabase_client()

# Check if profile exists
def profile_exists(email: str) -> bool:
    resp = (
        supabase
        .from_("profiles")
        .select("id")
        .eq("email", email)
        .execute()
    )
    return bool(getattr(resp, "data", None))

# Create new profile route
@router.post("/create", status_code = status.HTTP_201_CREATED)
def create_profile(profile: Profile):
    try: 
        profile_email = profile.email.lower()

        if profile_exists(profile_email):
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

        if getattr(resp, "error", None):
            print(resp.error)
            return {"message": "Profile creation failed"}

        if not getattr(resp, "data", None):
            print("No data returned")
            return {"message": "Profile creation failed"}
        
        else:
            return {"message": "Profile created successfully"}
        
    except Exception as e:
        print("Error:", e)
        return {"message": "Profile creation failed"}
    
@router.get("/all")
def get_all_profiles():
    try:
        resp = supabase.from_("profiles").select("*").execute()
        if getattr(resp, "error", None):
            print(resp.error)
            return {"message": "Failed to retrieve profiles"}

        if not getattr(resp, "data", None):
            print("No data returned")
            return {"message": "No profiles found"}

        return {"profiles": resp.data}

    except Exception as e:
        print("Error:", e)
        return {"message": "Failed to retrieve profiles"}
