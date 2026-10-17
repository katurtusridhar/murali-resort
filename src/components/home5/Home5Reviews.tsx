"use client";

import React, { useState } from "react";
import { Star, CheckCircle2, ExternalLink, MessageSquareQuote, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GoogleReview {
  id: string;
  author: string;
  rating: number;
  category: string;
  categoryFilter: "all" | "weddings" | "meetings" | "conventions";
  text: string;
}

const googleReviewsData: GoogleReview[] = [
  {
    id: "review-1",
    author: "Pemmaraju Mohan",
    rating: 5,
    category: "Weddings & Large Functions",
    categoryFilter: "weddings",
    text: "Very spacious place for conducting marriage and other big functions. Big car parking and sufficient for good number of gathering.",
  },
  {
    id: "review-2",
    author: "Triveni Velaga",
    rating: 5,
    category: "Grand Convention Halls",
    categoryFilter: "conventions",
    text: "Very good and big convention halls and huge parking area",
  },
  {
    id: "review-3",
    author: "pandu",
    rating: 5,
    category: "Meetings & Family Celebrations",
    categoryFilter: "meetings",
    text: "Wow Murali resort is the best option for function Hall. And also it's best option for meetings. I enjoyed meetings here I attended two times here in murali resorts. I thoroughly enjoyed with my family especially my kids spent good time here. Waiting to visit again when I get the opertunity...",
  },
  {
    id: "review-4",
    author: "Medapati Sai Krishna Reddy",
    rating: 4,
    category: "1,500-Capacity Banquets",
    categoryFilter: "conventions",
    text: "One of the best convention halls for functions. It easily holds up to 1,500 people, and the service is great. The resort is located in a peaceful area away from the busy city. Everything was well designed.",
  },
];

const filterCategories = [
  { id: "all", label: "All Reviews (4)" },
  { id: "weddings", label: "Weddings & Banquets" },
  { id: "conventions", label: "Conventions & Scale" },
  { id: "meetings", label: "Meetings & Families" },
] as const;

export default function Home5Reviews() {
  const [activeFilter, setActiveFilter] = useState<"all" | "weddings" | "meetings" | "conventions">("all");

  const filteredReviews = googleReviewsData.filter((review) => {
    if (activeFilter === "all") return true;
    return review.categoryFilter === activeFilter;
  });

  return (
    <section 
      id="reviews" 
      aria-label="Google Maps Guest Reviews"
      className="relative w-full bg-transparent py-16 sm:py-24 md:py-36 text-stone-900 border-t border-stone-200/80 z-20 overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-7xl relative z-20">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-[#8A622A]" />
              <span className="text-[#8A622A] uppercase tracking-[0.22em] text-xs font-semibold">
                Guest Impressions
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#14171A] tracking-tight leading-[1.14] mb-4">
              Real Experiences from Google Maps.
            </h2>
            
            <p className="text-[#525A62] text-base sm:text-lg font-light leading-relaxed">
              Real reviews from guests who hosted weddings, parties, and meetings at Murali Resort.
            </p>
          </div>

          {/* Google Rating Summary Badge */}
          <div className="w-full sm:w-auto bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between sm:justify-start gap-5 shrink-0 self-start lg:self-end relative z-20">
            <div className="flex items-center gap-4">
              {/* Google 4-Color Icon */}
              <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-center shrink-0 shadow-inner">
                <svg className="w-7 h-7" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-serif text-2xl font-bold text-[#14171A] leading-none">4.5</span>
                  <div role="img" className="flex items-center gap-0.5" aria-label="Rated 4.5 out of 5 stars based on 1300+ Google reviews">
                    {[1, 2, 3, 4].map((star) => (
                      <Star key={star} size={15} className="fill-[#FBBC04] text-[#FBBC04]" />
                    ))}
                    {/* Half star for 4.5 */}
                    <div className="relative w-[15px] h-[15px]">
                      <Star size={15} className="text-stone-300" />
                      <div className="absolute inset-0 overflow-hidden w-[50%]">
                        <Star size={15} className="fill-[#FBBC04] text-[#FBBC04]" />
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#525A62] font-medium">
                  Verified Google Rating · <span className="text-[#14171A] font-semibold">1,300+ reviews</span>
                </p>
              </div>
            </div>

            <a
              href="https://maps.app.goo.gl/yzuQ8TLbJ3FSdTcQ7"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-dark shrink-0"
            >
              <span>View On Maps</span>
              <ExternalLink size={13} className="text-[#525A62]" />
            </a>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-10 relative z-20">
          {filterCategories.map((cat) => {
            const isActive = activeFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`min-h-[44px] px-4 sm:px-5 py-2.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 inline-flex items-center justify-center ${
                  isActive
                    ? "bg-[#14171A] text-white shadow-sm"
                    : "bg-white text-[#525A62] hover:text-[#14171A] border border-stone-200/80 hover:bg-stone-50"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Reviews Cards Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative z-20"
        >
          <AnimatePresence mode="popLayout">
            {filteredReviews.map((review) => (
              <motion.article
                layout
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-2xl p-5 sm:p-8 border border-stone-200/90 shadow-sm hover:shadow-md hover:border-[#8A622A]/40 transition-all duration-300 flex flex-col justify-between group relative z-20"
              >
                {/* Decorative Quotation Glyph */}
                <MessageSquareQuote 
                  size={40} 
                  className="absolute top-6 right-6 text-stone-200/60 group-hover:text-[#8A622A]/20 transition-colors pointer-events-none" 
                  aria-hidden="true"
                />

                {/* Top Row: Reviewer Name & Event Category Pill */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pr-10">
                    <h3 className="font-serif text-lg font-semibold text-[#14171A] tracking-tight">
                      {review.author}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#8A622A]/10 text-[#8A622A] border border-[#8A622A]/20 shrink-0">
                      <Sparkles size={11} className="text-[#8A622A]" />
                      <span>{review.category}</span>
                    </span>
                  </div>

                  {/* Rating Stars (Timeline e.g. '2 years ago' removed) */}
                  <div className="flex items-center gap-1 mb-5">
                    <div role="img" className="flex items-center gap-0.5" aria-label={`Rated ${review.rating} out of 5 stars`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < review.rating
                              ? "fill-[#FBBC04] text-[#FBBC04]"
                              : "fill-stone-200 text-stone-200"
                          }
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Authentic Quote Body */}
                  <blockquote className="text-[#525A62] text-sm sm:text-base font-light leading-relaxed mb-6">
                    &ldquo;{review.text}&rdquo;
                  </blockquote>
                </div>

                {/* Card Footer: Google Maps Verification Status */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-[#525A62]">
                  <div className="flex items-center gap-1.5 min-h-[44px]">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                    <span className="font-medium text-[#525A62]">Verified Google Review</span>
                  </div>

                  <a
                    href="https://maps.app.goo.gl/yzuQ8TLbJ3FSdTcQ7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#8A622A] min-h-[44px] inline-flex items-center gap-1 font-medium transition-colors text-[#525A62]"
                  >
                    <span>Google Maps</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Call to Action for Hosts */}
        <div className="mt-10 sm:mt-14 p-5 sm:p-8 rounded-2xl bg-white border border-stone-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-20">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#8A622A]/10 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <Star size={18} className="text-[#8A622A] fill-[#8A622A]" />
            </div>
            <div>
              <h4 className="font-serif text-base sm:text-lg font-semibold text-[#14171A]">
                Celebrated your milestone event at Murali Resort?
              </h4>
              <p className="text-xs sm:text-sm text-[#525A62]">
                Join our community of hosts by sharing your honest experience on Google Maps.
              </p>
            </div>
          </div>

          <a
            href="https://maps.app.goo.gl/yzuQ8TLbJ3FSdTcQ7"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto btn-primary-dark shrink-0"
          >
            <span>Write a Google Review</span>
            <ExternalLink size={13} />
          </a>
        </div>

      </div>
    </section>
  );
}
