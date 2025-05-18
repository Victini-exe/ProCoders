from flask import Flask 
from .database import db 
from .models import User, Role
from config import LocalDevelopmentConfig
from flask_security import Security, SQLAlchemyUserDatastore, hash_password
from flask_restful import Api
from flask_cors import CORS
from .resources import register_resources

def create_app():
    app = Flask(__name__)
    app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, datastore)
    app.app_context().push()

    CORS(app)

    api = Api(app)
    register_resources(api)
    api.init_app(app)

    with app.app_context():
        db.create_all()

        app.security.datastore.find_or_create_role(name = "admin", description = "Superuser of app")
        app.security.datastore.find_or_create_role(name = "user", description = "User of the app")
        db.session.commit()

        if not app.security.datastore.find_user(email = "admin@email.com"):
            app.security.datastore.create_user(email = "admin@email.com",
                                            username = "admin",
                                            password = hash_password("1234"),
                                            roles = ['admin'])

        db.session.commit()

    return app





