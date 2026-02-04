export default function Testimonials() {
  const testimonials = [
    {
      quote: "Every piece arrived exactly as described.",
      author: "Margaret",
      title: "Collector",
      rating: 0,
      image: "/testimonials/testimonial-1.jpg",
    },
    {
      quote:
        "The provenance documentation was incredibly thorough. I felt completely confident in my purchase.",
      author: "Luis",
      title: "Estate Buyer",
      rating: 0,
      image: "/testimonials/testimonial-2.jpg",
    },
    {
      quote: "Professional shipping, wonderful experience.",
      author: "Michiko",
      title: "Interior Designer",
      rating: 0,
      image: "/testimonials/testimonial-3.jpg",
    },
    {
      quote:
        "Providing a third-party appraisal for items over $1,000 is very comforting",
      author: "James",
      title: "Private Collector",
      rating: 0,
      image: "/testimonials/testimonial-4.jpg",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-lux-pearl border-y border-lux-silver">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm md:text-base font-semibold text-gold uppercase tracking-widest mb-3">
            Trusted by Collectors
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-ink mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-ink-light max-w-2xl mx-auto">
            Join other collectors who have found their perfect pieces through
            Kollect-It.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-surface-0 rounded-lg p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              {/* Quote */}
              <p className="font-serif text-lg text-ink mb-6 leading-relaxed flex-grow">
                "{testimonial.quote}"
              </p>

              {/* Divider */}
              <div className="w-8 h-1 bg-gold/30 mb-4" />

              {/* Author Info */}
              <div>
                <p className="font-semibold text-ink">{testimonial.author}</p>
                <p className="text-sm text-ink-light">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-14 text-center bg-surface-0 rounded-lg p-10 border-2 border-lux-gold/20">
          <h3 className="font-serif text-3xl text-ink mb-3">
            Join Our Collector Community
          </h3>
          <p className="text-ink-light text-lg mb-6 max-w-xl mx-auto">
            Over 2,000 satisfied collectors trust Kollect-It for authenticated
            pieces and expert curation.
          </p>
          <button className="inline-block bg-gold text-white font-semibold px-10 py-3 rounded-lg hover:opacity-90 transition-opacity">
            Start Collecting Today
          </button>
        </div>
      </div>
    </section>
  );
}
