import type { ReactNode } from "react";
import type { IconName } from "@/types/icon";
import { Heading, type HeadingLevel } from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";

export interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description?: string;
  action?: ReactNode;
  /** Match the surrounding outline — usually one below the section title. */
  headingLevel?: HeadingLevel;
}

export function EmptyState({
  icon = "image",
  title,
  description,
  action,
  headingLevel = "h3",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-panel border border-dashed border-border-strong px-6 py-12 text-center">
      <Icon name={icon} size="lg" className="text-text-muted" />
      <Heading as={headingLevel} size="card">
        {title}
      </Heading>
      {description && (
        <Text size="sm" tone="muted" className="max-w-sm">
          {description}
        </Text>
      )}
      {action}
    </div>
  );
}
