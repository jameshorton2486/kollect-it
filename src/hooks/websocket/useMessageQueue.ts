
import { useCallback, useRef } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
}

export function useMessageQueue(socket: WebSocket | null, debug: boolean = false) {
  const messageQueue = useRef<WebSocketMessage[]>([]);
  const processingQueue = useRef(false);
  const lastMessageTime = useRef(0);

  const log = useCallback((message: string, data?: any) => {
    if (debug) {
      if (data) {
        console.log(`[WebSocket Queue] ${message}:`, data);
      } else {
        console.log(`[WebSocket Queue] ${message}`);
      }
    }
  }, [debug]);

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

  const addToQueue = useCallback((message: WebSocketMessage) => {
    messageQueue.current.push(message);
    log('Message added to queue:', message);
    processMessageQueue();
  }, [log, processMessageQueue]);

  return { addToQueue };
}
