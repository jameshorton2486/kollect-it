
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

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
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  // Use refs for rate limiting
  const messageQueue = useRef<WebSocketMessage[]>([]);
  const processingQueue = useRef(false);
  const lastMessageTime = useRef(0);
  const reconnectTimeout = useRef<NodeJS.Timeout>();
  
  const {
    maxReconnectAttempts = 5,
    reconnectInterval = 5000,
    debug = true
  } = config;

  const log = useCallback((message: string, data?: any) => {
    if (debug) {
      if (data) {
        console.log(`[WebSocket] ${message}:`, data);
      } else {
        console.log(`[WebSocket] ${message}`);
      }
    }
  }, [debug]);

  // Process message queue with rate limiting
  const processMessageQueue = useCallback(() => {
    if (!processingQueue.current && messageQueue.current.length > 0 && socket?.readyState === WebSocket.OPEN) {
      processingQueue.current = true;

      const now = Date.now();
      const timeSinceLastMessage = now - lastMessageTime.current;
      const minMessageInterval = 1000; // Minimum 1 second between messages

      const delay = Math.max(0, minMessageInterval - timeSinceLastMessage);

      setTimeout(() => {
        const message = messageQueue.current.shift();
        if (message && socket?.readyState === WebSocket.OPEN) {
          try {
            log('Sending queued message:', message);
            socket.send(JSON.stringify(message));
            lastMessageTime.current = Date.now();
          } catch (err) {
            log('Error sending queued message:', err);
          }
        }

        processingQueue.current = false;
        if (messageQueue.current.length > 0) {
          processMessageQueue();
        }
      }, delay);
    }
  }, [socket, log]);

  useEffect(() => {
    let isCleanupCalled = false;

    const getBackoffDelay = (attempt: number) => {
      // Exponential backoff with jitter
      const baseDelay = Math.min(1000 * Math.pow(2, attempt), 30000);
      const jitter = Math.random() * 1000;
      return baseDelay + jitter;
    };

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

          // Process any messages that were queued during reconnection
          if (messageQueue.current.length > 0) {
            processMessageQueue();
          }
        };

        ws.onclose = (event) => {
          const reason = event.reason || 'Unknown reason';
          log(`WebSocket disconnected: Code ${event.code} - ${reason}`);
          setIsConnected(false);

          if (!isCleanupCalled) {
            if (event.code === 1008 || event.code === 429) {
              // Rate limit hit - use exponential backoff
              const backoffDelay = getBackoffDelay(reconnectAttempts);
              log(`Rate limit hit, backing off for ${backoffDelay}ms`);
              setError(`Rate limit reached. Retrying in ${Math.round(backoffDelay / 1000)} seconds...`);
              reconnectTimeout.current = setTimeout(() => {
                setReconnectAttempts(prev => prev + 1);
                connectWebSocket();
              }, backoffDelay);
            } else {
              // Handle other close cases
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
              // Handle rate limit error from server
              const retryAfter = parseInt(data.error.retryAfter) || 5000;
              log(`Rate limit error from server, retry after ${retryAfter}ms`);
              toast.error(`Rate limit reached. Please wait ${Math.round(retryAfter / 1000)} seconds.`);
              return;
            }
            
            // Handle other message types
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
                // Handle other message types as needed
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

    const handleCloseEvent = (event: CloseEvent) => {
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
          // Use exponential backoff for reconnection
          const backoffDelay = getBackoffDelay(reconnectAttempts);
          reconnectTimeout.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connectWebSocket();
          }, backoffDelay);
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
    };

    connectWebSocket();

    // Cleanup function
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
  }, [maxReconnectAttempts, reconnectAttempts, log, processMessageQueue]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (!socket) {
      setError('No WebSocket connection available');
      return;
    }

    if (socket.readyState === WebSocket.OPEN) {
      // Add message to queue instead of sending immediately
      messageQueue.current.push(message);
      log('Message added to queue:', message);
      processMessageQueue();
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
  }, [socket, log, processMessageQueue]);

  return {
    isConnected,
    error,
    sendMessage,
    reconnectAttempts
  };
}
