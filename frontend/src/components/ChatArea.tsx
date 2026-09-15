import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Message } from '../types';
import { MessageBubble } from './MessageBubble';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  onViewArtifact?: (artifactId: string) => void;
}

const STARTER_PROMPTS = [
  {
    tag: 'Grounded QA',
    text: 'How did Shreyas Doshi define High Agency for product managers?',
  },
  {
    tag: 'B2B Growth',
    text: 'What is Elena Verna’s thesis on Reverse Trials vs Freemium?',
  },
  {
    tag: 'Ship 30 Essay',
    text: 'Write a Ship 30 style essay on Brian Chesky’s Founder Mode and product craft.',
  },
  {
    tag: 'HTML Artifact',
    text: 'Generate an HTML growth metric scorecard dashboard based on Gustaf Alströmer.',
  },
];

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onViewArtifact,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
  };

  return (
    <div className="chat-section">
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎙️</div>
            <h2 className="empty-title">The Lenny Growth Assistant</h2>
            <p className="empty-subtitle">
              Ask product and growth questions strictly grounded in Lenny’s Podcast transcripts,
              generate Ship 30 for 30 essays (~1,250 words), or create sandboxed HTML artifacts.
            </p>

            <div className="starter-grid">
              {STARTER_PROMPTS.map((starter, idx) => (
                <div
                  key={idx}
                  className="starter-card"
                  onClick={() => onSendMessage(starter.text)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="starter-tag">{starter.tag}</div>
                  <div className="starter-text">{starter.text}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <MessageBubble key={m.id} message={m} onViewArtifact={onViewArtifact} />
          ))
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="message-row assistant">
            <div className="message-meta">
              <Sparkles size={13} color="#06B6D4" />
              <span>Searching transcripts & synthesizing...</span>
            </div>
            <div className="message-bubble" style={{ width: 'auto' }}>
              <div className="shimmer">
                <span className="dot-flashing" />
                <span>Formulating grounded answer...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="chat-input-bar">
        <form onSubmit={handleSubmit} className="input-container">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask a product question, request a Ship 30 essay, or generate an artifact..."
            className="chat-textarea"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="send-btn"
            disabled={!input.trim() || isLoading}
            id="btn-send-message"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
