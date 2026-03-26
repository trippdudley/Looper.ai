/**
 * AskLooperChat — Your personal golf LLM.
 * Claude-inspired: minimal chrome, prominent input, conversation is the star.
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Zap, Loader2, AlertCircle, Plus } from 'lucide-react';
import { C, F, S } from '../data/tokens';
import { player } from '../data/tripp';
import { streamChat, isApiKeyConfigured, type ChatMessage } from '../services/chat';

// --- Integration sources ---
const CONNECTED_SOURCES = [
  { name: 'GHIN', status: 'connected' as const, detail: '118 rounds' },
  { name: 'Arccos', status: 'connected' as const, detail: '101 rounds' },
  { name: 'Foresight', status: 'connected' as const, detail: '208 sessions' },
];
const AVAILABLE_SOURCES = [
  { name: 'Arccos', category: 'Scoring' },
  { name: 'Trackman', category: 'Launch Monitor' },
  { name: 'WHOOP', category: 'Health' },
];

// One tee-up question per pillar
const TEE_UPS = [
  { label: 'Play', q: "What do my best and worst rounds have in common?" },
  { label: 'Practice', q: "I have 45 minutes. What should I work on?" },
  { label: 'Coaching', q: "What should a coach know about my game?" },
];

// --- Markdown renderer ---
function renderMarkdown(text: string): JSX.Element[] {
  const lines = text.split('\n');
  const elements: JSX.Element[] = [];
  let listItems: string[] = [];
  let listStart = 0;
  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${listStart}`} style={{ margin: '8px 0', paddingLeft: 20, listStyleType: 'disc' }}>
          {listItems.map((item, i) => (
            <li key={i} style={{ margin: '4px 0', color: C.body, fontSize: 14, lineHeight: 1.7 }}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('### ')) { flushList(); elements.push(<h4 key={i} style={{ fontFamily: F.brand, fontSize: 13, fontWeight: 700, color: C.ink, margin: '16px 0 6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{line.slice(4)}</h4>); }
    else if (line.startsWith('## ')) { flushList(); elements.push(<h3 key={i} style={{ fontFamily: F.brand, fontSize: 15, fontWeight: 700, color: C.ink, margin: '16px 0 8px' }}>{line.slice(3)}</h3>); }
    else if (line.startsWith('# ')) { flushList(); elements.push(<h2 key={i} style={{ fontFamily: F.brand, fontSize: 17, fontWeight: 700, color: C.ink, margin: '16px 0 8px' }}>{line.slice(2)}</h2>); }
    else if (/^\d+\.\s/.test(line)) {
      flushList();
      const match = line.match(/^(\d+)\.\s(.+)/);
      if (match) elements.push(<div key={i} style={{ display: 'flex', gap: 10, margin: '6px 0', alignItems: 'flex-start' }}><span style={{ fontFamily: F.data, fontSize: 12, color: C.accent, fontWeight: 700, minWidth: 18, marginTop: 2 }}>{match[1]}.</span><span style={{ fontSize: 14, lineHeight: 1.7, color: C.body }}>{renderInline(match[2])}</span></div>);
    }
    else if (line.startsWith('- ') || line.startsWith('* ')) { if (listItems.length === 0) listStart = i; listItems.push(line.slice(2)); }
    else if (line.match(/^---+$/)) { flushList(); elements.push(<hr key={i} style={{ border: 'none', borderTop: `1px solid ${C.border}`, margin: '12px 0' }} />); }
    else if (line.trim() === '') { flushList(); }
    else { flushList(); elements.push(<p key={i} style={{ fontSize: 14, lineHeight: 1.8, color: C.body, margin: '6px 0' }}>{renderInline(line)}</p>); }
  }
  flushList();
  return elements;
}

function renderInline(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    if (match[2]) parts.push(<strong key={key++} style={{ color: C.ink, fontWeight: 600 }}>{match[2]}</strong>);
    else if (match[3]) parts.push(<em key={key++} style={{ color: C.ink, fontStyle: 'italic' }}>{match[3]}</em>);
    else if (match[4]) parts.push(<span key={key++} style={{ fontFamily: F.data, fontSize: 13, color: C.accentBright, background: C.accentBg, padding: '1px 5px', borderRadius: 3 }}>{match[4]}</span>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length > 0 ? parts : [text];
}

export default function AskLooperChat(): JSX.Element {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasApiKey = isApiKeyConfigured();
  const hasConversation = messages.length > 0 || isStreaming;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, streamingText, scrollToBottom]);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleSend = useCallback(async (text?: string) => {
    const msgText = text || input.trim();
    if (!msgText || isStreaming) return;
    setInput('');
    setError(null);
    const userMsg: ChatMessage = { role: 'user', content: msgText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsStreaming(true);
    setStreamingText('');
    let accumulated = '';
    await streamChat(newMessages,
      (chunk) => { accumulated += chunk; setStreamingText(accumulated); },
      () => { setMessages(prev => [...prev, { role: 'assistant', content: accumulated }]); setStreamingText(''); setIsStreaming(false); },
      (err) => { setError(err.message); setIsStreaming(false); setStreamingText(''); },
    );
  }, [input, isStreaming, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 140px)' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      {/* Conversation area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: hasConversation ? 'flex-start' : 'center' }}>

        {/* Empty state — minimal, Claude-inspired */}
        {!hasConversation && (
          <div style={{ textAlign: 'center', padding: '0 0 24px' }}>
            <div style={{ fontFamily: F.brand, fontSize: 24, fontWeight: 700, color: C.ink, marginBottom: 6 }}>
              Ask Looper
            </div>
            <p style={{ fontFamily: F.brand, fontSize: 14, color: C.muted, margin: '0 0 10px' }}>
              {player.totalRounds} rounds and 6,671 practice shots loaded
            </p>
            {/* Connected sources */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              {CONNECTED_SOURCES.map((s, i) => (
                <span key={i} style={{ fontFamily: F.editorial, fontSize: 12, fontStyle: 'italic', color: C.body }}>
                  {s.name} <span style={{ fontFamily: F.data, fontSize: 10, color: C.muted, fontStyle: 'normal' }}>({s.detail})</span>
                </span>
              ))}
              <button onClick={() => setShowIntegrations(true)} style={{
                background: 'none', border: `1px solid ${C.border}`, borderRadius: '50%',
                width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'border-color 150ms',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = C.accent)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                <Plus size={12} color={C.muted} />
              </button>
            </div>

            {/* Integrations modal */}
            {showIntegrations && (
              <div style={{
                position: 'fixed', inset: 0, background: C.overlay, zIndex: 100,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }} onClick={() => setShowIntegrations(false)}>
                <div style={{ ...S.cardElevated, maxWidth: 400, width: '90%', padding: '24px', textAlign: 'left' }} onClick={e => e.stopPropagation()}>
                  <div style={{ fontFamily: F.brand, fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 4 }}>Integrations</div>
                  <p style={{ fontFamily: F.brand, fontSize: 13, color: C.muted, margin: '0 0 16px' }}>More data sources make Looper smarter.</p>

                  {/* Connected */}
                  <div style={{ fontFamily: F.data, fontSize: 10, color: C.conf, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Connected</div>
                  {CONNECTED_SOURCES.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                      <div>
                        <div style={{ fontFamily: F.brand, fontSize: 14, fontWeight: 500, color: C.ink }}>{s.name}</div>
                        <div style={{ fontFamily: F.data, fontSize: 11, color: C.muted }}>{s.detail}</div>
                      </div>
                      <span style={{ fontFamily: F.data, fontSize: 10, color: C.conf, background: C.confBg, padding: '2px 8px', borderRadius: 10 }}>Connected</span>
                    </div>
                  ))}

                  {/* Scoring & Shot Tracking */}
                  <div style={{ fontFamily: F.data, fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 16, marginBottom: 8 }}>Scoring & Shot Tracking</div>
                  {['Decade', '18Birdies', 'The Grint'].map((name, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                      <div style={{ fontFamily: F.brand, fontSize: 14, fontWeight: 500, color: C.ink }}>{name}</div>
                      <span style={{ fontFamily: F.data, fontSize: 10, color: C.muted, background: C.surfaceAlt, padding: '2px 8px', borderRadius: 10 }}>Connect</span>
                    </div>
                  ))}

                  {/* Launch Monitors */}
                  <div style={{ fontFamily: F.data, fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 16, marginBottom: 8 }}>Launch Monitors</div>
                  {['Trackman', 'Flightscope', 'SkyTrak', 'Garmin R10'].map((name, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                      <div style={{ fontFamily: F.brand, fontSize: 14, fontWeight: 500, color: C.ink }}>{name}</div>
                      <span style={{ fontFamily: F.data, fontSize: 10, color: C.muted, background: C.surfaceAlt, padding: '2px 8px', borderRadius: 10 }}>Connect</span>
                    </div>
                  ))}

                  {/* Health */}
                  <div style={{ fontFamily: F.data, fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 16, marginBottom: 8 }}>Health & Fitness</div>
                  {['WHOOP', 'Peloton', 'Apple Health'].map((name, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? `1px solid ${C.border}` : 'none' }}>
                      <div style={{ fontFamily: F.brand, fontSize: 14, fontWeight: 500, color: C.ink }}>{name}</div>
                      <span style={{ fontFamily: F.data, fontSize: 10, color: C.muted, background: C.surfaceAlt, padding: '2px 8px', borderRadius: 10 }}>Coming Soon</span>
                    </div>
                  ))}

                  <button onClick={() => setShowIntegrations(false)} style={{
                    width: '100%', marginTop: 16, padding: '10px', background: C.surfaceAlt,
                    border: `1px solid ${C.border}`, borderRadius: 8, cursor: 'pointer',
                    fontFamily: F.brand, fontSize: 13, color: C.body,
                  }}>Done</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Messages */}
        {hasConversation && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '8px 0' }}>
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.role === 'user' ? (
                  <div style={{ maxWidth: '85%', marginLeft: 'auto' }}>
                    <div style={{
                      background: C.surfaceEl,
                      border: `1px solid ${C.border}`,
                      borderRadius: '16px 16px 4px 16px',
                      padding: '12px 16px',
                    }}>
                      <p style={{ fontFamily: F.brand, fontSize: 14, color: C.ink, lineHeight: 1.6, margin: 0 }}>{msg.content}</p>
                    </div>
                  </div>
                ) : (
                  <div style={{ maxWidth: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: C.accentGrad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: F.brand, fontSize: 9, fontWeight: 700, color: '#fff' }}>L</span>
                      </div>
                      <span style={{ fontFamily: F.brand, fontSize: 12, fontWeight: 600, color: C.accent }}>Looper</span>
                    </div>
                    <div style={{ paddingLeft: 28 }}>
                      {renderMarkdown(msg.content)}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Streaming */}
            {isStreaming && streamingText && (
              <div style={{ maxWidth: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: C.accentGrad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={10} color="#fff" style={{ animation: 'pulse 1.5s ease infinite' }} />
                  </div>
                  <span style={{ fontFamily: F.brand, fontSize: 12, fontWeight: 600, color: C.accent }}>Looper</span>
                </div>
                <div style={{ paddingLeft: 28 }}>
                  {renderMarkdown(streamingText)}
                </div>
              </div>
            )}

            {isStreaming && !streamingText && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
                <Loader2 size={16} color={C.accent} style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ fontFamily: F.brand, fontSize: 13, color: C.muted }}>Thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', marginBottom: 8 }}>
          <AlertCircle size={14} color={C.flag} />
          <span style={{ fontFamily: F.brand, fontSize: 12, color: C.body }}>{error}</span>
        </div>
      )}

      {/* API key warning — subtle inline */}
      {!hasApiKey && !hasConversation && (
        <p style={{ fontFamily: F.brand, fontSize: 12, color: C.muted, textAlign: 'center', margin: '0 0 8px' }}>
          Add <span style={{ fontFamily: F.data, fontSize: 11, color: C.caution }}>VITE_ANTHROPIC_API_KEY</span> to .env.local to enable
        </p>
      )}

      {/* Input area */}
      <div style={{ paddingTop: 8, paddingBottom: 4 }}>
        {/* Tee-up chips — only when empty */}
        {!hasConversation && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {TEE_UPS.map((t, i) => (
              <button key={i} onClick={() => handleSend(t.q)} disabled={isStreaming || !hasApiKey}
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 20,
                  padding: '7px 14px',
                  cursor: hasApiKey ? 'pointer' : 'not-allowed',
                  transition: 'all 150ms',
                  opacity: hasApiKey ? 1 : 0.5,
                }}
                onMouseEnter={e => { if (hasApiKey) { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.background = C.surfaceAlt; } }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface; }}>
                <span style={{ fontFamily: F.brand, fontSize: 13, color: C.body }}>{t.q}</span>
              </button>
            ))}
          </div>
        )}

        {/* Re-ask chips when in conversation */}
        {hasConversation && !isStreaming && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
            {["Practice plan for today", "Break down my last round", "What should a coach know?"].map((q, i) => (
              <button key={i} onClick={() => handleSend(q)} disabled={!hasApiKey}
                style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: '5px 12px', cursor: 'pointer', transition: 'border-color 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = C.accent)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                <span style={{ fontFamily: F.brand, fontSize: 12, color: C.body }}>{q}</span>
              </button>
            ))}
          </div>
        )}

        {/* Text input */}
        <div style={{
          display: 'flex', gap: 8, alignItems: 'flex-end',
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
          padding: '10px 14px', transition: 'border-color 150ms',
        }}>
          <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="Ask anything about your game..."
            disabled={!hasApiKey || isStreaming} rows={1}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: F.brand, fontSize: 15, color: C.ink, resize: 'none', lineHeight: 1.5, padding: '2px 0' }} />
          <button onClick={() => handleSend()} disabled={!input.trim() || isStreaming || !hasApiKey}
            style={{
              width: 36, height: 36, borderRadius: 8,
              background: input.trim() && hasApiKey ? C.accentGrad : 'transparent',
              border: 'none',
              cursor: input.trim() && hasApiKey ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              transition: 'all 150ms',
            }}>
            <Send size={16} color={input.trim() && hasApiKey ? '#fff' : C.muted} />
          </button>
        </div>
      </div>
    </div>
  );
}
