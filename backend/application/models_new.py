from .database import db
from flask_security import UserMixin, RoleMixin
from datetime import datetime, timezone
import json
from enum import Enum

# Keep all the enums
# ...existing enums...

class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(255))

class UsersRoles(db.Model):
    __tablename__ = 'users_roles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))

class User(db.Model, UserMixin):
    __tablename__ = 'user'
    
    # All the columns remain the same
    # ...existing columns...
    
    # Define relationships consistently - Parent model defines the backref
    roles = db.relationship('Role', secondary='users_roles', backref='users')
    products = db.relationship('Product', backref='seller', lazy=True)
    cart_items = db.relationship('CartItem', backref='user', lazy=True)
    purchases = db.relationship('Purchase', backref='user', lazy=True)
    saved_items = db.relationship('SavedItem', backref='user', lazy=True)
    saved_searches = db.relationship('SearchQuery', backref='user', lazy=True)
    buyer_chats = db.relationship('Chat', foreign_keys='Chat.buyer_id', backref='buyer', lazy=True)
    seller_chats = db.relationship('Chat', foreign_keys='Chat.seller_id', backref='seller', lazy=True)
    reviews_given = db.relationship('Review', foreign_keys='Review.reviewer_id', backref='reviewer', lazy=True)
    reviews_received = db.relationship('Review', foreign_keys='Review.reviewee_id', backref='reviewee', lazy=True)
    disputes_filed = db.relationship('Dispute', backref='complainant', lazy=True)
    notifications = db.relationship('Notification', backref='user', lazy=True)
    bids = db.relationship('Bid', backref='bidder', lazy=True)
    sent_messages = db.relationship('Message', backref='sender', lazy=True)

class Product(db.Model):
    __tablename__ = 'product'
    
    # All the columns remain the same
    # ...existing columns...
    
    # Relationships - Parent defines backrefs
    images = db.relationship('ProductImage', backref='product', lazy=True, cascade='all, delete-orphan')
    auction = db.relationship('Auction', backref='product', uselist=False, lazy=True)
    transactions = db.relationship('Transaction', backref='product', lazy=True)
    saved_by_users = db.relationship('SavedItem', backref='product', lazy=True)
    chats = db.relationship('Chat', backref='product', lazy=True)

# Child models only reference their parent without backref
class ProductImage(db.Model):
    __tablename__ = 'product_image'
    # ...existing implementation...

class CartItem(db.Model):
    __tablename__ = 'cart_item'
    # ...existing implementation...

class Purchase(db.Model):
    __tablename__ = 'purchase'
    # ...existing implementation...

class Auction(db.Model):
    __tablename__ = 'auction'
    
    # All the columns remain the same
    # ...existing columns...
    
    # Remove backref from child side
    product = db.relationship('Product')
    bids = db.relationship('Bid', foreign_keys='winning_bid_id', backref='won_auction', lazy=True)
    all_bids = db.relationship('Bid', primaryjoin="Bid.auction_id == Auction.id", backref='auction', lazy=True)

class Bid(db.Model):
    __tablename__ = 'bid'
    
    # All the columns remain the same
    # ...existing columns...
    
    # Remove backref from child side
    bidder = db.relationship('User')

class SavedItem(db.Model):
    __tablename__ = 'saved_item'
    
    # All the columns remain the same
    # ...existing columns...
    
    # Remove backref from child side
    user = db.relationship('User')
    product = db.relationship('Product')

class SearchQuery(db.Model):
    __tablename__ = 'search_query'
    
    # All the columns remain the same
    # ...existing columns...
    
    # Remove backref from child side
    user = db.relationship('User')

class Chat(db.Model):
    __tablename__ = 'chat'
    
    # All the columns remain the same
    # ...existing columns...
    
    # Remove backref from child side
    buyer = db.relationship('User', foreign_keys=[buyer_id])
    seller = db.relationship('User', foreign_keys=[seller_id])
    product = db.relationship('Product')
    messages = db.relationship('Message', backref='chat', lazy=True, cascade='all, delete-orphan')

class Message(db.Model):
    __tablename__ = 'message'
    
    # All the columns remain the same
    # ...existing columns...
    
    # Remove backref from child side
    sender = db.relationship('User')

class Transaction(db.Model):
    __tablename__ = 'transaction'
    
    # All the columns remain the same
    # ...existing columns...
    
    # Remove backref from child side
    product = db.relationship('Product')
    buyer = db.relationship('User', foreign_keys=[buyer_id])
    seller = db.relationship('User', foreign_keys=[seller_id])
    reviews = db.relationship('Review', backref='transaction', lazy=True, cascade='all, delete-orphan')
    dispute = db.relationship('Dispute', backref='transaction', uselist=False, lazy=True, cascade='all, delete-orphan')

class Review(db.Model):
    __tablename__ = 'review'
    
    # All the columns remain the same
    # ...existing columns...
    
    # Remove backref from child side
    reviewer = db.relationship('User', foreign_keys=[reviewer_id])
    reviewee = db.relationship('User', foreign_keys=[reviewee_id])

class Dispute(db.Model):
    __tablename__ = 'dispute'
    
    # All the columns remain the same
    # ...existing columns...
    
    # Remove backref from child side
    transaction = db.relationship('Transaction')
    complainant = db.relationship('User')

class Notification(db.Model):
    __tablename__ = 'notification'
    
    # All the columns remain the same
    # ...existing columns...
    
    # Remove backref from child side
    user = db.relationship('User')
