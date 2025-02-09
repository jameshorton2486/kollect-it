
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
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(`wss://rbdbhelhvefrhcdbicss.functions.supabase.co/realtime-chat`);

        ws.onopen = () => {
          console.log('WebSocket connection established successfully');
          setIsConnected(true);
          setError(null);
        };

        ws.onclose = (event) => {
          const reason = event.reason || 'Unknown reason';
          console.log(`WebSocket disconnected: Code ${event.code} - ${reason}`);
          setIsConnected(false);

          // Handle specific close codes
          switch (event.code) {
            case 1000:
              console.log('Normal closure');
              break;
            case 1001:
              setError('Server is going down or client navigated away');
              break;
            case 1002:
              setError('Protocol error occurred');
              break;
            case 1003:
              setError('Received invalid data');
              break;
            case 1005:
              setError('Connection closed unexpectedly');
              break;
            case 1006:
              setError('Connection lost. Attempting to reconnect...');
              break;
            case 1007:
              setError('Message format error');
              break;
            case 1008:
              setError('Policy violation');
              break;
            case 1009:
              setError('Message too large');
              break;
            case 1011:
              setError('Server encountered an error');
              break;
            default:
              setError(`Connection closed with code ${event.code}`);
          }

          // Attempt to reconnect after 5 seconds
          setTimeout(() => {
            console.log('Attempting to reconnect...');
            connectWebSocket();
          }, 5000);
        };

        ws.onerror = (event) => {
          console.error('WebSocket error:', event);
          // TypeScript doesn't expose the error property on the event
          // but it might be available in some browsers
          const errorEvent = event as ErrorEvent;
          const errorMessage = errorEvent.message || 'Unknown error occurred';
          setError(`WebSocket error: ${errorMessage}. Check console for details.`);
        };

        ws.onmessage = (event) => {
          console.log('Received message:', event.data);
          try {
            const data = JSON.parse(event.data);
            console.log('Parsed message:', data);
          } catch (err) {
            console.error('Error parsing message:', err);
            setError('Failed to parse incoming message');
          }
        };

        setSocket(ws);
      } catch (err) {
        console.error('Error creating WebSocket:', err);
        setError(`Failed to create WebSocket connection: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    connectWebSocket();

    // Cleanup on unmount
    return () => {
      console.log('Cleaning up WebSocket connection');
      if (socket?.readyState === WebSocket.OPEN) {
        socket.close(1000, 'Component unmounting');
      }
    };
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (!socket) {
      setError('No WebSocket connection available');
      return;
    }

    if (socket.readyState === WebSocket.OPEN) {
      try {
        console.log('Sending message:', message);
        socket.send(JSON.stringify(message));
      } catch (err) {
        console.error('Error sending message:', err);
        setError(`Failed to send message: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    } else {
      const states = {
        [WebSocket.CONNECTING]: 'still connecting',
        [WebSocket.CLOSING]: 'closing',
        [WebSocket.CLOSED]: 'closed'
      };
      const state = states[socket.readyState as keyof typeof states] || 'unknown';
      console.error(`WebSocket is not connected. State: ${state}`);
      setError(`WebSocket is ${state}`);
    }
  }, [socket]);

  return {
    isConnected,
    error,
    sendMessage
  };
}
