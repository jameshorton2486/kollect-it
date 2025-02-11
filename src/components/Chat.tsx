
import { useWebSocket } from '../hooks/useWebSocket';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowClockwise } from 'lucide-react';

export function Chat() {
  const { isConnected, error, sendMessage, reconnectAttempts } = useWebSocket({
    maxReconnectAttempts: 5,
    reconnectInterval: 5000,
    debug: true
  });

  const handleSendMessage = () => {
    sendMessage({
      type: 'message',
      data: 'Hello from the client!'
    });
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span>
          Connection status: {isConnected ? 'Connected' : 'Disconnected'}
          {!isConnected && reconnectAttempts > 0 && ` (Retry ${reconnectAttempts}/5)`}
        </span>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center gap-2">
            {error}
            {reconnectAttempts > 0 && <ArrowClockwise className="animate-spin" />}
          </AlertDescription>
        </Alert>
      )}
      
      <Button 
        onClick={handleSendMessage}
        disabled={!isConnected}
        className="flex items-center gap-2"
      >
        Send Test Message
        {!isConnected && <ArrowClockwise className="animate-spin" />}
      </Button>
    </div>
  );
}
