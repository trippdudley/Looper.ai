import { X, RefreshCw } from 'lucide-react';
import { C, F, S } from '../../data/tokens';
import { sourceConfig } from '../../data/sources';

interface DataSourceDrawerProps {
  sourceKey: string | null;
  onClose: () => void;
}

export default function DataSourceDrawer({ sourceKey, onClose }: DataSourceDrawerProps) {
  if (!sourceKey) return null;
  const src = sourceConfig[sourceKey];
  if (!src) return null;

  const isConnected = src.status === 'live' || src.status === 'synced';
  const isComing = src.status === 'coming';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      {/* Overlay */}
      <div
        style={{ position: 'absolute', inset: 0, background: C.overlay }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'relative',
          background: C.surface,
          borderRadius: '16px 16px 0 0',
          padding: '20px 16px env(safe-area-inset-bottom, 20px)',
          maxHeight: '70vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: isConnected ? C.conf : C.dim }} />
            <span style={{ fontFamily: F.brand, fontSize: 18, fontWeight: 700, color: C.ink }}>
              {src.label}
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X size={18} color={C.muted} />
          </button>
        </div>

        {/* Status */}
        {isConnected && (
          <div style={{ ...S.cardInner, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted }}>
                STATUS
              </div>
              <div style={{ fontFamily: F.data, fontSize: 12, fontWeight: 700, color: C.conf, marginTop: 2 }}>
                {src.status === 'live' ? 'Live (real-time)' : `Synced \u00B7 ${src.lastSync}`}
              </div>
            </div>
            <button
              style={{
                fontFamily: F.data, fontSize: 9, fontWeight: 700,
                color: C.accent, background: C.accentBg,
                border: 'none', borderRadius: 6,
                padding: '6px 10px',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              <RefreshCw size={10} />
              Sync Now
            </button>
          </div>
        )}

        {/* Data types */}
        <div style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, marginBottom: 8 }}>
          {isConnected ? 'DATA FLOWING IN' : 'DATA TYPES'}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {src.dataTypes.map((dt) => (
            <span
              key={dt}
              style={{
                fontFamily: F.data,
                fontSize: 9,
                color: C.body,
                background: C.surfaceAlt,
                border: `0.5px solid ${C.borderSub}`,
                borderRadius: 4,
                padding: '3px 8px',
              }}
            >
              {dt}
            </span>
          ))}
        </div>

        {/* Cross-source insight */}
        <div
          style={{
            background: C.accentBg,
            borderLeft: `2px solid ${C.accent}`,
            borderRadius: '0 8px 8px 0',
            padding: '10px 14px',
            marginBottom: 16,
          }}
        >
          <div style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: C.accent, marginBottom: 4 }}>
            {isConnected ? 'CROSS-SOURCE INSIGHT' : 'WHAT CONNECTING UNLOCKS'}
          </div>
          <div style={{ fontFamily: F.brand, fontSize: 12, color: C.body, lineHeight: 1.5 }}>
            {src.crossSourceInsight}
          </div>
        </div>

        {/* Action button */}
        {!isConnected && !isComing && (
          <button
            style={{
              fontFamily: F.brand,
              fontSize: 14,
              fontWeight: 600,
              color: '#FFFFFF',
              background: C.accent,
              border: 'none',
              borderRadius: 8,
              padding: '12px 0',
              width: '100%',
              cursor: 'pointer',
              marginBottom: 12,
            }}
          >
            Connect {src.label}
          </button>
        )}

        {isComing && (
          <div
            style={{
              fontFamily: F.brand,
              fontSize: 13,
              color: C.muted,
              textAlign: 'center',
              padding: '12px 0',
              marginBottom: 12,
            }}
          >
            Integration in development. We'll notify you when it's ready.
          </div>
        )}

        {/* Privacy note */}
        <div style={{ fontFamily: F.data, fontSize: 9, color: C.muted, textAlign: 'center' }}>
          Your data stays yours. Looper reads, never writes back.
        </div>
      </div>
    </div>
  );
}
