import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface ProductDescriptionSectionProps {
  form: UseFormReturn<any>;
  handleAIRewrite: () => Promise<void>;
  isGenerating: boolean;
}

export function ProductDescriptionSection({ 
  form, 
  handleAIRewrite, 
  isGenerating 
}: ProductDescriptionSectionProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <div className="flex justify-between items-center">
              <FormLabel>Description</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAIRewrite}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                Enhance with AI
              </Button>
            </div>
            <FormControl>
              <Textarea 
                placeholder="Detailed description of the item"
                className="min-h-[200px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}