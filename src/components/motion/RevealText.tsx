"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import { cn } from "@/src/lib/utils/cn";

export interface RevealTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}

export function RevealText({
  text,
  as: Tag = "span",
  className,
  delay = 0,
  stagger = 0.04,
  once = true,
}: RevealTextProps) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const words = text.split(" ");

  if (reduced || !mounted) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={cn("inline-block", className)} aria-label={text}>
      {words.map((word, index) => (
        <span
          key={index}
          className="inline-block overflow-hidden align-bottom"
          style={{ marginRight: "0.25em" }}
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once, amount: 0.5 }}
            transition={{
              duration: 0.55,
              delay: delay + index * stagger,
              ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
