import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface BulkProductUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BulkProductUpload({ open, onOpenChange }: BulkProductUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result;
        if (typeof text !== 'string') return;

        const rows = text.split('\n').map(row => row.split(','));
        const headers = rows[0];
        const products = rows.slice(1).map(row => {
          const product: Record<string, any> = {};
          headers.forEach((header, index) => {
            product[header.trim()] = row[index]?.trim();
          });
          return product;
        });

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('Not authenticated');

        for (const product of products) {
          const { error } = await supabase.from('products').insert({
            name: product.name,
            description: product.description,
            price: parseFloat(product.price),
            category_id: product.category_id,
            condition: product.condition,
            user_id: session.user.id
          });

          if (error) throw error;
        }

        toast({
          title: "Success",
          description: `${products.length} products uploaded successfully`
        });
        onOpenChange(false);
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload products. Please check your CSV format.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bulk Upload Products</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors
              ${isDragActive ? 'border-[#008080] bg-[#008080]/5' : 'border-gray-300'}
            `}
          >
            <input {...getInputProps()} />
            {isUploading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <p>Uploading products...</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600">
                  Drag and drop your CSV file here, or click to select
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Required columns: name, description, price, category_id, condition
                </p>
              </div>
            )}
          </div>
          <Button
            onClick={() => {
              const template = "name,description,price,category_id,condition\n";
              const blob = new Blob([template], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'product_template.csv';
              a.click();
            }}
            variant="outline"
            className="w-full"
          >
            Download Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}