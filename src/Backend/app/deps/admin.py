import os
from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader

ADMIN_SECRET = os.getenv("HERDSOURCING_ADMIN_SECRET")

admin_header = APIKeyHeader(name="X-Admin-Secret", auto_error=False)

def require_admin(x_admin_secret: str = Depends(admin_header)):
    if not ADMIN_SECRET:
        # misconfigured env
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Admin secret not configured",
        )

    if x_admin_secret != ADMIN_SECRET:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    # if needed you could return some dummy admin user object here
    return True