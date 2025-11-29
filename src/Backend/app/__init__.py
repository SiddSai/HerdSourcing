from flask import Flask
from flask import Blueprint


def create_app():
    app = Flask(__name__)
    from routes.health_check import health_bp
    app.register_blueprint(health_bp)
    return app

