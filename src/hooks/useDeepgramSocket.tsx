
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface DeepgramConfig {
  maxReconnectAttempts?: number;
  debug?: boolean;
}

export function useDeepgramSocket(config: DeepgramConfig = {}) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  
  const {
    maxReconnectAttempts = 3,
    debug = true
  } = config;

  const log = useCallback((message: string, data?: any) => {
    if (debug) {
      console.log(`[Deepgram] ${message}`, data || '');
    }
  }, [debug]);

  const connectWebSocket = useCallback(async () => {
    try {
      log('Connecting to Deepgram WebSocket...');
      const response = await fetch('/api/get-deepgram-token');
      const { token } = await response.json();
      
      const ws = new WebSocket('wss://api.deepgram.com/v1/listen', {
        headers: {
          Authorization: `Token ${token}`
        }
      });

      ws.onopen = () => {
        log('WebSocket connected');
        setIsConnected(true);
        setError(null);
        toast.success('Connected to transcription service');
      };

      ws.onclose = () => {
        log('WebSocket disconnected');
        setIsConnected(false);
        setError('Connection closed');
        toast.error('Transcription service disconnected');
      };

      ws.onerror = (event) => {
        log('WebSocket error:', event);
        setError('Connection error');
        toast.error('Error connecting to transcription service');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.channel?.alternatives?.[0]?.transcript) {
            const newTranscript = data.channel.alternatives[0].transcript;
            setTranscript(prev => prev + ' ' + newTranscript);
          }
        } catch (err) {
          log('Error parsing message:', err);
        }
      };

      setSocket(ws);
    } catch (err) {
      log('Error creating WebSocket:', err);
      setError('Failed to connect');
      toast.error('Failed to connect to transcription service');
    }
  }, [log]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.current.push(event.data);
          
          // Convert to proper format and send to WebSocket
          const reader = new FileReader();
          reader.onload = () => {
            if (socket?.readyState === WebSocket.OPEN) {
              socket.send(reader.result as ArrayBuffer);
            }
          };
          reader.readAsArrayBuffer(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        setIsRecording(false);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start(250); // Send data every 250ms
      setIsRecording(true);
      toast.success('Recording started');
    } catch (err) {
      log('Error starting recording:', err);
      setError('Failed to start recording');
      toast.error('Failed to access microphone');
    }
  }, [socket, log]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      toast.success('Recording stopped');
    }
  }, [isRecording]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.close();
      }
      if (mediaRecorder.current && isRecording) {
        mediaRecorder.current.stop();
      }
    };
  }, [connectWebSocket, isRecording]);

  return {
    isConnected,
    isRecording,
    error,
    transcript,
    startRecording,
    stopRecording
  };
}
