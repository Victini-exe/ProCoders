from flask import current_app as app, request
from flask_restful import Resource, reqparse
from flask_security import auth_required, hash_password, login_user, logout_user
from flask_security.utils import verify_password
from ..database import db
import cloudinary
import cloudinary.uploader

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
    def post(self):
        content_type = request.headers.get('Content-Type', '')

        try:
            # Handle multipart/form-data (with file uploads)
            if content_type.startswith('multipart/form-data'):
                # Manually extract form data
                full_name = request.form.get('fullName')
                email = request.form.get('email')
                password = request.form.get('password')
                phone_number = request.form.get('phoneNumber')
                preferred_language = request.form.get('preferredLanguage', 'en')
                profile_image = request.files.get('profileImage')

                # Validate required fields
                if not all([full_name, email, password]):
                    return {'message': 'Full name, email, and password are required'}, 400

                # Handle profile image upload
                profile_image_url = None
                if profile_image:
                    try:
                        upload_result = cloudinary.uploader.upload(
                            profile_image,
                            folder="ecofinds/profiles",
                            resource_type="auto"
                        )
                        profile_image_url = upload_result['secure_url']
                    except Exception as e:
                        return {'message': f'Error uploading profile image: {str(e)}'}, 400

            # Handle application/json
            elif content_type.startswith('application/json'):
                data = request.get_json()
                if not data:
                    return {'message': 'No JSON data provided'}, 400

                full_name = data.get('fullName')
                email = data.get('email')
                password = data.get('password')
                phone_number = data.get('phoneNumber')
                preferred_language = data.get('preferredLanguage', 'english')
                profile_image_url = data.get('profileImageUrl')

                # Validate required fields
                if not all([full_name, email, password]):
                    return {'message': 'Full name, email, and password are required'}, 400

            else:
                return {'message': 'Unsupported Content-Type. Use multipart/form-data or application/json'}, 415

            # Check if user already exists
            if app.security.datastore.find_user(email=email):
                return {"message": "User already exists"}, 400

            try:
                role = app.security.datastore.find_role('user')

                user = app.security.datastore.create_user(
                    email=email,
                    full_name=full_name,
                    password=hash_password(str(password)),
                    phone_number=phone_number,
                    preferred_language=preferred_language,
                    profile_image_url=profile_image_url,
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
                app.logger.error(f"Error during registration: {str(e)}")
                return {"message": f"Error during registration: {str(e)}"}, 500

        except Exception as e:
            app.logger.error(f"Error processing request: {str(e)}")
            return {"message": f"Error processing request: {str(e)}"}, 500

class LogoutResource(Resource):
    @auth_required('token')
    def post(self):
        logout_user()
        return {"message": "Logged out successfully"}, 200
