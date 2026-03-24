import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { CD, F } from './tokens';
import { useStreamingText } from './hooks';

export interface ChatMsg {
  role: 'user' | 'ai';
  text: string;
  isNew?: boolean;
}

/** Single AI response bubble with streaming text */
function AIBubble({ text, isNew }: { text: string; isNew: boolean }) {
  const { displayed, isComplete } = useStreamingText(text, isNew, 12);
  const show = isNew ? displayed : text;

  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{
        fontFamily: F.brand, fontSize: 8, color: CD.muted, marginBottom: 2,
        letterSpacing: '0.05em', fontWeight: 800,
      }}>
        LOOPER<span style={{ color: CD.accent }}>.AI</span>
      </div>
      <div style={{
        fontFamily: F.brand, fontSize: 12, lineHeight: 1.5, color: CD.body,
        background: CD.surface, borderRadius: '0 12px 12px 12px',
        padding: '8px 12px', maxWidth: '88%',
      }}>
        {show}
        {isNew && !isComplete && (
          <span style={{
            display: 'inline-block', width: 2, height: 10,
            backgroundColor: CD.accent, marginLeft: 1, verticalAlign: 'middle',
            animation: 'cursorBlink 530ms step-end infinite',
          }} />
        )}
      </div>
    </div>
  );
}

/** Chat panel: suggestion chips, messages, input bar */
export default function ChatPanel({
  messages,
  chips,
  onChipClick,
}: {
  messages: ChatMsg[];
  chips: string[];
  onChipClick: (chip: string) => void;
}) {
  const [inputVal, setInputVal] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Messages area */}
      {messages.length > 0 && (
        <div ref={scrollRef} style={{
          maxHeight: 200, overflowY: 'auto', padding: '8px 14px',
          borderTop: `1px solid ${CD.border}`,
        }}>
          {messages.map((m, i) => (
            m.role === 'user' ? (
              <div key={i} style={{
                display: 'flex', justifyContent: 'flex-end', marginBottom: 8,
              }}>
                <div style={{
                  fontFamily: F.brand, fontSize: 12, lineHeight: 1.5, color: CD.ink,
                  background: 'rgba(16,185,129,0.15)',
                  borderRadius: '12px 0 12px 12px',
                  padding: '8px 12px', maxWidth: '88%',
                }}>
                  {m.text}
                </div>
              </div>
            ) : (
              <AIBubble key={i} text={m.text} isNew={!!m.isNew} />
            )
          ))}
        </div>
      )}

      {/* Suggestion chips */}
      {chips.length > 0 && (
        <div style={{
          display: 'flex', gap: 6, padding: '6px 14px',
          overflowX: 'auto', borderTop: `1px solid ${CD.border}`,
        }}>
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => onChipClick(chip)}
              style={{
                fontFamily: F.brand, fontSize: 11, color: CD.body,
                background: 'none', border: `1px solid ${CD.borderSub}`,
                borderRadius: 99, padding: '4px 10px',
                whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0,
              }}
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div style={{
        height: 56, padding: '8px 12px',
        borderTop: `1px solid ${CD.border}`,
        background: CD.bg,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <input
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask Looper..."
          style={{
            flex: 1, height: 36,
            fontFamily: F.brand, fontSize: 13, color: CD.ink,
            background: CD.surfaceAlt,
            border: `1px solid ${CD.borderSub}`,
            borderRadius: 6, padding: '0 12px',
            outline: 'none',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = CD.accent; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = CD.borderSub; }}
        />
        <Send size={18} style={{ color: CD.accent, cursor: 'pointer', flexShrink: 0 }} />
      </div>
    </div>
  );
}
