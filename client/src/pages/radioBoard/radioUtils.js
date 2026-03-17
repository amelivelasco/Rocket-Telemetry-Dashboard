export const downloadConfig = (radios) => {
  const config = radios.map(({ errors, saved, ...radio }) => radio);
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `radio-config-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const loadConfig = (onSuccess) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!Array.isArray(parsed)) throw new Error("Invalid format");
        const loaded = parsed.map(radio => ({
          ...radio,
          saved: false,
          pins: Array.isArray(radio.pins) ? radio.pins : [],
        }));
        onSuccess(loaded);
      } catch {
        alert("Invalid config file — must be a JSON array of radio objects.");
      }
    };
    reader.readAsText(file);
  };
  input.click();
};

export const validate = (radios) => {
  const ids = radios.map(r => r.idVal);
  return radios.map(r => ({
    ...r,
    errors: ids.filter(id => id === r.idVal).length > 1 ? ["Same ID used twice"] : [],
  }));
};

export const DEFAULT_RADIOS = validate([
  {
    uid: 1, status: "online", idVal: "0x01", saved: false,
    pins: [
      { key: "frequency", label: "Frequency", unit: "MHz", value: "433" },
      { key: "baudRate",  label: "Baud rate", unit: "bps", value: "9600" },
      { key: "txPower",   label: "TX power",  unit: "dBm", value: "10" },
    ],
  },
  {
    uid: 2, status: "syncing", idVal: "0x01", saved: false,
    pins: [
      { key: "frequency", label: "Frequency", unit: "MHz", value: "433" },
      { key: "baudRate",  label: "Baud rate", unit: "bps", value: "19200" },
      { key: "txPower",   label: "TX power",  unit: "dBm", value: "5" },
      { key: "channel",   label: "Channel",   unit: "",    value: "3" },
    ],
  },
  {
    uid: 3, status: "offline", idVal: "0x03", saved: false,
    pins: [
      { key: "frequency", label: "Frequency", unit: "MHz", value: "868" },
      { key: "baudRate",  label: "Baud rate", unit: "bps", value: "9600" },
      { key: "txPower",   label: "TX power",  unit: "dBm", value: "10" },
    ],
  },
]);