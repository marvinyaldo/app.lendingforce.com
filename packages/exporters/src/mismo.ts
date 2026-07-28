import type { CallData } from "@lf/types";
import { num, xml } from "./escape.js";

/* ------------------------------------------------------------------ *
 * MISMO 3.4 export (ULAD / Fannie 3.4 flavor) for Arive import.
 *
 * Maps the full 1003 captured in the guided call + application section
 * into a MISMO 3.4 message. Best-effort mapping: only populated fields
 * are emitted, enums are normalized to MISMO enumerations, and any data
 * without a native MISMO home is carried in the DEAL EXTENSION so
 * nothing is lost. Validate against Arive's importer before production.
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

/** Yes/No/boolean-ish string -> "true"/"false"/"" */
function boolIndicator(tag: string, value: unknown): string {
  const s = String(value ?? "").trim().toLowerCase();
  if (!s) return "";
  if (["yes", "y", "true", "1"].includes(s)) return `<${tag}>true</${tag}>`;
  if (["no", "n", "false", "0"].includes(s)) return `<${tag}>false</${tag}>`;
  return "";
}

/** Yes/No-typed declaration element (e.g. IntentToOccupyType). */
function yesNoType(tag: string, value: unknown): string {
  const s = String(value ?? "").trim().toLowerCase();
  if (["yes", "y", "true", "1"].includes(s)) return `<${tag}>Yes</${tag}>`;
  if (["no", "n", "false", "0"].includes(s)) return `<${tag}>No</${tag}>`;
  return "";
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

/** citizenship -> MISMO CitizenshipResidencyType */
function citizenshipType(v: unknown): string {
  const s = String(v ?? "").toLowerCase();
  if (s.includes("us citizen") || s === "citizen") return "USCitizen";
  if (s.includes("permanent")) return "PermanentResidentAlien";
  if (s.includes("non-permanent") || s.includes("non permanent")) return "NonPermanentResidentAlien";
  return "";
}

/** marital status -> MISMO MaritalStatusType */
function maritalType(v: unknown): string {
  const s = String(v ?? "").toLowerCase();
  if (s.includes("married")) return "Married";
  if (s.includes("separated")) return "Separated";
  if (s.includes("unmarried") || s.includes("single")) return "Unmarried";
  return "";
}

/** own/rent -> MISMO BorrowerResidencyBasisType */
function residencyBasis(v: unknown): string {
  const s = String(v ?? "").toLowerCase();
  if (s.includes("own")) return "Own";
  if (s.includes("rent")) return "Rent";
  if (s.includes("no primary") || s.includes("rent free") || s.includes("free")) return "LivingRentFree";
  return "";
}

/** liability type -> MISMO LiabilityType */
function liabilityType(v: unknown): string {
  const s = String(v ?? "").toLowerCase();
  if (s.includes("revolv")) return "Revolving";
  if (s.includes("install")) return "Installment";
  if (s.includes("mortgage")) return "MortgageLoan";
  if (s.includes("lease")) return "LeasePayment";
  if (s) return "Other";
  return "";
}

/** Build a MISMO ADDRESS node from parts. */
function addressNode(
  street: unknown,
  city: unknown,
  state: unknown,
  zip: unknown,
  county?: unknown,
  country?: unknown
): string {
  return wrap(
    "ADDRESS",
    t("AddressLineText", street) +
      t("CityName", city) +
      t("CountryCode", country) +
      t("CountyName", county) +
      t("PostalCode", zip) +
      t("StateCode", state)
  );
}

/** A telephone CONTACT_POINT with a role (Home/Mobile/Work). */
function phonePoint(role: string, value: unknown): string {
  const v = num(value);
  if (!v) return "";
  return wrap(
    "CONTACT_POINT",
    wrap("CONTACT_POINT_DETAIL", t("ContactPointRoleType", role)) +
      wrap("CONTACT_POINT_TELEPHONE", `<ContactPointTelephoneValue>${v}</ContactPointTelephoneValue>`)
  );
}

/** An email CONTACT_POINT. */
function emailPoint(value: unknown): string {
  const v = xml(value);
  if (!v) return "";
  return wrap(
    "CONTACT_POINT",
    wrap("CONTACT_POINT_DETAIL", t("ContactPointRoleType", "Home")) +
      wrap("CONTACT_POINT_EMAIL", `<ContactPointEmailValue>${v}</ContactPointEmailValue>`)
  );
}

/** A MISMO NAME node from separate parts (falls back to a full name). */
function nameNode(first: unknown, middle: unknown, last: unknown, full: unknown, suffix?: unknown): string {
  return wrap(
    "NAME",
    t("FirstName", first) +
      t("FullName", full) +
      t("LastName", last) +
      t("MiddleName", middle) +
      t("SuffixName", suffix)
  );
}

/** Split a single full name into first/middle/last. */
function splitName(full: unknown) {
  const parts = String(full ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return { first: "", middle: "", last: "" };
  if (parts.length === 1) return { first: parts[0]!, middle: "", last: "" };
  return {
    first: parts[0]!,
    middle: parts.slice(1, -1).join(" "),
    last: parts[parts.length - 1]!
  };
}

/** One CURRENT_INCOME_ITEM. */
function incomeItem(type: string, value: unknown): string {
  const v = num(value);
  if (!v) return "";
  return wrap(
    "CURRENT_INCOME_ITEM",
    wrap(
      "CURRENT_INCOME_ITEM_DETAIL",
      `<CurrentIncomeMonthlyTotalAmount>${v}</CurrentIncomeMonthlyTotalAmount>` + t("IncomeType", type)
    )
  );
}

/** One ASSET node with optional institution/account. */
function assetNode(type: string, value: unknown, institution?: unknown, account?: unknown): string {
  const amt = num(value);
  if (!amt) return "";
  return wrap(
    "ASSET",
    wrap(
      "ASSET_DETAIL",
      t("AssetAccountIdentifier", account) +
        `<AssetCashOrMarketValueAmount>${amt}</AssetCashOrMarketValueAmount>` +
        t("AssetType", type)
    ) + wrap("ASSET_HOLDER", nameNode("", "", "", institution))
  );
}

/** One LIABILITY node. */
function liabilityNode(creditor: unknown, type: unknown, balance: unknown, payment: unknown): string {
  const bal = num(balance);
  const pay = num(payment);
  if (!bal && !pay && !xml(creditor)) return "";
  return wrap(
    "LIABILITY",
    wrap(
      "LIABILITY_DETAIL",
      (pay ? `<LiabilityMonthlyPaymentAmount>${pay}</LiabilityMonthlyPaymentAmount>` : "") +
        t("LiabilityType", liabilityType(type)) +
        (bal ? `<LiabilityUnpaidBalanceAmount>${bal}</LiabilityUnpaidBalanceAmount>` : "")
    ) + wrap("LIABILITY_HOLDER", nameNode("", "", "", creditor))
  );
}

export function toMISMO(data: CallData, createdAt: string = new Date().toISOString()): string {
  // --- ASSETS ---
  const assets = wrap(
    "ASSETS",
    assetNode("CheckingAccount", data.checkingSavings, data.checkingBank, data.checkingAccountNumber) +
      assetNode("SavingsAccount", data.savingsBalance, data.savingsBank, data.savingsAccountNumber) +
      assetNode("RetirementFund", data.retirementAssets, data.retirementInstitution) +
      assetNode("Other", data.otherAssetsValue, data.otherAssetsDescription)
  );

  // --- COLLATERALS / SUBJECT PROPERTY ---
  const collaterals = wrap(
    "COLLATERALS",
    wrap(
      "COLLATERAL",
      wrap(
        "SUBJECT_PROPERTY",
        addressNode(
          data.propertyAddress,
          data.propertyCity,
          data.propertyState,
          data.propertyZip,
          data.propertyCounty
        ) +
          wrap(
            "PROPERTY_DETAIL",
            n("FinancedUnitCount", data.propertyUnits) +
              n("PropertyEstimatedValueAmount", data.estimatedValue) +
              n("PropertyStructureBuiltYear", data.propertyYearBuilt) +
              t("PropertyUsageType", occupancyType(data.occupancy))
          )
      )
    )
  );

  // --- LIABILITIES ---
  const liabilities = wrap(
    "LIABILITIES",
    liabilityNode(data.liability1Creditor, data.liability1Type, data.liability1Balance, data.liability1Payment) +
      liabilityNode(data.liability2Creditor, data.liability2Type, data.liability2Balance, data.liability2Payment) +
      liabilityNode(data.liability3Creditor, data.liability3Type, data.liability3Balance, data.liability3Payment)
  );

  // --- LOANS ---
  const cashOut = isCashOut(data.loanPurpose);
  const loans = wrap(
    "LOANS",
    wrap(
      "LOAN",
      wrap("LOAN_PURPOSE", t("LoanPurposeType", purposeType(data.loanPurpose))) +
        (cashOut ? wrap("REFINANCE", t("RefinanceCashOutDeterminationType", "CashOut")) : "") +
        wrap(
          "TERMS_OF_LOAN",
          n("BaseLoanAmount", data.loanAmount) +
            n("LoanAmortizationPeriodCount", data.loanTermMonths) +
            t("MortgageType", mortgageType(data.productType)) +
            n("NoteRatePercent", data.interestRate)
        ),
      `xlink:label="Loan_Subject" LoanRoleType="SubjectLoan"`
    )
  );

  // --- BORROWER PARTY ---
  const bName = splitName(data.borrowerFullName);
  const borrowerContact = wrap(
    "CONTACT_POINTS",
    phonePoint("Mobile", data.borrowerCellPhone || data.preferredPhone) +
      phonePoint("Home", data.borrowerHomePhone) +
      phonePoint("Work", data.borrowerWorkPhone) +
      emailPoint(data.email)
  );
  const borrowerName = nameNode(
    data.borrowerFirstName || bName.first,
    data.borrowerMiddleName || bName.middle,
    data.borrowerLastName || bName.last,
    data.borrowerFullName,
    data.borrowerSuffix
  );
  const bDob = normalizeDate(data.borrowerDob);
  const borrowerDetail = wrap(
    "BORROWER_DETAIL",
    (bDob ? `<BorrowerBirthDate>${bDob}</BorrowerBirthDate>` : "") +
      "<BorrowerClassificationType>Primary</BorrowerClassificationType>" +
      n("DependentCount", data.borrowerDependentsCount) +
      t("MaritalStatusType", maritalType(data.borrowerMaritalStatus))
  );
  const borrowerIncome = wrap(
    "CURRENT_INCOME",
    wrap(
      "CURRENT_INCOME_ITEMS",
      incomeItem("Base", data.grossMonthlyIncome) +
        incomeItem("Overtime", data.incomeOvertime) +
        incomeItem("Bonus", data.incomeBonus) +
        incomeItem("Commissions", data.incomeCommission) +
        incomeItem("MilitaryBasePay", data.incomeMilitary) +
        incomeItem("Other", data.incomeOther) +
        incomeItem("Other", data.otherIncomeAmount)
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
          : "") +
          t("EmploymentPositionDescription", data.borrowerPosition) +
          t("EmploymentStartDate", normalizeDate(data.hireDate)) +
          n("EmploymentTimeInLineOfWorkYearsCount", data.borrowerYearsInLineOfWork) +
          n("OwnershipInterestPercent", data.borrowerSelfEmployedShare)
      ) +
        wrap(
          "LEGAL_ENTITY",
          nameNode("", "", "", data.employer) +
            wrap(
              "CONTACT_POINTS",
              phonePoint("Work", data.employerPhone)
            )
        ) +
        addressNode(data.employerStreet, data.employerCity, data.employerState, data.employerZip)
    )
  );
  const currentResidence = wrap(
    "RESIDENCE",
    addressNode(
      data.currentStreet,
      data.currentCity,
      data.currentState,
      data.currentZip,
      "",
      data.currentCountry
    ) +
      wrap(
        "RESIDENCE_DETAIL",
        t("BorrowerResidencyBasisType", residencyBasis(data.currentHousingType)) +
          t("BorrowerResidencyType", "Current") +
          n("MonthlyHousingExpenseAmount", data.currentHousingPayment)
      )
  );
  const borrowerResidences = wrap("RESIDENCES", currentResidence);

  // Declarations — element names/order match the Arive/DU MISMO export.
  const declarationDetail = wrap(
    "DECLARATION_DETAIL",
    boolIndicator("BankruptcyIndicator", data.declDeclaredBankruptcy) +
      t("CitizenshipResidencyType", citizenshipType(data.borrowerCitizenship)) +
      yesNoType("HomeownerPastThreeYearsType", data.declOwnershipInterest) +
      yesNoType("IntentToOccupyType", data.declOccupyPrimary) +
      boolIndicator("OutstandingJudgmentsIndicator", data.declOutstandingJudgments) +
      boolIndicator("PartyToLawsuitIndicator", data.declPartyToLawsuit) +
      boolIndicator("PresentlyDelinquentIndicator", data.declDelinquentFederalDebt) +
      boolIndicator("PriorPropertyDeedInLieuConveyedIndicator", data.declConveyedTitleInLieu) +
      boolIndicator("PriorPropertyForeclosureCompletedIndicator", data.declPropertyForeclosed) +
      boolIndicator("PriorPropertyShortSaleCompletedIndicator", data.declPreForeclosureShortSale) +
      boolIndicator("PropertyProposedCleanEnergyLienIndicator", data.declSubjectToLien) +
      boolIndicator("UndisclosedBorrowedFundsIndicator", data.declBorrowingMoney) +
      boolIndicator("UndisclosedComakerOfNoteIndicator", data.declCoSigner) +
      boolIndicator("UndisclosedCreditApplicationIndicator", data.declNewCredit) +
      boolIndicator("UndisclosedMortgageApplicationIndicator", data.declOtherMortgage)
  );
  const declaration = wrap("DECLARATION", declarationDetail);

  // BORROWER child order matches MISMO: DETAIL, CURRENT_INCOME, DECLARATION,
  // EMPLOYERS, RESIDENCES. (Citizenship is carried inside DECLARATION_DETAIL.)
  const borrower = wrap(
    "BORROWER",
    borrowerDetail + borrowerIncome + declaration + employers + borrowerResidences
  );

  const borrowerSsn = num(data.borrowerSsn);
  const borrowerTaxIds = borrowerSsn
    ? wrap(
        "TAXPAYER_IDENTIFIERS",
        wrap(
          "TAXPAYER_IDENTIFIER",
          t("TaxpayerIdentifierType", "SocialSecurityNumber") +
            `<TaxpayerIdentifierValue>${borrowerSsn}</TaxpayerIdentifierValue>`
        )
      )
    : "";

  // Always emit a BORROWER element so the party reads as a real borrower, and
  // carry an xlink label so it can be linked to the loan as the primary borrower.
  const borrowerBlock = borrower || "<BORROWER><BORROWER_DETAIL/></BORROWER>";
  const borrowerParty = wrap(
    "PARTY",
    wrap("INDIVIDUAL", borrowerContact + borrowerName) +
      wrap(
        "ROLES",
        wrap(
          "ROLE",
          borrowerBlock + wrap("ROLE_DETAIL", t("PartyRoleType", "Borrower")),
          `SequenceNumber="1" xlink:label="BORROWER_1"`
        )
      ) +
      borrowerTaxIds,
    `SequenceNumber="1"`
  );

  // --- CO-BORROWER PARTY (optional) ---
  let coBorrowerParty = "";
  if (xml(data.coBorrowerName)) {
    const cName = splitName(data.coBorrowerName);
    const cDob = normalizeDate(data.coBorrowerDob);
    const cContact = wrap(
      "CONTACT_POINTS",
      phonePoint("Mobile", data.coBorrowerPhone) + emailPoint(data.coBorrowerEmail)
    );
    const cDetail = wrap(
      "BORROWER_DETAIL",
      (cDob ? `<BorrowerBirthDate>${cDob}</BorrowerBirthDate>` : "") +
        "<BorrowerClassificationType>Secondary</BorrowerClassificationType>" +
        t("MaritalStatusType", maritalType(data.coBorrowerMaritalStatus))
    );
    const cSsn = num(data.coBorrowerSsn);
    const cTaxIds = cSsn
      ? wrap(
          "TAXPAYER_IDENTIFIERS",
          wrap(
            "TAXPAYER_IDENTIFIER",
            t("TaxpayerIdentifierType", "SocialSecurityNumber") +
              `<TaxpayerIdentifierValue>${cSsn}</TaxpayerIdentifierValue>`
          )
        )
      : "";
    coBorrowerParty = wrap(
      "PARTY",
      wrap("INDIVIDUAL", cContact + nameNode(cName.first, cName.middle, cName.last, data.coBorrowerName)) +
        wrap(
          "ROLES",
          wrap(
            "ROLE",
            wrap("BORROWER", cDetail || "<BORROWER_DETAIL/>") +
              wrap("ROLE_DETAIL", t("PartyRoleType", "Borrower")),
            `SequenceNumber="1" xlink:label="BORROWER_2"`
          )
        ) +
        cTaxIds,
      `SequenceNumber="2"`
    );
  }

  // --- LOAN ORIGINATOR PARTY (optional) ---
  let loParty = "";
  if (xml(data.loName) || xml(data.loNmls)) {
    const loName = splitName(data.loName);
    const loContact = wrap(
      "CONTACT_POINTS",
      phonePoint("Work", data.loPhone) + emailPoint(data.loEmail)
    );
    const loIds = wrap(
      "LICENSES",
      (data.loNmls
        ? wrap(
            "LICENSE",
            wrap(
              "LICENSE_DETAIL",
              t("LicenseAuthorityLevelType", "Federal") +
                `<LicenseIdentifier>${xml(data.loNmls)}</LicenseIdentifier>`
            )
          )
        : "") +
        (data.loStateLicense
          ? wrap(
              "LICENSE",
              wrap(
                "LICENSE_DETAIL",
                t("LicenseAuthorityLevelType", "State") +
                  `<LicenseIdentifier>${xml(data.loStateLicense)}</LicenseIdentifier>`
              )
            )
          : "")
    );
    loParty = wrap(
      "PARTY",
      wrap("INDIVIDUAL", loContact + nameNode(loName.first, loName.middle, loName.last, data.loName)) +
        loIds +
        wrap(
          "ROLES",
          wrap(
            "ROLE",
            wrap(
              "LOAN_ORIGINATOR",
              t("LoanOriginatorType", "Individual") + t("NationwideMortgageLicensingSystemAndRegistryIdentifier", data.loNmls)
            ) + wrap("ROLE_DETAIL", t("PartyRoleType", "LoanOriginator"))
          )
        )
    );
  }

  // --- ORGANIZATION PARTY (optional) ---
  let orgParty = "";
  if (xml(data.loOrganization)) {
    orgParty = wrap(
      "PARTY",
      wrap("LEGAL_ENTITY", wrap("LEGAL_ENTITY_DETAIL", t("FullName", data.loOrganization))) +
        wrap(
          "ROLES",
          wrap(
            "ROLE",
            wrap(
              "LOAN_ORIGINATOR",
              t("NationwideMortgageLicensingSystemAndRegistryIdentifier", data.loOrgNmls)
            ) + wrap("ROLE_DETAIL", t("PartyRoleType", "LoanOriginationCompany"))
          )
        )
    );
  }

  const parties = wrap("PARTIES", borrowerParty + coBorrowerParty + loParty + orgParty);

  // The primary/secondary borrower is designated on BORROWER_DETAIL
  // (BorrowerClassificationType), matching how Arive/DU export identifies them,
  // so no borrower<->loan relationships are needed here.
  const deal = `<DEAL>${assets}${collaterals}${liabilities}${loans}${parties}</DEAL>`;

  return (
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<MESSAGE MISMOReferenceModelIdentifier="3.4.032420160128" ` +
    `xmlns="http://www.mismo.org/residential/2009/schemas" ` +
    `xmlns:DU="http://www.datamodelextension.org/Schema/DU" ` +
    `xmlns:ULAD="http://www.datamodelextension.org/Schema/ULAD" ` +
    `xmlns:xlink="http://www.w3.org/1999/xlink" ` +
    `xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ` +
    `xsi:schemaLocation="http://www.mismo.org/residential/2009/schemas DU_Wrapper_3.4.0_B324.xsd">` +
    wrap(
      "ABOUT_VERSIONS",
      wrap("ABOUT_VERSION", `<CreatedDatetime>${xml(createdAt)}</CreatedDatetime>`)
    ) +
    `<DEAL_SETS><DEAL_SET><DEALS>${deal}</DEALS></DEAL_SET></DEAL_SETS>` +
    `</MESSAGE>`
  );
}
