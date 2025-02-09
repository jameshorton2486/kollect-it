
import { useState, useEffect, useCallback } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
}

export function useWebSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create WebSocket connection
    console.log('Attempting to connect to WebSocket...');
    const ws = new WebSocket(`wss://rbdbhelhvefrhcdbicss.functions.supabase.co/realtime-chat`);

    ws.onopen = () => {
      console.log('WebSocket connection established successfully');
      setIsConnected(true);
      setError(null);
    };

    ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      setIsConnected(false);
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        console.log('Attempting to reconnect...');
        setSocket(new WebSocket(`wss://rbdbhelhvefrhcdbicss.functions.supabase.co/realtime-chat`));
      }, 5000);
    };

    ws.onerror = (event) => {
      console.error('WebSocket error:', event);
      setError('WebSocket connection error. Check console for details.');
    };

    ws.onmessage = (event) => {
      console.log('Received message:', event.data);
      try {
        const data = JSON.parse(event.data);
        console.log('Parsed message:', data);
      } catch (err) {
        console.error('Error parsing message:', err);
      }
    };

    setSocket(ws);

    // Cleanup on unmount
    return () => {
      console.log('Cleaning up WebSocket connection');
      ws.close();
    };
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (socket?.readyState === WebSocket.OPEN) {
      console.log('Sending message:', message);
      socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected. State:', socket?.readyState);
      setError('WebSocket is not connected');
    }
  }, [socket]);

  return {
    isConnected,
    error,
    sendMessage
  };
}
