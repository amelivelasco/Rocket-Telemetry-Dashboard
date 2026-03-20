import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import "./telemetryChart.css";
import { useState } from "react";
import { handleClick } from "./telemetryUtils";
import { displayData } from "./telemetryUtils";

function TelemetryChart({ data, title, dataKey }) {
  const yAxisWidth = 60;
  const [pinnedPoint, setPinnedPoint] = useState(null); // store the actual data point, not index
  const onChartClick = (chartData) => handleClick(chartData, setPinnedPoint);
  const chartData = displayData(pinnedPoint, data, dataKey);

  return (
    <div className="chart-container">
      <div className="chart-inner">
        <h2 className="chart-title">{title}</h2>

        <AreaChart
          width={900}
          height={300}
          data={data}
          onClick={onChartClick}
          margin={{ top: 5, right: yAxisWidth, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#666" />
          <XAxis dataKey="timeLabel" stroke="#fff" />
          <YAxis stroke="#fff" width={yAxisWidth} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.25}
            connectNulls={false}
            />   
        </AreaChart>
      </div>
    </div>
  );
}

export default TelemetryChart;