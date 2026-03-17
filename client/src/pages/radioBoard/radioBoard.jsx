import { useState } from "react";
import "./radioBoard.css";
import RadioCard from "../../components/radioCard/radioCard"

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
  { uid: 1, status: "online",  idVal: "0x01", p1: "433", p2: "9600",  p3: "10" },
  { uid: 2, status: "syncing", idVal: "0x01", p1: "433", p2: "19200", p3: "5"  },
  { uid: 3, status: "offline", idVal: "0x03", p1: "868", p2: "9600",  p3: "10" },
]);

function RadioBoard() {
  const [radios, setRadios] = useState(DEFAULT_RADIOS);

  const handleChange = (i, key, value) => {
    const updated = radios.map((r, idx) => idx === i ? { ...r, [key]: value } : r);
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
    }]));
  };

  return (
    <div className="radio-page">
      <div className="topbar">
        <h2>Radio config</h2>
        <button className="btn">Load radio config</button>
        <button className="btn">Download config</button>
      </div>
      <div className="cards-wrap">
        {radios.map((r, i) => (
          <RadioCard
            key={r.uid}
            radio={r}
            index={i}
            onChange={handleChange}
            onLoad={handleLoad}
            onRemove={handleRemove}
          />
        ))}
        <button className="add-btn" onClick={handleAdd}>+</button>
      </div>
    </div>
  );
}

export default RadioBoard;