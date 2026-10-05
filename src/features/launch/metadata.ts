import type { Metadata } from "next";
import { connection } from "next/server";
import { SITE_NAME } from "@/constants/site";
import { msUntilLaunch } from "./config";

/**
 * Page metadata that stays generic until launch, so page names don't leak
 * through the browser tab before the site opens. Use from generateMetadata.
 */
export async function launchAwareMetadata(pageTitle: string): Promise<Metadata> {
  await connection();
  return {
    title:
      msUntilLaunch() > 0
        ? `${SITE_NAME} — Coming Soon`
        : `${pageTitle} — ${SITE_NAME}`,
  };
}
