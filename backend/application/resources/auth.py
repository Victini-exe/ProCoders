from flask import current_app as app
from flask_restful import Resource, reqparse
from flask_security import auth_required, hash_password, login_user, logout_user
from flask_security.utils import verify_password
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
        self.parser.add_argument('email', type=str, required=True, help='Email is required', location='json')
        self.parser.add_argument('userName', type=str, required=False, help='Username is required', location='json')
        self.parser.add_argument('password', type=str, required=True, help='Password is required', location='json')
        self.parser.add_argument('address', type=str,location='json', required=False, help='Address is optional')
        self.parser.add_argument('displayName', type=str, required=False, help='Display name is required', location='json')

    def post(self):
        args = self.parser.parse_args()
        email = args['email']
        username = args['userName']
        password = args['password']
        display_name = args['displayName']
        
        if app.security.datastore.find_user(email=email):
            return {"message": "User already exists"}, 400

        try:
            role = app.security.datastore.find_role('user')

            app.security.datastore.create_user(
                email=email,
                username=username,
                password=hash_password(str(password)),
                display_name=display_name,
                roles=[role],
            )
            db.session.commit()
            
            user = app.security.datastore.find_user(email=email)
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
