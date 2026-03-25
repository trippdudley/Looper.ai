import { useNavigate } from 'react-router-dom';
import { Repeat } from 'lucide-react';

function PhoneFrame({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div style={{
      maxWidth: 375,
      height: 750,
      margin: '0 auto',
      background: '#1A1F2B',
      borderRadius: 40,
      padding: '50px 12px',
      position: 'relative',
    }}>
      {/* Inner screen */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: 32,
        height: '100%',
        overflowY: 'auto',
        position: 'relative',
      }}>
        {/* Status bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 20px 0',
        }}>
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            color: '#1A1F2B',
            fontWeight: 700,
          }}>
            9:41
          </span>
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            color: '#1A1F2B',
          }}>
            LTE &nbsp; 100%
          </span>
        </div>
        {/* Notch */}
        <div style={{
          width: '30%',
          height: 4,
          background: '#1A1F2B',
          borderRadius: 2,
          margin: '4px auto 12px',
        }} />
        {/* Content */}
        <div style={{ padding: '0 20px 20px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function PlayerBrief(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F6F7F9',
      padding: '40px 20px',
    }}>
      <PhoneFrame>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: '0.05em',
            color: '#1A1F2B',
          }}>
            LOOPER<span style={{ color: '#0D7C66' }}>.AI</span>
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 16,
            fontWeight: 500,
            color: '#1A1F2B',
            marginTop: 6,
          }}>
            Lesson Summary
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            fontWeight: 400,
            color: '#9CA3AF',
            marginTop: 4,
          }}>
            March 25, 2026 &middot; Coach Thompson
          </div>
        </div>
        <div style={{
          height: 1,
          background: '#ECEEF2',
          margin: '16px 0',
        }} />

        {/* Section 1 — What we worked on */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#9CA3AF',
            letterSpacing: '0.08em',
            marginBottom: 8,
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
            We focused on your iron contact today — specifically getting the strike point more consistently toward the center of the face. This builds directly on the progress from last session.
          </div>
        </div>

        {/* Section 2 — What clicked */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#9CA3AF',
            letterSpacing: '0.08em',
            marginBottom: 8,
          }}>
            What clicked
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 400,
            color: '#4B5563',
            lineHeight: 1.6,
            marginBottom: 12,
          }}>
            The &ldquo;push the handle toward the target&rdquo; feel worked really well for you. Your contact improved noticeably through the session, and you said it felt natural by the end. That&rsquo;s a great sign.
          </div>
          {/* Progress indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              color: '#9CA3AF',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              flexShrink: 0,
            }}>
              Strike quality
            </span>
            <div style={{
              width: 200,
              height: 6,
              background: '#ECEEF2',
              borderRadius: 3,
              overflow: 'hidden',
            }}>
              <div style={{
                width: '71%',
                height: '100%',
                background: '#0FA87A',
                borderRadius: 3,
              }} />
            </div>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              fontWeight: 400,
              color: '#0FA87A',
            }}>
              71%
            </span>
          </div>
        </div>

        {/* Section 3 — Your practice plan */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#9CA3AF',
            letterSpacing: '0.08em',
            marginBottom: 8,
          }}>
            Your practice plan
          </div>
          {/* Drill 1 */}
          <div style={{
            background: '#F6F7F9',
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: '#1A1F2B',
              }}>
                Gate drill — 7 iron
              </span>
              <Repeat size={14} color="#9CA3AF" />
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 400,
              color: '#4B5563',
            }}>
              3 sets of 10 balls, 3 times this week
            </div>
          </div>
          {/* Drill 2 */}
          <div style={{
            background: '#F6F7F9',
            borderRadius: 8,
            padding: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: '#1A1F2B',
              }}>
                Tempo ladder — 7 iron
              </span>
              <Repeat size={14} color="#9CA3AF" />
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 400,
              color: '#4B5563',
            }}>
              5-5-5 at 60/80/100% effort, twice this week
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <button
          onClick={() => navigate('/player/journey')}
          style={{
            width: '100%',
            height: 44,
            background: '#0D7C66',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 500,
            color: '#FFFFFF',
          }}
        >
          View My Journey
        </button>
      </PhoneFrame>

      {/* Demo annotation */}
      <div style={{
        textAlign: 'center',
        marginTop: 24,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        fontStyle: 'italic',
        color: '#9CA3AF',
        maxWidth: 500,
        margin: '24px auto 0',
      }}>
        Player receives this summary on their phone within 30 seconds of the coach clicking &ldquo;Send&rdquo;
      </div>
    </div>
  );
}
