import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import CustomTooltip from "./customTooltip";
import "./telemetryChart.css";

function TelemetryChart({ data, title, dataKey }) {
  const yAxisWidth = 60;

  return (
    <div className="chart-container">
      <div className="chart-inner">
        <h2 className="chart-title">{title}</h2>

        <AreaChart
          width={900}
          height={300}
          data={data}
          margin={{ top: 5, right: yAxisWidth, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#666" />
          <XAxis dataKey="timeLabel" stroke="#fff" />
          <YAxis stroke="#fff" width={yAxisWidth} />
          <Tooltip
            content={<CustomTooltip title={title} dataKey={dataKey} />}
            cursor={data && data.length > 0 ? { stroke: "#fff", strokeWidth: 1 } : false}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.25}
            dot={{ r: 4, fill: "#8884d8", stroke: "#fff", strokeWidth: 1 }}
            activeDot={{ r: 6, fill: "#fff", stroke: "#8884d8", strokeWidth: 2 }}
          />
        </AreaChart>
      </div>
    </div>
  );
}

export default TelemetryChart;