"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export default function WordFadeIn({
  words,
  delay = 0.1,
  className
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const _words = words.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay,
        when: "beforeChildren"
      }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.h1
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={cn(
        "font-display  text-4xl font-bold tracking-[-0.02em] text-black drop-shadow-sm dark:text-white md:text-4xl md:leading-[5rem]",
        className
      )}
    >
      {_words.map((word, i) => (
        <motion.span key={word + i} variants={wordVariants}>
          {word}{" "}
        </motion.span>
      ))}
    </motion.h1>
  );
}
