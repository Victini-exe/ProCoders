from flask import request
from flask_restful import Resource, reqparse
from flask_security import auth_required, current_user
from ..database import db
from ..models import Product

class ProductListResource(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('title', type=str, required=True, help='Title is required', location='json')
        self.parser.add_argument('description', type=str, required=True, help='Description is required', location='json')
        self.parser.add_argument('price', type=float, required=False, location='json')
        self.parser.add_argument('quantity', type=int, required=False, location='json')
        self.parser.add_argument('condition', type=str, required=False, location='json')
        self.parser.add_argument('yome', type=str, required=False, location='json')
        self.parser.add_argument('brand', type=str, required=False, location='json')
        self.parser.add_argument('model', type=str, required=False, location='json')
        self.parser.add_argument('dimensions', type=str, required=False, location='json')
        self.parser.add_argument('weight', type=float, required=False, location='json')
        self.parser.add_argument('material', type=str, required=False, location='json')
        self.parser.add_argument('original_packaging', type=bool, required=False, location='json')
        self.parser.add_argument('manual_included', type=bool, required=False, location='json')
        self.parser.add_argument('working_condition_desc', type=str, required=False, location='json')
        self.parser.add_argument('image_url', type=str, required=False, location='json')
        self.parser.add_argument('category_id', type=int, required=True, location='json')

    @auth_required()
    def get(self):
        category = request.args.get('category_id')
        query = Product.query
        if category:
            query = query.filter_by(category_id=category)
        products = query.all()
        return [product.to_dict() for product in products], 200

    @auth_required()
    def post(self):
        args = self.parser.parse_args()
        product = Product(
            title=args['title'],
            description=args['description'],
            price=args.get('price'),
            quantity=args.get('quantity'),
            condition=args.get('condition'),
            yome=args.get('yome'),
            brand=args.get('brand'),
            model=args.get('model'),
            dimensions=args.get('dimensions'),
            weight=args.get('weight'),
            material=args.get('material'),
            original_packaging=args.get('original_packaging'),
            manual_included=args.get('manual_included'),
            working_condition_desc=args.get('working_condition_desc'),
            image_url=args.get('image_url'),
            seller_id=current_user.id,
            category_id=args.get('category_id')
        )
        db.session.add(product)
        db.session.commit()
        return product.to_dict(), 201


class ProductResource(Resource):
    def __init__(self):
        self.parser = ProductListResource().parser

    @auth_required()
    def get(self, product_id):
        product = Product.query.get_or_404(product_id)
        return product.to_dict(), 200

    @auth_required()
    def put(self, product_id):
        product = Product.query.get_or_404(product_id)
        if product.seller_id != current_user.id:
            return {'message': 'Unauthorized'}, 403

        args = self.parser.parse_args()
        for key, value in args.items():
            if value is not None:
                setattr(product, key, value)

        db.session.commit()
        return product.to_dict(), 200

    @auth_required()
    def delete(self, product_id):
        product = Product.query.get_or_404(product_id)
        if product.seller_id != current_user.id:
            return {'message': 'Unauthorized'}, 403

        db.session.delete(product)
        db.session.commit()
        return {'message': 'Product deleted successfully'}, 204