import { C, F } from '../../data/tokens';

interface SectionLabelProps {
  number: string;
  text: string;
}

export default function SectionLabel({ number, text }: SectionLabelProps) {
  return (
    <div
      style={{
        fontFamily: F.data,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        color: C.muted,
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        marginBottom: 12,
      }}
    >
      <span style={{ color: C.accent }}>{number}</span>
      <span>{text}</span>
    </div>
  );
}
