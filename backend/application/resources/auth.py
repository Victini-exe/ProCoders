from flask import current_app as app, make_response
from flask_restful import Resource, reqparse
from flask_security import auth_required, hash_password, login_user, logout_user
from flask_security.utils import verify_password
import uuid
from ..database import db

class LoginResource(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('email', type=str, required=True, help='Email is required', location='json')
        self.parser.add_argument('password', type=str, required=True, help='Password is required',location='json')

    def post(self):
        args = self.parser.parse_args()
        user = app.security.datastore.find_user(email=args['email'])
        
        if not user:
            return {"message": "Invalid email or password"}, 401
            
        if not verify_password(args['password'], user.password):
            return {"message": "Invalid email or password"}, 401
            
        if not user.active:
            return {"message": "Account is deactivated"}, 401
        
        login_user(user)
        
        auth_token = user.get_auth_token()
        
        return {
            "message": "Login successful",
            "token": auth_token,
            "user": user.to_dict()
        }, 200

class SignupResource(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('fullName', type=str, required=True, help='Full name is required', location='json')
        self.parser.add_argument('email', type=str, required=True, help='Email is required', location='json')
        self.parser.add_argument('phoneNumber', type=str, required=False, location='json')
        self.parser.add_argument('password', type=str, required=True, help='Password is required', location='json')
        self.parser.add_argument('preferredLanguage', type=str, default='english', location='json')
        self.parser.add_argument('profile_image_url', type=str, required=False, location='json')

    def post(self):
        args = self.parser.parse_args()
        email = args['email']
        password = args['password']
        
        if app.security.datastore.find_user(email=email):
            return {"message": "User already exists"}, 400

        try:
            role = app.security.datastore.find_role('user')
            
            # Convert frontend language format to backend format
            language_mapping = {
                'english': 'en',
                'hindi': 'hi',
                'gujarati': 'gu'
            }
            backend_language = language_mapping.get(args['preferredLanguage'].lower(), 'en')

            # Generate fs_uniquifier
            fs_uniquifier = str(uuid.uuid4())

            user = app.security.datastore.create_user(
                email=email,
                full_name=args['fullName'],
                password=hash_password(str(password)),
                phone_number=args.get('phoneNumber'),
                preferred_language=backend_language,
                profile_image_url=args.get('profile_image_url'),
                fs_uniquifier=fs_uniquifier,
                roles=[role],
            )
            db.session.commit()
            
            login_user(user)
            auth_token = user.get_auth_token()

            return {
                "message": "User registered successfully",
                "token": auth_token,
                "user": user.to_dict()
            }, 201
            
        except Exception as e:
            db.session.rollback()
            return {"message": f"Error during registration: {str(e)}"}, 500

class LogoutResource(Resource):
    @auth_required('token')
    def post(self):
        logout_user()
        return {"message": "Logged out successfully"}, 200
