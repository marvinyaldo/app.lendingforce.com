import type { CallData } from "@lf/types";
import { num, xml } from "./escape.js";

/* ------------------------------------------------------------------ *
 * MISMO 3.4 export (ULAD / Fannie 3.4 flavor) for Arive import.
 *
 * This maps the data captured in the guided call into a MISMO 3.4
 * message. It is a best-effort mapping: only populated fields are
 * emitted, enum values are normalized to MISMO enumerations, and any
 * Lending Force-specific data that has no MISMO home is carried in the
 * DEAL EXTENSION so nothing is lost. Validate against Arive's importer
 * before relying on it in production.
 * ------------------------------------------------------------------ */

/** <Tag>escaped</Tag>, or "" when empty so we never emit hollow nodes. */
function t(tag: string, value: unknown): string {
  const v = xml(value);
  return v ? `<${tag}>${v}</${tag}>` : "";
}

/** Numeric element: strips to digits/decimal. */
function n(tag: string, value: unknown): string {
  const v = num(value);
  return v ? `<${tag}>${v}</${tag}>` : "";
}

/** Wrap children in a container only when at least one child exists. */
function wrap(tag: string, inner: string, attrs = ""): string {
  if (!inner) return "";
  return `<${tag}${attrs ? " " + attrs : ""}>${inner}</${tag}>`;
}

function pad(x: string): string {
  return x.padStart(2, "0");
}

/** Normalize a free-text date to ISO (YYYY-MM-DD); "" if unparseable. */
function normalizeDate(v: unknown): string {
  const s = String(v ?? "").trim();
  if (!s) return "";
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return `${m[1]}-${pad(m[2]!)}-${pad(m[3]!)}`;
  m = s.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})$/);
  if (m) {
    let [, mo, d, y] = m as unknown as [string, string, string, string];
    if (y.length === 2) y = (Number(y) > 30 ? "19" : "20") + y;
    return `${y}-${pad(mo)}-${pad(d)}`;
  }
  return "";
}

/** occupancy -> MISMO PropertyUsageType */
function occupancyType(v: unknown): string {
  const s = String(v ?? "").toLowerCase();
  if (s.includes("primary")) return "PrimaryResidence";
  if (s.includes("second")) return "SecondHome";
  if (s.includes("investment")) return "Investment";
  return "";
}

/** loanPurpose -> MISMO LoanPurposeType */
function purposeType(v: unknown): string {
  const s = String(v ?? "").toLowerCase();
  if (s.includes("purchase")) return "Purchase";
  if (s.includes("refinance") || s.includes("cash")) return "Refinance";
  if (s) return "Other";
  return "";
}

/** True when the purpose implies a cash-out refinance. */
function isCashOut(v: unknown): boolean {
  return String(v ?? "").toLowerCase().includes("cash");
}

/** productType -> MISMO MortgageType (best-effort keyword match). */
function mortgageType(v: unknown): string {
  const s = String(v ?? "").toLowerCase();
  if (s.includes("fha")) return "FHA";
  if (/\bva\b/.test(s)) return "VA";
  if (s.includes("usda") || s.includes("rural")) return "USDARuralDevelopment";
  if (s.includes("conventional")) return "Conventional";
  return "";
}

