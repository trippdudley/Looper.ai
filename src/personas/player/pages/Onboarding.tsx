import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import { C, F } from '../data/tokens';
import { sourceConfig, type SourceConfig } from '../data/sources';

type Step = 1 | 2 | 3;

const GOALS = ['Break 100', 'Break 90', 'Break 80', 'Scratch', 'Plus handicap'] as const;

const inputStyle: React.CSSProperties = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: 4,
  padding: '10px 12px',
  fontFamily: F.brand,
  fontSize: 14,
  color: C.ink,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

const connectableSources = Object.entries(sourceConfig).filter(
  ([key, s]: [string, SourceConfig]) => key !== 'coaching' && s.status !== 'coming'
);

export default function Onboarding(): React.JSX.Element {
  const { player, refreshPlayer } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [handicap, setHandicap] = useState('');
  const [homeClub, setHomeClub] = useState('');
  const [goal, setGoal] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggleSource = (key: string): void => {
    setSelectedSources(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleComplete = async (): Promise<void> => {
    if (!player) return;
    setSaving(true);

    await supabase
      .from('players')
      .update({
        handicap_index: handicap ? parseFloat(handicap) : null,
        home_club: homeClub || null,
        goal: goal || null,
        connected_sources: selectedSources,
        onboarding_complete: true,
      })
      .eq('id', player.id);

    await refreshPlayer();
    navigate('/player');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: C.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: F.brand,
        padding: 20,
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <div style={{ width: '100%', maxWidth: 480 }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          {[1, 2, 3].map(s => (
            <div
              key={s}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: s <= step ? C.accentBright : C.dim,
                transition: 'background 0.2s',
              }}
            />
          ))}
        </div>

        {/* Step 1: About Your Game */}
        {step === 1 && (
          <div>
            <h2
              style={{
                fontFamily: F.brand,
                fontSize: 22,
                fontWeight: 700,
                color: C.ink,
                textAlign: 'center',
                margin: '0 0 8px',
              }}
            >
              About Your Game
            </h2>
            <p
              style={{
                fontFamily: F.brand,
                fontSize: 14,
                color: C.body,
                textAlign: 'center',
                margin: '0 0 28px',
              }}
            >
              Help Looper understand where you are today.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontFamily: F.brand, fontSize: 12, fontWeight: 600, color: C.body, marginBottom: 6, display: 'block' }}>
                  HANDICAP INDEX
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 12.4"
                  value={handicap}
                  onChange={e => setHandicap(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontFamily: F.brand, fontSize: 12, fontWeight: 600, color: C.body, marginBottom: 6, display: 'block' }}>
                  HOME CLUB
                </label>
                <input
                  type="text"
                  placeholder="e.g. Scottsdale National"
                  value={homeClub}
                  onChange={e => setHomeClub(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontFamily: F.brand, fontSize: 12, fontWeight: 600, color: C.body, marginBottom: 6, display: 'block' }}>
                  GOAL
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {GOALS.map(g => (
                    <button
                      key={g}
                      onClick={() => setGoal(g)}
                      style={{
                        background: goal === g ? C.accentBright : C.surface,
                        color: goal === g ? '#FFFFFF' : C.body,
                        border: `1px solid ${goal === g ? C.accentBright : C.border}`,
                        borderRadius: 20,
                        padding: '6px 14px',
                        fontFamily: F.brand,
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              style={{
                width: '100%',
                background: C.accentBright,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 4,
                padding: '10px 16px',
                fontFamily: F.brand,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: 28,
              }}
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2: Connect Your Data */}
        {step === 2 && (
          <div>
            <h2
              style={{
                fontFamily: F.brand,
                fontSize: 22,
                fontWeight: 700,
                color: C.ink,
                textAlign: 'center',
                margin: '0 0 8px',
              }}
            >
              Connect Your Data
            </h2>
            <p
              style={{
                fontFamily: F.brand,
                fontSize: 14,
                color: C.body,
                textAlign: 'center',
                margin: '0 0 28px',
              }}
            >
              Select the systems you use. We'll connect them next.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {connectableSources.map(([key, source]) => {
                const selected = selectedSources.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => toggleSource(key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      background: selected ? C.surfaceAlt : C.surface,
                      border: `1px solid ${selected ? source.color : C.border}`,
                      borderRadius: 6,
                      padding: '12px 14px',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        border: `2px solid ${selected ? source.color : C.dim}`,
                        background: selected ? source.color : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {selected && <Check size={12} color="#FFFFFF" />}
                    </div>
                    <div>
                      <div style={{ fontFamily: F.brand, fontSize: 14, fontWeight: 600, color: C.ink }}>
                        {source.label}
                      </div>
                      <div style={{ fontFamily: F.brand, fontSize: 12, color: C.muted, marginTop: 2 }}>
                        {source.dataTypes.slice(0, 3).join(' / ')}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: 1,
                  background: C.surface,
                  color: C.body,
                  border: `1px solid ${C.border}`,
                  borderRadius: 4,
                  padding: '10px 16px',
                  fontFamily: F.brand,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                style={{
                  flex: 2,
                  background: C.accentBright,
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 4,
                  padding: '10px 16px',
                  fontFamily: F.brand,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: You're In */}
        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: C.accentGrad,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: `0 0 24px ${C.confGlow}`,
              }}
            >
              <Check size={28} color="#FFFFFF" />
            </div>
            <h2
              style={{
                fontFamily: F.brand,
                fontSize: 22,
                fontWeight: 700,
                color: C.ink,
                margin: '0 0 8px',
              }}
            >
              You're In
            </h2>
            <p
              style={{
                fontFamily: F.brand,
                fontSize: 14,
                color: C.body,
                margin: '0 0 28px',
              }}
            >
              Your portal is ready. Ask Looper anything about your game.
            </p>

            {/* Summary */}
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                padding: 16,
                textAlign: 'left',
                marginBottom: 28,
              }}
            >
              {handicap && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: F.brand, fontSize: 13, color: C.muted }}>Handicap</span>
                  <span style={{ fontFamily: F.data, fontSize: 13, color: C.ink }}>{handicap}</span>
                </div>
              )}
              {homeClub && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: F.brand, fontSize: 13, color: C.muted }}>Home Club</span>
                  <span style={{ fontFamily: F.brand, fontSize: 13, color: C.ink }}>{homeClub}</span>
                </div>
              )}
              {goal && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: F.brand, fontSize: 13, color: C.muted }}>Goal</span>
                  <span style={{ fontFamily: F.brand, fontSize: 13, color: C.ink }}>{goal}</span>
                </div>
              )}
              {selectedSources.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: F.brand, fontSize: 13, color: C.muted }}>Sources</span>
                  <span style={{ fontFamily: F.brand, fontSize: 13, color: C.ink }}>
                    {selectedSources.map(k => sourceConfig[k]?.label).join(', ')}
                  </span>
                </div>
              )}
              {!handicap && !homeClub && !goal && selectedSources.length === 0 && (
                <span style={{ fontFamily: F.brand, fontSize: 13, color: C.muted }}>
                  No details added yet — you can update these anytime.
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  flex: 1,
                  background: C.surface,
                  color: C.body,
                  border: `1px solid ${C.border}`,
                  borderRadius: 4,
                  padding: '10px 16px',
                  fontFamily: F.brand,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                disabled={saving}
                style={{
                  flex: 2,
                  background: C.accentBright,
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 4,
                  padding: '10px 16px',
                  fontFamily: F.brand,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? 'Setting up...' : 'Go to My Portal'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
