'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { gsap, Power4 } from 'gsap';
import s from './ThemeToggle.module.scss';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const strength = 50; // Même force que l'exemple original

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const moveMagnet = (event: MouseEvent) => {
      const magnetButton = event.currentTarget as HTMLElement;
      const bounding = magnetButton.getBoundingClientRect();

      gsap.to(magnetButton, {
        duration: 1,
        x:
          ((event.clientX - bounding.left) / magnetButton.offsetWidth - 0.5) *
          strength,
        y:
          ((event.clientY - bounding.top) / magnetButton.offsetHeight - 0.5) *
          strength,
        ease: Power4.easeOut,
      });
    };

    const resetMagnet = (event: MouseEvent) => {
      const magnetButton = event.currentTarget as HTMLElement;
      gsap.to(magnetButton, {
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
    <button ref={buttonRef} onClick={toggleTheme} className={s.magnetic}>
      <div className={s.button}>
        <div
          className={`${s.circle} ${theme === 'dark' ? s.dark : s.light}`}
        ></div>
      </div>
    </button>
  );
}
