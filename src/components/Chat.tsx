
import { useWebSocket } from '../hooks/useWebSocket';

export function Chat() {
  const { isConnected, error, sendMessage } = useWebSocket();

  const handleSendMessage = () => {
    sendMessage({
      type: 'message',
      data: 'Hello from the client!'
    });
  };

  return (
    <div>
      <div>Connection status: {isConnected ? 'Connected' : 'Disconnected'}</div>
      {error && <div>Error: {error}</div>}
      <button onClick={handleSendMessage}>Send Test Message</button>
    </div>
  );
}
