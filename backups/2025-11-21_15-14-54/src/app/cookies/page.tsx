import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Kollect-It",
  description: "Information about how Kollect-It uses cookies.",
};

export default function CookiesPage() {
  return (
    <div style={{ backgroundColor: "#F7F6F2", minHeight: "100vh", padding: "60px 20px", color: "#3A3A3A" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", backgroundColor: "#FFFFFF", padding: "60px", borderRadius: "8px", border: "1px solid #EAE6DD" }}>
        <h1 style={{ fontFamily: "serif", fontSize: "3rem", marginBottom: "40px", borderBottom: "2px solid #C9A66B", paddingBottom: "20px" }}>Cookie Policy</h1>
        
        <div style={{ display: "grid", gap: "40px" }}>
          <section>
            <h2 style={{ fontFamily: "serif", fontSize: "1.8rem", marginBottom: "15px", color: "#C9A66B" }}>What Are Cookies?</h2>
            <p style={{ lineHeight: "1.6" }}>
              Cookies are small text files that are stored on your device when you visit a website. They help us make the website work properly and improve your user experience.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "serif", fontSize: "1.8rem", marginBottom: "15px", color: "#C9A66B" }}>Types of Cookies We Use</h2>
            
            <div style={{ marginTop: "20px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "10px" }}>Essential Cookies</h3>
              <p style={{ lineHeight: "1.6", marginBottom: "20px" }}>
                These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you, such as logging in or filling in forms.
              </p>

              <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "10px" }}>Analytics Cookies</h3>
              <p style={{ lineHeight: "1.6", marginBottom: "20px" }}>
                These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular.
              </p>

              <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "10px" }}>Functionality Cookies</h3>
              <p style={{ lineHeight: "1.6", marginBottom: "20px" }}>
                These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
              </p>

              <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "10px" }}>Marketing Cookies</h3>
              <p style={{ lineHeight: "1.6", marginBottom: "20px" }}>
                These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.
              </p>
            </div>
          </section>

          <section>
            <h2 style={{ fontFamily: "serif", fontSize: "1.8rem", marginBottom: "15px", color: "#C9A66B" }}>How to Manage Cookies</h2>
            <p style={{ lineHeight: "1.6" }}>
              You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
