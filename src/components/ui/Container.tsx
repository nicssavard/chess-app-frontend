"use client";
import clsx from "clsx";

interface props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}
export function Container({ className, children, ...props }: props) {
  return (
    <div
      className={clsx("mx-auto  max-w-7xl px-2 sm:px-6 lg:px-8", className)}
      {...props}
    >
      {children}
    </div>
  );
}
