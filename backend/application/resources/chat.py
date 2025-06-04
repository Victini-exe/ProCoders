from flask import request, jsonify
from flask_restful import Resource
from flask_security import auth_required, current_user
from sqlalchemy import or_, and_
from ..models import Chat, Message, Product, User
from ..database import db
from datetime import datetime

class ChatResource(Resource):
    @auth_required('token')
    def post(self):
        """Create a new chat or get existing chat"""
        data = request.get_json()
        product_id = data.get('product_id')
        
        if not product_id:
            return {'message': 'Product ID is required'}, 400
            
        product = Product.query.get(product_id)
        if not product:
            return {'message': 'Product not found'}, 404
            
        # Check if chat already exists
        existing_chat = Chat.query.filter(
            and_(
                Chat.product_id == product_id,
                or_(
                    and_(Chat.buyer_id == current_user.id, Chat.seller_id == product.seller_id),
                    and_(Chat.seller_id == current_user.id, Chat.buyer_id == product.seller_id)
                )
            )
        ).first()
        
        if existing_chat:
            return {'chat': existing_chat.to_dict()}, 200
            
        # Create new chat
        if current_user.id == product.seller_id:
            return {'message': 'Seller cannot start chat with themselves'}, 400
            
        new_chat = Chat(
            buyer_id=current_user.id,
            seller_id=product.seller_id,
            product_id=product_id
        )
        
        db.session.add(new_chat)
        db.session.commit()
        
        return {'chat': new_chat.to_dict()}, 201

    @auth_required('token')
    def get(self):
        """Get all chats for the current user"""
        chats = Chat.query.filter(
            or_(
                Chat.buyer_id == current_user.id,
                Chat.seller_id == current_user.id
            )
        ).all()
        
        return {'chats': [chat.to_dict() for chat in chats]}, 200

class ChatDetailResource(Resource):
    @auth_required('token')
    def get(self, chat_id):
        """Get chat details and messages"""
        chat = Chat.query.get_or_404(chat_id)
        
        # Verify user is part of the chat
        if current_user.id not in [chat.buyer_id, chat.seller_id]:
            return {'message': 'Unauthorized access'}, 403
            
        # Mark all unread messages as read
        if chat.buyer_id == current_user.id:
            unread_messages = Message.query.filter_by(
                chat_id=chat_id,
                sender_id=chat.seller_id,
                is_read=False
            ).all()
        else:
            unread_messages = Message.query.filter_by(
                chat_id=chat_id,
                sender_id=chat.buyer_id,
                is_read=False
            ).all()
            
        for message in unread_messages:
            message.is_read = True
            
        db.session.commit()
        
        return {'chat': chat.to_dict()}, 200

class MessageResource(Resource):
    @auth_required('token')
    def post(self, chat_id):
        """Send a new message"""
        chat = Chat.query.get_or_404(chat_id)
        
        # Verify user is part of the chat
        if current_user.id not in [chat.buyer_id, chat.seller_id]:
            return {'message': 'Unauthorized access'}, 403
            
        data = request.get_json()
        content = data.get('content')
        
        if not content or not content.strip():
            return {'message': 'Message content is required'}, 400
            
        new_message = Message(
            chat_id=chat_id,
            sender_id=current_user.id,
            content=content
        )
        
        db.session.add(new_message)
        db.session.commit()
        
        return {'message': new_message.to_dict()}, 201

    @auth_required('token')
    def get(self, chat_id):
        """Get all messages for a chat"""
        chat = Chat.query.get_or_404(chat_id)
        
        # Verify user is part of the chat
        if current_user.id not in [chat.buyer_id, chat.seller_id]:
            return {'message': 'Unauthorized access'}, 403
            
        messages = Message.query.filter_by(chat_id=chat_id).order_by(Message.sent_at.asc()).all()
        return {'messages': [message.to_dict() for message in messages]}, 200

class UnreadMessagesResource(Resource):
    @auth_required('token')
    def get(self):
        """Get count of unread messages for the current user"""
        chats = Chat.query.filter(
            or_(
                Chat.buyer_id == current_user.id,
                Chat.seller_id == current_user.id
            )
        ).all()
        
        unread_counts = {}
        total_unread = 0
        
        for chat in chats:
            if chat.buyer_id == current_user.id:
                count = Message.query.filter_by(
                    chat_id=chat.id,
                    sender_id=chat.seller_id,
                    is_read=False
                ).count()
            else:
                count = Message.query.filter_by(
                    chat_id=chat.id,
                    sender_id=chat.buyer_id,
                    is_read=False
                ).count()
                
            if count > 0:
                unread_counts[str(chat.id)] = count
                total_unread += count
                
        return {
            'total_unread': total_unread,
            'unread_by_chat': unread_counts
        }, 200
