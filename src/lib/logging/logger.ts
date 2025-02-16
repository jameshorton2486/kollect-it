
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogEvent = 'auth' | 'api' | 'navigation' | 'user_action' | 'error' | 'system';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  event: LogEvent;
  message: string;
  data?: Record<string, any>;
}

const DEBUG_MODE = process.env.NODE_ENV === 'development';

class Logger {
  private static formatLogEntry(entry: LogEntry): string {
    return JSON.stringify({
      ...entry,
      environment: process.env.NODE_ENV,
    });
  }

  private static log(level: LogLevel, event: LogEvent, message: string, data?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      event,
      message,
      data: data ? this.sanitizeData(data) : undefined
    };

    const formattedEntry = this.formatLogEntry(entry);

    switch (level) {
      case 'debug':
        if (DEBUG_MODE) {
          console.debug(formattedEntry);
        }
        break;
      case 'info':
        console.info(formattedEntry);
        break;
      case 'warn':
        console.warn(formattedEntry);
        break;
      case 'error':
        console.error(formattedEntry);
        break;
    }

    // In production, you might want to send logs to a service like Supabase
    if (process.env.NODE_ENV === 'production') {
      this.persistLog(entry);
    }
  }

  private static sanitizeData(data: Record<string, any>): Record<string, any> {
    const sensitiveFields = ['password', 'token', 'secret', 'credit_card'];
    return Object.entries(data).reduce((acc, [key, value]) => {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        acc[key] = '[REDACTED]';
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
  }

  private static async persistLog(entry: LogEntry) {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      await supabase.from('system_logs').insert([entry]);
    } catch (error) {
      console.error('Failed to persist log:', error);
    }
  }

  static debug(event: LogEvent, message: string, data?: Record<string, any>) {
    this.log('debug', event, message, data);
  }

  static info(event: LogEvent, message: string, data?: Record<string, any>) {
    this.log('info', event, message, data);
  }

  static warn(event: LogEvent, message: string, data?: Record<string, any>) {
    this.log('warn', event, message, data);
  }

  static error(event: LogEvent, message: string, data?: Record<string, any>) {
    this.log('error', event, message, data);
  }
}

export const logger = Logger;
