"use client";

import { useState } from "react";
import NextImage from "next/image";
import { cx } from "@/utils/cx";
import { Icon } from "./Icon";

export type ImageRatio = "16/9" | "2/1" | "1/1";
export type ImageFit = "cover" | "contain";

const ratioStyles: Record<ImageRatio, string> = {
  "16/9": "aspect-video",
  "2/1": "aspect-2/1",
  "1/1": "aspect-square",
};

const fitStyles: Record<ImageFit, string> = {
  cover: "object-cover",
  contain: "object-contain",
};

interface ImageBaseProps {
  /** Path under /public or an allowed remote URL. */
  src: string;
  /** Required. Use "" for purely decorative images. */
  alt: string;
  fit?: ImageFit;
  /** "eager" only for above-the-fold images (Next 16 replaces `priority`). */
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  className?: string;
}

/**
 * - `ratio`: reserves space with an aspect ratio, image fills it.
 * - `fill`: fills a positioned parent that already has a size.
 * - `fixed`: intrinsic width/height (logos, avatars).
 */
export type ImageProps = ImageBaseProps &
  (
    | { layout: "ratio"; ratio: ImageRatio; sizes: string }
    | { layout: "fill"; sizes: string }
    | { layout: "fixed"; width: number; height: number }
  );

export function Image(props: ImageProps) {
  const {
    src,
    alt,
    fit = "cover",
    loading,
    fetchPriority,
    className,
  } = props;
  // Tracking the failed src (not a boolean) means a new src retries on its own.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const hasError = failedSrc === src;

  const fallback = (
    <span
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      className="absolute inset-0 flex items-center justify-center bg-surface-raised text-text-muted"
    >
      <Icon name="image" size="lg" />
    </span>
  );

  const shared = {
    src,
    alt,
    loading,
    fetchPriority,
    onError: () => setFailedSrc(src),
  };

  if (props.layout === "fixed") {
    return (
      <span
        className={cx("relative inline-block shrink-0", className)}
        style={{ width: props.width, height: props.height }}
      >
        {hasError ? (
          fallback
        ) : (
          <NextImage
            {...shared}
            width={props.width}
            height={props.height}
            className={cx("size-full", fitStyles[fit])}
          />
        )}
      </span>
    );
  }

  return (
    <div
      className={cx(
        "overflow-hidden bg-surface-raised",
        props.layout === "ratio"
          ? cx("relative w-full", ratioStyles[props.ratio])
          : "absolute inset-0",
        className,
      )}
    >
      {hasError ? (
        fallback
      ) : (
        <NextImage
          {...shared}
          fill
          sizes={props.sizes}
          className={fitStyles[fit]}
        />
      )}
    </div>
  );
}
