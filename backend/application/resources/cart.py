from flask_restful import Resource, reqparse
from flask_security import auth_required, current_user
from ..database import db
from ..models import CartItem, Product

class CartListResource(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('product_id', type=int, required=True, help='Product ID is required', location='json')
        self.parser.add_argument('quantity', type=int, required=False, default=1, location='json')

    @auth_required()
    def get(self):
        cart_items = CartItem.query.filter_by(user_id=current_user.id).all()
        return [
            {
                'id': item.id,
                'product_id': item.product_id,
                'product_title': item.product.title,
                'product_price': item.product.price,
                'quantity': item.quantity
            }
            for item in cart_items
        ], 200

    @auth_required()
    def post(self):
        args = self.parser.parse_args()
        product = Product.query.get_or_404(args['product_id'])

        existing = CartItem.query.filter_by(user_id=current_user.id, product_id=product.id).first()
        if existing:
            existing.quantity += args['quantity']
            db.session.commit()
            return {'message': 'Quantity updated', 'quantity': existing.quantity}, 200

        cart_item = CartItem(user_id=current_user.id, product_id=product.id, quantity=args['quantity'])
        db.session.add(cart_item)
        db.session.commit()
        return {
            'id': cart_item.id,
            'product_id': cart_item.product_id,
            'quantity': cart_item.quantity
        }, 201


class CartItemResource(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('quantity', type=int, required=True, help='Quantity is required', location='json')

    @auth_required()
    def get(self, cart_item_id):
        cart_item = CartItem.query.get_or_404(cart_item_id)
        if cart_item.user_id != current_user.id:
            return {'message': 'Unauthorized'}, 403

        return {
            'id': cart_item.id,
            'product_id': cart_item.product_id,
            'product_title': cart_item.product.title,
            'product_price': cart_item.product.price,
            'quantity': cart_item.quantity
        }, 200

    @auth_required()
    def put(self, cart_item_id):
        cart_item = CartItem.query.get_or_404(cart_item_id)
        if cart_item.user_id != current_user.id:
            return {'message': 'Unauthorized'}, 403

        args = self.parser.parse_args()
        cart_item.quantity = args['quantity']
        db.session.commit()

        return {
            'id': cart_item.id,
            'product_id': cart_item.product_id,
            'quantity': cart_item.quantity
        }, 200

    @auth_required()
    def delete(self, cart_item_id):
        cart_item = CartItem.query.get_or_404(cart_item_id)
        if cart_item.user_id != current_user.id:
            return {'message': 'Unauthorized'}, 403

        db.session.delete(cart_item)
        db.session.commit()
        return {'message': 'Item removed from cart'}, 204