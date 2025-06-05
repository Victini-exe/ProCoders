from flask_restful import Api

def register_resources(api: Api):
    """Register all API resources"""

    # Auth endpoints
    from .auth import LoginResource, SignupResource, LogoutResource
    api.add_resource(LoginResource, '/api/login')
    api.add_resource(SignupResource, '/api/signup')
    api.add_resource(LogoutResource, '/api/logout')

    # Product endpoints
    from .product import ProductListResource, ProductResource
    api.add_resource(ProductListResource, '/api/products')
    api.add_resource(ProductResource, '/api/products/<int:product_id>')

    # Cart endpoints
    from .cart import CartListResource, CartItemResource
    api.add_resource(CartListResource, '/api/cart')
    api.add_resource(CartItemResource, '/api/cart/item', '/api/cart/item/<int:cart_item_id>')

    # User endpoints
    from .user import UserListResource, UserResource
    api.add_resource(UserListResource, '/api/users')
    api.add_resource(UserResource, '/api/users/<int:user_id>')

    # Category endpoints
    from .category import CategoryListResource, CategoryResource
    api.add_resource(CategoryListResource, '/api/categories')
    api.add_resource(CategoryResource, '/api/categories/<int:category_id>')

    # Chat endpoints
    from .chat import ChatResource, ChatDetailResource, MessageResource, UnreadMessagesResource
    api.add_resource(ChatResource, '/api/chats')
    api.add_resource(ChatDetailResource, '/api/chats/<int:chat_id>')
    api.add_resource(MessageResource, '/api/chats/<int:chat_id>/messages')
    api.add_resource(UnreadMessagesResource, '/api/chats/unread')

    # Wishlist endpoints
    from .wishlist import WishlistResource, WishlistItemResource
    api.add_resource(WishlistResource, '/api/wishlist')
    api.add_resource(WishlistItemResource, '/api/wishlist/<int:item_id>')
