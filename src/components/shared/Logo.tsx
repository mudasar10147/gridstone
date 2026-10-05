import Link from "next/link";
import { Image } from "@/components/ui/Image";
import { ROUTES } from "@/constants/routes";
import { SITE_NAME } from "@/constants/site";

const LOGO_MARK_SIZE = 44;

/** Brand lock-up: the crystal "G" mark plus the two-line wordmark. */
export function Logo() {
  return (
    <Link
      href={ROUTES.home}
      aria-label={`${SITE_NAME} home`}
      className="flex items-center gap-2.5 rounded-control"
    >
      <Image
        layout="fixed"
        src="/logo.png"
        alt=""
        width={LOGO_MARK_SIZE}
        height={LOGO_MARK_SIZE}
        fit="contain"
        loading="eager"
      />
      <span
        aria-hidden
        className="flex flex-col font-heading text-lg leading-none font-bold tracking-wide text-text-primary uppercase sm:text-xl"
      >
        <span>Gridstone</span>
        <span className="text-text-secondary">Productions</span>
      </span>
    </Link>
  );
}
