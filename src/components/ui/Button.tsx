import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { motion, HTMLMotionProps } from "framer-motion";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ButtonProps = {
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ href, variant = "primary", size = "md", children, className, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-bold tracking-tight rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-primary-green text-white hover:bg-opacity-90 focus:ring-primary-green",
      secondary: "bg-accent-terracotta text-white hover:bg-opacity-90 focus:ring-accent-terracotta",
      outline: "border-2 border-primary-green text-primary-green hover:bg-primary-green hover:text-white focus:ring-primary-green",
      ghost: "text-primary-green hover:bg-primary-green/10 focus:ring-primary-green",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    const combinedClasses = cn(baseStyles, variants[variant], sizes[size], className);

    if (href) {
      return (
        <Link href={href} className={combinedClasses} {...(props as any)}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref as any} className={combinedClasses} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
