import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/sections/PageHero";
import Accommodations from "@/components/sections/Accommodations";
import CTABanner from "@/components/sections/CTABanner";

export default function AccommodationsPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar />

      <PageHero
        title="Guest Suites & Accommodations"
        subtitle="Retreat to spaces designed for profound relaxation."
        backgroundImage="/images/bedroom.jpg"
        eyebrow="Premium Stays"
      />

      <Accommodations />

      <CTABanner
        title="Reserve Your Stay"
        subtitle="Experience uncompromised luxury at Murali Resort."
        buttonText="Book a Suite"
        buttonHref="/contact?type=accommodation"
        variant="light"
      />

      <Footer />
    </main>
  );
}
