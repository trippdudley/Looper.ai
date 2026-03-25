import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, ArrowUp } from 'lucide-react';

function InfinityLoader(): React.JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: '0.06em',
        color: '#0D7C66',
      }}>
        LOOPER.AI
      </div>
      <svg width="60" height="30" viewBox="0 0 60 30">
        <path
          d="M15 15C15 8 8 5 4 10C0 15 4 25 10 22C16 19 15 15 15 15C15 15 15 11 20 8C25 5 30 8 30 15C30 22 25 25 20 22C15 19 15 15 15 15"
          fill="none"
          stroke="#E8E8E8"
          strokeWidth="2"
          strokeLinecap="round"
          transform="translate(0, 0)"
        />
        <circle r="3" fill="#0D7C66">
          <animateMotion
            dur="2.5s"
            repeatCount="indefinite"
            path="M15 15C15 8 8 5 4 10C0 15 4 25 10 22C16 19 15 15 15 15C15 15 15 11 20 8C25 5 30 8 30 15C30 22 25 25 20 22C15 19 15 15 15 15"
          />
        </circle>
      </svg>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        fontWeight: 400,
        color: '#9CA3AF',
      }}>
        Preparing lesson summary...
      </div>
    </div>
  );
}

export default function SessionReview(): React.JSX.Element {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Loading state */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: loading ? 1 : 0,
        pointerEvents: loading ? 'auto' : 'none',
        transition: 'opacity 0.5s ease',
      }}>
        <InfinityLoader />
      </div>

      {/* Content */}
      <div style={{
        opacity: loading ? 0 : 1,
        transition: 'opacity 0.5s ease',
        pointerEvents: loading ? 'none' : 'auto',
      }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={() => navigate('/coach')}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#9CA3AF', display: 'flex', alignItems: 'center',
                  padding: 0,
                }}
              >
                <ChevronLeft size={20} />
              </button>
              <h1 style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 24,
                fontWeight: 700,
                color: '#1A1F2B',
                margin: 0,
              }}>
                Lesson Summary
              </h1>
            </div>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              background: '#FDF6E3',
              color: '#D4980B',
              borderRadius: 3,
              padding: '4px 10px',
            }}>
              Draft
            </span>
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 400,
            color: '#9CA3AF',
            marginLeft: 32,
          }}>
            Session 14 &middot; Moe Norman &middot; March 25, 2026
          </div>
        </div>

        {/* Card 1 — What we worked on */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #DFE2E7',
          borderRadius: 8,
          padding: 24,
          marginBottom: 16,
        }}>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#9CA3AF',
            marginBottom: 10,
          }}>
            What we worked on
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 400,
            color: '#4B5563',
            lineHeight: 1.6,
          }}>
            Iron strike consistency — continuing the gate drill progression from Session 13, with a focus on reducing toe-side misses under tempo pressure.
          </div>
        </div>

        {/* Card 2 — What responded */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #DFE2E7',
          borderRadius: 8,
          padding: 24,
          marginBottom: 16,
        }}>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#9CA3AF',
            marginBottom: 12,
          }}>
            What responded
          </div>
          {/* Item 1 */}
          <div style={{
            borderLeft: '3px solid #0FA87A',
            paddingLeft: 12,
            marginBottom: 16,
          }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              color: '#1A1F2B',
              marginBottom: 4,
            }}>
              External cue: &ldquo;Push the handle toward the target&rdquo;
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 400,
              color: '#4B5563',
            }}>
              Face-to-path gap narrowed from{' '}
              <span style={{ fontFamily: "'Space Mono', monospace" }}>4.2&deg;</span> to{' '}
              <span style={{ fontFamily: "'Space Mono', monospace" }}>1.8&deg;</span> over{' '}
              <span style={{ fontFamily: "'Space Mono', monospace" }}>12</span> swings. Player feel rating:{' '}
              <span style={{ fontFamily: "'Space Mono', monospace" }}>4/5</span>.
            </div>
          </div>
          {/* Item 2 */}
          <div style={{
            borderLeft: '3px solid #0FA87A',
            paddingLeft: 12,
          }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              color: '#1A1F2B',
              marginBottom: 4,
            }}>
              Gate drill with alignment sticks at 80% tempo
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 400,
              color: '#4B5563',
            }}>
              Strike dispersion tightened{' '}
              <span style={{ fontFamily: "'Space Mono', monospace" }}>22%</span> vs baseline. Centeredness improved from{' '}
              <span style={{ fontFamily: "'Space Mono', monospace" }}>58%</span> to{' '}
              <span style={{ fontFamily: "'Space Mono', monospace" }}>71%</span>.
            </div>
          </div>
        </div>

        {/* Card 3 — What to practice */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #DFE2E7',
          borderRadius: 8,
          padding: 24,
          marginBottom: 24,
        }}>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#9CA3AF',
            marginBottom: 12,
          }}>
            What to practice
          </div>
          {/* Drill 1 */}
          <div style={{
            background: '#F6F7F9',
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: '#1A1F2B',
              }}>
                Gate drill — 7 iron
              </span>
              <span style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 9,
                fontWeight: 700,
                background: '#E6F5F1',
                color: '#0D7C66',
                padding: '2px 8px',
                borderRadius: 3,
              }}>
                External
              </span>
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 400,
              color: '#4B5563',
              marginBottom: 6,
            }}>
              3 sets of 10 balls. Alignment sticks 6 inches outside target line. Focus on hearing the click, not steering the path.
            </div>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              fontWeight: 400,
              color: '#9CA3AF',
            }}>
              3x this week
            </div>
          </div>
          {/* Drill 2 */}
          <div style={{
            background: '#F6F7F9',
            borderRadius: 8,
            padding: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: '#1A1F2B',
              }}>
                Tempo ladder — 7 iron
              </span>
              <span style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 9,
                fontWeight: 700,
                background: '#E6F5F1',
                color: '#0D7C66',
                padding: '2px 8px',
                borderRadius: 3,
              }}>
                Constraint
              </span>
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 400,
              color: '#4B5563',
              marginBottom: 6,
            }}>
              Hit 5 balls at 60% effort, 5 at 80%, 5 at 100%. Track where contact quality drops off.
            </div>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              fontWeight: 400,
              color: '#9CA3AF',
            }}>
              2x this week
            </div>
          </div>
        </div>

        {/* Chat bar */}
        <div style={{ marginBottom: 16 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#FFFFFF',
            border: '1px solid #DFE2E7',
            borderRadius: 8,
            height: 48,
            paddingLeft: 16,
            paddingRight: 8,
          }}>
            <input
              type="text"
              placeholder="Add a note for Moe..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 400,
                color: '#1A1F2B',
                background: 'transparent',
              }}
            />
            <button style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#0D7C66',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <ArrowUp size={16} color="#FFFFFF" />
            </button>
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            fontWeight: 400,
            color: '#9CA3AF',
            marginTop: 6,
          }}>
            Looper will incorporate your notes into the summary
          </div>
        </div>

        {/* Send to Player CTA */}
        <button
          onClick={() => navigate('/player/brief')}
          style={{
            width: '100%',
            height: 52,
            background: '#0D7C66',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 16,
            fontWeight: 500,
            color: '#FFFFFF',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#0A6352'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#0D7C66'; }}
        >
          <Send size={18} />
          Send to Player
        </button>
      </div>
    </div>
  );
}
