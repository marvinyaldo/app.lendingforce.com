import type { CallData } from "@lf/types";
import { num, xml } from "./escape.js";

export function toInternalXML(data: CallData): string {
  return (
    `<?xml version="1.0"?>` +
    `<LENDING_FORCE_CALL_APPLICATION>` +
    `<BORROWER>` +
    `<FULL_NAME>${xml(data.borrowerFullName)}</FULL_NAME>` +
    `<PHONE>${xml(data.preferredPhone)}</PHONE>` +
    `<EMAIL>${xml(data.email)}</EMAIL>` +
    `</BORROWER>` +
    `<GOALS>` +
    `<PRIMARY_GOAL>${xml(data.primaryGoal)}</PRIMARY_GOAL>` +
    `<FINANCIAL_GOAL>${xml(data.financialGoal)}</FINANCIAL_GOAL>` +
    `<EMOTIONAL_GOAL>${xml(data.emotionalGoal)}</EMOTIONAL_GOAL>` +
    `</GOALS>` +
    `<PROPERTY>` +
    `<ADDRESS>${xml(data.propertyAddress)}</ADDRESS>` +
    `<OCCUPANCY>${xml(data.occupancy)}</OCCUPANCY>` +
    `<ESTIMATED_VALUE>${num(data.estimatedValue)}</ESTIMATED_VALUE>` +
    `</PROPERTY>` +
    `<LOAN_PRESENTATION>` +
    `<PRODUCT_TYPE>${xml(data.productType)}</PRODUCT_TYPE>` +
    `<LOAN_AMOUNT>${num(data.loanAmount)}</LOAN_AMOUNT>` +
    `<INTEREST_RATE>${num(data.interestRate)}</INTEREST_RATE>` +
    `<NEW_PAYMENT>${num(data.newPayment)}</NEW_PAYMENT>` +
    `</LOAN_PRESENTATION>` +
    `</LENDING_FORCE_CALL_APPLICATION>`
  );
}
