import { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  onClick?: () => void;
}

export const AnimatedCounter = ({ 
  value, 
  duration = 2000, 
  prefix = '', 
  suffix = '', 
  className = '',
  onClick 
}: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const animateCounter = () => {
    setIsAnimating(true);
    const startTime = Date.now();
    const startValue = displayValue;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (value - startValue) * easeOutQuart);
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    animateCounter();
  }, [value]);

  const handleClick = () => {
    if (onClick) {
      onClick();
      animateCounter();
    }
  };

  return (
    <span 
      className={`counter ${className} ${onClick ? 'cursor-pointer hover:scale-110' : ''} ${isAnimating ? 'animate-pulse' : ''}`}
      onClick={handleClick}
    >
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
};