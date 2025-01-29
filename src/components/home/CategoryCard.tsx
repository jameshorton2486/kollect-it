interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function CategoryCard({ icon, title, description }: CategoryCardProps) {
  return (
    <div className="p-8 rounded-lg border border-shop-200 hover:border-shop-300 transition-all duration-300 bg-white hover:shadow-lg">
      <div className="text-shop-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-shop-800 mb-2">{title}</h3>
      <p className="text-shop-600">{description}</p>
    </div>
  );
}