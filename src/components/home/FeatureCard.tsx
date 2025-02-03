interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-8 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-nav mb-2">{title}</h3>
      <p className="text-shop-600">{description}</p>
    </div>
  );
}