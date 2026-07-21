/**
 * Shared types for the Lending Force guided call script.
 */

export type SectionId =
  | "intro"
  | "brand"
  | "goals"
  | "property"
  | "credit"
  | "liabilities"
  | "income"
  | "assets"
  | "foreshadow"
  | "presentation"
  | "propertyConditions"
  | "declarations"
  | "application";

export type FieldType = "input" | "textarea" | "select";

/**
 * Tuple form: [key, label] | [key, label, type] | [key, label, type, options]
 * `options` is a pipe-separated string for selects, e.g. "Phone|Text|Email".
 */
export type FieldDef =
  | [key: string, label: string]
  | [key: string, label: string, type: FieldType]
  | [key: string, label: string, type: FieldType, options: string];

/**
 * Tuple form: [buttonLabel, action]
 *
 * Actions:
 *   "<sectionId>"              - navigate to start of section
 *   "jump:<index>"             - jump to step index in current section
 *   "next:<sectionId>"         - navigate to start of section
 *   "rebuttal:<key>"           - open rebuttal drawer with key
 *   "drawer"                   - open the rebuttal drawer
 *   "export"                   - show export screen
 *   "set:key=value;<action>"   - assign data field(s) then run action
 *   "at:<sectionId>:<index>"   - navigate to a specific step within a section
 *   "when:key=value?A|B"       - run action A if data[key]===value, else action B
 */
export type RouteDef = [label: string, action: string];

/** An alternate script the LO can switch to via tabs on a question. */
export interface ScriptVariant {
  label: string;
  script: string;
}

export interface Question {
  title: string;
  script: string;
  /** Optional tabbed script options; when present, tabs show at the top of the step. */
  variants?: ScriptVariant[];
  coach?: string;
  fields?: FieldDef[];
  routes?: RouteDef[];
}

export type Flow = Record<SectionId, Question[]>;

export type RebuttalKey =
  | "notInterested"
  | "busy"
  | "sendInfo"
  | "howGotInfo"
  | "oldInquiry"
  | "creditPull"
  | "lowRate"
  | "closingCosts"
  | "thinkAboutIt"
  | "spouse"
  | "paymentHigh"
  | "bank";

/** Tuple form: [title, body] */
export type Rebuttal = [title: string, body: string];

export type Rebuttals = Record<RebuttalKey, Rebuttal>;

/**
 * Free-form bag of captured call data, keyed by field name.
 * Kept loose because the question flow defines arbitrary keys.
 */
export type CallData = Record<string, string>;

export interface CallState {
  section: SectionId;
  index: number;
  route: string;
}
