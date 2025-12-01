from fastapi import APIRouter, HTTPException, status
from app.models import Project
from db.supabase import create_supabase_client
from fastapi import Depends
from app.deps.admin import require_admin

router = APIRouter(prefix="/projects", tags=["projects"])
supabase = create_supabase_client()


def project_exists(title: str) -> bool:
    resp = (
        supabase
        .from_("projects")
        .select("id")
        .eq("title", title)
        .execute()
    )
    # if there's an error, treat it as "doesn't exist" and let insert fail later
    data = getattr(resp, "data", None)
    return bool(data)


@router.post("/create", status_code=status.HTTP_201_CREATED)
def create_project(project: Project):
    project_title = project.title.lower()

    try:
        # 1) check for duplicate
        if project_exists(project_title):
            # you **lowercased** here but not in project_exists() or insert
            # either store lowercase in DB or stop lowercasing at all
            raise HTTPException(status_code=400, detail="Project already exists")

        # 2) build payload (be consistent about casing!)
        payload = {
            "title": project_title,
            "description": project.description,
            "status": project.status,
        }

        resp = supabase.from_("projects").insert(payload).execute()
        print("DEBUG:", resp)

        # 3) handle Supabase error
        if getattr(resp, "error", None):
            print("Supabase error:", resp.error)
            raise HTTPException(status_code=500, detail="Project creation failed")

        if not getattr(resp, "data", None):
            print("No data returned")
            raise HTTPException(status_code=500, detail="Project creation failed")

        return {"message": "Project created successfully", "project": resp.data[0]}

    except HTTPException:
        # re-raise HTTPExceptions so FastAPI returns proper status codes
        raise
    except Exception as e:
        print("Unexpected error:", e)
        raise HTTPException(status_code=500, detail="Project creation failed")

# Get all projects route 
@router.get("/all")
def get_all_projects():
    try:
        resp = supabase.from_("projects").select("*").execute()
        if getattr(resp, "error", None):
            print(resp.error)
            return {"message": "Failed to retrieve projects"}

        if not getattr(resp, "data", None):
            print("No data returned")
            return {"message": "No projects found"}

        return {"projects": resp.data}

    except Exception as e:
        print("Error:", e)
        return {"message": "Failed to retrieve projects"}
    
# Get specific project
@router.get("/{project_id}")
def get_project_by_id(project_id: str):
    try:
        resp = (
            supabase
            .from_("projects")
            .select("*")
            .eq("id", project_id)
            .single()
            .execute()
        )

        if getattr(resp, "error", None):
            raise HTTPException(status_code=404, detail="Project not found")

        return resp.data

    except Exception as e:
        print("Unexpected error:", e)
        raise HTTPException(status_code=500, detail="Failed to retrieve project")
    

# Delete route
@router.delete("/{project_id}", dependencies=[Depends(require_admin)])
def delete_project(project_id: str):
    try:
        resp = (
            supabase
            .from_("projects")
            .delete()
            .eq("id", project_id)
            .execute()
        )

        if getattr(resp, "error", None):
            print("Supabase error:", resp.error)
            raise HTTPException(status_code=500, detail="Failed to delete project")

        if not getattr(resp, "data", None):
            raise HTTPException(status_code=404, detail="Project not found")

        return {"message": "Project deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        print("Unexpected error:", e)
        raise HTTPException(status_code=500, detail="Failed to delete project")