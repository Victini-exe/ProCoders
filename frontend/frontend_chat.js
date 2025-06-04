import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChatBox = ({ productId, buyerId, sellerId, senderId }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');

  const sendMessage = async () => {
    if (!content.trim()) return;

    try {
      await axios.post('http://localhost:5000/messages', {
        product_id: productId,
        buyer_id: buyerId,
        seller_id: sellerId,
        sender_id: senderId,
        content
      });
      setContent('');
      fetchMessages(); // still fine to call directly
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get('http://localhost:5000/messages', {
        params: {
          product_id: productId,
          buyer_id: buyerId,
          seller_id: sellerId
        }
      });
      setMessages(res.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Polling every 3s

    return () => clearInterval(interval); // cleanup on unmount
  }, [productId, buyerId, sellerId]);

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', maxWidth: '600px' }}>
      <h2>Product Chat</h2>
      <div style={{ maxHeight: '300px', overflowY: 'scroll', marginBottom: '1rem' }}>
        {messages.map((msg, i) => (
          <p key={i}>
            <b>{msg.sender_id === senderId ? 'You' : 'Them'}:</b> {msg.content}
          </p>
        ))}
      </div>
      <input
        style={{ width: '80%', marginRight: '0.5rem' }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;
