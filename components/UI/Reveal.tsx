import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export const Reveal: React.FC<Props> = ({ children, width = "100%", delay = 0, direction = "up" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  const getHiddenVariant = () => {
    switch (direction) {
      case "up": return { opacity: 0, y: 30 }; // Increased distance for drama
      case "down": return { opacity: 0, y: -30 };
      case "left": return { opacity: 0, x: 30 };
      case "right": return { opacity: 0, x: -30 };
      default: return { opacity: 0, y: 30 };
    }
  };

  const variants = {
    hidden: getHiddenVariant(),
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0,
      transition: { duration: 0.8, ease: [0.25, 0.25, 0.25, 0.75], delay: delay } // Custom easing
    },
  };

  return (
    <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        {...({
            variants,
            initial: "hidden",
            animate: mainControls
        } as any)}
      >
        {children}
      </motion.div>
    </div>
  );
};