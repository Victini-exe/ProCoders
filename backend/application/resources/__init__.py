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
    api.add_resource(ProductListResource, '/products')
    api.add_resource(ProductResource, '/products/<int:product_id>')

    # Cart endpoints
    from .cart import CartListResource, CartItemResource
    api.add_resource(CartListResource, '/cart')
    api.add_resource(CartItemResource, '/cart/item', '/cart/item/<int:cart_item_id>')

    # User endpoints
    from .user import UserListResource, UserResource
    api.add_resource(UserListResource, '/users')
    api.add_resource(UserResource, '/users/<int:user_id>')

    # Category endpoints
    from .category import CategoryListResource, CategoryResource
    api.add_resource(CategoryListResource, '/api/categories')
    api.add_resource(CategoryResource, '/api/categories/<int:category_id>')

    # Chat endpoints
    from .chat import ChatResource, ChatDetailResource, MessageResource, UnreadMessagesResource
    api.add_resource(ChatResource, '/chats')
    api.add_resource(ChatDetailResource, '/chats/<int:chat_id>')
    api.add_resource(MessageResource, '/chats/<int:chat_id>/messages')
    api.add_resource(UnreadMessagesResource, '/chats/unread')
