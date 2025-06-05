from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_security import current_user
from .models import Message, Chat
from .database import db
from datetime import datetime

socketio = SocketIO()

@socketio.on('connect')
def handle_connect():
    if not current_user.is_authenticated:
        return False
    # Join user's personal room for private messages
    join_room(f'user_{current_user.id}')
    return True

@socketio.on('disconnect')
def handle_disconnect():
    if current_user.is_authenticated:
        leave_room(f'user_{current_user.id}')

@socketio.on('join_chat')
def handle_join_chat(chat_id):
    if not current_user.is_authenticated:
        return False
        
    chat = Chat.query.get(chat_id)
    if not chat or current_user.id not in [chat.buyer_id, chat.seller_id]:
        return False
        
    join_room(f'chat_{chat_id}')
    return True

@socketio.on('leave_chat')
def handle_leave_chat(chat_id):
    leave_room(f'chat_{chat_id}')

@socketio.on('send_message')
def handle_send_message(data):
    if not current_user.is_authenticated:
        return False
        
    chat_id = data.get('chat_id')
    content = data.get('content')
    
    if not chat_id or not content or not content.strip():
        return False
        
    chat = Chat.query.get(chat_id)
    if not chat or current_user.id not in [chat.buyer_id, chat.seller_id]:
        return False
        
    new_message = Message(
        chat_id=chat_id,
        sender_id=current_user.id,
        content=content
    )
    
    db.session.add(new_message)
    db.session.commit()
    
    message_data = new_message.to_dict()
    
    # Emit to the chat room
    emit('new_message', message_data, room=f'chat_{chat_id}')
    
    # Emit to the other user's personal room for notifications
    other_user_id = chat.seller_id if current_user.id == chat.buyer_id else chat.buyer_id
    emit('message_notification', {
        'chat_id': chat_id,
        'message': message_data
    }, room=f'user_{other_user_id}')
    
    return True

@socketio.on('mark_messages_read')
def handle_mark_messages_read(chat_id):
    if not current_user.is_authenticated:
        return False
        
    chat = Chat.query.get(chat_id)
    if not chat or current_user.id not in [chat.buyer_id, chat.seller_id]:
        return False
        
    # Mark messages from the other user as read
    if chat.buyer_id == current_user.id:
        unread_messages = Message.query.filter_by(
            chat_id=chat_id,
            sender_id=chat.seller_id,
            is_read=False
        ).all()
    else:
        unread_messages = Message.query.filter_by(
            chat_id=chat_id,
            sender_id=chat.buyer_id,
            is_read=False
        ).all()
        
    for message in unread_messages:
        message.is_read = True
        
    db.session.commit()
    
    # Notify the sender that their messages were read
    emit('messages_read', {
        'chat_id': chat_id,
        'reader_id': current_user.id
    }, room=f'chat_{chat_id}')
    
    return True 