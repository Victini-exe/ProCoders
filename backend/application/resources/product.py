from flask_restful import Resource, reqparse
from flask_security import auth_required, current_user, roles_required, roles_accepted
from ..database import db
from ..models import Product

class ProductListResource(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('title', type=str, required=True)
        self.parser.add_argument('description', type=str, required=True)
        self.parser.add_argument('price', type=float, required=True)
        self.parser.add_argument('quantity', type=int, required=True)
        self.parser.add_argument('condition', type=str, required=True)
        self.parser.add_argument('yome', type=str, required=True)
        self.parser.add_argument('brand', type=str, required=True)
        self.parser.add_argument('model', type=str, required=True)
        self.parser.add_argument('dimensions', type=str, required=True)
        self.parser.add_argument('weight', type=float, required=True)
        self.parser.add_argument('material', type=str, required=True)
        self.parser.add_argument('original_packaging', type=bool, required=True)
        self.parser.add_argument('manual_included', type=bool, required=True)
        self.parser.add_argument('working_condition_desc', type=str, required=True)
        self.parser.add_argument('image_url', type=str, required=False)
        self.parser.add_argument('category_id', type=int, required=True)

    @auth_required()
    def get(self):
        products = Product.query.all()
        return [p.__dict__ for p in products], 200

    @auth_required()
    @roles_accepted('user')
    def post(self):
        args = self.parser.parse_args()
        product = Product(
            title=args['title'],
            description=args['description'],
            price=args['price'],
            quantity=args['quantity'],
            condition=args['condition'],
            yome=args['yome'],
            brand=args['brand'],
            model=args['model'],
            dimensions=args['dimensions'],
            weight=args['weight'],
            material=args['material'],
            original_packaging=args['original_packaging'],
            manual_included=args['manual_included'],
            working_condition_desc=args['working_condition_desc'],
            image_url=args.get('image_url'),
            seller_id=current_user.id,
            category_id=args['category_id']
        )
        db.session.add(product)
        db.session.commit()
        return product.__dict__, 201


class ProductResource(Resource):
    def __init__(self):
        self.parser = ProductListResource().parser

    @auth_required()
    def get(self, product_id):
        product = Product.query.get_or_404(product_id)
        return product.__dict__, 200

    @auth_required()
    @roles_accepted('user')
    def put(self, product_id):
        args = self.parser.parse_args()
        product = Product.query.get_or_404(product_id)
        if product.seller_id != current_user.id:
            return {'message': 'Unauthorized'}, 403

        for key, value in args.items():
            setattr(product, key, value)

        db.session.commit()
        return product.__dict__, 200

    @auth_required()
    @roles_accepted('user')
    def delete(self, product_id):
        product = Product.query.get_or_404(product_id)
        if product.seller_id != current_user.id:
            return {'message': 'Unauthorized'}, 403

        db.session.delete(product)
        db.session.commit()
        return {'message': 'Product deleted successfully'}, 204