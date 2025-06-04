from flask import request
from flask_restful import Resource, reqparse
from flask_security import auth_required, current_user
from ..database import db
from ..models import Product, ProductStatus, ProductCondition, ProductImage

class ProductListResource(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('title', type=str, required=True, help='Title is required', location='json')
        self.parser.add_argument('description', type=str, required=False, location='json')
        self.parser.add_argument('category', type=str, required=True, help='Category is required', location='json')
        self.parser.add_argument('condition', type=str, choices=['new', 'old'], required=True, help='Condition must be either new or old', location='json')
        self.parser.add_argument('price', type=float, required=True, help='Price is required', location='json')
        self.parser.add_argument('is_auction', type=bool, default=False, location='json')
        self.parser.add_argument('location', type=str, required=True, help='Location is required', location='json')
        self.parser.add_argument('images', type=list, location='json', required=False)

    @auth_required()
    def get(self):
        products = Product.query.filter_by(status=ProductStatus.ACTIVE).all()
        return [product.to_dict() for product in products], 200

    @auth_required()
    def post(self):
        args = self.parser.parse_args()
        
        product = Product(
            title=args['title'],
            description=args.get('description'),
            category=args['category'],
            condition=ProductCondition.NEW if args['condition'] == 'new' else ProductCondition.OLD,
            price=args['price'],
            is_auction=args['is_auction'],
            location=args['location'],
            seller_id=current_user.id,
            status=ProductStatus.ACTIVE
        )
        db.session.add(product)
        
        # Handle product images
        images = args.get('images', [])
        for idx, image_url in enumerate(images):
            image = ProductImage(
                product=product,
                image_url=image_url,
                is_primary=(idx == 0)  # First image is primary
            )
            db.session.add(image)
        
        db.session.commit()
        return product.to_dict(), 201


class ProductResource(Resource):
    def __init__(self):
        self.parser = ProductListResource().parser
        self.image_parser = reqparse.RequestParser()
        self.image_parser.add_argument('image_url', type=str, required=True, help='Image URL is required', location='json')
        self.image_parser.add_argument('is_primary', type=bool, default=False, location='json')

    @auth_required()
    def get(self, product_id):
        product = Product.query.get_or_404(product_id)
        return product.to_dict(), 200

    @auth_required()
    def put(self, product_id):
        args = self.parser.parse_args()
        product = Product.query.get_or_404(product_id)
        
        if product.seller_id != current_user.id:
            return {'message': 'Unauthorized'}, 403

        if product.status != ProductStatus.ACTIVE:
            return {'message': 'Cannot edit a sold or removed product'}, 400

        product.title = args['title']
        product.description = args.get('description')
        product.category = args['category']
        product.condition = ProductCondition.NEW if args['condition'] == 'new' else ProductCondition.OLD
        product.price = args['price']
        product.is_auction = args['is_auction']
        product.location = args['location']

        # Update images if provided
        if args.get('images'):
            # Remove existing images
            ProductImage.query.filter_by(product_id=product.id).delete()
            
            # Add new images
            for idx, image_url in enumerate(args['images']):
                image = ProductImage(
                    product=product,
                    image_url=image_url,
                    is_primary=(idx == 0)  # First image is primary
                )
                db.session.add(image)

        db.session.commit()
        return product.to_dict(), 200

    @auth_required()
    def delete(self, product_id):
        product = Product.query.get_or_404(product_id)
        
        if product.seller_id != current_user.id:
            return {'message': 'Unauthorized'}, 403

        # Instead of deleting, mark as removed
        product.status = ProductStatus.REMOVED
        db.session.commit()
        return {'message': 'Product removed successfully'}, 200