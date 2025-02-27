
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { accessibilitySettingsSchema } from "@/lib/validations/schemas";

interface AccessibilitySettings {
  reduceMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
}

export function AccessibilitySettings() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    reduceMotion: false,
    highContrast: false,
    largeText: false,
  });

  useEffect(() => {
    const loadSettings = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('accessibility_settings')
          .eq('user_id', session.user.id)
          .single();

        if (data?.accessibility_settings) {
          try {
            const validatedSettings = accessibilitySettingsSchema.parse(data.accessibility_settings);
            setSettings({
              reduceMotion: Boolean(validatedSettings.reduceMotion),
              highContrast: Boolean(validatedSettings.highContrast),
              largeText: Boolean(validatedSettings.largeText),
            });
          } catch (error) {
            console.error("Invalid settings format:", error);
            setSettings({
              reduceMotion: false,
              highContrast: false,
              largeText: false,
            });
          }
        }
      }
    };

    loadSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<AccessibilitySettings>) => {
    const updatedSettings: AccessibilitySettings = {
      ...settings,
      ...newSettings,
    };
    
    try {
      const validatedSettings = accessibilitySettingsSchema.parse(updatedSettings);
      setSettings({
        reduceMotion: Boolean(validatedSettings.reduceMotion),
        highContrast: Boolean(validatedSettings.highContrast),
        largeText: Boolean(validatedSettings.largeText),
      });

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { error } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: session.user.id,
            accessibility_settings: validatedSettings
          });

        if (error) {
          toast.error("Failed to save settings");
          return;
        }

        // Apply settings to document
        document.documentElement.classList.toggle('reduce-motion', validatedSettings.reduceMotion);
        document.documentElement.classList.toggle('high-contrast', validatedSettings.highContrast);
        document.documentElement.classList.toggle('large-text', validatedSettings.largeText);

        toast.success("Settings saved successfully");
      }
    } catch (error) {
      console.error("Settings validation error:", error);
      toast.error("Invalid settings format");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Accessibility settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Accessibility Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <label htmlFor="reduce-motion" className="text-sm font-medium">
              Reduce Motion
            </label>
            <Switch
              id="reduce-motion"
              checked={settings.reduceMotion}
              onCheckedChange={(checked) => updateSettings({ reduceMotion: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="high-contrast" className="text-sm font-medium">
              High Contrast
            </label>
            <Switch
              id="high-contrast"
              checked={settings.highContrast}
              onCheckedChange={(checked) => updateSettings({ highContrast: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="large-text" className="text-sm font-medium">
              Large Text
            </label>
            <Switch
              id="large-text"
              checked={settings.largeText}
              onCheckedChange={(checked) => updateSettings({ largeText: checked })}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
