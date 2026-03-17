import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function TelemetryChart({ data, title, dataKey }) {
  return (
    <div style={{ marginBottom: "2rem" }} >
      <h2>{title}</h2>
      <AreaChart width={900} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timeLabel" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.25}
        />
      </AreaChart>
    </div>
  );
}

export default TelemetryChart;