from flask import Flask
from flask_cors import CORS
from routes import api_routes
from flask_jwt_extended import JWTManager

app = Flask(__name__)
CORS(app)
app.config['JWT_SECRET_KEY'] = 'super-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

jwt = JWTManager(app)

from models import db
db.init_app(app)

with app.app_context():
    db.create_all()

app.register_blueprint(api_routes)

if __name__ == '__main__':
    app.run(debug=True)
