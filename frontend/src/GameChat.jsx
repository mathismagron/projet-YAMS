import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function GameChat({ gameId, user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/chat/${gameId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages", error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 2000);
    return () => clearInterval(intervalId);
  }, [gameId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post(`/api/chat/${gameId}`, {
        authorName: user.username,
        content: newMessage
      });
      setNewMessage("");
      fetchMessages();
    } catch (error) {
      console.error("Erreur lors de l'envoi du message", error);
    }
  };

  return (
    <div style={{ marginTop: "30px", border: "1px solid #ccc", borderRadius: "5px", padding: "10px", backgroundColor: "#fff", display: "flex", flexDirection: "column", height: "300px" }}>
      <h3 style={{ margin: "0 0 10px 0", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>Chat de la partie</h3>
      
      <div style={{ flex: 1, overflowY: "auto", marginBottom: "10px", padding: "5px" }}>
        {messages.length === 0 ? (
          <p style={{ color: "#aaa", textAlign: "center", fontStyle: "italic" }}>Aucun message pour le moment.</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} style={{ marginBottom: "8px", textAlign: msg.authorName === user.username ? "right" : "left" }}>
              <span style={{ fontSize: "12px", color: "#666", marginRight: "5px" }}>
                {msg.authorName} :
              </span>
              <span style={{ 
                display: "inline-block", 
                backgroundColor: msg.authorName === user.username ? "#007bff" : "#e9ecef", 
                color: msg.authorName === user.username ? "white" : "black", 
                padding: "6px 10px", 
                borderRadius: "15px",
                maxWidth: "80%",
                wordBreak: "break-word"
              }}>
                {msg.content}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "10px" }}>
        <input 
          type="text" 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)} 
          placeholder="Écrivez un message..." 
          style={{ flex: 1, padding: "8px", borderRadius: "3px", border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ padding: "8px 15px", border: "none", backgroundColor: "#28a745", color: "white", borderRadius: "3px", cursor: "pointer" }}>
          Envoyer
        </button>
      </form>
    </div>
  );
}

export default GameChat;