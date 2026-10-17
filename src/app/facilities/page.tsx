import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Facilities from "@/components/sections/Facilities";
import CTABanner from "@/components/sections/CTABanner";

export default function FacilitiesPage() {
  return (
    <main className="relative min-h-screen bg-transparent">
      {/* Background Layer at z-0, BEHIND GhostFibersBackground at z-5 */}
      <div className="fixed inset-0 z-0 bg-[#FBF9F5] pointer-events-none" aria-hidden="true" />

      {/* Main Facilities Section at relative z-20 */}
      <div className="relative z-20">
        <Navbar />

        <header className="pt-28 sm:pt-36 md:pt-48 pb-10 sm:pb-12 px-4 sm:px-6 md:px-12 flex flex-col items-center text-center bg-[#FBF9F5] isolate">
          <span className="text-[#8A622A] uppercase tracking-[0.2em] text-xs font-bold mb-4 sm:mb-6">
            The Details
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-premium-dark mb-6 sm:mb-8 max-w-5xl leading-[1.08] sm:leading-[1.05]">
            Facilities & Amenities
          </h1>
          <p className="text-stone-600 text-base sm:text-lg md:text-xl max-w-2xl font-light leading-relaxed">
            Spaces that work as hard as they look, equipped with everything you need.
          </p>
        </header>

        <Facilities />
      </div>

      {/* CTA & Footer: Dark Luxury Finale with continuous Ghost Fibers down to end of footer */}
      <div className="relative text-white overflow-hidden">
        {/* Background Layer: Sits at z-0, BEHIND GhostFibersBackground at z-5 */}
        <div className="absolute inset-0 z-0 bg-[#0C0F12] pointer-events-none" aria-hidden="true" />

        {/* Foreground Content Layer: Sits at relative z-20, IN FRONT OF GhostFibersBackground at z-5 */}
        <div className="relative z-20">
          <CTABanner
            title="See our spaces in person"
            subtitle="Schedule a guided tour of our facilities with our event team."
            buttonText="Book a Tour"
            buttonHref="/contact?type=tour"
            transparentBg={true}
          />
          <Footer transparent={true} />
        </div>
      </div>
    </main>
  );
}
