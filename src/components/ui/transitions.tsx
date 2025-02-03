import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface FadeProps {
  children: ReactNode;
  className?: string;
}

export function FadeIn({ children, className }: FadeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({ children, className }: FadeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, className }: FadeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ListProps extends FadeProps {
  items: any[];
  renderItem: (item: any, index: number) => ReactNode;
}

export function AnimatedList({ items, renderItem, className }: ListProps) {
  return (
    <AnimatePresence>
      <div className={className}>
        {items.map((item, index) => (
          <motion.div
            key={item.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}