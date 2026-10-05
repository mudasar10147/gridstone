// Launch moment: Friday 9 October 2026, 12:00 PM Pakistan time (UTC+5).
// Before this, visitors only see the countdown; the site content is not sent.
export const LAUNCH_AT: number = new Date("2026-10-09T12:00:00+05:00").getTime();

export function msUntilLaunch(): number {
  return LAUNCH_AT - Date.now();
}
