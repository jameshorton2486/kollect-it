import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-2 text-destructive text-sm mt-1"
    >
      <AlertCircle className="h-4 w-4" />
      <span>{message}</span>
    </motion.div>
  );
}