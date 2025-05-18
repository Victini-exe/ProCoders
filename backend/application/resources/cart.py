from flask_restful import Resource, reqparse
from flask_security import auth_required, current_user
from ..database import db
from ..models import CartItem, Product

class CartListResource(Resource):
    @auth_required()
    def get(self):
        cart_items = CartItem.query.filter_by(user_id=current_user.id).all()
        return [
            {
                'id': item.id,
                'product_id': item.product_id,
                'product_title': item.product.title,
                'product_price': item.product.price
            }
            for item in cart_items
        ], 200

class CartItemResource(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('product_id', type=int, required=True, help='Product ID is required')

    @auth_required()
    def post(self):
        args = self.parser.parse_args()
        product = Product.query.get_or_404(args['product_id'])

        existing = CartItem.query.filter_by(user_id=current_user.id, product_id=product.id).first()
        if existing:
            return {'message': 'Product already in cart'}, 400

        cart_item = CartItem(user_id=current_user.id, product_id=product.id)
        db.session.add(cart_item)
        db.session.commit()
        return {
            'id': cart_item.id,
            'product_id': cart_item.product_id
        }, 201

    @auth_required()
    def delete(self, cart_item_id):
        cart_item = CartItem.query.get_or_404(cart_item_id)
        if cart_item.user_id != current_user.id:
            return {'message': 'Unauthorized'}, 403

        db.session.delete(cart_item)
        db.session.commit()
        return {'message': 'Item removed from cart'}, 204