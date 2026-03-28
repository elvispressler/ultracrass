import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 tracking-wider uppercase";
    
    const variants = {
      default: "bg-primary text-background hover:bg-primary/90 shadow-sm px-6 py-3",
      outline: "border border-border bg-transparent hover:bg-secondary/50 px-6 py-3",
      ghost: "hover:bg-secondary/50 px-6 py-3",
    };

    return (
      <motion.button
        whileHover={{ y: -1 }}
        whileTap={{ y: 0 }}
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Wird verarbeitet...
          </span>
        ) : children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
