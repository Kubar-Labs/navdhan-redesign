"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import { cn } from "@/src/lib/utils/cn";

export interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
  amount?: number;
  direction?: "up" | "down" | "left" | "right";
}

const directionOffsets = {
  up: { y: 16, x: 0 },
  down: { y: -16, x: 0 },
  left: { x: 16, y: 0 },
  right: { x: -16, y: 0 },
};

export function FadeIn({
  children,
  className,
  delay = 0,
  once = true,
  amount = 0.2,
  direction = "up",
}: FadeInProps) {
  const reduced = useReducedMotion();
  const offset = directionOffsets[direction];

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
