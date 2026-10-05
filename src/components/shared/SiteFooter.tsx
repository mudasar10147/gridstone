import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Text } from "@/components/ui/Text";
import { SITE_NAME } from "@/constants/site";

export interface SiteFooterProps {
  /** Passed in so the footer stays a pure render (no clock reads). */
  year: number;
}

export function SiteFooter({ year }: SiteFooterProps) {
  return (
    <footer className="border-t border-border-subtle/60">
      <Container
        width="wide"
        className="flex flex-col items-center justify-between gap-3 py-4 sm:flex-row sm:py-3"
      >
        <Text size="sm" tone="muted">
          © {year} {SITE_NAME}. All rights reserved.
        </Text>
        <Eyebrow decoration="framed">More worlds ahead</Eyebrow>
      </Container>
    </footer>
  );
}
