import { useState, useEffect } from "react";
import "./radioBoard.css";
import RadioCard from "../../components/radioCard/radioCard"
import useRadioSocket from "../../sockets/radio/useRadioSocket";

function validate(radios) {
  const ids = radios.map(r => r.idVal);
  return radios.map(r => ({
    ...r,
    errors: ids.filter(id => id === r.idVal).length > 1
      ? ["Same ID used twice"]
      : [],
  }));
}

let nextId = 4;

const DEFAULT_RADIOS = validate([
  { uid: 1, status: "online",  idVal: "0x01", p1: "433", p2: "9600",  p3: "10", saved: false },
  { uid: 2, status: "syncing", idVal: "0x01", p1: "433", p2: "19200", p3: "5", saved: false  },
  { uid: 3, status: "offline", idVal: "0x03", p1: "868", p2: "9600",  p3: "10", saved: false },
]);

function RadioBoard() {

  const [radios, setRadios] = useState(DEFAULT_RADIOS);
  const { lastUpdated, sendConfig, isConnected, lastReceived } = useRadioSocket("ws://127.0.0.1:8001/ws/radio/");

  // Sync received data from backend with local radios
  useEffect(() => {
    if (lastReceived && Array.isArray(lastReceived)) {
      console.log("Syncing received radios:", lastReceived);
      setRadios(prevRadios => {
        const updated = prevRadios.map(radio => {
          // Find matching radio in received data
          const receivedRadio = lastReceived.find(r => r.uid === radio.uid);
          if (receivedRadio) {
            return {
              ...radio,
              ...receivedRadio,
              saved: true, // Mark as saved after confirmation from backend
            };
          }
          return radio;
        });
        return validate(updated);
      });
    }
  }, [lastReceived]);

  const sendRandomValues = () => {
    const payload = radios.map(r => ({
      ...r,
      p1: (400 + Math.floor(Math.random() * 500)).toString(),
      p2: [9600, 19200, 38400][Math.floor(Math.random() * 3)].toString(),
      p3: Math.floor(Math.random() * 20).toString(),
      saved: false, // Mark as unsaved while sending
    }));
    setRadios(prevRadios => validate(prevRadios.map((r, i) => ({ ...r, ...payload[i] }))));
    sendConfig(payload);
  };

  const handleChange = (i, key, value) => {
    const updated = radios.map((r, idx) => 
      idx === i ? { ...r, [key]: value, saved: false } : r
    );
    setRadios(validate(updated));
  };

  const handleLoad = (i) => {
    setRadios(r => r.map((radio, idx) => idx === i ? { ...radio, status: "syncing" } : radio));
    setTimeout(() => {
      setRadios(r => r.map((radio, idx) => idx === i ? { ...radio, status: "online" } : radio));
    }, 1500);
  };

  const handleRemove = (i) => {
    setRadios(r => validate(r.filter((_, idx) => idx !== i)));
  };

  const handleAdd = () => {
    const uid = nextId++;
    setRadios(r => validate([...r, {
      uid, status: "offline",
      idVal: `0x0${uid}`, p1: "433", p2: "9600", p3: "10",
      saved: false,
    }]));
  };

  return (
    <div className="radio-page">
      <div className="topbar">
        <h2>Radio config</h2>
        <button className="btn" onClick={sendRandomValues}>Send random values</button>
        <button className="btn">Load radio config</button>
        <button className="btn">Download config</button>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div 
            style={{ 
              width: "12px", 
              height: "12px", 
              borderRadius: "50%",
              backgroundColor: isConnected ? "#4be34b" : "#ff6b6b"
            }} 
          />
          <span style={{ fontSize: "12px", color: "#888" }}>
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        {lastUpdated && (
          <span style={{ fontSize: "12px", color: "#888" }}>
            Last updated: {lastUpdated}
          </span>
        )}
      </div>
      <div className="cards-wrap">
        {radios.map((r, i) => (
          <div key={r.uid} style={{ position: "relative" }}>
            {r.saved && (
              <div 
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  backgroundColor: "#4be34b",
                  color: "white",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: "bold",
                  zIndex: 10,
                }}
              >
                ✓
              </div>
            )}
            <RadioCard
              radio={r}
              index={i}
              onChange={handleChange}
              onLoad={handleLoad}
              onRemove={handleRemove}
            />
          </div>
        ))}
        <button className="add-btn" onClick={handleAdd}>+</button>
      </div>
    </div>
  );
}

export default RadioBoard;