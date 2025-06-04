from .database import db
from flask_security import UserMixin, RoleMixin
from datetime import datetime, timezone
import json
from enum import Enum

class ProductStatus(str, Enum):
    ACTIVE = 'active'
    SOLD = 'sold'
    REMOVED = 'removed'

class ProductCondition(str, Enum):
    NEW = 'new'
    OLD = 'old'

class TransactionStatus(str, Enum):
    COMPLETED = 'completed'
    DISPUTED = 'disputed'
    REFUNDED = 'refunded'

class DisputeStatus(str, Enum):
    OPEN = 'open'
    IN_REVIEW = 'in_review'
    RESOLVED = 'resolved'
    DISMISSED = 'dismissed'

class NotificationType(str, Enum):
    NEW_BID = 'new_bid'
    NEW_MESSAGE = 'new_message'
    PRICE_DROP = 'price_drop'
    SEARCH_MATCH = 'search_match'
    AUCTION_END = 'auction_end'
    DISPUTE_UPDATE = 'dispute_update'
    REVIEW_RECEIVED = 'review_received'
    TRANSACTION_UPDATE = 'transaction_update'

# ---------------------- User, Role, and Association Table ----------------------

class Role(db.Model, RoleMixin):
    __tablename__ = 'role'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)  # 'admin' or 'user'
    description = db.Column(db.String(255))

class UsersRoles(db.Model):
    __tablename__ = 'users_roles'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))

class User(db.Model, UserMixin):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    phone_number = db.Column(db.String(20), unique=True, nullable=True)
    password = db.Column(db.String(255), nullable=False)  # This is the password_hash
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    active = db.Column(db.Boolean, nullable=False, default=True)
    
    # New verification fields
    is_verified_email = db.Column(db.Boolean, default=False)
    is_verified_phone = db.Column(db.Boolean, default=False)
    
    # Profile fields
    profile_image_url = db.Column(db.String(500), nullable=True)
    preferred_language = db.Column(db.String(10), default='en')
    
    # Rating fields
    rating_as_seller = db.Column(db.Float, default=0.0)
    rating_as_buyer = db.Column(db.Float, default=0.0)
    
    # Timestamp fields
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    
    # Relationships
    roles = db.relationship('Role', backref='bearer', secondary='users_roles')
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
    
    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'phone_number': self.phone_number,
            'is_verified_email': self.is_verified_email,
            'is_verified_phone': self.is_verified_phone,
            'profile_image_url': self.profile_image_url,
            'preferred_language': self.preferred_language,
            'rating_as_seller': self.rating_as_seller,
            'rating_as_buyer': self.rating_as_buyer,
            'active': self.active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'role': self.roles[0].name if self.roles else None
        }

# --------------------------- EcoFinds Core Models ---------------------------

class Category(db.Model):
    __tablename__ = 'category'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)

    products = db.relationship('Product', backref='category', lazy=True)

class Product(db.Model):
    __tablename__ = 'product'
    
    id = db.Column(db.Integer, primary_key=True)
    seller_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    condition = db.Column(db.Enum(ProductCondition), nullable=False, default=ProductCondition.OLD)
    price = db.Column(db.Float, nullable=False)
    is_auction = db.Column(db.Boolean, nullable=False, default=False)
    status = db.Column(db.Enum(ProductStatus), nullable=False, default=ProductStatus.ACTIVE)
    location = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    
    # Relationships
    images = db.relationship('ProductImage', backref='product', lazy=True, cascade='all, delete-orphan')
    auction = db.relationship('Auction', backref='product', uselist=False, lazy=True)
    transactions = db.relationship('Transaction', backref='product', lazy=True)
    saved_by_users = db.relationship('SavedItem', backref='product', lazy=True)
    chats = db.relationship('Chat', backref='product', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'seller_id': self.seller_id,
            'title': self.title,
            'description': self.description,
            'category': self.category.name if self.category else None,
            'category_id': self.category_id,
            'condition': self.condition.value if self.condition else None,
            'price': self.price,
            'is_auction': self.is_auction,
            'status': self.status.value,
            'location': self.location,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'images': [img.to_dict() for img in self.images],
            'auction': self.auction.to_dict() if self.auction else None
        }

class ProductImage(db.Model):
    __tablename__ = 'product_image'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id', ondelete='CASCADE'), nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'image_url': self.image_url,
            'is_primary': self.is_primary
        }

class CartItem(db.Model):
    __tablename__ = 'cart_item'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    product = db.relationship('Product')

class Purchase(db.Model):
    __tablename__ = 'purchase'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    purchased_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    product = db.relationship('Product')

