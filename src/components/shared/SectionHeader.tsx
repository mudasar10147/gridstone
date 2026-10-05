import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import {
  Heading,
  type HeadingEffect,
  type HeadingLevel,
} from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

export interface SectionHeaderProps {
  eyebrow?: string;
  /** May include <HeadingAccent> for the gradient words. */
  title: ReactNode;
  description?: ReactNode;
  as?: HeadingLevel;
  titleEffect?: HeadingEffect;
  /** Lets the section reference this heading via aria-labelledby. */
  titleId?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  as = "h2",
  titleEffect = "none",
  titleId,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      {eyebrow && <Eyebrow decoration="lead-rule">{eyebrow}</Eyebrow>}
      <Heading as={as} size="section" effect={titleEffect} id={titleId}>
        {title}
      </Heading>
      {description && <Text className="max-w-xs">{description}</Text>}
    </div>
  );
}
