import { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import { C, F } from '../../data/tokens';
import { chatResponses } from '../../data/timeline';
import { connectedSources } from '../../data/sources';
import type { PlayerTab } from '../layout/BottomNav';

interface ChatPanelProps {
  open: boolean;
  onClose: () => void;
  activeTab: PlayerTab;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const suggestedPrompts = [
  'Why was my last round worse than usual?',
  'Compare my driving this month vs. last month',
  'What should I practice before my next lesson?',
  'How has my iron accuracy changed since the fitting?',
];

export default function ChatPanel({ open, onClose, activeTab }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (text: string) => {
    const userMsg: Message = { role: 'user', text };
    const response = chatResponses[text] || 'I can help with questions about your golf data. Try one of the suggested prompts to see cross-source intelligence in action.';
    const assistantMsg: Message = { role: 'assistant', text: response };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput('');
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: C.bg,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: '#1A1F2B',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.conf }} />
          <span style={{ fontFamily: F.brand, fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>
            Ask Looper
          </span>
          <span style={{ fontFamily: F.data, fontSize: 9, color: 'rgba(255,255,255,0.5)' }}>
            {connectedSources.length} sources
          </span>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
        >
          <X size={18} color="rgba(255,255,255,0.7)" />
        </button>
      </div>

      {/* Context pill */}
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        <span
          style={{
            fontFamily: F.data,
            fontSize: 9,
            fontWeight: 700,
            color: C.muted,
            background: C.surfaceAlt,
            padding: '3px 10px',
            borderRadius: 10,
            textTransform: 'uppercase',
            letterSpacing: '.06em',
          }}
        >
          Context: {activeTab}
        </span>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {messages.length === 0 && (
          <div style={{ padding: '24px 0' }}>
            <p style={{ fontFamily: F.brand, fontSize: 14, color: C.body, textAlign: 'center', marginBottom: 20 }}>
              Ask anything about your game. Looper pulls from all connected sources to give you cross-source intelligence.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  style={{
                    fontFamily: F.brand,
                    fontSize: 13,
                    color: C.ink,
                    background: C.surface,
                    border: `0.5px solid ${C.borderSub}`,
                    borderRadius: 10,
                    padding: '10px 14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    lineHeight: 1.4,
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              background: msg.role === 'user' ? C.accent : C.surface,
              color: msg.role === 'user' ? '#FFFFFF' : C.body,
              borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
              padding: '10px 14px',
              border: msg.role === 'assistant' ? `0.5px solid ${C.borderSub}` : 'none',
            }}
          >
            <div
              style={{
                fontFamily: F.brand,
                fontSize: 13,
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input bar */}
      <div
        style={{
          padding: '12px 16px env(safe-area-inset-bottom, 12px)',
          borderTop: `0.5px solid ${C.borderSub}`,
          background: C.surface,
          display: 'flex',
          gap: 8,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && input.trim()) sendMessage(input.trim()); }}
          placeholder="Ask about your game..."
          style={{
            flex: 1,
            fontFamily: F.brand,
            fontSize: 14,
            color: C.ink,
            background: C.surfaceAlt,
            border: `0.5px solid ${C.borderSub}`,
            borderRadius: 10,
            padding: '10px 14px',
            outline: 'none',
          }}
        />
        <button
          onClick={() => { if (input.trim()) sendMessage(input.trim()); }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: input.trim() ? C.accent : C.surfaceAlt,
            border: 'none',
            cursor: input.trim() ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Send size={16} color={input.trim() ? '#FFFFFF' : C.muted} />
        </button>
      </div>
    </div>
  );
}

// FAB button component
export function ChatFAB({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: 72,
        right: 16,
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: C.accent,
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(13,124,102,0.3)',
        zIndex: 40,
      }}
    >
      <MessageCircle size={22} color="#FFFFFF" />
    </button>
  );
}