/** Split a full name into first / middle / last for the MISMO NAME node. */
function splitName(full: unknown, firstFallback: unknown) {
  const parts = String(full ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return { first: String(firstFallback ?? ""), middle: "", last: "" };
  if (parts.length === 1) return { first: parts[0]!, middle: "", last: "" };
  return {
    first: parts[0]!,
    middle: parts.slice(1, -1).join(" "),
    last: parts[parts.length - 1]!
  };
}

/** One ASSET node, or "" when no amount is present. */
function assetNode(type: string, value: unknown): string {
  const amt = num(value);
  if (!amt) return "";
  return wrap(
    "ASSET",
    wrap(
      "ASSET_DETAIL",
      `<AssetCashOrMarketValueAmount>${amt}</AssetCashOrMarketValueAmount>` + t("AssetType", type)
    )
  );
}

export function toMISMO(
  data: CallData,
  createdAt: string = new Date().toISOString()
): string {
  // --- ASSETS ---
  const assets = wrap(
    "ASSETS",
    assetNode("CheckingAccount", data.checkingSavings) +
      assetNode("RetirementFund", data.retirementAssets)
  );

  // --- COLLATERALS / SUBJECT PROPERTY ---
  const collaterals = wrap(
    "COLLATERALS",
    wrap(
      "COLLATERAL",
      wrap(
        "SUBJECT_PROPERTY",
        wrap("ADDRESS", t("AddressLineText", data.propertyAddress)) +
          wrap(
            "PROPERTY_DETAIL",
            n("PropertyEstimatedValueAmount", data.estimatedValue) +
              t("PropertyUsageType", occupancyType(data.occupancy))
          )
      )
    )
  );

  // --- LOANS ---
  const cashOut = isCashOut(data.loanPurpose);
  const loans = wrap(
    "LOANS",
    wrap(
      "LOAN",
      wrap("LOAN_PURPOSE", t("LoanPurposeType", purposeType(data.loanPurpose))) +
        (cashOut
          ? wrap("REFINANCE", t("RefinanceCashOutDeterminationType", "CashOut"))
          : "") +
        wrap(
          "TERMS_OF_LOAN",
          n("BaseLoanAmount", data.loanAmount) +
            t("MortgageType", mortgageType(data.productType)) +
            n("NoteRatePercent", data.interestRate)
        ),
      `LoanRoleType="SubjectLoan"`
    )
  );

  // --- PARTY (borrower) ---
  const name = splitName(data.borrowerFullName, data.borrowerFirstName);

  const contactPoints = wrap(
    "CONTACT_POINTS",
    wrap(
      "CONTACT_POINT",
      wrap("CONTACT_POINT_TELEPHONE", n("ContactPointTelephoneValue", data.preferredPhone))
    ) +
      wrap(
        "CONTACT_POINT",
        wrap("CONTACT_POINT_EMAIL", t("ContactPointEmailValue", data.email))
      )
  );

  const nameNode = wrap(
    "NAME",
    t("FirstName", name.first) +
      t("FullName", data.borrowerFullName) +
      t("LastName", name.last) +
      t("MiddleName", name.middle)
  );

  const dob = normalizeDate(data.borrowerDob);
  const borrowerDetail = wrap("BORROWER_DETAIL", dob ? `<BorrowerBirthDate>${dob}</BorrowerBirthDate>` : "");

  const currentIncome = wrap(
    "CURRENT_INCOME",
    wrap(
      "CURRENT_INCOME_ITEMS",
      wrap(
        "CURRENT_INCOME_ITEM",
        wrap(
          "CURRENT_INCOME_ITEM_DETAIL",
          n("CurrentIncomeMonthlyTotalAmount", data.grossMonthlyIncome) + t("IncomeType", "Base")
        )
      )
    )
  );

  const selfEmployed = String(data.employmentType ?? "").toLowerCase().includes("self");
  const employers = wrap(
    "EMPLOYERS",
    wrap(
      "EMPLOYER",
      wrap(
        "EMPLOYMENT",
        (selfEmployed
          ? "<EmploymentBorrowerSelfEmployedIndicator>true</EmploymentBorrowerSelfEmployedIndicator>"
          : "") + t("EmploymentStartDate", normalizeDate(data.hireDate))
      ) + wrap("LEGAL_ENTITY", wrap("LEGAL_ENTITY_DETAIL", t("FullName", data.employer)))
    )
  );

  const borrower = wrap("BORROWER", borrowerDetail + currentIncome + employers);

  const ssn = num(data.borrowerSsn);
  const taxpayerIds = ssn
    ? wrap(
        "TAXPAYER_IDENTIFIERS",
        wrap(
          "TAXPAYER_IDENTIFIER",
          t("TaxpayerIdentifierType", "SocialSecurityNumber") +
            `<TaxpayerIdentifierValue>${ssn}</TaxpayerIdentifierValue>`
        )
      )
    : "";

  const parties = wrap(
    "PARTIES",
    wrap(
      "PARTY",
      wrap("INDIVIDUAL", contactPoints + nameNode) +
        wrap(
          "ROLES",
          wrap("ROLE", borrower + wrap("ROLE_DETAIL", t("PartyRoleType", "Borrower")))
        ) +
        taxpayerIds
    )
  );

  // --- EXTENSION: Lending Force call capture (no native MISMO home) ---
  const extension = wrap(
    "EXTENSION",
    wrap(
      "OTHER",
      `<LENDING_FORCE_CALL_CAPTURE xmlns="http://lendingforce.com/call-capture">` +
        t("PrimaryGoal", data.primaryGoal) +
        t("FinancialGoal", data.financialGoal) +
        t("EmotionalGoal", data.emotionalGoal) +
        t("DebtDriver", data.debtDriver) +
        n("TotalDebtToPayoff", data.totalDebtToPayoff) +
        n("TotalMonthlyDebtPayments", data.totalPaymentsToPayoff) +
        t("LiabilitySummary", data.liabilitySummary) +
        t("OutsideExpenses", data.outsideExpenses) +
        n("EstimatedCreditScore", data.estimatedCreditScore) +
        t("CreditEvents", data.creditEvents) +
        t("ProductType", data.productType) +
        n("ProposedNewPayment", data.newPayment) +
        t("FinancialBenefit", data.financialBenefit) +
        t("EmotionalBenefit", data.emotionalBenefit) +
        t("Notes", data.runningNotes) +
        `</LENDING_FORCE_CALL_CAPTURE>`
    )
  );

  const deal = `<DEAL>${assets}${collaterals}${loans}${parties}${extension}</DEAL>`;

  return (
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<MESSAGE xmlns="http://www.mismo.org/residential/2009/schemas" ` +
    `xmlns:xlink="http://www.w3.org/1999/xlink" MISMOReferenceModelIdentifier="3.4.0">` +
    wrap(
      "ABOUT_VERSIONS",
      wrap(
        "ABOUT_VERSION",
        `<CreatedDatetime>${xml(createdAt)}</CreatedDatetime>` +
          t("DataVersionIdentifier", "3.4.032420160128")
      )
    ) +
    `<DEAL_SETS><DEAL_SET><DEALS>${deal}</DEALS></DEAL_SET></DEAL_SETS>` +
    `</MESSAGE>`
  );
}
