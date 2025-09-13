import { useEffect, useState, useRef } from 'react';

// Particle configuration for the background animation
interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  size: number;
  duration: number;
  vx: number;
  vy: number;
  opacity: number;
}

export const ParticleBackground = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize particles on component mount
  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      // Create 50 particles with random properties for natural movement
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 8,
          size: Math.random() * 3 + 1, // Random size between 1-4px
          duration: Math.random() * 4 + 6, // Animation duration 6-10s
          vx: (Math.random() - 0.5) * 0.5, // Random horizontal velocity
          vy: (Math.random() - 0.5) * 0.5, // Random vertical velocity
          opacity: Math.random() * 0.6 + 0.2 // Random opacity 0.2-0.8
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  // Handle mouse interactions for enhanced particle effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Convert mouse position to percentage for particle interaction
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };

    const handleMouseEnter = () => {
      // Spawn additional particles when user hovers over the area
      setParticles(prev => {
        const newParticles = [...prev];
        for (let i = 0; i < 10; i++) {
          newParticles.push({
            id: Date.now() + i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: 0,
            size: Math.random() * 2 + 1,
            duration: Math.random() * 3 + 4,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
            opacity: Math.random() * 0.8 + 0.2
          });
        }
        return newParticles;
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
    }

    // Cleanup event listeners
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="particles"
      style={{
        '--mouse-x': `${mousePosition.x}%`,
        '--mouse-y': `${mousePosition.y}%`
      } as React.CSSProperties}
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle interactive-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            '--particle-vx': `${particle.vx}px`,
            '--particle-vy': `${particle.vy}px`
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};