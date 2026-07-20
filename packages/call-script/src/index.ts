import type { CallData, SectionId } from "@lf/types";

export { flow } from "./flow.js";
export { rebuttals } from "./rebuttals.js";

/**
 * A ready-to-use personal brand an LO can drop in if they do not want to write
 * their own. Applied via the "Use sample brand" route in the brand section.
 */
export const sampleBrand: CallData = {
  brandPositioning:
    "I'm a mortgage advisor with Lending Force, and my focus is simple: helping homeowners make confident, numbers-first decisions about their mortgage — not selling them a loan they don't need.",
  brandWhy:
    "Clients choose to work with me because I tell them the truth. If restructuring their mortgage or debt genuinely improves their position, I'll show them exactly how. If it doesn't, I'll tell them that too — no pressure, no games.",
  brandProof:
    "I've helped hundreds of families lower their monthly obligations, consolidate high-interest debt, and free up cash flow. Every recommendation I make is backed by real numbers you can see for yourself."
};

/** Data keys that make up a personal brand; persisted separately so they survive a data clear. */
export const brandFields = ["brandPositioning", "brandWhy", "brandProof"] as const;

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
  "foreshadow",
  "presentation",
  "application",
  "declarations",
  "propertyConditions"
];

/** Pretty-print a section id ("propertyConditions" -> "Property Conditions"). */
export function labelSection(s: string): string {
  return s.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}
