
import type { DeviceInfo } from '@/types/session';

export function getDeviceInfo(): DeviceInfo {
  return {
    platform: navigator.platform,
    userAgent: navigator.userAgent,
    language: navigator.language,
    cookiesEnabled: navigator.cookieEnabled,
    screenResolution: {
      width: window.screen.width,
      height: window.screen.height
    }
  };
}
