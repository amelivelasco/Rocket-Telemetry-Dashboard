import { useState, useEffect } from "react";
import "./radioConfig.css";
import RadioCard from "../../components/radioCard/radioCard";
import useRadioSocket from "../../sockets/radio/useRadioSocket";
import { validate, DEFAULT_RADIOS, downloadConfig, loadConfig } from "./radioUtils";

function RadioBoard() {
  const [radios, setRadios] = useState(DEFAULT_RADIOS);
  const { lastUpdated, isConnected, lastReceived } = useRadioSocket("ws://127.0.0.1:8001/ws/radio/");
  let nextId = DEFAULT_RADIOS.length + 1;
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
        <h2>Radio Config</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button className="btn" onClick={() => loadConfig(loaded => { nextId = Math.max(...loaded.map(r => r.uid)) + 1; setRadios(validate(loaded)); })}>Load radio config</button>
            <button className="btn" onClick={() => downloadConfig(radios)}>Download config</button>
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