from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
import pyotp
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature

app = Flask(__name__)

# SQLite config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ecofinds.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Flask-Mail config (Gmail example)
app.config.update(
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USERNAME='your-email@gmail.com',  # Replace with your email
    MAIL_PASSWORD='your-app-password',     # Replace with your app password
    SECRET_KEY='a-very-secret-key'
)

db = SQLAlchemy(app)
mail = Mail(app)
serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])


# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    email_confirmed = db.Column(db.Boolean, default=False)
    otp_secret = db.Column(db.String(16))  # Base32 secret for TOTP


def create_tables():
    db.create_all()


@app.route('/')
def home():
    return jsonify({"message": "EcoFinds OTP API is running"}), 200


@app.route('/signup', methods=['POST'])
def signup():
    data = request.json or {}
    email = data.get('email')
    if not email:
        return jsonify({"error": "Email is required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 400

    otp_secret = pyotp.random_base32()
    user = User(email=email, email_confirmed=False, otp_secret=otp_secret)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": f"User {email} created. Please verify your email."}), 201


@app.route('/send_otp', methods=['POST'])
def send_otp():
    data = request.json or {}
    email = data.get('email')
    if not email:
        return jsonify({'error': 'Email required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    totp = pyotp.TOTP(user.otp_secret, digits=6)
    otp = totp.now()

    print(f"[DEBUG] Sending OTP '{otp}' to {email}")

    msg = Message("Your EcoFinds OTP",
                  sender=app.config['MAIL_USERNAME'],
                  recipients=[email])
    msg.body = f"Your OTP is {otp}. It is valid for 5 minutes."

    try:
        mail.send(msg)
    except Exception as e:
        print(f"[ERROR] Mail sending failed: {e}")
        return jsonify({"error": "Failed to send OTP email"}), 500

    return jsonify({"message": "OTP sent to email"}), 200


@app.route('/verify_otp', methods=['POST'])
def verify_otp():
    data = request.json or {}
    email = data.get('email')
    otp = data.get('otp')

    if not email or not otp:
        return jsonify({'error': 'Email and OTP required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    totp = pyotp.TOTP(user.otp_secret, digits=6)
    if totp.verify(otp, valid_window=1):  # Accept OTP valid within 30s before or after
        return jsonify({"message": "OTP verified"}), 200
    else:
        return jsonify({"error": "Invalid or expired OTP"}), 400


@app.route('/send_confirmation', methods=['POST'])
def send_confirmation():
    data = request.json or {}
    email = data.get('email')
    if not email:
        return jsonify({'error': 'Email required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    token = serializer.dumps(email, salt='email-confirm')
    # Changed to backend URL for testing; update as needed
    confirm_url = f"http://localhost:5000/confirm_email/{token}"

    print(f"[DEBUG] Sending confirmation link: {confirm_url} to {email}")

    msg = Message("Confirm your EcoFinds account",
                  sender=app.config['MAIL_USERNAME'],
                  recipients=[email])
    msg.body = f"Please click the link to confirm your email: {confirm_url}"

    try:
        mail.send(msg)
    except Exception as e:
        print(f"[ERROR] Mail sending failed: {e}")
        return jsonify({"error": "Failed to send confirmation email"}), 500

    return jsonify({"message": "Confirmation email sent"}), 200


@app.route('/confirm_email/<token>', methods=['GET'])
def confirm_email(token):
    try:
        email = serializer.loads(token, salt='email-confirm', max_age=3600)  # 1 hour expiry
    except SignatureExpired:
        return jsonify({"error": "The confirmation link has expired."}), 400
    except BadSignature:
        return jsonify({"error": "Invalid confirmation token."}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found."}), 404

    if user.email_confirmed:
        return jsonify({"message": "Email already confirmed."}), 200

    user.email_confirmed = True
    db.session.commit()

    return jsonify({"message": f"Email {email} confirmed successfully!"}), 200


if __name__ == "__main__":
    with app.app_context():
        create_tables()
    app.run(debug=True)
