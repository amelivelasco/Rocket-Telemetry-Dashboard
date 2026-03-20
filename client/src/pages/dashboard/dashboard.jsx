import TelemetryChart from "../../components/telemetryChart/telemetryChart";
import TelemetrySummaryCards from "../../components/telemetrySummaryCards/telemetrySummaryCards";
import useTelemetrySocket from "../../useTelemetrySocket";
import useRadioSocket from "../../sockets/radio/useRadioSocket";
import { useState, useEffect } from "react";
import "./dashboard.css"


function Dashboard() {
  const { data: telemetryData, sendMessage } = useTelemetrySocket(
    "ws://127.0.0.1:8001/ws/telemetry/"
  );
  const {
    lastUpdated: radioLastUpdated,
    lastReceived: radioLastReceived,
  } = useRadioSocket("ws://127.0.0.1:8001/ws/radio/");

  const [radioPinTimeseries, setRadioPinTimeseries] = useState([[], [], [], []]);

  const latest = telemetryData[telemetryData.length - 1];
  const radioFirstPinLabels = (radioLastReceived?.[0]?.pins ?? []).slice(0, 4).map((pin, index) => pin.label || pin.key || `Pin ${index + 1}`);

  useEffect(() => {
    if (!Array.isArray(radioLastReceived) || radioLastReceived.length === 0) return;

    const baseRadio = radioLastReceived[0];
    const pins = Array.isArray(baseRadio.pins) ? baseRadio.pins.slice(0, 4) : [];
    const timestamp = radioLastUpdated || new Date().toLocaleTimeString();

    setRadioPinTimeseries((prev) =>
      prev.map((series, index) => {
        const pin = pins[index];
        if (!pin) return series;

        const value = Number(pin.value);
        if (Number.isNaN(value)) return series;

        const next = [...series, { timeLabel: timestamp, value }];
        return next.slice(-60);
      })
    );
  }, [radioLastReceived, radioLastUpdated]);

  return (
    <div className="main-container">
      <div className="App">
        <h1>Dashboard</h1>
        <p style={{color:"gray", fontSize:"12px"}}>telemetry points: {telemetryData.length}</p>
        <TelemetrySummaryCards latest={latest} />
        <div style={{ marginTop: "2rem" }}>
          <h2>Radio Board 1 (live) - first 4 pins</h2>
          {radioPinTimeseries.map((series, idx) => (
            <TelemetryChart
              key={idx}
              data={series}
              title={`Radio1 ${radioFirstPinLabels[idx] ?? `Pin ${idx + 1}`}`}
              dataKey="value"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;