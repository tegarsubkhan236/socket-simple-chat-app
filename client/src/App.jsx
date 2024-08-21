import { useState, useEffect } from 'react';

function App() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prevMessages => [...prevMessages, message]);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = {
        username: username,
        text: input,
      };
      socket.send(JSON.stringify(message));
      setInput('');
    }
  };

  const handleUsernameSubmit = () => {
    if (username.trim() !== '') {
      setIsUsernameSet(true);
    }
  };

  return (
      <div>
        {!isUsernameSet ? (
            <div>
              <h2>Set your username</h2>
              <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
              />
              <button onClick={handleUsernameSubmit}>Set Username</button>
            </div>
        ) : (
            <div>
              <h1>WebSocket Chat</h1>
              <div style={{ border: '1px solid black', padding: '10px', height: '300px', overflowY: 'scroll' }}>
                {messages.map((message, index) => (
                    <p key={index}><strong>{message.username}</strong> ({message.time}): {message.text}</p>
                ))}
              </div>
              <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
        )}
      </div>
  );
}

export default App;