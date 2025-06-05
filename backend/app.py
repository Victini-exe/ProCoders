from flask import Flask
from application import create_app
from application.socket_events import socketio

app = create_app()

if __name__ == "__main__":
    socketio.run(app, debug=True)
