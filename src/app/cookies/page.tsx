import { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Cookie Policy | Kollect-It",
  description: "Information about how Kollect-It uses cookies.",
  alternates: {
    canonical: "https://kollect-it.com/cookies",
  },
  openGraph: {
    title: "Cookie Policy | Kollect-It",
    description: "Learn how Kollect-It uses cookies to improve your experience.",
    url: "https://kollect-it.com/cookies",
    type: "website",
  },
};

const sections = [
  {
    id: "what-are-cookies",
    title: "1. What Are Cookies?",
    content: (
      <p>
        Cookies are small text files stored on your device when you visit a website.
        They help the site work properly and improve your experience. I use them
        thoughtfully and only when necessary.
      </p>
    ),
  },
  {
    id: "essential",
    title: "2. Essential Cookies",
    content: (
      <p>
        These cookies are necessary for the website to function and cannot be switched
        off. They are usually only set in response to actions made by you, such as
        logging in, adding items to your cart, or filling in forms.
      </p>
    ),
  },
  {
    id: "analytics",
    title: "3. Analytics Cookies",
    content: (
      <p>
        These cookies allow us to count visits and traffic sources so we can measure
        and improve the performance of our site. They help us know which pages are
        the most and least popular and see how visitors move around the site.
      </p>
    ),
  },
  {
    id: "functionality",
    title: "4. Functionality Cookies",
    content: (
      <p>
        These cookies enable the website to provide enhanced functionality and
        personalization, such as remembering your preferences. They may be set by
        us or by third-party providers whose services we have added to our pages.
      </p>
    ),
  },
  {
    id: "marketing",
    title: "5. Marketing Cookies",
    content: (
      <p>
        These cookies may be set through our site by our advertising partners.
        They may be used by those companies to build a profile of your interests
        and show you relevant adverts on other sites. Currently, we do not use
        marketing cookies on Kollect-It.
      </p>
    ),
  },
  {
    id: "managing",
    title: "6. How to Manage Cookies",
    content: (
      <>
        <p className="mb-4">
          You can set your browser to refuse all or some browser cookies, or to
          alert you when websites set or access cookies. If you disable or refuse
          cookies, please note that some parts of this website may become
          inaccessible or not function properly.
        </p>
        <p>
          Most web browsers allow some control of cookies through browser settings.
          To find out more about cookies, including how to see what cookies have
          been set, visit{" "}
          <a
            href="https://www.allaboutcookies.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lux-gold hover:text-lux-gold-light underline-offset-4 hover:underline"
          >
            www.allaboutcookies.org
          </a>.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "7. Contact",
    content: (
      <p>
        Questions about our cookie policy? Reach out to me at{" "}
        <a
          href="mailto:jameshorton2486@gmail.com"
          className="text-lux-gold hover:text-lux-gold-light underline-offset-4 hover:underline"
        >
          jameshorton2486@gmail.com
        </a>.
      </p>
    ),
  },
];

export default function CookiesPage() {
  return (
    <LegalPageLayout
      label="Legal"
      title="Cookie Policy"
      description="How we use cookies and similar technologies."
      sections={sections}
    />
  );
}
