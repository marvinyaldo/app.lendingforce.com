import type { CallData } from "@lf/types";
import { num, xml } from "./escape.js";

/**
 * MISMO-style XML export. This is a prototype mapping — validate against the
 * destination LOS/POS before production use.
 */
export function toMISMO(data: CallData): string {
  return (
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<MESSAGE MISMOReferenceModelIdentifier="3.4.0" xmlns="http://www.mismo.org/residential/2009/schemas">` +
    `<DEAL_SETS><DEAL_SET><DEALS><DEAL>` +
    `<PARTIES><PARTY>` +
    `<INDIVIDUAL><NAME><FullName>${xml(data.borrowerFullName)}</FullName></NAME></INDIVIDUAL>` +
    `<ROLES><ROLE><ROLE_DETAIL><PartyRoleType>Borrower</PartyRoleType></ROLE_DETAIL></ROLE></ROLES>` +
    `</PARTY></PARTIES>` +
    `<LOANS><LOAN>` +
    `<LOAN_DETAIL>` +
    `<LoanPurposeType>${xml(data.loanPurpose)}</LoanPurposeType>` +
    `<NoteAmount>${num(data.loanAmount)}</NoteAmount>` +
    `</LOAN_DETAIL>` +
    `<TERMS_OF_LOAN>` +
    `<BaseLoanAmount>${num(data.loanAmount)}</BaseLoanAmount>` +
    `<MortgageType>${xml(data.productType)}</MortgageType>` +
    `<NoteRatePercent>${num(data.interestRate)}</NoteRatePercent>` +
    `</TERMS_OF_LOAN>` +
    `<PROPERTY>` +
    `<ADDRESS><AddressLineText>${xml(data.propertyAddress)}</AddressLineText></ADDRESS>` +
    `<PROPERTY_DETAIL>` +
    `<PropertyEstimatedValueAmount>${num(data.estimatedValue)}</PropertyEstimatedValueAmount>` +
    `<PropertyUsageType>${xml(data.occupancy)}</PropertyUsageType>` +
    `</PROPERTY_DETAIL>` +
    `</PROPERTY>` +
    `</LOAN></LOANS>` +
    `</DEAL></DEALS></DEAL_SET></DEAL_SETS>` +
    `<EXTENSION><OTHER><LENDING_FORCE_CALL_CAPTURE>` +
    `<PrimaryGoal>${xml(data.primaryGoal)}</PrimaryGoal>` +
    `<FinancialGoal>${xml(data.financialGoal)}</FinancialGoal>` +
    `<EmotionalGoal>${xml(data.emotionalGoal)}</EmotionalGoal>` +
    `</LENDING_FORCE_CALL_CAPTURE></OTHER></EXTENSION>` +
    `</MESSAGE>`
  );
}
