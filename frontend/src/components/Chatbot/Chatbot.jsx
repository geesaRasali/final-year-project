import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: 'http://localhost:4000/api/chat' }),
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || isLoading) return;
    setInputText('');
    sendMessage({ text });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Extract text content from a message (v3 uses parts array)
  const getMessageText = (message) => {
    if (!message.parts) return '';
    return message.parts
      .filter((p) => p.type === 'text')
      .map((p) => p.text)
      .join('');
  };

  return (
    <div className="chatbot-container">
      {isOpen ? (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>AI Assistant</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="close-btn"
            >
              ✕
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.length === 0 && (
              <p className="chatbot-greeting">Hi! How can I help you today?</p>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`chat-message ${
                  m.role === 'user' ? 'user-message' : 'ai-message'
                }`}
              >
                <div className="message-content">{getMessageText(m)}</div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-message ai-message">
                <div className="message-content typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-form">
            <input
              className="chatbot-input"
              value={inputText}
              placeholder="Type your message..."
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              className="chatbot-submit"
              onClick={handleSend}
              disabled={isLoading}
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="chatbot-toggle-btn"
          onClick={() => setIsOpen(true)}
        >
          💬 Chat
        </button>
      )}
    </div>
  );
};

export default Chatbot;
