import TelemetryChart from "./components/telemetryChart";
import useTelemetrySocket from "./useTelemetrySocket";
import TelemetrySummaryCards from "./components/telemetrySummaryCards";
import "./App.css"

function App() {
  const { data: telemetryData, sendMessage } = useTelemetrySocket(
    "ws://127.0.0.1:8001/ws/telemetry/"
  );

  const latest = telemetryData[telemetryData.length - 1];

  const sendTestTelemetry = () => {
    sendMessage({
      timeLabel: new Date().toLocaleTimeString(),
      altitude: Math.floor(Math.random() * 1000),
      velocity: Math.floor(Math.random() * 500),
      temperature: Math.floor(Math.random() * 100),
      battery_voltage: 12 + Math.random() * 2
    });
  };

  return (
    <div className="main-container">
      <div className="App">
        <h1>Rocket Telemetry Dashboard</h1>

        <button className="send-data" onClick={sendTestTelemetry}>Send test data</button>

        <TelemetrySummaryCards latest={latest} />

        <TelemetryChart
          data={telemetryData}
          title="Altitude"
          dataKey="altitude"
        />

        <TelemetryChart
          data={telemetryData}
          title="Velocity"
          dataKey="velocity"
        />

        <TelemetryChart
          data={telemetryData}
          title="Temperature"
          dataKey="temperature"
        />

        <TelemetryChart
          data={telemetryData}
          title="Battery Voltage"
          dataKey="battery_voltage"
          />
      </div>
    </div>
  );
}

export default App;