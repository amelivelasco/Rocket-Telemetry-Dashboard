import { useState, useEffect } from "react";
import "./radioBoard.css";
import RadioCard from "../../components/radioCard/radioCard";
import useRadioSocket from "../../sockets/radio/useRadioSocket";
import { validate } from "./radioUtils";

// Default radio configurations based on backend packet schemas
const DEFAULT_RADIOS = [
  {
    uid: 1,
    idVal: "0x01",
    status: "waiting",
    pins: [
      { key: "altitude", label: "Altitude", unit: "m", value: "0.0", type: "FLOAT" },
      { key: "velocity", label: "Velocity", unit: "m/s", value: "0.0", type: "FLOAT" },
      { key: "temperature", label: "Temperature", unit: "°C", value: "0", type: "SHORT" },
      { key: "battery_voltage", label: "Battery Voltage", unit: "V", value: "0.0", type: "FLOAT" },
      { key: "status_code", label: "Status Code", unit: "", value: "0", type: "BYTE" },
    ],
  },
  {
    uid: 2,
    idVal: "0x02",
    status: "waiting",
    pins: [
      { key: "frequency", label: "Frequency", unit: "MHz", value: "0.0", type: "FLOAT" },
      { key: "baud_rate", label: "Baud Rate", unit: "bps", value: "0", type: "UNSIGNED_INT" },
      { key: "tx_power", label: "TX Power", unit: "dBm", value: "0.0", type: "FLOAT" },
      { key: "channel", label: "Channel", unit: "", value: "0", type: "UNSIGNED_SHORT" },
    ],
  },
  {
    uid: 3,
    idVal: "0x03",
    status: "waiting",
    pins: [
      { key: "pressure", label: "Pressure", unit: "hPa", value: "0.0", type: "FLOAT" },
      { key: "humidity", label: "Humidity", unit: "%", value: "0", type: "UNSIGNED_SHORT" },
      { key: "mission_name", label: "Mission Name", unit: "", value: "", type: "STRING(10)" },
    ],
  },
];

function RadioBoard() {
  const [radios, setRadios] = useState(DEFAULT_RADIOS);
  const { lastUpdated, isConnected, lastReceived } = useRadioSocket("ws://127.0.0.1:8001/ws/radio/");

  useEffect(() => {
    if (lastReceived && Array.isArray(lastReceived)) {
      console.log("RadioBoard received backend data", lastReceived);
      setRadios(prev => {
        // Keep existing radios and update values from server by uid
        const byUid = Object.fromEntries(prev.map(r => [r.uid, r]));
        lastReceived.forEach(serverRadio => {
          byUid[serverRadio.uid] = {
            ...byUid[serverRadio.uid],
            ...serverRadio,
            status: serverRadio.status ?? "online",
          };
        });
        return Object.values(byUid);
      });
    }
  }, [lastReceived]);


  return (
    <div className="radio-page">
      <div className="topbar">
        <h2>Radio Telemetry Data</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: isConnected ? "#4be34b" : "#ff6b6b" }} />
          <span style={{ fontSize: "12px", color: "#888" }}>{isConnected ? "Connected" : "Disconnected"}</span>
        </div>
        {lastUpdated && <span style={{ fontSize: "12px", color: "#888" }}>Last updated: {lastUpdated}</span>}
      </div>
      <div className="cards-wrap">
        {radios.map((r, i) => (
          <RadioCard
            key={r.uid}
            radio={r}
            index={i}
            readOnly={true}
          />
        ))}
      </div>
    </div>
  );
}

export default RadioBoard;