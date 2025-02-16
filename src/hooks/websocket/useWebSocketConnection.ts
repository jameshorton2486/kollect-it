
import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface ConnectionConfig {
  maxReconnectAttempts: number;
  reconnectInterval: number;
  debug: boolean;
}

export function useWebSocketConnection(config: ConnectionConfig) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const reconnectTimeout = useRef<NodeJS.Timeout>();

  const log = useCallback((message: string, data?: any) => {
    if (config.debug) {
      if (data) {
        console.log(`[WebSocket Connection] ${message}:`, data);
      } else {
        console.log(`[WebSocket Connection] ${message}`);
      }
    }
  }, [config.debug]);

  const getBackoffDelay = (attempt: number) => {
    const baseDelay = Math.min(1000 * Math.pow(2, attempt), 30000);
    const jitter = Math.random() * 1000;
    return baseDelay + jitter;
  };

  const handleCloseEvent = useCallback((event: CloseEvent) => {
    switch (event.code) {
      case 1000:
        log('Normal closure');
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
  }, [log]);

  return {
    isConnected,
    setIsConnected,
    error,
    setError,
    reconnectAttempts,
    setReconnectAttempts,
    reconnectTimeout,
    handleCloseEvent,
    getBackoffDelay,
    log
  };
}
