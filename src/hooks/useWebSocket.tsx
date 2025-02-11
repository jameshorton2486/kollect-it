
import { useState, useEffect, useCallback } from 'react';
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

  useEffect(() => {
    let reconnectTimer: NodeJS.Timeout;
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
            // Handle specific close codes
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
                // Increment reconnect attempts
                setReconnectAttempts(prev => prev + 1);
                // Attempt to reconnect
                reconnectTimer = setTimeout(() => {
                  log(`Attempting to reconnect (attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})`);
                  connectWebSocket();
                }, reconnectInterval);
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
          }
        };

        ws.onerror = (event) => {
          log('WebSocket error:', event);
          // TypeScript doesn't expose the error property on the event
          // but it might be available in some browsers
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
            
            // Handle different message types
            switch (data.type) {
              case 'session.created':
                log('Session created successfully');
                // Send session configuration
                ws.send(JSON.stringify({
                  type: 'session.update',
                  session: {
                    modalities: ['text', 'audio'],
                    instructions: "You are a helpful assistant.",
                    voice: "alloy",
                    input_audio_format: "pcm16",
                    output_audio_format: "pcm16",
                    input_audio_transcription: {
                      model: "whisper-1"
                    },
                    turn_detection: {
                      type: "server_vad",
                      threshold: 0.5,
                      prefix_padding_ms: 300,
                      silence_duration_ms: 1000
                    }
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

    connectWebSocket();

    // Cleanup function
    return () => {
      isCleanupCalled = true;
      clearTimeout(reconnectTimer);
      log('Cleaning up WebSocket connection');
      if (socket?.readyState === WebSocket.OPEN) {
        socket.close(1000, 'Component unmounting');
      }
    };
  }, [maxReconnectAttempts, reconnectInterval, reconnectAttempts, log]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (!socket) {
      setError('No WebSocket connection available');
      return;
    }

    if (socket.readyState === WebSocket.OPEN) {
      try {
        log('Sending message:', message);
        socket.send(JSON.stringify(message));
      } catch (err) {
        log('Error sending message:', err);
        setError(`Failed to send message: ${err instanceof Error ? err.message : 'Unknown error'}`);
        toast.error('Failed to send message');
      }
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
  }, [socket, log]);

  return {
    isConnected,
    error,
    sendMessage,
    reconnectAttempts
  };
}
