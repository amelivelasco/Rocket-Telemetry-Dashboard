import { useState, useEffect, useRef } from "react";
import "./radioBoard.css";
import RadioCard from "../../components/radioCard/radioCard";
import useRadioSocket from "../../sockets/radio/useRadioSocket";
import { validate, DEFAULT_RADIOS, downloadConfig, loadConfig } from "./radioUtils";

let nextId = DEFAULT_RADIOS.length + 1;

function RadioBoard() {
  const [radios, setRadios] = useState(DEFAULT_RADIOS);
  const { lastUpdated, sendConfig, isConnected, lastReceived } = useRadioSocket("ws://127.0.0.1:8001/ws/radio/");

  useEffect(() => {
    if (lastReceived && Array.isArray(lastReceived)) {
      setRadios(prev => validate(prev.map(radio => {
        const match = lastReceived.find(r => r.uid === radio.uid);
        return match ? { ...radio, ...match, saved: true } : radio;
      })));
    }
  }, [lastReceived]);

  const sendRandomValues = () => {
    const payload = radios.map(r => ({
      ...r,
      pins: r.pins.map(pin => ({ ...pin, value: (Math.floor(Math.random() * 900) + 100).toString() })),
      saved: false,
    }));
    setRadios(validate(payload));
    sendConfig(payload);
  };

  const handleChange = (i, key, value) => {
    setRadios(r => validate(r.map((radio, idx) => idx === i ? { ...radio, [key]: value, saved: false } : radio)));
  };

  const handleLoad = (i) => {
    setRadios(r => r.map((radio, idx) => idx === i ? { ...radio, status: "syncing" } : radio));
    setTimeout(() => {
      setRadios(r => r.map((radio, idx) => idx === i ? { ...radio, status: "online" } : radio));
    }, 1500);
  };

  const handleRemove    = (i)      => setRadios(r => validate(r.filter((_, idx) => idx !== i)));
  const handlePinChange = (ri, pi, field, value) => setRadios(r => r.map((radio, i) => i !== ri ? radio : { ...radio, pins: radio.pins.map((pin, j) => j !== pi ? pin : { ...pin, [field]: value }) }));
  const handleAddPin    = (ri)     => setRadios(r => r.map((radio, i) => i !== ri ? radio : { ...radio, pins: [...radio.pins, { key: `pin${Date.now()}`, label: "New pin", unit: "", value: "" }] }));
  const handleRemovePin = (ri, pi) => setRadios(r => r.map((radio, i) => i !== ri ? radio : { ...radio, pins: radio.pins.filter((_, j) => j !== pi) }));

  const handleAdd = () => {
    const uid = nextId++;
    setRadios(r => validate([...r, {
      uid, status: "offline", idVal: `0x0${uid}`, saved: false,
      pins: [
        { key: "frequency", label: "Frequency", unit: "MHz", value: "433" },
        { key: "baudRate",  label: "Baud rate", unit: "bps", value: "9600" },
      ],
    }]));
  };

  return (
    <div className="radio-page">
      <div className="topbar">
        <h2>Radio config</h2>
        <button className="btn" onClick={sendRandomValues}>Send random values</button>
        <button className="btn" onClick={() => loadConfig(loaded => { nextId = Math.max(...loaded.map(r => r.uid)) + 1; setRadios(validate(loaded)); })}>Load radio config</button>
        <button className="btn" onClick={() => downloadConfig(radios)}>Download config</button>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: isConnected ? "#4be34b" : "#ff6b6b" }} />
          <span style={{ fontSize: "12px", color: "#888" }}>{isConnected ? "Connected" : "Disconnected"}</span>
        </div>
        {lastUpdated && <span style={{ fontSize: "12px", color: "#888" }}>Last updated: {lastUpdated}</span>}
      </div>
      <div className="cards-wrap">
        {radios.map((r, i) => (
          <div key={r.uid} style={{ position: "relative" }}>
            {r.saved && (
              <div style={{ position: "absolute", top: "-8px", right: "-8px", backgroundColor: "#4be34b", color: "white", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "bold", zIndex: 10 }}>✓</div>
            )}
            <RadioCard
              radio={r} index={i}
              onChange={handleChange}
              onPinChange={handlePinChange}
              onAddPin={handleAddPin}
              onRemovePin={handleRemovePin}
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