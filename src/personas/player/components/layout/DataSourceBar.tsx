import { useState } from 'react';
import { Plus } from 'lucide-react';
import { C, F } from '../../data/tokens';
import { sourceConfig, connectedSources, availableSources } from '../../data/sources';

interface DataSourceBarProps {
  onSourceTap?: (sourceKey: string) => void;
}

export default function DataSourceBar({ onSourceTap }: DataSourceBarProps) {
  const [scrollRef, setScrollRef] = useState<HTMLDivElement | null>(null);

  return (
    <div
      style={{
        background: C.surface,
        borderBottom: `0.5px solid ${C.borderSub}`,
        padding: '8px 0',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <div
        ref={setScrollRef}
        style={{
          display: 'flex',
          gap: 6,
          padding: '0 16px',
          minWidth: 'min-content',
        }}
      >
        {/* Connected sources */}
        {connectedSources.map((key) => {
          const src = sourceConfig[key];
          return (
            <button
              key={key}
              onClick={() => onSourceTap?.(key)}
              style={{
                fontFamily: F.data,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '.06em',
                textTransform: 'uppercase',
                color: src.color,
                background: src.color + '10',
                border: `1px solid ${src.color}30`,
                borderRadius: 12,
                padding: '4px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: C.conf,
                  flexShrink: 0,
                }}
              />
              {src.short}
            </button>
          );
        })}

        {/* Separator */}
        <div style={{ width: 1, background: C.borderSub, margin: '2px 2px', flexShrink: 0 }} />

        {/* Available sources */}
        {availableSources.map((key) => {
          const src = sourceConfig[key];
          return (
            <button
              key={key}
              onClick={() => onSourceTap?.(key)}
              style={{
                fontFamily: F.data,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '.06em',
                textTransform: 'uppercase',
                color: C.muted,
                background: 'transparent',
                border: `1px solid ${C.borderSub}`,
                borderRadius: 12,
                padding: '4px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                opacity: src.status === 'coming' ? 0.5 : 0.7,
              }}
            >
              <Plus size={9} strokeWidth={2.5} />
              {src.short}
              {src.status === 'coming' && (
                <span style={{ fontSize: 7, fontWeight: 400, fontStyle: 'italic', letterSpacing: 'normal', textTransform: 'none' }}>
                  soon
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
