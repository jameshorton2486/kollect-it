import { DashboardLayout } from "@/components/DashboardLayout";
import { CategoryGrid } from "@/components/categories/management/CategoryGrid";
import { CategoryDialog } from "@/components/categories/management/CategoryDialog";
import { CategoryHeader } from "@/components/categories/management/CategoryHeader";
import { BulkProductUpload } from "@/components/categories/management/BulkProductUpload";
import { useState } from "react";

export default function CategoryManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <CategoryHeader 
          onCreateClick={() => setIsDialogOpen(true)}
          onBulkUploadClick={() => setIsBulkUploadOpen(true)}
        />
        <CategoryGrid />
        <CategoryDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen} 
        />
        <BulkProductUpload
          open={isBulkUploadOpen}
          onOpenChange={setIsBulkUploadOpen}
        />
      </div>
    </DashboardLayout>
  );
}