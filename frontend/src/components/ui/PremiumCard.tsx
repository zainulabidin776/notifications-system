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
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (
    event: MouseEvent<HTMLDivElement>,
  ) => {
    const card = cardRef.current;

    if (!card) {
      return;
    }

    const bounds = card.getBoundingClientRect();

    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      whileHover={{
        y: -3,
      }}
      transition={{
        type: 'spring',
        stiffness: 320,
        damping: 26,
      }}
      className={[
        'premium-card',
        accent ? 'premium-card--accent' : '',
        className,
      ].join(' ')}
    >
      <div className="premium-card__spotlight" />

      <div className="premium-card__content">
        {children}
      </div>
    </motion.div>
  );
}