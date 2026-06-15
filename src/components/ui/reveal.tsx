"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  threshold?: number;
}

export function Reveal({ 
  children, 
  delay = 0, 
  direction = "up", 
  className = "",
  threshold = 0.1
}: RevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    // Don't run observer if we prefer reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (prefersReducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (currentRef) observer.unobserve(currentRef);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: threshold,
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  const getDirectionClasses = () => {
    if (isVisible) return "translate-y-0 translate-x-0 opacity-100";
    
    switch (direction) {
      case "up": return "translate-y-12 opacity-0";
      case "down": return "-translate-y-12 opacity-0";
      case "left": return "translate-x-12 opacity-0";
      case "right": return "-translate-x-12 opacity-0";
      case "none": return "opacity-0";
      default: return "translate-y-12 opacity-0";
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-[1200ms] ease-out ${getDirectionClasses()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
