import "./radioCard.css";

const STATUS_BADGE = {
  online:  { label: "online",  cls: "badge-online" },
  syncing: { label: "syncing", cls: "badge-syncing" },
  offline: { label: "offline", cls: "badge-offline" },
};

function RadioCard({ radio, index, onChange, onLoad, onRemove }) {
  const badge = STATUS_BADGE[radio.status];
  return (
    <div className="radio-card">
      <div className="card-header">
        <span className="card-title">Radio {radio.uid}</span>
        <span className={`badge ${badge.cls}`}>{badge.label}</span>
      </div>
      {[
        { key: "idVal", label: "ID" },
        { key: "p1",    label: "P1 — frequency (MHz)" },
        { key: "p2",    label: "P2 — baud rate" },
        { key: "p3",    label: "P3 — tx power (dBm)" },
      ].map(({ key, label }) => (
        <div className="field" key={key}>
          <label>{label}</label>
          <input
            value={radio[key]}
            onChange={e => onChange(index, key, e.target.value)}
          />
        </div>
      ))}
      {radio.errors?.map(err => (
        <div className="warn-box" key={err}>▲ {err}</div>
      ))}
      <div className="card-footer">
        <button className="btn" onClick={() => onLoad(index)}>Load</button>
        <button className="btn btn-danger" onClick={() => onRemove(index)}>✕</button>
      </div>
    </div>
  );
}

export default RadioCard