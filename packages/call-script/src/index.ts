import type { SectionId } from "@lf/types";

export { flow } from "./flow.js";
export { rebuttals } from "./rebuttals.js";

/** The order sections walk through during Next / Previous navigation. */
export const sectionOrder: SectionId[] = [
  "intro",
  "brand",
  "goals",
  "property",
  "credit",
  "liabilities",
  "income",
  "assets",
  "presentation",
  "propertyConditions",
  "declarations"
];

/** Pretty-print a section id ("propertyConditions" -> "Property Conditions"). */
export function labelSection(s: string): string {
  return s.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}
