import { CD, F } from './tokens';
import { useStreamingText } from './hooks';

/** Pulsing dot + streaming label for AI thinking state */
export default function ThinkingIndicator({
  text,
  isActive,
  speed = 25,
}: {
  text: string;
  isActive: boolean;
  speed?: number;
}) {
  const { displayed, isComplete } = useStreamingText(text, isActive, speed);

  if (!text) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
      <span
        style={{
          width: 6, height: 6, borderRadius: '50%',
          backgroundColor: CD.accent,
          animation: 'sidebarPulse 1.5s ease-in-out infinite',
          flexShrink: 0,
        }}
      />
      <span style={{ fontFamily: F.data, fontSize: 12, color: CD.muted }}>
        {displayed}
        {!isComplete && (
          <span style={{
            display: 'inline-block', width: 2, height: 12,
            backgroundColor: CD.accent, marginLeft: 1, verticalAlign: 'middle',
            animation: 'cursorBlink 530ms step-end infinite',
          }} />
        )}
      </span>
    </div>
  );
}
