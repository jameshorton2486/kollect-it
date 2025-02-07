
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock_status: string;
    stock_quantity: number;
    low_stock_threshold: number;
  };
  isSelected: boolean;
  onSelect: () => void;
  onThresholdUpdate: (productId: string, newThreshold: number) => void;
}

export function ProductCard({ 
  product, 
  isSelected, 
  onSelect, 
  onThresholdUpdate 
}: ProductCardProps) {
  return (
    <Card 
      className={`hover:shadow-lg transition-shadow ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onSelect}
    >
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{product.name}</span>
          <Badge variant={
            product.stock_status === 'in_stock' ? 'default' :
            product.stock_status === 'low_stock' ? 'destructive' :
            'destructive'
          }>
            {product.stock_status === 'in_stock' ? 'In Stock' :
             product.stock_status === 'low_stock' ? 'Low Stock' :
             'Out of Stock'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-shop-600">{product.description}</p>
          <p className="font-semibold">${product.price}</p>
          <div className="flex justify-between items-center">
            <span className="text-sm">Stock: {product.stock_quantity}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm">Alert at:</span>
              <Input
                type="number"
                value={product.low_stock_threshold}
                onChange={(e) => onThresholdUpdate(product.id, parseInt(e.target.value))}
                className="w-20 h-8"
                min="0"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
