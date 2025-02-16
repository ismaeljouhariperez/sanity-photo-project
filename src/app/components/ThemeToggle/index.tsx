'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { gsap, Power4 } from 'gsap';
import { motion } from 'framer-motion';
import s from './ThemeToggle.module.scss';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const strength = 50;

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const buttonWidth = button.offsetWidth;
    const buttonHeight = button.offsetHeight;

    const moveMagnet = (event: MouseEvent) => {
      const bounding = button.getBoundingClientRect();

      gsap.to(button, {
        duration: 1,
        x: ((event.clientX - bounding.left) / buttonWidth - 0.5) * strength,
        y: ((event.clientY - bounding.top) / buttonHeight - 0.5) * strength,
        strength,
        ease: Power4.easeOut,
      });
    };

    const resetMagnet = () => {
      gsap.to(button, {
        duration: 1,
        x: 0,
        y: 0,
        ease: Power4.easeOut,
      });
    };

    button.addEventListener('mousemove', moveMagnet);
    button.addEventListener('mouseout', resetMagnet);

    return () => {
      button.removeEventListener('mousemove', moveMagnet);
      button.removeEventListener('mouseout', resetMagnet);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button ref={buttonRef} onClick={toggleTheme} className={`${s.magnetic}`}>
      <div className={`${s.circle}`}>
        <div className={s.fullMoon} />

        {/* Overlay pour l'effet croissant */}
        <motion.div
          className={s.moonOverlay}
          initial={{ x: 0 }}
          animate={{
            x: theme === 'dark' ? 10 : 0,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>
    </button>
  );
}
