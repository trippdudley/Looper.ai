interface DataSourcePillProps {
  name: string;
  color: string;
}

export default function DataSourcePill({ name, color }: DataSourcePillProps) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: color }}
    >
      {name}
    </span>
  );
}
