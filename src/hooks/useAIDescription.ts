import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAIDescription() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDescription = async (currentDescription: string): Promise<string | null> => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('enhance-description', {
        body: { description: currentDescription }
      });

      if (error) throw error;
      return data.enhancedDescription;
    } catch (error) {
      console.error('Error generating description:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateDescription, isGenerating };
}