interface CategoryCardProps {
  id: string;
  name: string;
  description: string | null;
}

export function CategoryCard({ name, description }: CategoryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-shop-200 overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-shop-800 mb-2">{name}</h3>
        <p className="text-shop-600">{description}</p>
      </div>
    </div>
  );
}