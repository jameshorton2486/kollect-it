
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useMessageQueue } from './websocket/useMessageQueue';
import { useWebSocketConnection } from './websocket/useWebSocketConnection';

interface WebSocketMessage {
  type: string;
  data: any;
}

interface WebSocketConfig {
  maxReconnectAttempts?: number;
  reconnectInterval?: number;
  debug?: boolean;
}

export function useWebSocket(config: WebSocketConfig = {}) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  
  const {
    maxReconnectAttempts = 5,
    reconnectInterval = 5000,
    debug = true
  } = config;

  const {
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
  } = useWebSocketConnection({
    maxReconnectAttempts,
    reconnectInterval,
    debug
  });

  const { addToQueue } = useMessageQueue(socket, debug);

  useEffect(() => {
    let isCleanupCalled = false;

    const connectWebSocket = () => {
      try {
        if (reconnectAttempts >= maxReconnectAttempts) {
          log(`Max reconnection attempts (${maxReconnectAttempts}) reached`);
          setError('Maximum reconnection attempts reached. Please refresh the page.');
          toast.error('Connection lost. Please refresh the page to reconnect.');
          return;
        }

        log('Attempting to connect to WebSocket...');
        const projectRef = 'rbdbhelhvefrhcdbicss';
        const ws = new WebSocket(`wss://${projectRef}.functions.supabase.co/realtime-chat`);

        ws.onopen = () => {
          log('WebSocket connection established successfully');
          setIsConnected(true);
          setError(null);
          setReconnectAttempts(0);
          toast.success('Connected to chat server');
        };

        ws.onclose = (event) => {
          const reason = event.reason || 'Unknown reason';
          log(`WebSocket disconnected: Code ${event.code} - ${reason}`);
          setIsConnected(false);

          if (!isCleanupCalled) {
            if (event.code === 1008 || event.code === 429) {
              const backoffDelay = getBackoffDelay(reconnectAttempts);
              log(`Rate limit hit, backing off for ${backoffDelay}ms`);
              setError(`Rate limit reached. Retrying in ${Math.round(backoffDelay / 1000)} seconds...`);
              reconnectTimeout.current = setTimeout(() => {
                setReconnectAttempts(prev => prev + 1);
                connectWebSocket();
              }, backoffDelay);
            } else {
              handleCloseEvent(event);
            }
          }
        };

        ws.onerror = (event) => {
          log('WebSocket error:', event);
          const errorEvent = event as ErrorEvent;
          const errorMessage = errorEvent.message || 'Unknown error occurred';
          setError(`WebSocket error: ${errorMessage}. Check console for details.`);
          toast.error('Connection error. Attempting to reconnect...');
        };

        ws.onmessage = (event) => {
          log('Received message:', event.data);
          try {
            const data = JSON.parse(event.data);
            log('Parsed message:', data);
            
            if (data.type === 'error' && data.error?.code === 429) {
              const retryAfter = parseInt(data.error.retryAfter) || 5000;
              log(`Rate limit error from server, retry after ${retryAfter}ms`);
              toast.error(`Rate limit reached. Please wait ${Math.round(retryAfter / 1000)} seconds.`);
              return;
            }
            
            switch (data.type) {
              case 'session.created':
                log('Session created successfully');
                ws.send(JSON.stringify({
                  type: 'session.update',
                  session: {
                    modalities: ['text'],
                    instructions: "You are a helpful assistant."
                  }
                }));
                break;
              case 'error':
                log('Error from server:', data.error);
                setError(data.error.message || 'Unknown server error');
                toast.error('Server error: ' + (data.error.message || 'Unknown error'));
                break;
              default:
                break;
            }
          } catch (err) {
            log('Error parsing message:', err);
            setError('Failed to parse incoming message');
          }
        };

        setSocket(ws);
      } catch (err) {
        log('Error creating WebSocket:', err);
        setError(`Failed to create WebSocket connection: ${err instanceof Error ? err.message : 'Unknown error'}`);
        toast.error('Failed to connect to chat server');
      }
    };

    connectWebSocket();

    return () => {
      isCleanupCalled = true;
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      log('Cleaning up WebSocket connection');
      if (socket?.readyState === WebSocket.OPEN) {
        socket.close(1000, 'Component unmounting');
      }
    };
  }, [maxReconnectAttempts, reconnectAttempts, log, socket]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (!socket) {
      setError('No WebSocket connection available');
      return;
    }

    if (socket.readyState === WebSocket.OPEN) {
      addToQueue(message);
    } else {
      const states = {
        [WebSocket.CONNECTING]: 'still connecting',
        [WebSocket.CLOSING]: 'closing',
        [WebSocket.CLOSED]: 'closed'
      };
      const state = states[socket.readyState as keyof typeof states] || 'unknown';
      log(`WebSocket is not connected. State: ${state}`);
      setError(`WebSocket is ${state}`);
      toast.error(`Cannot send message: Connection is ${state}`);
    }
  }, [socket, log, addToQueue]);

  return {
    isConnected,
    error,
    sendMessage,
    reconnectAttempts
  };
}
