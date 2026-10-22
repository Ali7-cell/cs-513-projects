import React from "react";
import { clsx } from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  inset = false,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "rounded-2xl p-5 bg-uaf-light transition-all",
        inset ? "shadow-neu-inset" : "shadow-neu",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
