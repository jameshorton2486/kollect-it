import { Metadata } from "next";
import { AesopSection } from "@/components/AesopSection";

export const metadata: Metadata = {
  title: "Cookie Policy | Kollect-It",
  description: "Information about how Kollect-It uses cookies.",
};

export default function CookiesPage() {
  return (
    <main>
      <AesopSection
        variant="cream"
        layout="full"
        title="Cookie Policy"
        description={
          <>
            <div className="space-y-8 max-w-4xl mx-auto">
              <section>
                <h2 className="text-2xl font-serif font-semibold text-gold-600 mb-4">What Are Cookies?</h2>
                <p className="text-ink-700 leading-relaxed">
                  Cookies are small text files that are stored on your device when you visit a website. They help us make the website work properly and improve your user experience.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-gold-600 mb-6">Types of Cookies We Use</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-ink-900 mb-3">Essential Cookies</h3>
                    <p className="text-ink-700 leading-relaxed">
                      These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you, such as logging in or filling in forms.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-ink-900 mb-3">Analytics Cookies</h3>
                    <p className="text-ink-700 leading-relaxed">
                      These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-ink-900 mb-3">Functionality Cookies</h3>
                    <p className="text-ink-700 leading-relaxed">
                      These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-ink-900 mb-3">Marketing Cookies</h3>
                    <p className="text-ink-700 leading-relaxed">
                      These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-gold-600 mb-4">How to Manage Cookies</h2>
                <p className="text-ink-700 leading-relaxed">
                  You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
                </p>
              </section>
            </div>
          </>
        }
      />
    </main>
  );
}
