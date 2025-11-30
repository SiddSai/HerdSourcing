from fastapi import FastAPI
from routes.health_check import router as health_router
from routes.profileRoutes import router as profiles_router
from routes.projectRoutes import router as projects_router

app = FastAPI()

app.include_router(health_router)
app.include_router(profiles_router)
app.include_router(projects_router)
