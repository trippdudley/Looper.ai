import { ChevronLeft } from 'lucide-react';

function PhoneFrame({ children }: { children: React.ReactNode }): JSX.Element {
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
        <div style={{ padding: '0 20px 20px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

const sessions = [
  {
    num: 14,
    date: 'Mar 25, 2026',
    title: 'Iron strike consistency',
    result: 'Centeredness improved to 71%',
    isToday: true,
  },
  {
    num: 13,
    date: 'Mar 18, 2026',
    title: 'Gate drill progression',
    result: 'Dispersion tightened 18%',
    isToday: false,
  },
  {
    num: 12,
    date: 'Mar 11, 2026',
    title: 'Approach shot distance control',
    result: 'Carry variance reduced to 4.2 yds',
    isToday: false,
  },
  {
    num: 11,
    date: 'Mar 4, 2026',
    title: 'Tempo and rhythm work',
    result: 'Swing speed consistency +12%',
    isToday: false,
  },
  {
    num: 10,
    date: 'Feb 25, 2026',
    title: 'Driver face control',
    result: 'Face angle improved 1.4 deg',
    isToday: false,
  },
];

const handicapSteps = [
  { value: '16.2', date: 'Oct \'25' },
  { value: '14.8', date: 'Dec \'25' },
  { value: '13.6', date: 'Feb \'26' },
  { value: '12.4', date: 'Mar \'26' },
];

export default function PlayerJourney(): JSX.Element {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#F6F7F9',
      padding: '40px 20px',
      position: 'relative',
    }}>
      <button
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          background: 'none',
          border: 'none',
          cursor: 'default',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          fontWeight: 400,
          color: '#9CA3AF',
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      >
        <ChevronLeft size={14} />
        Return to prototype
      </button>
      <PhoneFrame>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: '0.05em',
            color: '#1A1F2B',
          }}>
            LOOPER<span style={{ color: '#0D7C66' }}>.AI</span>
          </div>
        </div>
        <div style={{ padding: '0 0 4px', marginBottom: 4 }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 20,
            fontWeight: 700,
            color: '#1A1F2B',
          }}>
            My Journey
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 400,
            color: '#9CA3AF',
          }}>
            Moe Norman
          </div>
        </div>

        {/* Quick stats row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px 0',
          borderBottom: '1px solid #ECEEF2',
          marginBottom: 16,
        }}>
          {[
            { label: 'Handicap', value: '12.4' },
            { label: '', value: '14 sessions' },
            { label: 'Since', value: 'Oct 2025' },
          ].map((stat, i) => (
            <div key={i} style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              color: '#4B5563',
            }}>
              {stat.label && <span>{stat.label} </span>}
              <span style={{ fontWeight: 700 }}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          {sessions.map((s, i) => (
            <div
              key={s.num}
              style={{
                display: 'flex',
                gap: 12,
                paddingBottom: i < sessions.length - 1 ? 16 : 0,
                position: 'relative',
                borderLeft: s.isToday ? '3px solid #0FA87A' : 'none',
                paddingLeft: s.isToday ? 9 : 0,
                marginLeft: s.isToday ? 9 : 12,
              }}
            >
              {/* Vertical line connector */}
              {i < sessions.length - 1 && !s.isToday && (
                <div style={{
                  position: 'absolute',
                  left: 11,
                  top: 24,
                  bottom: 0,
                  width: 1,
                  background: '#DFE2E7',
                }} />
              )}
              {/* Number circle */}
              <div style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                border: s.isToday ? '2px solid #0FA87A' : '2px solid #DFE2E7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                background: '#FFFFFF',
                position: 'relative',
                zIndex: 1,
              }}>
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  color: s.isToday ? '#0FA87A' : '#4B5563',
                }}>
                  {s.num}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 11,
                    fontWeight: 400,
                    color: '#9CA3AF',
                  }}>
                    {s.date}
                  </span>
                  {s.isToday && (
                    <span style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 9,
                      fontWeight: 700,
                      background: '#E6F5F1',
                      color: '#0D7C66',
                      padding: '2px 6px',
                      borderRadius: 3,
                      textTransform: 'uppercase',
                    }}>
                      Today
                    </span>
                  )}
                </div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#1A1F2B',
                  marginBottom: 2,
                }}>
                  {s.title}
                </div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  fontWeight: 400,
                  color: '#4B5563',
                }}>
                  {s.result}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          fontWeight: 400,
          color: '#0D7C66',
          marginBottom: 20,
          paddingLeft: 12,
          cursor: 'pointer',
        }}>
          See all 14 sessions
        </div>

        {/* Handicap trend */}
        <div style={{
          background: '#F6F7F9',
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
        }}>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#9CA3AF',
            letterSpacing: '0.08em',
            marginBottom: 10,
          }}>
            Handicap trend
          </div>
          {/* Simple SVG line */}
          <svg width="100%" height="40" viewBox="0 0 280 40" preserveAspectRatio="xMidYMid meet">
            <polyline
              points="0,5 90,18 180,28 270,38"
              fill="none"
              stroke="#0FA87A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {[
              { x: 0, y: 5 },
              { x: 90, y: 18 },
              { x: 180, y: 28 },
              { x: 270, y: 38 },
            ].map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="3" fill="#0FA87A" />
            ))}
          </svg>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 6,
          }}>
            {handicapSteps.map((h, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#1A1F2B',
                }}>
                  {h.value}
                </div>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 9,
                  color: '#9CA3AF',
                }}>
                  {h.date}
                </div>
              </div>
            ))}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            marginTop: 8,
            justifyContent: 'center',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path d="M6 2 L6 10 M3 7 L6 10 L9 7" stroke="#0FA87A" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              fontWeight: 400,
              color: '#0FA87A',
            }}>
              -3.8 since Oct 2025
            </span>
          </div>
        </div>
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
        The player&rsquo;s journey updates automatically after every session. No manual entry. The record builds itself.
      </div>
    </div>
  );
}
