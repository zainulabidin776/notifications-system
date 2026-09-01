import {
  useRef,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { motion } from 'framer-motion';

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  accent?: boolean;
}

export function PremiumCard({
  children,
  className = '',
  accent = false,
}: PremiumCardProps) {
  const cardRef =
    useRef<HTMLDivElement>(null);

  const handleMouseMove = (
    event: MouseEvent<HTMLDivElement>,
  ) => {
    const card = cardRef.current;

    if (!card) {
      return;
    }

    const bounds =
      card.getBoundingClientRect();

    const x =
      event.clientX - bounds.left;

    const y =
      event.clientY - bounds.top;

    card.style.setProperty(
      '--mouse-x',
      `${x}px`,
    );

    card.style.setProperty(
      '--mouse-y',
      `${y}px`,
    );
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;

    if (!card) {
      return;
    }

    /*
     * Move the spotlight gently back toward
     * the center after the pointer leaves.
     */
    card.style.setProperty(
      '--mouse-x',
      '50%',
    );

    card.style.setProperty(
      '--mouse-y',
      '50%',
    );
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        y: -3,
        scale: 1.004,
      }}
      transition={{
        type: 'spring',
        stiffness: 340,
        damping: 27,
      }}
      className={[
        'premium-card group',
        accent
          ? 'premium-card--accent'
          : '',
        className,
      ].join(' ')}
    >
      {/* Cursor-following light */}
      <div
        aria-hidden="true"
        className="premium-card__spotlight"
      />

      {/* Small border illumination */}
      <div
        aria-hidden="true"
        className="premium-card__cursor-border"
      />

      <div className="premium-card__content">
        {children}
      </div>
    </motion.div>
  );
}