import { useEffect, useState } from "react";
import { fetchTelemetry } from "../api";
import TelemetryChart from "../components/telemetryChart";
import TelemetrySummaryCards from "../components/telemetrySummaryCards";

function Dashboard() {
  const [telemetry, setTelemetry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTelemetry() {
      try {
        const data = await fetchTelemetry();

        const formattedData = data.map((point) => ({
          ...point,
          timeLabel: new Date(point.timestamp).toLocaleTimeString(),
        }));

        setTelemetry(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTelemetry();
  }, []);

  if (loading) return <p>Loading telemetry...</p>;
  if (error) return <p>Error: {error}</p>;

  const latest = telemetry[telemetry.length - 1];

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Rocket Telemetry Dashboard</h1>
      <TelemetrySummaryCards latest={latest} />

      <TelemetryChart data={telemetry} title="Altitude vs Time" dataKey="altitude" />
      <TelemetryChart data={telemetry} title="Velocity vs Time" dataKey="velocity" />
      <TelemetryChart data={telemetry} title="Temperature vs Time" dataKey="temperature" />
      <TelemetryChart data={telemetry} title="Battery Voltage vs Time" dataKey="battery_voltage" />
    </div>
  );
}

export default Dashboard;