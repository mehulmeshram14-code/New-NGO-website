import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/data/siteConfig";
import { ContactForm } from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24 bg-ivory min-h-screen">
        <div className="container mx-auto px-6 md:px-12">
          <SectionHeading title="Contact Us" />
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto">
            <div>
              <h3 className="font-editorial text-2xl font-bold text-primary-green mb-6">Get in Touch</h3>
              <p className="text-muted mb-8">We would love to hear from you. Whether you want to partner with us, volunteer, or simply learn more about our work.</p>
              
              <ul className="space-y-4 mb-8 text-charcoal font-bold">
                <li>Email: {siteConfig.contact.email}</li>
                <li>Phone: {siteConfig.contact.phone}</li>
                <li>Address: {siteConfig.contact.address}</li>
              </ul>
            </div>

            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
