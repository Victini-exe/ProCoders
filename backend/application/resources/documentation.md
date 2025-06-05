# Chat System API

## REST Endpoints

### 1. `/chats`
- **POST** - Create/Get chat
  ```json
  {
    "product_id": "integer"
  }
  ```

- **GET** - List all user's chats
  - Returns array of chat objects with messages

### 2. `/chats/<chat_id>`
- **GET** - Get chat details and messages
  - Automatically marks messages as read
  - Returns chat object with messages

### 3. `/chats/<chat_id>/messages`
- **POST** - Send message
  ```json
  {
    "content": "string"
  }
  ```

- **GET** - Get all messages in chat
  - Returns chronologically ordered messages

### 4. `/chats/unread`
- **GET** - Get unread message counts
  ```json
  {
    "total_unread": "integer",
    "unread_by_chat": {
      "chat_id": "count"
    }
  }
  ```

## Real-time Events (Socket.IO)

### Connection
- **Event**: `connect`
  - Authenticates user and joins them to their personal room
  - **Response**: `boolean` - Connection success status

- **Event**: `disconnect`
  - Handles user disconnection from Socket.IO server

### Chat Room Management
- **Event**: `join_chat`
  - **Data**: `chat_id` (integer)
  - **Response**: `boolean` - Join success status
  - Joins user to a specific chat room for real-time updates

- **Event**: `leave_chat`
  - **Data**: `chat_id` (integer)
  - Removes user from a chat room

### Messaging
- **Event**: `send_message`
  - **Data**:
    ```json
    {
      "chat_id": "integer",
      "content": "string"
    }
    ```
  - **Response**: `boolean` - Message send success status
  - **Emits**:
    - `new_message` to chat room
    - `message_notification` to recipient's personal room

- **Event**: `mark_messages_read`
  - **Data**: `chat_id` (integer)
  - **Response**: `boolean` - Operation success status
  - **Emits**: `messages_read` to chat room

### Event Listeners
- **Event**: `new_message`
  - **Data**:
    ```json
    {
      "id": "integer",
      "chat_id": "integer",
      "sender_id": "integer",
      "content": "string",
      "sent_at": "datetime",
      "is_read": "boolean",
      "sender_name": "string"
    }
    ```

- **Event**: `message_notification`
  - **Data**:
    ```json
    {
      "chat_id": "integer",
      "message": "Message object"
    }
    ```

- **Event**: `messages_read`
  - **Data**:
    ```json
    {
      "chat_id": "integer",
      "reader_id": "integer"
    }
    ```

## Response Objects

### Chat Object
```json
{
  "id": "integer",
  "buyer_id": "integer",
  "seller_id": "integer",
  "product_id": "integer",
  "created_at": "datetime",
  "messages": ["Message objects"],
  "buyer": "User object",
  "seller": "User object",
  "product": "Product object"
}
```

### Message Object
```json
{
  "id": "integer",
  "chat_id": "integer",
  "sender_id": "integer",
  "content": "string",
  "sent_at": "datetime",
  "is_read": "boolean",
  "sender_name": "string"
}
```

## Implementation Notes

### Authentication
- All REST endpoints require authentication token
- Socket.IO connection requires authentication
- Only buyers can initiate chats
- Users can only access chats they are part of

### Real-time Features
- Messages are delivered instantly to all connected clients in the chat
- Users receive notifications for new messages even when not in the chat
- Read receipts are sent automatically when messages are viewed
- Each user has a personal notification room
- Each chat has its own room for real-time updates

### Room Structure
- Personal rooms: `user_{user_id}`
  - Used for user-specific notifications
- Chat rooms: `chat_{chat_id}`
  - Used for real-time chat messages and updates

### Best Practices
1. Always join chat room when opening a chat
2. Leave chat room when closing/switching chats
3. Handle reconnection scenarios in the client
4. Implement error handling for failed message sends
5. Update UI optimistically while waiting for server confirmation

# Wishlist API

## Endpoints

### 1. `/wishlist`
- **POST** - Add item to wishlist
  ```json
  {
    "product_id": "integer",
    "alert_on_price_drop": "boolean"
  }
  ```

- **GET** - Get all wishlist items
  - Returns array of saved items with product details

### 2. `/wishlist/<item_id>`
- **DELETE** - Remove item from wishlist
- **PATCH** - Update price drop alert
  ```json
  {
    "alert_on_price_drop": "boolean"
  }
  ```

## Response Objects

### SavedItem Object
```json
{
  "id": "integer",
  "user_id": "integer",
  "product_id": "integer",
  "alert_on_price_drop": "boolean",
  "saved_at": "datetime",
  "product": "Product object"
}
```

## Notes
- All endpoints require authentication token
- Users can only access their own wishlist items
- Price drop alerts can be toggled per item
