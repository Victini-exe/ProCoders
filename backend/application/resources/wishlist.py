from flask import request
from flask_restful import Resource
from flask_security import auth_required, current_user
from ..models import SavedItem, Product
from ..database import db

class WishlistResource(Resource):
    @auth_required('token')
    def post(self):
        """Add item to wishlist"""
        data = request.get_json()
        product_id = data.get('product_id')
        alert_on_price_drop = data.get('alert_on_price_drop', False)
        
        if not product_id:
            return {'message': 'Product ID is required'}, 400
            
        # Check if product exists
        product = Product.query.get(product_id)
        if not product:
            return {'message': 'Product not found'}, 404
            
        # Check if item is already in wishlist
        existing_item = SavedItem.query.filter_by(
            user_id=current_user.id,
            product_id=product_id
        ).first()
        
        if existing_item:
            return {'message': 'Item already in wishlist'}, 400
            
        # Create new saved item
        saved_item = SavedItem(
            user_id=current_user.id,
            product_id=product_id,
            alert_on_price_drop=alert_on_price_drop
        )
        
        db.session.add(saved_item)
        db.session.commit()
        
        return {'saved_item': saved_item.to_dict()}, 201

    @auth_required('token')
    def get(self):
        """Get all items in user's wishlist"""
        saved_items = SavedItem.query.filter_by(user_id=current_user.id).all()
        return {
            'saved_items': [item.to_dict() for item in saved_items]
        }, 200

class WishlistItemResource(Resource):
    @auth_required('token')
    def delete(self, item_id):
        """Remove item from wishlist"""
        saved_item = SavedItem.query.get_or_404(item_id)
        
        # Verify ownership
        if saved_item.user_id != current_user.id:
            return {'message': 'Unauthorized access'}, 403
            
        db.session.delete(saved_item)
        db.session.commit()
        
        return {'message': 'Item removed from wishlist'}, 200

    @auth_required('token')
    def patch(self, item_id):
        """Update price drop alert preference"""
        saved_item = SavedItem.query.get_or_404(item_id)
        
        # Verify ownership
        if saved_item.user_id != current_user.id:
            return {'message': 'Unauthorized access'}, 403
            
        data = request.get_json()
        alert_on_price_drop = data.get('alert_on_price_drop')
        
        if alert_on_price_drop is None:
            return {'message': 'alert_on_price_drop field is required'}, 400
            
        saved_item.alert_on_price_drop = alert_on_price_drop
        db.session.commit()
        
        return {'saved_item': saved_item.to_dict()}, 200