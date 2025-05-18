from flask import Blueprint, request, jsonify
from models import db, User, Product, Purchase, Category, CartItem, Review
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api_routes = Blueprint('api', __name__)

@api_routes.route('/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered'}), 400
    user = User(email=data['email'], password=data['password'], name=data.get('name', ''))
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'})

@api_routes.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email'], password=data['password']).first()
    if user:
        token = create_access_token(identity=user.id)
        return jsonify({'token': token, 'user_id': user.id, 'role': user.role})
    return jsonify({'message': 'Invalid credentials'}), 401

@api_routes.route('/user', methods=['GET', 'PUT'])
@jwt_required()
def manage_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if request.method == 'GET':
        return jsonify({
            'email': user.email,
            'name': user.name,
            'role': user.role
        })
    elif request.method == 'PUT':
        data = request.json
        user.name = data.get('name', user.name)
        db.session.commit()
        return jsonify({'message': 'Profile updated'})

@api_routes.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([{'id': c.id, 'name': c.name} for c in categories])

@api_routes.route('/categories', methods=['POST'])
@jwt_required()
def add_category():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user.role != 'admin':
        return jsonify({'message': 'Admin privileges required'}), 403
    data = request.json
    if Category.query.filter_by(name=data['name']).first():
        return jsonify({'message': 'Category already exists'}), 400
    new_cat = Category(name=data['name'])
    db.session.add(new_cat)
    db.session.commit()
    return jsonify({'message': 'Category added', 'id': new_cat.id})

@api_routes.route('/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    search = request.args.get('search')
    query = Product.query
    if category:
        cat = Category.query.filter_by(name=category).first()
        if cat:
            query = query.filter_by(category_id=cat.id)
        else:
            return jsonify([])  # No products if category not found
    if search:
        query = query.filter(Product.title.contains(search))
    products = query.all()
    return jsonify([{
        'id': p.id,
        'title': p.title,
        'description': p.description,
        'category': p.category_obj.name if p.category_obj else None,
        'price': p.price
    } for p in products])

@api_routes.route('/product/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get(product_id)
    if product:
        return jsonify({
            'title': product.title,
            'price': product.price,
            'category': product.category_obj.name if product.category_obj else None,
            'description': product.description
        })
    return jsonify({'message': 'Product not found'}), 404

@api_routes.route('/add_product', methods=['POST'])
@jwt_required()
def add_product():
    data = request.json
    current_user = get_jwt_identity()

    category_name = data.get('category')
    category_obj = None
    if category_name:
        category_obj = Category.query.filter_by(name=category_name).first()
        if not category_obj:
            return jsonify({'message': 'Category not found'}), 400

    product = Product(
        title=data['title'],
        description=data['description'],
        category_id=category_obj.id if category_obj else None,
        price=data['price'],
        user_id=current_user
    )
    db.session.add(product)
    db.session.commit()
    return jsonify({'message': 'Product added successfully'})

@api_routes.route('/my_listings', methods=['GET'])
@jwt_required()
def get_my_listings():
    user_id = get_jwt_identity()
    listings = Product.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': p.id,
        'title': p.title,
        'price': p.price
    } for p in listings])

@api_routes.route('/delete_product/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    product = Product.query.get(product_id)
    current_user = get_jwt_identity()
    if product and product.user_id == current_user:
        db.session.delete(product)
        db.session.commit()
        return jsonify({'message': 'Product deleted'})
    return jsonify({'message': 'Product not found or unauthorized'}), 404

@api_routes.route('/purchase', methods=['POST'])
@jwt_required()
def purchase():
    data = request.json
    user_id = get_jwt_identity()
    for product_id in data.get('product_ids', []):
        purchase = Purchase(user_id=user_id, product_id=product_id)
        db.session.add(purchase)
    db.session.commit()
    return jsonify({'message': 'Purchase successful'})

@api_routes.route('/purchases', methods=['GET'])
@jwt_required()
def get_purchases():
    user_id = get_jwt_identity()
    purchases = Purchase.query.filter_by(user_id=user_id).all()
    results = []
    for p in purchases:
        product = Product.query.get(p.product_id)
        if product:
            results.append({
                'title': product.title,
                'price': product.price
            })
    return jsonify(results)

@api_routes.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    result = []
    for item in cart_items:
        product = Product.query.get(item.product_id)
        if product:
            result.append({
                'cart_item_id': item.id,
                'product_id': product.id,
                'title': product.title,
                'price': product.price,
                'quantity': item.quantity
            })
    return jsonify(result)

@api_routes.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    data = request.json
    product_id = data['product_id']
    quantity = data.get('quantity', 1)
    existing_item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    if existing_item:
        existing_item.quantity += quantity
    else:
        new_item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
        db.session.add(new_item)
    db.session.commit()
    return jsonify({'message': 'Added to cart'})

@api_routes.route('/cart/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(item_id):
    user_id = get_jwt_identity()
    item = CartItem.query.get(item_id)
    if not item or item.user_id != user_id:
        return jsonify({'message': 'Item not found or unauthorized'}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Removed from cart'})
@api_routes.route('/reviews/<int:product_id>', methods=['GET'])
def get_reviews(product_id):
    reviews = Review.query.filter_by(product_id=product_id).all()
    return jsonify([{
        'user_id': r.user_id,
        'rating': r.rating,
        'comment': r.comment,
        'timestamp': r.timestamp.isoformat()
    } for r in reviews])

@api_routes.route('/reviews/<int:product_id>', methods=['POST'])
@jwt_required()
def add_review(product_id):
    user_id = get_jwt_identity()
    data = request.json
    rating = data.get('rating')
    comment = data.get('comment', '')
    if not rating or rating < 1 or rating > 5:
        return jsonify({'message': 'Rating must be between 1 and 5'}), 400

    review = Review(user_id=user_id, product_id=product_id, rating=rating, comment=comment)
    db.session.add(review)
    db.session.commit()
    return jsonify({'message': 'Review added'})
