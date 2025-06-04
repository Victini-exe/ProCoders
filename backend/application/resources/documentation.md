# Chat System API

## Endpoints

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

## Response Objects

### Chat Object
```json
{
  "id": "integer",
  "buyer_id": "integer",
  "seller_id": "integer",
  "product_id": "integer",
  "created_at": "datetime",
  "messages": ["Message objects"]
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
  "is_read": "boolean"
}
```

## Notes
- All endpoints require authentication token
- Only buyers can initiate chats
- Messages are automatically marked as read when chat is viewed
