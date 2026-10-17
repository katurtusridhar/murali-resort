"use client";

import TextReveal from "@/components/ui/TextReveal";
import Magnetic from "@/components/ui/Magnetic";
import Link from "next/link";
import clsx from "clsx";

interface CTABannerProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
  variant?: "light" | "dark";
  transparentBg?: boolean;
}

export default function CTABanner({
  title = "Now Imagine Your Event Here",
  subtitle,
  buttonText = "Enquire Now",
  buttonHref = "/contact",
  variant = "dark",
  transparentBg = false,
}: CTABannerProps) {
  const isDark = variant === "dark";

  return (
    <section className={clsx(
      "py-16 sm:py-24 md:py-32 relative",
      transparentBg
        ? "bg-transparent text-white"
        : isDark ? "bg-premium-dark text-white" : "bg-stone-100 text-premium-dark"
    )}>
      <div className="container mx-auto px-4 sm:px-6 md:px-12 text-center flex flex-col items-center">
        <TextReveal
          text={title}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-6 sm:mb-8 justify-center max-w-4xl"
        />

        {subtitle && (
          <p className={clsx(
            "text-base sm:text-lg mx-auto mb-8 sm:mb-12 max-w-2xl px-2 font-light leading-relaxed",
            isDark ? "text-stone-300" : "text-stone-600"
          )}>
            {subtitle}
          </p>
        )}

        <Magnetic strength={20}>
          <Link
            href={buttonHref}
            className={clsx(
              "min-h-[48px] px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm uppercase tracking-wider font-semibold btn-liquid inline-flex items-center justify-center isolate",
              isDark
                ? "bg-white text-premium-dark btn-liquid-light shadow-lg"
                : "border border-premium-dark text-premium-dark"
            )}
          >
            {buttonText}
          </Link>
        </Magnetic>
      </div>
    </section>
  );
}
