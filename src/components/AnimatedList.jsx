import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";

function AnimatedItem({ children, index, onHover }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.05,
      }}
    >
      {children}
    </motion.div>
  );
}

export default function AnimatedList({ items, renderItem }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div>
      {items.map((item, index) => (
        <AnimatedItem
          key={item.id ?? index}
          index={index}
          onHover={setHoveredIndex}
        >
          {renderItem(item, hoveredIndex === index)}
        </AnimatedItem>
      ))}
    </div>
  );
}
