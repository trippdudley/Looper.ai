import {
  BookOpen, Clock, TrendingUp, Heart, FileText,
  Moon, Wrench, Package, Star,
} from 'lucide-react';
import { C } from '../../data/tokens';

const typeMap: Record<string, {
  Icon: typeof BookOpen;
  bg: string;
  border: string;
}> = {
  lesson:    { Icon: BookOpen,    bg: C.accentBg,   border: C.accent },
  practice:  { Icon: Clock,       bg: C.cautionBg,  border: C.caution },
  round:     { Icon: TrendingUp,  bg: '#3B82F610',  border: '#3B82F6' },
  body:      { Icon: Heart,       bg: C.flagBg,     border: C.flag },
  score:     { Icon: FileText,    bg: '#6366F110',   border: '#6366F1' },
  rest:      { Icon: Moon,        bg: C.surfaceAlt,  border: C.dim },
  fitting:   { Icon: Wrench,      bg: C.cautionBg,  border: C.caution },
  equipment: { Icon: Package,     bg: '#6366F110',   border: '#6366F1' },
  milestone: { Icon: Star,        bg: C.confBg,     border: C.conf },
};

interface TypeIconProps {
  type: string;
  size?: number;
}

export default function TypeIcon({ type, size = 28 }: TypeIconProps) {
  const config = typeMap[type] || typeMap.rest;
  const { Icon, bg, border } = config;
  const iconSize = Math.round(size * 0.5);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 6,
        background: bg,
        border: `1px solid ${border}30`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon size={iconSize} color={border} strokeWidth={2} />
    </div>
  );
}
