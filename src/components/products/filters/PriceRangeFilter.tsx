
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

interface PriceRangeFilterProps {
  priceRange: { min: string; max: string };
  onPriceRangeChange: (value: { min: string; max: string }) => void;
}

export function PriceRangeFilter({
  priceRange,
  onPriceRangeChange,
}: PriceRangeFilterProps) {
  const maxPriceLimit = 10000;
  const [sliderValue, setSliderValue] = useState([0, maxPriceLimit]);

  useEffect(() => {
    setSliderValue([
      Number(priceRange.min) || 0,
      Number(priceRange.max) || maxPriceLimit,
    ]);
  }, [priceRange]);

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    onPriceRangeChange({
      min: value[0].toString(),
      max: value[1].toString(),
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-shop-800">Price Range</h3>
      
      <Slider
        value={sliderValue}
        min={0}
        max={maxPriceLimit}
        step={100}
        onValueChange={handleSliderChange}
        className="my-6"
      />
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="min-price">Min Price</Label>
          <Input
            id="min-price"
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) =>
              onPriceRangeChange({ ...priceRange, min: e.target.value })
            }
            className="border-gray-300"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max-price">Max Price</Label>
          <Input
            id="max-price"
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) =>
              onPriceRangeChange({ ...priceRange, max: e.target.value })
            }
            className="border-gray-300"
          />
        </div>
      </div>
    </div>
  );
}
