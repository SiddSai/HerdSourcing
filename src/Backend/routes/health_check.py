from flask import Blueprint

health_bp = Blueprint("health_bp",  __name__)

@health_bp.route("/check")
def health_check():
    return("Health has been checked")

