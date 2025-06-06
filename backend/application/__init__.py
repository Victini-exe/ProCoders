from flask import Flask 
from .database import db 
from .models import User, Role, Category
from config import DevelopmentConfig
from flask_security import Security, SQLAlchemyUserDatastore, hash_password
from flask_restful import Api
from flask_cors import CORS
from .resources import register_resources
from .socket_events import socketio

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, datastore)
    app.app_context().push()

    # Configure CORS
    CORS(app, 
         resources={r"/api/*": {
             "origins": ["http://localhost:5173"],
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
             "allow_headers": ["Content-Type", "Authorization", "ngrok-skip-browser-warning"],
             "expose_headers": ["Content-Range", "X-Content-Range"],
             "supports_credentials": True
         }})

    # Initialize Socket.IO
    socketio.init_app(app, 
                     cors_allowed_origins=["http://localhost:5173"],
                     async_mode='threading')

    api = Api(app)
    register_resources(api)
    api.init_app(app)

    with app.app_context():
        db.create_all()
        
        app.security.datastore.find_or_create_role(name = "user", description = "User of the app")
        db.session.commit()

        # Initialize predefined categories
        default_categories = [
            "Electronics & Gadgets",
            "Fashion & Accessories",
            "Home & Living",
            "Books & Stationery",
            "Sports & Fitness"
        ]

        for category_name in default_categories:
            if not Category.query.filter_by(name=category_name).first():
                category = Category(name=category_name)
                db.session.add(category)
        
        db.session.commit()

    return app





