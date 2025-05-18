from flask_restful import Api

def register_resources(api: Api):
    """Register all API resources"""
    from .auth import LoginResource, SignupResource, LogoutResource
    
    # Auth endpoints
    api.add_resource(LoginResource, '/api/login')
    api.add_resource(SignupResource, '/api/signup/')
    api.add_resource(LogoutResource, '/api/logout')

    from .product import ProductListResource, ProductResource
    
    api.add_resource(ProductListResource, '/products')
    api.add_resource(ProductResource, '/products/<int:product_id>')
