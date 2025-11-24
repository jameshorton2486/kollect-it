export default function TrustStrip() {
  const stats = [
    {
      value: "100%",
      label: "Authenticated",
    },
    {
      value: "5,000+",
      label: "Collectors",
    },
    {
      value: "$2M+",
      label: "Items Sold",
    },
    {
      value: "4.9",
      label: "Rating",
      prefix: "★",
    },
  ];

  return (
    <section className="py-8 md:py-10 bg-lux-pearl border-y border-lux-silver">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-0">
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex items-center">
              {/* Stat */}
              <div className="text-center px-6 md:px-10 lg:px-12">
                <div className="text-2xl md:text-3xl lg:text-4xl font-semibold text-lux-black mb-1 tracking-tight">
                  {stat.prefix && (
                    <span className="text-lux-gold mr-1">{stat.prefix}</span>
                  )}
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-lux-gray uppercase tracking-widest font-medium">
                  {stat.label}
                </div>
              </div>
              
              {/* Gold Divider (not after last item) */}
              {index < stats.length - 1 && (
                <div className="hidden md:block w-px h-12 bg-lux-gold/40" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
