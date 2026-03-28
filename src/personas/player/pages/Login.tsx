import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { C, F } from '../data/tokens';

type Mode = 'signin' | 'signup';

export default function Login(): React.JSX.Element {
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div style={{ minHeight: '100vh', background: C.bg }} />;
  if (user) return <Navigate to="/player" replace />;
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = mode === 'signin'
      ? await signIn(email, password)
      : await signUp(email, password, name || undefined);

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
    } else {
      navigate('/player');
    }
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
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span
            style={{
              fontFamily: F.brand,
              fontSize: 28,
              fontWeight: 800,
              color: C.ink,
              letterSpacing: '.06em',
              textTransform: 'uppercase',
            }}
          >
            LOOPER
          </span>
          <span
            style={{
              fontFamily: F.brand,
              fontSize: 28,
              fontWeight: 800,
              color: C.accentBright,
              letterSpacing: '.06em',
              textShadow: `0 0 12px ${C.confGlow}`,
            }}
          >
            .AI
          </span>
          <div
            style={{
              fontFamily: F.brand,
              fontSize: 14,
              color: C.body,
              marginTop: 8,
            }}
          >
            Player Portal
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mode === 'signup' && (
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 4,
                  padding: '10px 12px',
                  fontFamily: F.brand,
                  fontSize: 14,
                  color: C.ink,
                  outline: 'none',
                }}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 4,
                padding: '10px 12px',
                fontFamily: F.brand,
                fontSize: 14,
                color: C.ink,
                outline: 'none',
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 4,
                padding: '10px 12px',
                fontFamily: F.brand,
                fontSize: 14,
                color: C.ink,
                outline: 'none',
              }}
            />

            {error && (
              <div
                style={{
                  fontFamily: F.brand,
                  fontSize: 13,
                  color: '#C93B3B',
                  padding: '8px 12px',
                  background: 'rgba(201, 59, 59, 0.1)',
                  borderRadius: 4,
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                background: C.accentBright,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 4,
                padding: '10px 16px',
                fontFamily: F.brand,
                fontSize: 14,
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1,
                marginTop: 4,
              }}
            >
              {submitting
                ? 'Loading...'
                : mode === 'signin'
                  ? 'Sign In'
                  : 'Create Account'}
            </button>
          </div>
        </form>

        {/* Toggle mode */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <span style={{ fontFamily: F.brand, fontSize: 13, color: C.body }}>
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          </span>
          <button
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: F.brand,
              fontSize: 13,
              color: C.accentBright,
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
            }}
          >
            {mode === 'signin' ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
