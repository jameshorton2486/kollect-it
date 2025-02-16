
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

  private static async persistLog(entry: LogEntry) {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      // Using activity_logs table instead of system_logs since it's already in the schema
      await supabase.from('activity_logs').insert([{
        activity_type: 'system',
        details: entry,
        timestamp: entry.timestamp
      }]);
    } catch (error) {
      console.error('Failed to persist log:', error);
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

  static debug(event: LogEvent, message: string, data?: Record<string, any>) {
    if (DEBUG_MODE) {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: 'debug',
        event,
        message,
        data: data ? this.sanitizeData(data) : undefined
      };
      console.debug(this.formatLogEntry(entry));
    }
  }

  static info(event: LogEvent, message: string, data?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      event,
      message,
      data: data ? this.sanitizeData(data) : undefined
    };
    console.info(this.formatLogEntry(entry));
    if (process.env.NODE_ENV === 'production') {
      this.persistLog(entry);
    }
  }

  static warn(event: LogEvent, message: string, data?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'warn',
      event,
      message,
      data: data ? this.sanitizeData(data) : undefined
    };
    console.warn(this.formatLogEntry(entry));
    if (process.env.NODE_ENV === 'production') {
      this.persistLog(entry);
    }
  }

  static error(event: LogEvent, message: string, data?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      event,
      message,
      data: data ? this.sanitizeData(data) : undefined
    };
    console.error(this.formatLogEntry(entry));
    if (process.env.NODE_ENV === 'production') {
      this.persistLog(entry);
    }
  }
}

export const logger = Logger;
