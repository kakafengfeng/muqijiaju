import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation, useReducedMotion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

// 指数型 ease-out：进入干脆利落，比通用 cubic 更有高级感
const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const Reveal: React.FC<Props> = ({ children, width = "100%", delay = 0, direction = "up" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const mainControls = useAnimation();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  // 减少动态效果偏好：直接呈现，不做位移动画
  if (reduceMotion) {
    return (
      <div ref={ref} style={{ position: "relative", width }}>
        {children}
      </div>
    );
  }

  const getHiddenVariant = () => {
    switch (direction) {
      case "up": return { opacity: 0, y: 30 };
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
      transition: { duration: 0.8, ease: EASE_OUT_EXPO, delay: delay }
    },
  };

  // 只有左右位移才需要裁剪横向溢出；纵向位移不裁剪，避免吃掉子元素的阴影与焦点环
  const needsClip = direction === "left" || direction === "right";

  return (
    <div ref={ref} style={{ position: "relative", width, overflow: needsClip ? "hidden" : "visible" }}>
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
