/**
 * "Digging Deep" discovery questions, extracted from the training decks.
 * Plain reference for the pop-out — grouped by module → area → scenario.
 */
export interface Scenario {
  title: string;
  why: string;
  questions: string[];
}
export interface Area {
  area: string;
  scenarios: Scenario[];
}
export interface Deck {
  key: string;
  label: string;
  areas: Area[];
}

export const trainingDecks: Deck[] = [
  {
    key: "goals",
    label: "Goals & Income",
    areas: [
      {
        area: "Goals",
        scenarios: [
          {
            title: "Lower the Monthly Payment",
            why: "“Lower my payment” is a surface answer — find whether it’s a fixed budget, flexibility, or a life change.",
            questions: [
              "What would having a lower payment actually change for you day-to-day?",
              "Is this more about the monthly savings, or is there something specific the difference would go toward?",
              "Are you on a fixed budget right now, or is this more about freeing up flexibility?",
              "Have you had any changes to your income or expenses recently?",
              "How long are you planning to stay in this home — long-term, or possibly selling in a few years?"
            ]
          },
          {
            title: "Cash Out & Debt Consolidation",
            why: "Cash-out goals usually have a specific purpose. Knowing the use of funds lets you size the loan and present the right product.",
            questions: [
              "What would the cash be used for — home improvements, debt payoff, an emergency fund?",
              "How much debt are we talking about — do you have a rough total in mind?",
              "If we could consolidate that debt and lower your overall payment, would that feel like a win?",
              "Do you have a specific amount you need to pull out, or are you open to exploring what makes sense?",
              "What’s driving the timing — is there something coming up that prompted this?"
            ]
          },
          {
            title: "PMI Removal & Term Change",
            why: "Borrowers focused on PMI or term are often equity-aware and engaged. Confirm the value picture and expand the goal.",
            questions: [
              "Do you know roughly what your home is worth today compared to when you bought it?",
              "Have you made any improvements that might have increased the value?",
              "What made you start thinking about PMI removal now — did you notice it on your statement?",
              "If we could remove the PMI and keep your payment similar, or even lower it, would that interest you?",
              "Are you also open to talking about shortening the term if the numbers made sense?"
            ]
          },
          {
            title: "Still Exploring",
            why: "“Just exploring” usually hides a trigger they haven’t put into words yet. Your job is to surface it.",
            questions: [
              "What made you decide to look into your options now — was there something specific that prompted it?",
              "Is there a financial goal you’ve had on the back burner that this might help with?",
              "When you think about your mortgage, what’s the one thing you’d change if you could?",
              "Are you more focused on reducing your monthly cost, accessing some equity, or both?",
              "What would the ideal outcome look like if everything went perfectly?"
            ]
          }
        ]
      },
      {
        area: "Income",
        scenarios: [
          {
            title: "Salaried / W-2 Employee",
            why: "The simplest income to document. Confirm tenure, the makeup of the pay, and anything on the horizon that could shift qualification.",
            questions: [
              "How long have you been with your current employer?",
              "Is your income base salary, or does it include any bonuses or overtime?",
              "Has your income changed recently — a raise, a reduction, or a change in hours?",
              "How secure do you feel in your position right now?",
              "Are you planning to stay in this role, or are there any upcoming changes?"
            ]
          },
          {
            title: "Hourly / Commission",
            why: "Variable income is qualified on a two-year average. Probe consistency, recent trend, and how the pay is actually structured.",
            questions: [
              "Would you say your income has been consistent over the last two years, or has it fluctuated?",
              "Do you work overtime regularly, and do you expect that to continue?",
              "How does your commission structure work — tied to deals, hours, or performance?",
              "Has your income gone up or down recently compared to prior years?",
              "Do you have pay stubs and W-2s from the last two years handy?"
            ]
          },
          {
            title: "Self-Employed / Business Owner",
            why: "Qualified from tax returns and business documentation. Understanding the business helps you explain how the income calculation works.",
            questions: [
              "How long have you owned your business?",
              "How has the business performed over the last 12–24 months?",
              "How do you typically pay yourself — salary, draw, or distributions?",
              "Are your business and personal finances kept completely separate?",
              "Do you expect this year’s return to look similar, higher, or lower than last year?",
              "What’s your busiest season — is income spread out or concentrated in certain months?"
            ]
          },
          {
            title: "Rental, VA & Support Income",
            why: "Secondary income can strengthen a file when it’s properly documented and likely to continue.",
            questions: [
              "Is the rental income on a lease agreement, and are you reporting it on your taxes?",
              "Is the VA or disability income expected to continue long-term?",
              "Have you been receiving the child support consistently — and for how long?",
              "Is documentation available: court orders, tax returns showing rental income, a VA award letter?",
              "Do you have any upcoming changes to this income source?"
            ]
          }
        ]
      }
    ]
  },
  {
    key: "assets",
    label: "Assets & Property",
    areas: [
      {
        area: "Assets",
        scenarios: [
          {
            title: "Financially Stable",
            why: "Stable borrowers qualify easily, but the file still needs full asset documentation. Ask about retirement, lump sums, and the cushion.",
            questions: [
              "Where do you primarily bank — do you keep accounts in one place or spread out?",
              "Do you have a savings cushion you like to maintain — an amount you’d rather not drop below?",
              "Are there retirement or investment accounts we should be aware of for reserves?",
              "Any upcoming bonuses, tax refunds, or lump sums we should factor in?",
              "Would you rather keep as much cash as possible after closing, or are you comfortable using most of it?"
            ]
          },
          {
            title: "Feeling Stretched",
            why: "Cash-tight borrowers often need creative options — gift funds, down-payment assistance, seller credits, or lender-paid comp.",
            questions: [
              "When you say things have been tight — is that recent, or has it been building for a while?",
              "Do you have access to any gift funds or family help for the down payment?",
              "Are there retirement accounts we could count for reserves, even if you’d rather not touch them?",
              "Do you have any income changes coming up — a raise, a new job, or side income starting?",
              "Would rolling costs into the loan, or using lender credits to offset them, be helpful?"
            ]
          },
          {
            title: "Retirement & Investments",
            why: "Investment accounts can count toward reserves, but they need context. Learn what the borrower will use versus preserve.",
            questions: [
              "Do you have a 401(k), IRA, or investment accounts we could count for reserves?",
              "Are you fully vested, or is some of it employer-matched and not yet accessible?",
              "Are you comfortable with those funds being counted on paper, or would you rather not list them?",
              "Would you consider liquidating any for the down payment, or do you want to leave them untouched?",
              "Do you hold any stocks or mutual funds in a taxable brokerage account?"
            ]
          },
          {
            title: "Incoming Funds",
            why: "Incoming funds must be documented, sourced, and seasoned before they can be used. Establish what’s coming, when, and where from.",
            questions: [
              "When are you expecting that bonus or deposit — and roughly how much are we talking?",
              "Is it already in your account, or is it still coming in?",
              "For gift funds: is this from a family member, and would they sign a gift letter?",
              "Are you expecting a tax refund that might help with closing costs?",
              "Would you be comfortable timing the application to line up with those funds hitting your account?"
            ]
          }
        ]
      },
      {
        area: "Property",
        scenarios: [
          {
            title: "Long-Term Home",
            why: "Borrowers staying 5+ years benefit most from rate reductions, PMI removal, and equity moves. The math favors paying points upfront.",
            questions: [
              "How long have you owned the home, and what’s changed since you bought it?",
              "Have you done any improvements or renovations that might have increased the value?",
              "Do you have a rough sense of what it’s worth today?",
              "With a long-term horizon, would a slightly higher upfront cost be worth a meaningfully lower rate?",
              "Is the goal to lower the payment, shorten the term, or pull some equity out?"
            ]
          },
          {
            title: "May Move Soon",
            why: "If they may move in 1–3 years, they need to recoup costs quickly. Lender-paid comp or a no-cost refinance often beats paying points.",
            questions: [
              "What’s your rough timeline — are we talking 1–2 years or 3–5 years?",
              "Is there a reason for the potential move — a new job, family, or upsizing?",
              "If the lender covered most closing costs through the rate, would that change the math for you?",
              "Have you thought about renting the home instead of selling if you move?",
              "Is the main goal to reduce monthly costs now, even if you might sell before fully recouping?"
            ]
          },
          {
            title: "Rental / Investment",
            why: "Investment properties carry different LTV limits, higher rates, and rental-income documentation requirements.",
            questions: [
              "Is this currently rented, and do you have a lease agreement in place?",
              "Are you reporting the rental income on your tax returns?",
              "What’s the monthly rent versus the mortgage payment — is it cash-flowing positively?",
              "Is this the only investment property, or do you have others we should be aware of?",
              "Are you looking to pull cash out, lower the rate, or both?"
            ]
          },
          {
            title: "Value Unknown",
            why: "Help the borrower ballpark value before getting too far in. A quick market check or appraisal confirms whether the deal pencils out.",
            questions: [
              "Do you know what similar homes in your neighborhood have been selling for lately?",
              "Have you done any major updates since you bought it — kitchens, baths, additions?",
              "What did you pay originally, and do you think it’s gone up or down since then?",
              "Have any neighbors sold recently that gave you a ballpark?",
              "Would it help if I pulled recent sales data for your area to give us a starting point?"
            ]
          }
        ]
      }
    ]
  }
];

/** Lightweight list for launcher buttons (key + label). */
export const decks = trainingDecks.map((d) => ({ key: d.key, label: d.label }));
