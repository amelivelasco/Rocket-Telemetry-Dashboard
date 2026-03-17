import { useEffect, useRef, useState } from "react";

function useRadioSocket(url) {
  const ws = useRef(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [lastReceived, setLastReceived] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        ws.current = new WebSocket(url);

        ws.current.onopen = () => {
          console.log("Radio WS connected");
          setIsConnected(true);
          reconnectAttempts.current = 0;
        };

        ws.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setLastUpdated(data.last_updated);
            setLastReceived(data.received);
          } catch (e) {
            console.error("Failed to parse radio WS message:", e);
          }
        };

        ws.current.onerror = (e) => {
          console.error("Radio WS error:", e);
          setIsConnected(false);
        };

        ws.current.onclose = () => {
          console.log("Radio WS disconnected");
          setIsConnected(false);
          // Attempt to reconnect after 3 seconds
          if (reconnectAttempts.current < 5) {
            reconnectAttempts.current += 1;
            reconnectTimeout.current = setTimeout(connectWebSocket, 3000);
          }
        };
      } catch (e) {
        console.error("Failed to create WebSocket:", e);
      }
    };

    connectWebSocket();

    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      ws.current?.close();
    };
  }, [url]);

  const sendConfig = (config) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      try {
        ws.current.send(JSON.stringify(config));
      } catch (e) {
        console.error("Failed to send radio config:", e);
      }
    } else {
      console.warn("WebSocket not ready. Connection state:", ws.current?.readyState);
    }
  };

  return { lastUpdated, lastReceived, sendConfig, isConnected };
}

export default useRadioSocket;