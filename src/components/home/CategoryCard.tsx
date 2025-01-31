interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
}

export function CategoryCard({ icon, title, description, href }: CategoryCardProps) {
  const CardWrapper = href ? 'a' : 'div';
  
  return (
    <CardWrapper
      href={href}
      className={`p-8 rounded-lg border border-shop-200 hover:border-shop-300 transition-all duration-300 
        bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-shop-accent1 
        ${href ? 'cursor-pointer' : ''}`}
      role={href ? 'link' : 'article'}
      tabIndex={href ? 0 : undefined}
    >
      <div 
        className="text-shop-600 mb-4"
        aria-hidden="true"
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-shop-800 mb-2">
        {title}
      </h3>
      <p className="text-shop-600">
        {description}
      </p>
    </CardWrapper>
  );
}