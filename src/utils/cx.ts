type ClassValue = string | false | null | undefined;

/** Joins conditional class names. Deliberately tiny — see AGENTS.md §2.2. */
export function cx(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
