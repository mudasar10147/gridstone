import type { ReactNode } from "react";
import { cx } from "@/utils/cx";

export type ContainerWidth = "default" | "wide";

const widthStyles: Record<ContainerWidth, string> = {
  default: "max-w-7xl",
  wide: "max-w-wide",
};

export interface ContainerProps {
  width?: ContainerWidth;
  className?: string;
  children: ReactNode;
}

/** Centres content and applies the site's responsive side gutters. */
export function Container({
  width = "default",
  className,
  children,
}: ContainerProps) {
  return (
    <div
      className={cx(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        widthStyles[width],
        className,
      )}
    >
      {children}
    </div>
  );
}
