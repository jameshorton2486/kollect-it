
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface MaterialFilterProps {
  selectedMaterials: string[];
  onMaterialChange: (materials: string[]) => void;
}

const materials = [
  { id: "wood", label: "Wood" },
  { id: "metal", label: "Metal" },
  { id: "glass", label: "Glass" },
  { id: "textile", label: "Textile" },
  { id: "ceramic", label: "Ceramic" },
  { id: "stone", label: "Stone" },
  { id: "plastic", label: "Plastic" },
  { id: "mixed", label: "Mixed Materials" },
];

export function MaterialFilter({ selectedMaterials, onMaterialChange }: MaterialFilterProps) {
  const toggleMaterial = (materialId: string) => {
    if (selectedMaterials.includes(materialId)) {
      onMaterialChange(selectedMaterials.filter(id => id !== materialId));
    } else {
      onMaterialChange([...selectedMaterials, materialId]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-shop-800">Material</h3>
      <div className="grid grid-cols-2 gap-3">
        {materials.map((material) => (
          <div key={material.id} className="flex items-center space-x-2">
            <Checkbox
              id={`material-${material.id}`}
              checked={selectedMaterials.includes(material.id)}
              onCheckedChange={() => toggleMaterial(material.id)}
              className="border-gray-300 data-[state=checked]:bg-[#C6A961] data-[state=checked]:border-[#C6A961]"
            />
            <Label
              htmlFor={`material-${material.id}`}
              className="text-sm text-gray-600 cursor-pointer"
            >
              {material.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
