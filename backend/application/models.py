from .database import db
from flask_security import UserMixin, RoleMixin
from datetime import datetime, timezone

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
    email = db.Column(db.String(255), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    active = db.Column(db.Boolean, nullable=False, default=True)
    display_name = db.Column(db.String(80), nullable=False)
    address = db.Column(db.String(255), nullable=True)

    roles = db.relationship('Role', backref='bearer', secondary='users_roles')
    products = db.relationship('Product', backref='seller', lazy=True)
    cart_items = db.relationship('CartItem', backref='user', lazy=True)
    purchases = db.relationship('Purchase', backref='user', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'active': self.active,
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
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=True, default=0.0)  # Default price is 0.0
    quantity = db.Column(db.Integer, nullable=True, default=1)  # Default quantity is 1
    condition = db.Column(db.String(50), nullable=True, default='used')  # e.g., 'new', 'used'
    yome = db.Column(db.String(4), nullable=True, default='1969')  # Year of manufacture
    brand = db.Column(db.String(80), nullable=True)  # Brand name
    model = db.Column(db.String(80), nullable=True)  # Model name
    dimensions = db.Column(db.String(50), nullable=True)  # Dimensions of the product
    weight = db.Column(db.Float, nullable=True)  # Weight of the product
    material = db.Column(db.String(50), nullable=True)  # Material of the product
    original_packaging = db.Column(db.Boolean, nullable=False, default=False)  # Checkbox for original packaging
    manual_included = db.Column(db.Boolean, nullable=False, default=False)  # Checkbox for manual included
    working_condition_desc = db.Column(db.Text, nullable=True)  # Description of working condition
    image_url = db.Column(db.String(255)) 
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    seller_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)

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