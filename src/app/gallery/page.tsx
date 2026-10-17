import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Gallery from "@/components/sections/Gallery";
import CTABanner from "@/components/sections/CTABanner";

export default function GalleryPage() {
  return (
    <main className="relative min-h-screen bg-[#0C0F12] text-white overflow-hidden">
      {/* Foreground Content at z-20, IN FRONT OF GhostFibersBackground at z-5 */}
      <div className="relative z-20">
        <Navbar />

        <header className="w-full pt-28 sm:pt-36 md:pt-40 pb-8 sm:pb-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 bg-[#0C0F12] isolate relative z-20">
          <span className="text-accent uppercase tracking-[0.25em] text-xs font-semibold mb-4 sm:mb-6">
            The Gallery
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-white mb-4 sm:mb-6 leading-tight">
            Visual Journey
          </h1>
          <p className="text-stone-300 text-base sm:text-lg md:text-xl max-w-2xl font-light leading-relaxed">
            A glimpse into the extraordinary moments we&apos;ve brought to life.
          </p>
        </header>

        <div className="w-full">
          <Gallery />
        </div>

        {/* CTA & Footer: Dark Luxury Finale with explicit background and stacking isolation */}
        <div className="relative text-white overflow-hidden bg-[#0C0F12] isolate">
          <CTABanner
            title="Picture Your Event Here"
            subtitle="Our team is ready to help you create your own visual masterpiece."
            buttonText="Get in Touch"
            buttonHref="/contact"
            transparentBg={true}
          />
          <Footer transparent={true} />
        </div>
      </div>
    </main>
  );
}
