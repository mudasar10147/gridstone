import { IconButton } from "@/components/ui/IconButton";
import { SOCIAL_LINKS } from "@/constants/site";
import { cx } from "@/utils/cx";

export interface SocialLinksProps {
  className?: string;
}

export function SocialLinks({ className }: SocialLinksProps) {
  return (
    <ul className={cx("flex items-center gap-1", className)}>
      {SOCIAL_LINKS.map((link) => (
        <li key={link.label}>
          <IconButton
            href={link.href}
            icon={link.icon}
            label={`Gridstone on ${link.label}`}
          />
        </li>
      ))}
    </ul>
  );
}
