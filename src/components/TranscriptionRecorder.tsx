
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDeepgramSocket } from "@/hooks/useDeepgramSocket";
import { Mic, MicOff, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

export function TranscriptionRecorder() {
  const { 
    isConnected, 
    isRecording, 
    error, 
    transcript, 
    startRecording, 
    stopRecording 
  } = useDeepgramSocket();

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center space-x-2">
        <div 
          className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`} 
        />
        <span>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Voice Transcription</h3>
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            variant={isRecording ? "destructive" : "default"}
            className="flex items-center gap-2"
            disabled={!isConnected}
          >
            {isRecording ? (
              <>
                <MicOff className="w-4 h-4" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                Start Recording
              </>
            )}
          </Button>
        </div>

        <div className="bg-muted p-4 rounded-md min-h-[100px] relative">
          {transcript ? (
            <p className="text-sm whitespace-pre-wrap">{transcript}</p>
          ) : (
            <p className="text-muted-foreground text-sm">
              {isRecording 
                ? "Listening..." 
                : "Click 'Start Recording' to begin transcription"
              }
            </p>
          )}
          {isRecording && (
            <div className="absolute top-2 right-2">
              <RefreshCw className="w-4 h-4 animate-spin text-primary" />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
