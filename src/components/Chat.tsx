
import { useWebSocket } from '../hooks/useWebSocket';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';

export function Chat() {
  const { isConnected, error, sendMessage } = useWebSocket();

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
        <span>Connection status: {isConnected ? 'Connected' : 'Disconnected'}</span>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Button 
        onClick={handleSendMessage}
        disabled={!isConnected}
      >
        Send Test Message
      </Button>
    </div>
  );
}
