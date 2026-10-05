import type { ReactNode } from "react";
import { connection } from "next/server";
import { msUntilLaunch } from "../config";
import { ComingSoon } from "./ComingSoon";

export interface LaunchGateProps {
  /** The real page; only rendered (and sent) once launch has passed. */
  children: ReactNode;
}

/**
 * Wrap every page in this. Before launch it renders the countdown instead of
 * its children, so no site content reaches the browser early. Decided per
 * request, so pages unlock at launch without a redeploy.
 */
export async function LaunchGate({ children }: LaunchGateProps) {
  await connection();
  const remaining = msUntilLaunch();

  if (remaining > 0) {
    return <ComingSoon remaining={remaining} />;
  }

  return children;
}
