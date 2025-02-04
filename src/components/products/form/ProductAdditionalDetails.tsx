import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface ProductAdditionalDetailsProps {
  form: UseFormReturn<any>;
}

export function ProductAdditionalDetails({ form }: ProductAdditionalDetailsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="era"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Era/Period</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select era" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="victorian">Victorian (1837-1901)</SelectItem>
                <SelectItem value="edwardian">Edwardian (1901-1910)</SelectItem>
                <SelectItem value="art-nouveau">Art Nouveau (1890-1910)</SelectItem>
                <SelectItem value="art-deco">Art Deco (1920-1940)</SelectItem>
                <SelectItem value="mid-century">Mid-Century Modern (1940-1970)</SelectItem>
                <SelectItem value="vintage">Vintage (50+ years old)</SelectItem>
                <SelectItem value="contemporary">Contemporary</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="estimated_age"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estimated Age</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 'Circa 1920s' or '100+ years'" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="provenance"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Provenance (Optional)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="History of ownership, documentation, or certificates of authenticity"
                className="min-h-[100px]"
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