export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-surface-50 text-ink-900">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-4xl font-serif font-bold mb-12 text-ink-900">
          Shipping & Returns
        </h1>

        <div className="space-y-12 text-lg leading-relaxed">
          {/* SHIPPING SECTION */}
          <section>
            <h2 className="text-2xl font-serif font-semibold mb-3">Shipping</h2>
            <p>
              I pack every item myself and use the right materials for each
              piece. Fragile items receive extra padding and protection.
            </p>

            <ul className="list-disc list-inside mt-4 space-y-2">
              <li><strong>Shipping Time:</strong> 1-2 business days</li>
              <li><strong>Carrier:</strong> USPS or UPS</li>
              <li><strong>Tracking:</strong> Always included</li>
              <li>
                <strong>Packaging:</strong> New boxes, foam, bubble wrap, and
                corner guards as needed
              </li>
            </ul>

            <p className="mt-4">
              If you need something shipped faster, feel free to reach out.
            </p>
          </section>

          {/* LOCAL PICKUP */}
          <section>
            <h2 className="text-2xl font-serif font-semibold mb-3">Local Pickup</h2>
            <p>
              If you&apos;re near San Antonio, pickup may be available for larger
              items. Please contact me before purchasing to confirm.
            </p>
          </section>

          {/* RETURNS */}
          <section>
            <h2 className="text-2xl font-serif font-semibold mb-3">Returns</h2>
            <p>I want you to be happy with your purchase.</p>

            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>
                If an item arrives <strong>damaged</strong> or <strong>not as described</strong>,
                I will make it right.
              </li>
              <li>
                For other returns, please contact me within <strong>48 hours</strong> of
                delivery.
              </li>
              <li>Items must be returned in the same condition they arrived.</li>
            </ul>

            <p className="mt-4">I always handle returns personally and fairly.</p>
          </section>

          {/* INTERNATIONAL */}
          <section>
            <h2 className="text-2xl font-serif font-semibold mb-3">
              International Shipping
            </h2>
            <p>Not available at this time, but I&apos;m working on adding it.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

