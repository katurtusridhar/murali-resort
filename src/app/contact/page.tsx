import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MapHero from "@/components/sections/MapHero";
import Enquiry from "@/components/sections/Enquiry";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-transparent">
      <Navbar />

      <MapHero />

      <div className="relative py-14 sm:py-20 md:py-28 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 items-start relative z-20">
          
          {/* Left Column: Contact Information Card sitting strictly at z-20 */}
          <div className="lg:col-span-1 bg-white/95 backdrop-blur-md p-5 sm:p-8 md:p-10 rounded-2xl shadow-xl border border-stone-200/80 space-y-8 sm:space-y-10 relative z-20">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-400 block mb-2 sm:mb-3">Concierge Desk</span>
              <h2 className="text-2xl sm:text-3xl font-serif text-premium-dark mb-3 sm:mb-4">Contact Information</h2>
              <p className="text-stone-600 text-sm leading-relaxed font-light">
                Whether you are ready to book or exploring bespoke options, our dedicated events team is here to assist you.
              </p>
            </div>

            <div className="space-y-6 pt-4 border-t border-stone-100">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full border border-stone-200 bg-stone-50 shadow-sm flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={18} className="text-stone-900" />
                </div>
                <div>
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-premium-dark mb-1">Location</h3>
                  <p className="text-stone-500 text-xs leading-relaxed">Survey No - 134, Poranki-Nidamanuru<br />Poranki, Vijayawada, AP 521137</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full border border-stone-200 bg-stone-50 shadow-sm flex items-center justify-center shrink-0 mt-0.5">
                  <Phone size={18} className="text-stone-900" />
                </div>
                <div>
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-premium-dark mb-1">Direct Lines</h3>
                  <div className="flex flex-col text-stone-500 text-xs">
                    <a href="tel:+919502507999" className="py-1 inline-flex items-center min-h-[32px] hover:text-stone-900 transition-colors">+91 9502507999</a>
                    <a href="tel:+919440883636" className="py-1 inline-flex items-center min-h-[32px] hover:text-stone-900 transition-colors">+91 9440883636</a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full border border-stone-200 bg-stone-50 shadow-sm flex items-center justify-center shrink-0 mt-0.5">
                  <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-premium-dark mb-1">WhatsApp</h3>
                  <a 
                    href="https://wa.me/919502507999?text=Hello%20Murali%20Resort,%20I%20would%20like%20to%20enquire%20about%20booking%20an%20event."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1 inline-flex items-center min-h-[32px] text-stone-500 text-xs leading-relaxed hover:text-[#25D366] transition-colors"
                  >
                    +91 9502507999
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full border border-stone-200 bg-stone-50 shadow-sm flex items-center justify-center shrink-0 mt-0.5">
                  <Mail size={18} className="text-stone-900" />
                </div>
                <div>
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-premium-dark mb-1">Email</h3>
                  <div className="flex flex-col text-stone-500 text-xs">
                    <a href="mailto:info@muraliresort.com" className="py-1 inline-flex items-center min-h-[32px] hover:text-stone-900 transition-colors">info@muraliresort.com</a>
                    <a href="mailto:events@muraliresort.com" className="py-1 inline-flex items-center min-h-[32px] hover:text-stone-900 transition-colors">events@muraliresort.com</a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full border border-stone-200 bg-stone-50 shadow-sm flex items-center justify-center shrink-0 mt-0.5">
                  <Clock size={18} className="text-stone-900" />
                </div>
                <div>
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-premium-dark mb-1">Operating Hours</h3>
                  <p className="text-stone-500 text-xs leading-relaxed">Mon - Sun: 9:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Enquiry Form Card sitting strictly at z-20 */}
          <div className="lg:col-span-2 relative z-20">
            <Suspense fallback={<div className="h-[600px] flex items-center justify-center italic text-stone-500">Loading form...</div>}>
              <Enquiry standalone={false} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Footer: Ghost Fibers extend seamlessly through the footer */}
      <div className="relative overflow-hidden">
        {/* Dark canvas layer at z-0 behind GhostFibers at z-5 */}
        <div className="absolute inset-0 z-0 bg-[#0C0F12] pointer-events-none" aria-hidden="true" />

        {/* Transparent footer content at z-20 */}
        <div className="relative z-20">
          <Footer transparent={true} />
        </div>
      </div>
    </main>
  );
}
