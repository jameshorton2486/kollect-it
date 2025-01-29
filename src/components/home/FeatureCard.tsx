interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-8 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
      <div className="text-shop-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-shop-800 mb-2">{title}</h3>
      <p className="text-shop-600">{description}</p>
    </div>
  );
}