from flask_restful import Resource, reqparse
from flask_security import auth_required
from ..database import db
from ..models import Category

class CategoryListResource(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('name', type=str, required=True, help='Category name is required', location='json')

    @auth_required()
    def get(self):
        categories = Category.query.all()
        return [{'id': cat.id, 'name': cat.name} for cat in categories], 200

    # @auth_required()
    # def post(self):
    #     args = self.parser.parse_args()
    #     if Category.query.filter_by(name=args['name']).first():
    #         return {'message': 'Category already exists'}, 400

    #     category = Category(name=args['name'])
    #     db.session.add(category)
    #     db.session.commit()
    #     return {'id': category.id, 'name': category.name}, 201


class CategoryResource(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('name', type=str, required=True, help='Category name is required', location='json')

    @auth_required()
    def get(self, category_id):
        category = Category.query.get_or_404(category_id)
        return {'id': category.id, 'name': category.name}, 200

    # @auth_required()
    # def put(self, category_id):
    #     args = self.parser.parse_args()
    #     category = Category.query.get_or_404(category_id)
    #     category.name = args['name']
    #     db.session.commit()
    #     return {'id': category.id, 'name': category.name}, 200

    # @auth_required()
    # def delete(self, category_id):
    #     category = Category.query.get_or_404(category_id)
    #     db.session.delete(category)
    #     db.session.commit()
    #     return {'message': 'Category deleted'}, 204