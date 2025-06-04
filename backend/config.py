import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # Common configurations
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECURITY_PASSWORD_HASH = "bcrypt"
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "Authorization"
    SECURITY_REDIRECT_BEHAVIOR = "spa"  # Disable redirects to login page
    SECURITY_UNAUTHORIZED_VIEW = None  # Return a 401 response instead of redirecting

class DevelopmentConfig(Config):
    # Development configurations
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///database.sqlite3')
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    SECURITY_PASSWORD_SALT = os.getenv('SECURITY_PASSWORD_SALT', 'dev-salt-change-in-production')
    WTF_CSRF_ENABLED = False  # Disable CSRF for development
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'dev-jwt-secret-change-in-production')

class ProductionConfig(Config):
    # Production configurations
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SECRET_KEY = os.getenv('SECRET_KEY')
    SECURITY_PASSWORD_SALT = os.getenv('SECURITY_PASSWORD_SALT')
    WTF_CSRF_ENABLED = True  # Enable CSRF for production
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')

class TestingConfig(Config):
    # Testing configurations
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///test_database.sqlite3'
    SECRET_KEY = 'test-key'
    SECURITY_PASSWORD_SALT = 'test-salt'
    WTF_CSRF_ENABLED = False
    JWT_SECRET_KEY = 'test-jwt-key'
