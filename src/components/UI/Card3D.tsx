import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  enableGlare?: boolean;
  onClick?: () => void;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  depth = 12,
  enableGlare = true,
  onClick
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw mouse coordinates relative to card center (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Glare position in percent
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  // Spring smoothed values for fluid 3D tilt
  const springConfig = { damping: 20, stiffness: 260, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [depth, -depth]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-depth, depth]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const normalizedX = mouseX / rect.width - 0.5;
    const normalizedY = mouseY / rect.height - 0.5;

    x.set(normalizedX);
    y.set(normalizedY);

    glareX.set((mouseX / rect.width) * 100);
    glareY.set((mouseY / rect.height) * 100);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ perspective: 1200 }}
      className={`relative ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.015, z: 20 }}
        whileTap={onClick ? { scale: 0.985 } : undefined}
        transition={{ duration: 0.2 }}
        className="w-full h-full relative"
      >
        {children}

        {/* Dynamic 3D Glare Light Sheen */}
        {enableGlare && isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            style={{
              background: `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 65%)`,
            }}
            className="absolute inset-0 pointer-events-none rounded-2xl z-30 transition-opacity duration-200"
          />
        )}
      </motion.div>
    </div>
  );
};
