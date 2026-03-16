import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function TelemetryChart({ data, title, dataKey }) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2>{title}</h2>
      <LineChart width={900} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timeLabel" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={dataKey} dot={false} />
      </LineChart>
    </div>
  );
}

export default TelemetryChart;