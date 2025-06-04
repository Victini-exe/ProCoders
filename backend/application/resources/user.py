from flask_restful import Resource, reqparse
from flask_security import auth_required, current_user, hash_password
from ..database import db
from ..models import User
from flask import abort

class UserListResource(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('email', type=str, required=True, help='Email is required', location='json')
        self.parser.add_argument('userName', type=str, required=True, help='Username is required', location='json')
        self.parser.add_argument('password', type=str, required=True, help='Password is required', location='json')
        self.parser.add_argument('displayName', type=str, required=True, help='Display Name is required', location='json')

    def post(self):
        args = self.parser.parse_args()
        if User.query.filter_by(email=args['email']).first():
            return {'message': 'Email already exists'}, 400
        if User.query.filter_by(username=args['userName']).first():
            return {'message': 'Username already exists'}, 400

        new_user = User(
            email=args['email'],
            username=args['userName'],
            password=hash_password(args['password']),
            display_name=args['displayName'],
            fs_uniquifier=args['email']  # Simplified, can generate UUID
        )
        db.session.add(new_user)
        db.session.commit()
        return new_user.to_dict(), 201

class UserResource(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('userName', type=str, required=False, location='json')
        self.parser.add_argument('displayName', type=str, required=False, location='json')
        self.parser.add_argument('password', type=str, required=False, location='json')

    @auth_required()
    def get(self):
        return current_user.to_dict(), 200

    @auth_required()
    def put(self):
        args = self.parser.parse_args()
        updated = False

        if args['userName']:
            if User.query.filter_by(username=args['userName']).first():
                return {'message': 'Username already taken'}, 400
            current_user.username = args['userName']
            updated = True

        if args['displayName']:
            current_user.display_name = args['displayName']
            updated = True

        if args['password']:
            current_user.password = hash_password(args['password'])
            updated = True

        if updated:
            db.session.commit()
            return current_user.to_dict(), 200
        else:
            return {'message': 'No fields provided for update'}, 400

    @auth_required()
    def delete(self):
        db.session.delete(current_user)
        db.session.commit()
        return {'message': 'User account deleted'}, 204