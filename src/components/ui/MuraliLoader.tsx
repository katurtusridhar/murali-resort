'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './MuraliLoader.module.css';

export type MuraliLoaderProps = {
  /** Keep true while the page or route is loading. If omitted, self-manages initial page load */
  isLoading?: boolean;
  /** Optional short status line shown under the brand. */
  message?: string;
  /** Minimum duration in ms to display on initial page load (default: 2000ms) */
  duration?: number;
};

export default function MuraliLoader({
  isLoading: isLoadingProp,
  message = 'Preparing your experience',
  duration = 2000,
}: MuraliLoaderProps) {
  const [autoLoading, setAutoLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  // If isLoadingProp is passed, follow it; otherwise follow autoLoading
  const effectiveLoading = isLoadingProp !== undefined ? isLoadingProp : autoLoading;

  // Initial automatic page load timer when no external loading state is provided
  useEffect(() => {
    if (isLoadingProp !== undefined) return;
    const timer = window.setTimeout(() => {
      setAutoLoading(false);
    }, duration);
    return () => window.clearTimeout(timer);
  }, [isLoadingProp, duration]);

  // Handle scroll lock and graceful exit transition
  useEffect(() => {
    if (effectiveLoading) {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
      return;
    }

    document.body.style.overflow = '';

    const exitTimer = window.setTimeout(() => {
      setIsExiting(true);
    }, 10);

    const unmountTimer = window.setTimeout(() => {
      setIsMounted(false);
    }, 530);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(unmountTimer);
      document.body.style.overflow = '';
    };
  }, [effectiveLoading]);

  if (!isMounted) return null;

  return (
    <div
      className={`${styles.overlay} ${isExiting ? styles.exit : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Murali Resort"
    >
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.topRule} aria-hidden="true" />

      <main className={styles.centerStage}>
        <div className={styles.emblem} aria-hidden="true">
          <span className={styles.orbit} />
          <span className={styles.orbitInner} />
          <span className={styles.orbitPoint} />
          <span className={styles.logoAura} />
          <Image
            className={styles.logo}
            src="/murali-logo.png"
            alt="Murali Resort Logo"
            width={118}
            height={87}
            priority
            draggable={false}
          />
        </div>

        <div className={styles.brandBlock}>
          <div className={styles.eyebrow}>WELCOME TO</div>
          <div className={styles.wordmark}>MURALI <span>RESORT</span></div>
          <div className={styles.goldDivider} aria-hidden="true">
            <span />
          </div>
          <p className={styles.message}>
            {message}
            <span className={styles.dots} aria-hidden="true">
              <i /><i /><i />
            </span>
          </p>
        </div>

        <div className={styles.progress} role="presentation" aria-hidden="true">
          <span className={styles.progressSweep} />
        </div>
      </main>

      <div className={styles.footerNote} aria-hidden="true">
        <span className={styles.footerDot} /> A MOMENT TO UNWIND
      </div>
      <div className={styles.cornerMark} aria-hidden="true">MR</div>
    </div>
  );
}
