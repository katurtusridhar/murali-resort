"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Magnetic from "@/components/ui/Magnetic";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { Phone, Mail, ArrowRight, RefreshCw } from "lucide-react";

function normalizeEventType(type: string | null): string {
  if (type === "wedding" || type === "celebration") return "wedding";
  if (type === "corporate") return "corporate";
  if (type === "accommodation" || type === "tour") return "other";
  return type || "";
}

export default function Enquiry({ standalone = true }: { standalone?: boolean }) {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  const [status, setStatus] = useState<"idle" | "submitting" | "dispatched">("idle");
  const defaultEventType = normalizeEventType(typeParam);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);
  const eventType = selectedEventType ?? defaultEventType;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const submitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (submitTimerRef.current) {
        clearTimeout(submitTimerRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    if (submitTimerRef.current) {
      clearTimeout(submitTimerRef.current);
    }
    // Safe transition to transparent concierge dispatch screen
    submitTimerRef.current = setTimeout(() => {
      setStatus("dispatched");
    }, 600);
  };

  const waMessage = encodeURIComponent(
    `Hello Murali Resort, I would like to enquire about hosting an event:\n` +
    `• Name: ${formData.name || "Guest"}\n` +
    `• Phone: ${formData.phone || "Not specified"}\n` +
    `• Email: ${formData.email || "Not specified"}\n` +
    `• Event Type: ${eventType || "General Enquiry"}\n` +
    `• Details: ${formData.message || "None provided"}`
  );
  const waUrl = `https://wa.me/919502507999?text=${waMessage}`;
  const mailtoUrl = `mailto:info@muraliresort.com?subject=${encodeURIComponent(
    `Event Enquiry - ${formData.name || "Guest"}`
  )}&body=${waMessage}`;

  const formContent = (
    <>
      {standalone && (
        <div className="text-center max-w-2xl mb-16">
          <h2 className="text-4xl md:text-6xl font-serif text-premium-dark mb-6">
            Now Imagine Your Event Here
          </h2>
          <p className="text-stone-600 text-lg">
            Tell us what you’re planning, and let’s create an experience worth remembering.
          </p>
        </div>
      )}

      <div className="w-full max-w-4xl bg-white p-5 sm:p-8 md:p-12 shadow-xl relative z-20 overflow-hidden rounded-2xl border border-stone-200/80">
        {status === "dispatched" ? (
          <div className="flex flex-col items-center justify-center p-4 sm:p-6 text-center animate-in fade-in duration-500">
            <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mb-5">
              <WhatsAppIcon className="w-8 h-8 text-[#25D366]" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif text-premium-dark mb-3">
              Enquiry Details Ready
            </h3>

            <p className="text-stone-600 text-sm sm:text-base max-w-xl mb-6 font-light leading-relaxed">
              Automated background email delivery is currently in setup mode (missing server-side SMTP/CRM provider). 
              To guarantee your dates are locked in without delay, transmit your enquiry directly to our reservation concierge:
            </p>

            <div className="w-full max-w-lg space-y-3 mb-8">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[48px] py-3.5 px-6 rounded-full bg-[#25D366] text-white font-medium text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-3 hover:bg-[#20ba5a] transition-all shadow-md hover:shadow-lg"
              >
                <WhatsAppIcon className="w-5 h-5 text-white" />
                <span>Transmit via WhatsApp Concierge</span>
                <ArrowRight size={16} />
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href="tel:+919502507999"
                  className="min-h-[44px] py-3 px-4 rounded-full border border-stone-300 text-premium-dark font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors"
                >
                  <Phone size={14} className="text-accent" />
                  <span>Call +91 9502507999</span>
                </a>

                <a
                  href={mailtoUrl}
                  className="min-h-[44px] py-3 px-4 rounded-full border border-stone-300 text-premium-dark font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors"
                >
                  <Mail size={14} className="text-accent" />
                  <span>Email info@muraliresort.com</span>
                </a>
              </div>
            </div>

            <button
              onClick={() => setStatus("idle")}
              className="text-stone-500 hover:text-premium-dark text-xs uppercase tracking-wider inline-flex items-center gap-2 font-medium transition-colors"
            >
              <RefreshCw size={14} />
              <span>Edit details or start over</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs sm:text-sm font-medium text-stone-700 uppercase tracking-wider">Full Name</label>
              <input 
                required 
                type="text" 
                id="name" 
                name="name" 
                maxLength={100} 
                autoComplete="name" 
                value={formData.name}
                onChange={handleChange}
                className="w-full border-b border-stone-300 py-2.5 sm:py-3 bg-transparent focus:outline-none focus:border-premium-dark transition-colors text-sm sm:text-base" 
                placeholder="John Doe" 
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs sm:text-sm font-medium text-stone-700 uppercase tracking-wider">Email Address</label>
              <input 
                required 
                type="email" 
                id="email" 
                name="email" 
                maxLength={150} 
                autoComplete="email" 
                value={formData.email}
                onChange={handleChange}
                className="w-full border-b border-stone-300 py-2.5 sm:py-3 bg-transparent focus:outline-none focus:border-premium-dark transition-colors text-sm sm:text-base" 
                placeholder="john@example.com" 
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-xs sm:text-sm font-medium text-stone-700 uppercase tracking-wider">Phone Number</label>
              <input 
                required 
                type="tel" 
                id="phone" 
                name="phone" 
                maxLength={25} 
                autoComplete="tel" 
                value={formData.phone}
                onChange={handleChange}
                className="w-full border-b border-stone-300 py-2.5 sm:py-3 bg-transparent focus:outline-none focus:border-premium-dark transition-colors text-sm sm:text-base" 
                placeholder="+91 9502507999" 
              />
            </div>

            <div className="space-y-2 relative">
              <label htmlFor="eventType" className="text-xs sm:text-sm font-medium text-stone-700 uppercase tracking-wider">Event Type</label>
              <div className="relative">
                <select
                  id="eventType"
                  name="eventType"
                  className="w-full border-b border-stone-300 py-2.5 sm:py-3 bg-transparent focus:outline-none focus:border-premium-dark transition-colors appearance-none rounded-none pr-10 text-sm sm:text-base"
                  value={eventType}
                  onChange={(e) => setSelectedEventType(e.target.value)}
                >
                  <option value="">Select Event Type</option>
                  <option value="wedding">Wedding / Reception</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="social">Social Gathering</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none text-stone-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="message" className="text-xs sm:text-sm font-medium text-stone-700 uppercase tracking-wider">Additional Details</label>
              <textarea 
                id="message" 
                name="message" 
                maxLength={2000} 
                rows={3} 
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-stone-300 py-3 px-4 bg-transparent focus:outline-none focus:border-premium-dark transition-colors resize-none rounded-sm text-sm sm:text-base" 
                placeholder="Tell us about your estimated guest count, preferred dates, or specific requirements..."
              ></textarea>
            </div>

            <div className="md:col-span-2 flex justify-end mt-4">
              <Magnetic strength={20}>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full sm:w-auto min-h-[48px] px-10 py-3.5 bg-premium-dark text-white uppercase tracking-wider text-xs sm:text-sm inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 transition-colors hover:bg-black"
                >
                  {status === "submitting" ? "Preparing..." : "Submit Enquiry"}
                </button>
              </Magnetic>
            </div>
          </form>
        )}
      </div>
    </>
  );

  if (!standalone) {
    return <div className="w-full flex justify-center">{formContent}</div>;
  }

  return (
    <section className="py-16 sm:py-24 bg-stone-100" id="enquire">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 flex flex-col items-center">
        {formContent}
      </div>
    </section>
  );
}
