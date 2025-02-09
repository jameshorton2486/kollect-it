
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface AnalyticsHeaderProps {
  onExport: () => void;
}

export function AnalyticsHeader({ onExport }: AnalyticsHeaderProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Sales Analytics</h1>
        <Button
          onClick={onExport}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>
    </div>
  );
}
