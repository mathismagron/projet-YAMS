import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function DirectChat({ user, friend, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 2000);
    return () => clearInterval(intervalId);
  }, [friend.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/messages/history?userId1=${user.id}&userId2=${friend.id}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post('/api/messages/send', {
        senderId: user.id,
        receiverId: friend.id,
        content: newMessage
      });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error("Erreur lors de l'envoi du message", error);
    }
  };

  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px', width: '300px', 
      backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column',
      zIndex: 1000
    }}>
      <div style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
        <strong>Chat avec {friend.username}</strong>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>✖</button>
      </div>
      
      <div style={{ height: '300px', overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {messages.map(msg => {
          const isMe = msg.sender.id === user.id;
          return (
            <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
              <div style={{ fontSize: '0.7em', color: 'gray', marginBottom: '2px', textAlign: isMe ? 'right' : 'left' }}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={{ 
                padding: '8px 12px', 
                backgroundColor: isMe ? '#007bff' : '#f1f0f0', 
                color: isMe ? 'white' : 'black', 
                borderRadius: '15px' 
              }}>
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} style={{ display: 'flex', padding: '10px', borderTop: '1px solid #eee' }}>
        <input 
          type="text" 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)} 
          placeholder="Message..." 
          style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button type="submit" style={{ marginLeft: '5px', padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
          OK
        </button>
      </form>
    </div>
  );
}

export default DirectChat;
