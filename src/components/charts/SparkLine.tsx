import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparkLineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export default function SparkLine({ data, width = 60, height = 24, color = '#2E8B57' }: SparkLineProps) {
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
