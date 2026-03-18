interface DataSourceIconProps {
  name: string;
  color: string;
  size?: number;
}

export default function DataSourceIcon({ name, color, size = 40 }: DataSourceIconProps) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold"
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.4 }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