class Auction(db.Model):
    __tablename__ = 'auction'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id', ondelete='CASCADE'), nullable=False)
    reserve_price = db.Column(db.Float, nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)    
    end_time = db.Column(db.DateTime, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    winning_bid_id = db.Column(db.Integer, db.ForeignKey('bid.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    
    # Relationships - Fixed circular reference
    bids = db.relationship('Bid', backref='auction', lazy=True, foreign_keys='Bid.auction_id')

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'reserve_price': self.reserve_price,
            'start_time': self.start_time.isoformat() if self.start_time else None,
            'end_time': self.end_time.isoformat() if self.end_time else None,
            'is_active': self.is_active,
            'winning_bid_id': self.winning_bid_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'current_highest_bid': max([bid.bid_amount for bid in self.bids]) if self.bids else None
        }

class Bid(db.Model):
    __tablename__ = 'bid'

    id = db.Column(db.Integer, primary_key=True)
    auction_id = db.Column(db.Integer, db.ForeignKey('auction.id', ondelete='CASCADE'), nullable=False)
    bidder_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    bid_amount = db.Column(db.Float, nullable=False)
    bid_time = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    
    def to_dict(self):
        return {
            'id': self.id,
            'auction_id': self.auction_id,
            'bidder_id': self.bidder_id,
            'bid_amount': self.bid_amount,
            'bid_time': self.bid_time.isoformat() if self.bid_time else None,
            'bidder_name': self.bidder.full_name if self.bidder else None
        }

class SavedItem(db.Model):
    __tablename__ = 'saved_item'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id', ondelete='CASCADE'), nullable=False)
    alert_on_price_drop = db.Column(db.Boolean, default=False)
    saved_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'product_id': self.product_id,
            'alert_on_price_drop': self.alert_on_price_drop,
            'saved_at': self.saved_at.isoformat() if self.saved_at else None,
            'product': self.product.to_dict() if self.product else None
        }

class SearchQuery(db.Model):
    __tablename__ = 'search_query'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    query = db.Column(db.String(255), nullable=False)
    filters_json = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'query': self.query,
            'filters': json.loads(self.filters_json) if self.filters_json else {},
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    def set_filters(self, filters):
        self.filters_json = json.dumps(filters) if filters else None

class Chat(db.Model):
    __tablename__ = 'chat'

    id = db.Column(db.Integer, primary_key=True)
    buyer_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    seller_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id', ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    
    # Relationships
    messages = db.relationship('Message', backref='chat', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'buyer_id': self.buyer_id,
            'seller_id': self.seller_id,
            'product_id': self.product_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'buyer': self.buyer.to_dict() if self.buyer else None,
            'seller': self.seller.to_dict() if self.seller else None,
            'product': self.product.to_dict() if self.product else None,
            'messages': [msg.to_dict() for msg in self.messages]
        }

class Message(db.Model):
    __tablename__ = 'message'

    id = db.Column(db.Integer, primary_key=True)
    chat_id = db.Column(db.Integer, db.ForeignKey('chat.id', ondelete='CASCADE'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    sent_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    is_read = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'id': self.id,
            'chat_id': self.chat_id,
            'sender_id': self.sender_id,
            'content': self.content,
            'sent_at': self.sent_at.isoformat() if self.sent_at else None,
            'is_read': self.is_read,
            'sender_name': self.sender.full_name if self.sender else None
        }

class Transaction(db.Model):
    __tablename__ = 'transaction'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id', ondelete='CASCADE'), nullable=False)
    buyer_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    seller_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    price_paid = db.Column(db.Float, nullable=False)
    transaction_date = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    status = db.Column(db.Enum(TransactionStatus), nullable=False, default=TransactionStatus.COMPLETED)
    
    # Relationships
    buyer = db.relationship('User', foreign_keys=[buyer_id])
    seller = db.relationship('User', foreign_keys=[seller_id])
    reviews = db.relationship('Review', backref='transaction', lazy=True, cascade='all, delete-orphan')
    dispute = db.relationship('Dispute', backref='transaction', uselist=False, lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'buyer_id': self.buyer_id,
            'seller_id': self.seller_id,
            'price_paid': self.price_paid,
            'transaction_date': self.transaction_date.isoformat() if self.transaction_date else None,
            'status': self.status.value,
            'product': self.product.to_dict() if self.product else None,
            'buyer': self.buyer.to_dict() if self.buyer else None,
            'seller': self.seller.to_dict() if self.seller else None
        }

class Review(db.Model):
    __tablename__ = 'review'

    id = db.Column(db.Integer, primary_key=True)
    transaction_id = db.Column(db.Integer, db.ForeignKey('transaction.id', ondelete='CASCADE'), nullable=False)
    reviewer_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    reviewee_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    __table_args__ = (
        db.CheckConstraint('rating >= 1 AND rating <= 5', name='check_rating_range'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'transaction_id': self.transaction_id,
            'reviewer_id': self.reviewer_id,
            'reviewee_id': self.reviewee_id,
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'reviewer_name': self.reviewer.full_name if self.reviewer else None,
            'reviewee_name': self.reviewee.full_name if self.reviewee else None
        }

class Dispute(db.Model):
    __tablename__ = 'dispute'

    id = db.Column(db.Integer, primary_key=True)
    transaction_id = db.Column(db.Integer, db.ForeignKey('transaction.id', ondelete='CASCADE'), nullable=False)
    complainant_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    description = db.Column(db.Text, nullable=False)
    evidence_urls = db.Column(db.Text, nullable=True)  # Store as JSON string
    status = db.Column(db.Enum(DisputeStatus), nullable=False, default=DisputeStatus.OPEN)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'transaction_id': self.transaction_id,
            'complainant_id': self.complainant_id,
            'description': self.description,
            'evidence_urls': json.loads(self.evidence_urls) if self.evidence_urls else [],
            'status': self.status.value,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'transaction': self.transaction.to_dict() if self.transaction else None,
            'complainant': self.complainant.to_dict() if self.complainant else None
        }

    def set_evidence_urls(self, urls):
        self.evidence_urls = json.dumps(urls) if urls else None

class Notification(db.Model):
    __tablename__ = 'notification'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    payload = db.Column(db.Text, nullable=False)
    read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'type': self.type,
            'payload': json.loads(self.payload),
            'read': self.read,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        
    def set_payload(self, payload_dict):
        self.payload = json.dumps(payload_dict)