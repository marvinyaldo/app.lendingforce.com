import type { Flow } from "@lf/types";

export const flow: Flow = {
  intro: [
    {
      title: "Open the call",
      script:
        "Hello {{borrowerFirstName}}, this is {{loName}} with Lending Force.\n\n" +
        "I know your time is valuable, so I\u2019ll keep this direct. We received your information and wanted to connect to take a fresh look at your mortgage options.\n\n" +
        "The goal today is simple: I\u2019ll ask a few questions, understand what you\u2019re trying to accomplish, and see whether there is a real financial benefit. If there is, I\u2019ll make the next steps easy. If there is not, I\u2019ll tell you that too. Fair enough?",
      fields: [
        ["loName", "LO Name"],
        ["borrowerFirstName", "Borrower First Name"],
        ["borrowerFullName", "Borrower Full Name"],
        ["preferredPhone", "Preferred Phone"]
      ],
      routes: [
        ["Client agrees", "brand"],
        ["Not interested", "rebuttal:notInterested"],
        ["Busy", "rebuttal:busy"],
        ["Send info", "rebuttal:sendInfo"],
        ["How'd you get my info?", "rebuttal:howGotInfo"],
        ["That was an old inquiry", "rebuttal:oldInquiry"]
      ]
    },
    {
      title: "Confirm contact information",
      script:
        "Perfect. Before I go too far, let me make sure I have the best contact information for you.\n\n" +
        "Is this the best phone number to reach you? And do you prefer calls, texts, or email?",
      fields: [
        ["email", "Email"],
        ["preferredContact", "Preferred Contact Method", "select", "Phone|Text|Email"]
      ],
      routes: [["Continue", "brand"]]
    }
  ],
  brand: [
    {
      title: "Personal brand section",
      script:
        "PERSONAL BRAND SECTION\n\nUse your own language here.\n\n" +
        "Rep positioning statement: {{brandPositioning}}\n\n" +
        "Why clients choose to work with me: {{brandWhy}}\n\n" +
        "Proof or credibility: {{brandProof}}\n\n" +
        "Transition: The next steps are easy. I\u2019m going to ask a few questions so I can understand what matters most, then we\u2019ll decide together if there is a solution worth pursuing.",
      coach:
        "This stays blank/customizable so each LO can personalize it without changing the Lending Force call structure. Don't have one yet? Tap “Use sample brand” to drop in a ready-made version, then edit to taste. Your brand is saved on this device and won't be wiped when you clear a call.",
      fields: [
        ["brandPositioning", "Rep Positioning Statement", "textarea"],
        ["brandWhy", "Why Clients Choose Me", "textarea"],
        ["brandProof", "Proof / Credibility", "textarea"]
      ],
      routes: [
        ["Use sample brand", "presetBrand"],
        ["Move to goals", "goals"]
      ]
    }
  ],
  goals: [
    {
      title: "Identify the main goal",
      script:
        "Most clients I speak with are usually focused on one of a few things right now: lowering monthly expenses, consolidating debt, accessing funds for home improvement, or positioning themselves better financially.\n\n" +
        "Which one of those is closest to what you\u2019re trying to accomplish?",
      coach: "Let the client choose the route. Do not over-explain yet.",
      fields: [["primaryGoal", "Primary Goal"]],
      routes: [
        ["Lower payment", "set:primaryGoal=Lower payment;jump:1"],
        ["Debt consolidation", "set:primaryGoal=Debt consolidation;jump:2"],
        ["Cash out", "set:primaryGoal=Cash out;jump:3"],
        ["Home improvement", "set:primaryGoal=Home improvement;jump:4"],
        ["Purchase", "set:primaryGoal=Purchase;jump:5"],
        ["Not sure", "jump:6"]
      ]
    },
    {
      title: "Lower payment route",
      script:
        "That makes sense. When you say lower the payment, are you trying to create breathing room month to month, offset other rising expenses, or just make the mortgage feel more comfortable?",
      fields: [
        ["financialGoal", "Financial Goal", "textarea"],
        ["goalTimeline", "Timeline"]
      ],
      routes: [
        ["Client explains", "jump:7"],
        ["Mentions debt too", "set:primaryGoal=Lower payment + debt;jump:2"]
      ]
    },
    {
      title: "Debt consolidation route",
      script:
        "Got it. When you think about consolidating debt, is the bigger issue the monthly payment, the interest rate, the balances not moving, or just wanting everything simplified?",
      fields: [
        ["financialGoal", "Financial Goal", "textarea"],
        ["debtPain", "Debt Pain Point", "textarea"]
      ],
      routes: [
        ["Payment pressure", "set:debtDriver=Payment pressure;jump:7"],
        ["High interest", "set:debtDriver=High interest;jump:7"],
        ["Simplify budget", "set:debtDriver=Simplify budget;jump:7"]
      ]
    },
    {
      title: "Cash-out route",
      script:
        "That may be possible. What are you looking to use the funds for, and how much would actually solve the problem without over-borrowing?",
      fields: [
        ["cashOutPurpose", "Cash-Out Purpose", "textarea"],
        ["cashNeeded", "Cash Needed"]
      ],
      routes: [["Continue", "jump:7"]]
    },
    {
      title: "Home improvement route",
      script:
        "Tell me about the project. Is this something you need to do, something you want to do, or something that could improve the home\u2019s value?",
      fields: [
        ["renovationPlans", "Renovation Plans", "textarea"],
        ["cashNeeded", "Estimated Project Cost"]
      ],
      routes: [["Continue", "jump:7"]]
    },
    {
      title: "Purchase route",
      script:
        "Perfect. Are you already under contract, actively shopping, or just trying to understand what you can qualify for before you move forward?",
      fields: [
        ["purchaseStage", "Purchase Stage"],
        ["purchaseBudget", "Target Purchase Price"]
      ],
      routes: [
        ["Under contract", "set:purchaseStage=Under contract;next:property"],
        ["Shopping", "set:purchaseStage=Shopping;next:property"],
        ["Pre-approval", "set:purchaseStage=Pre-approval;next:property"]
      ]
    },
    {
      title: "Client is not sure",
      script:
        "No problem. Let\u2019s narrow it down.\n\n" +
        "If we could improve one thing for you financially, would you rather lower the monthly obligation, free up cash, clean up debt, or prepare for a purchase?",
      routes: [
        ["Lower obligation", "set:primaryGoal=Lower payment;jump:1"],
        ["Free up cash", "set:primaryGoal=Cash out;jump:3"],
        ["Clean up debt", "set:primaryGoal=Debt consolidation;jump:2"],
        ["Prepare purchase", "set:primaryGoal=Purchase;jump:5"]
      ]
    },
    {
      title: "Dig deeper emotionally",
      script:
        "If we solved that the right way, what would that do for you financially?\n\n" +
        "And outside of the numbers, what would that change for you personally?",
      coach: "Capture the client\u2019s exact words. This becomes the anchor in the presentation.",
      fields: [
        ["financialGoal", "Financial Goal", "textarea"],
        ["emotionalGoal", "Emotional Goal", "textarea"]
      ],
      routes: [["Recap goal", "jump:8"]]
    },
    {
      title: "Recap and gain agreement",
      script:
        "Let me make sure I have this right. Financially, you want {{financialGoal}}. Personally, this matters because {{emotionalGoal}}.\n\n" +
        "Did I miss anything?",
      fields: [["goalRecap", "Goal Recap", "textarea"]],
      routes: [
        ["Client agrees", "property"],
        ["Client adds more", "jump:7"]
      ]
    }
  ],
  property: [
    {
      title: "Confirm property and occupancy",
      script:
        "Thank you for bringing me up to speed. Now that I understand the goal, I want to understand the property.\n\n" +
        "Is {{propertyAddress}} your primary residence?",
      fields: [
        ["propertyAddress", "Property Address"],
        ["occupancy", "Occupancy", "select", "Primary Residence|Second Home|Investment Property"]
      ],
      routes: [
        ["Primary", "set:occupancy=Primary Residence;jump:1"],
        ["Second home", "set:occupancy=Second Home;jump:1"],
        ["Investment", "set:occupancy=Investment Property;jump:1"]
      ]
    },
    {
      title: "Value and equity",
      script:
        "When did you purchase the home, and what do you believe it is worth in today\u2019s market?\n\n" +
        "What makes you feel that value is accurate?",
      fields: [
        ["purchaseDate", "Purchase Date"],
        ["estimatedValue", "Estimated Market Value"],
        ["valueReason", "Why They Believe That Value", "textarea"]
      ],
      routes: [["Continue", "jump:2"]]
    },
    {
      title: "Home plans",
      script:
        "Any recent renovations, upgrades, or planned improvements?\n\n" +
        "And do you have any plans to move in the next few years?",
      fields: [
        ["propertyNotes", "Renovations / Property Notes", "textarea"],
        ["movePlans", "Plans to Move"]
      ],
      routes: [
        ["Continue", "credit"],
        ["Condition concerns", "propertyConditions"]
      ]
    }
  ],
  credit: [
    {
      title: "Credit setup",
      script:
        "Our process is designed with you in mind \u2014 your credit score is just as important to us as it is to you. We\u2019re going to pull a soft copy of your credit report, which means there\u2019s no impact at all on your score.\n\n" +
        "Go ahead with your date of birth and Social when you\u2019re ready.",
      coach:
        "Even though this is a soft pull, still collect the borrower's full SSN and DOB here — it is required to run credit and carries into the 1003. Follow company-approved credit authorization and privacy process.",
      fields: [
        ["borrowerDob", "DOB"],
        ["borrowerSsn", "SSN (full)"],
        ["estimatedCreditScore", "Estimated Credit Score"],
        ["creditEvents", "Credit Events", "textarea"]
      ],
      routes: [
        ["Client provided info", "set:creditPulled=yes;next:liabilities"],
        ["Client objected", "jump:1"]
      ]
    },
    {
      title: "Client objected \u2014 first rebuttal",
      script:
        "I get that. It\u2019s just a soft credit pull, so it doesn\u2019t even show up as an inquiry or affect your score in any way. It just lets us see your credit mix and match you to the right program \u2014 we can\u2019t see any private info or accounts.\n\n" +
        "Go ahead with your date of birth and Social when you\u2019re ready.",
      fields: [
        ["borrowerDob", "DOB"],
        ["borrowerSsn", "SSN"]
      ],
      routes: [
        ["Client provided info", "set:creditPulled=yes;next:liabilities"],
        ["Client objected again", "set:creditDeferred=yes;jump:2"]
      ]
    },
    {
      title: "Client objected again \u2014 defer credit",
      script:
        "No problem at all \u2014 let\u2019s just run through your income and assets first and then we\u2019ll circle back to credit in a minute. Sometimes it makes more sense once you see what range you\u2019re in.",
      coach:
        "The system will bring you back here to pull credit automatically once income is captured.",
      routes: [["Move to income", "next:income"]]
    },
    {
      title: "Circle back \u2014 pull credit now",
      script:
        "Now that we\u2019ve got your income and goals in place, let\u2019s go ahead and pull that soft copy. That way we can actually match you to the right programs instead of just guessing. It\u2019s still that soft credit check only, no impact whatsoever.\n\n" +
        "Go ahead with your date of birth and Social when you\u2019re ready.",
      fields: [
        ["borrowerDob", "DOB"],
        ["borrowerSsn", "SSN"]
      ],
      routes: [
        ["Client provided info", "set:creditPulled=yes;next:liabilities"],
        ["Still hesitant", "rebuttal:creditPull"]
      ]
    }
  ],
  liabilities: [
    {
      title: "Debt review setup",
      script:
        "Now I want to understand the debt picture. For each account, I\u2019m going to look at the balance, the payment, and the interest rate.\n\n" +
        "The goal is not just to pay things off. The goal is to see whether paying them off creates enough monthly benefit to make sense.",
      coach: "Ask what they actually pay, not just minimum payment.",
      fields: [
        ["liabilitySummary", "Liability Summary", "textarea"],
        ["totalDebtToPayoff", "Total Debt to Pay Off"],
        ["totalPaymentsToPayoff", "Total Monthly Payments"]
      ],
      routes: [
        ["Add outside expenses", "jump:1"],
        ["No debt to consolidate", "when:creditDeferred=yes?assets|income"]
      ]
    },
    {
      title: "Outside expenses",
      script:
        "Outside of what shows on credit, what else do you have monthly?\n\n" +
        "Things like auto insurance, utilities, school, sports, groceries, gas, subscriptions, family support, or anything else that affects the monthly budget.",
      fields: [["outsideExpenses", "Outside Monthly Expenses", "textarea"]],
      routes: [["Continue", "when:creditDeferred=yes?assets|income"]]
    }
  ],
  income: [
    {
      title: "Income type",
      script:
        "We\u2019ve discussed the monthly expenses. Now let\u2019s discuss the money coming in every month.\n\n" +
        "How are you compensated: hourly, salary, commission, self-employed, retirement, or another source?",
      fields: [
        ["employmentType", "Employment Type", "select", "Salary|Hourly|Commission|Self-Employed|Retired|Other"],
        ["employer", "Employer / Business"]
      ],
      routes: [
        ["Salary/hourly", "jump:1"],
        ["Commission", "jump:2"],
        ["Self-employed", "jump:3"],
        ["Retired", "jump:4"]
      ]
    },
    {
      title: "W2 income",
      script:
        "Who do you work for, how long have you been there, and how are you compensated?\n\n" +
        "What is your gross monthly income before deductions, and what is your take-home income after deductions?",
      fields: [
        ["hireDate", "Hire Date"],
        ["grossMonthlyIncome", "Gross Monthly Income"],
        ["netMonthlyIncome", "Net Monthly Income"]
      ],
      routes: [["Continue", "jump:5"]]
    },
    {
      title: "Commission income",
      script:
        "How long have you been receiving commission income, and is it consistent month to month or does it vary heavily?\n\n" +
        "Do you receive a base plus commission, or commission only?",
      fields: [
        ["commissionDetails", "Commission Details", "textarea"],
        ["grossMonthlyIncome", "Gross Monthly Income"]
      ],
      routes: [["Continue", "jump:5"]]
    },
    {
      title: "Self-employed income",
      script:
        "How long have you been self-employed, what type of business is it, and how do you pay yourself?\n\n" +
        "Do you file as sole proprietor, LLC, S-corp, partnership, or corporation?",
      fields: [
        ["selfEmploymentDetails", "Self-Employment Details", "textarea"],
        ["grossMonthlyIncome", "Estimated Gross Monthly Income"]
      ],
      routes: [["Continue", "jump:5"]]
    },
    {
      title: "Retirement income",
      script:
        "Congrats on retirement. What did you do before retiring, and what are your income sources now: Social Security, pension, retirement draws, disability, or something else?",
      fields: [
        ["retirementIncomeSources", "Retirement Income Sources", "textarea"],
        ["grossMonthlyIncome", "Gross Monthly Income"]
      ],
      routes: [["Continue", "jump:5"]]
    },
    {
      title: "Budget reality check",
      script:
        "Between your debt and other monthly expenses, you are spending roughly {{monthlyExpenseTotal}} per month. Your income is around {{grossMonthlyIncome}} gross and {{netMonthlyIncome}} take-home.\n\n" +
        "How much are you realistically able to put away at the end of the month?",
      fields: [
        ["monthlyExpenseTotal", "Monthly Expense Total"],
        ["monthlySavings", "Amount Put Away Monthly"]
      ],
      routes: [["Continue", "when:creditDeferred=yes?at:credit:3|assets"]]
    }
  ],
  assets: [
    {
      title: "Assets and reserves",
      script:
        "Assets typically strengthen your profile. With that in mind, how much do you have set aside?\n\n" +
        "Do you have a savings account, emergency fund, 401(k), IRA, retirement account, or other reserves?",
      fields: [
        ["checkingSavings", "Checking / Savings"],
        ["retirementAssets", "Retirement Assets"],
        ["totalAssets", "Total Assets / Reserves"]
      ],
      routes: [["Continue", "jump:1"]]
    },
    {
      title: "Nest egg positioning",
      script:
        "Do you have a nest egg set aside in the event of an emergency?\n\n" +
        "My goal is to make sure the option we recommend does not leave you uncomfortable after closing.",
      fields: [["assetNotes", "Asset Notes", "textarea"]],
      routes: [["Wrap up & foreshadow", "foreshadow"]]
    }
  ],
  foreshadow: [
    {
      title: "Foreshadow & trial close",
      script:
        "Thank you for speaking with me today. What I’m going to do next is put together some options for us to go over together.\n\n" +
        "To recap, your goals are {{financialGoal}} and {{emotionalGoal}} — correct?\n\n" +
        "If we can get those accomplished today, do you see any reason why you wouldn’t move forward?",
      coach:
        "This is the foreshadow / trial close at the end of the discovery call. Confirm the two goals in the client’s own words, then get the commitment before you go build options.",
      fields: [
        ["financialGoal", "Goal 1 (financial)", "textarea"],
        ["emotionalGoal", "Goal 2 (personal)", "textarea"]
      ],
      routes: [
        ["No reason — move forward", "jump:1"],
        ["They have a concern", "drawer"]
      ]
    },
    {
      title: "Set the callback",
      script:
        "Perfect. Give me {{prepTime}} and I’ll give you a call back at {{callbackTime}}.",
      coach:
        "Lock a specific time. This becomes the presentation appointment.",
      fields: [
        ["prepTime", "Prep Time Needed"],
        ["callbackTime", "Callback Time"]
      ],
      routes: [
        ["Present options now", "presentation"],
        ["End call — present on callback", "export"]
      ]
    }
  ],
  presentation: [
    {
      title: "Bring good news",
      script:
        "I have good news. I put together a solution that addresses what you told me was most important.\n\n" +
        "Before I show you the numbers, let\u2019s recap what you wanted to accomplish.",
      fields: [["goalRecapFinal", "Final Goal Recap", "textarea"]],
      routes: [
        ["Client agrees with recap", "jump:1"],
        ["Client corrects recap", "goals"]
      ]
    },
    {
      title: "Present solution",
      script:
        "Here is what we are going to do.\n\n" +
        "Product: {{productType}}\nLoan Amount: {{loanAmount}}\nRate: {{interestRate}}\nEstimated Payment: {{newPayment}}\n\n" +
        "The reason I chose this option is because {{productReason}}.\n\n" +
        "The financial benefit is {{financialBenefit}}.\n\n" +
        "The personal benefit is {{emotionalBenefit}}.",
      fields: [
        ["productType", "Product Type"],
        ["loanPurpose", "Loan Purpose", "select", "Purchase|Refinance|Cash-Out Refinance|HELOC"],
        ["loanAmount", "Loan Amount"],
        ["interestRate", "Interest Rate"],
        ["newPayment", "New Payment"],
        ["productReason", "Product Reason", "textarea"],
        ["financialBenefit", "Financial Benefit", "textarea"],
        ["emotionalBenefit", "Emotional Benefit", "textarea"]
      ],
      routes: [
        ["Client likes it", "jump:2"],
        ["Payment too high", "rebuttal:paymentHigh"],
        ["Needs to think", "rebuttal:thinkAboutIt"],
        ["Talk to spouse", "rebuttal:spouse"]
      ]
    },
    {
      title: "Soft close",
      script:
        "Based on everything we reviewed, this makes sense because it solves the reason you started this conversation in the first place.\n\n" +
        "The next step is simple. Would you prefer the appraisal during the week or on the weekend?",
      fields: [["appraisalPreference", "Appraisal Preference"]],
      routes: [
        ["Weekday", "set:appraisalPreference=Weekday;jump:3"],
        ["Weekend", "set:appraisalPreference=Weekend;jump:3"],
        ["Pushback", "drawer"]
      ]
    },
    {
      title: "Hard close / next docs",
      script:
        "Perfect. For the appraisal, you can use a debit or credit card. Which would you prefer?\n\n" +
        "In the meantime, I\u2019ll need your mortgage statement, homeowner\u2019s insurance, and income documents. Please work on those while I finalize the option.\n\n" +
        "While we\u2019re on the phone, let\u2019s go ahead and complete your application so we can get this moving.",
      fields: [
        ["paymentMethod", "Appraisal Payment Method"],
        ["docsNeeded", "Documents Needed", "textarea"],
        ["followUpTime", "Follow-Up Time"]
      ],
      routes: [["Complete the 1003 application", "application"]]
    }
  ],
  propertyConditions: [
    {
      title: "Property red flags",
      script:
        "I\u2019m going to ask a few quick property questions so we do not run into avoidable issues later.\n\n" +
        "Are there any known issues with the roof, foundation, water damage, electrical, HVAC, broken glass, peeling paint, missing handrails, or ongoing renovations?",
      fields: [["propertyConditionNotes", "Property Condition Notes", "textarea"]],
      routes: [
        ["No major concerns", "credit"],
        ["There are concerns", "jump:1"]
      ]
    },
    {
      title: "Condition concern details",
      script:
        "Tell me what is going on, when it started, and whether it has been repaired or still needs work.",
      fields: [["propertyConcernDetails", "Condition Concern Details", "textarea"]],
      routes: [["Back to the flow — pull credit", "credit"]]
    }
  ],
  declarations: [
    {
      title: "Declarations setup",
      script:
        "I\u2019m going to ask a few standard questions that help make sure the file is complete. If anything is a yes, just tell me and I\u2019ll document the details.",
      fields: [["declarationNotes", "Declaration Notes", "textarea"]],
      routes: [["Continue to export", "export"]]
    }
  ],
  application: [
    {
      title: "1003 \u2014 Borrower Information",
      script:
        "Perfect \u2014 since this makes sense for you, let\u2019s go ahead and get your application started so we can lock everything in. The good news is we already covered most of this on our call, so I\u2019ll just confirm the details as we go.\n\n" +
        "First, let me make sure I have your legal name exactly as it appears on your ID, along with your date of birth and Social.",
      coach:
        "This is the Uniform Residential Loan Application (URLA/1003), baked right into the call. Fields reuse the data collected earlier so you are confirming, not re-entering. Read it like a natural continuation of the close.",
      fields: [
        ["borrowerFirstName", "First Name"],
        ["borrowerMiddleName", "Middle Name"],
        ["borrowerLastName", "Last Name"],
        ["borrowerSuffix", "Suffix"],
        ["borrowerFullName", "Full Name (as on file)"],
        ["borrowerSsn", "Social Security Number"],
        ["borrowerDob", "Date of Birth"],
        ["borrowerCitizenship", "Citizenship", "select", "US Citizen|Permanent Resident|Non-Permanent Resident"],
        ["borrowerMaritalStatus", "Marital Status", "select", "Married|Separated|Unmarried"],
        ["borrowerDependentsCount", "Number of Dependents"],
        ["borrowerDependentsAges", "Dependents' Ages"],
        ["borrowerCellPhone", "Cell Phone"],
        ["borrowerHomePhone", "Home Phone"],
        ["borrowerWorkPhone", "Work Phone"],
        ["email", "Email"]
      ],
      routes: [["Continue", "jump:1"]]
    },
    {
      title: "1003 \u2014 Current Address & Housing",
      script:
        "Now, what\u2019s your current home address, and how long have you been there?\n\n" +
        "And is that a place you own or rent, and what\u2019s the monthly payment?",
      fields: [
        ["currentStreet", "Street Address"],
        ["currentUnit", "Unit #"],
        ["currentCity", "City"],
        ["currentState", "State"],
        ["currentZip", "ZIP"],
        ["currentCountry", "Country"],
        ["currentYears", "Years at Address"],
        ["currentMonths", "Months at Address"],
        ["currentHousingType", "Housing", "select", "Own|Rent|No primary housing expense"],
        ["currentHousingPayment", "Monthly Housing Payment"],
        ["mailingAddress", "Mailing Address (if different)", "textarea"]
      ],
      routes: [["Continue", "jump:2"]]
    },
    {
      title: "1003 \u2014 Co-Borrower (if any)",
      script:
        "Will anyone be on the loan with you \u2014 a spouse or a co-borrower?\n\n" +
        "If so, I\u2019ll grab their information the same way. If it\u2019s just you, we\u2019ll keep moving.",
      fields: [
        ["coBorrowerName", "Co-Borrower Full Name"],
        ["coBorrowerSsn", "Co-Borrower SSN"],
        ["coBorrowerDob", "Co-Borrower Date of Birth"],
        ["coBorrowerEmail", "Co-Borrower Email"],
        ["coBorrowerPhone", "Co-Borrower Phone"],
        ["coBorrowerMaritalStatus", "Co-Borrower Marital Status", "select", "Married|Separated|Unmarried"]
      ],
      routes: [
        ["Continue", "jump:3"],
        ["No co-borrower", "jump:3"]
      ]
    },
    {
      title: "1003 \u2014 Employment & Income",
      script:
        "Let\u2019s confirm your work and income. Who\u2019s your employer, what\u2019s your position, and how long have you been there?\n\n" +
        "Then we\u2019ll break down the monthly income \u2014 base pay, plus any overtime, bonus, or commission.",
      fields: [
        ["employer", "Employer / Business Name"],
        ["borrowerPosition", "Position / Title"],
        ["employmentType", "Employment Type", "select", "Salary|Hourly|Commission|Self-Employed|Retired|Other"],
        ["employerPhone", "Employer Phone"],
        ["employerStreet", "Employer Street"],
        ["employerCity", "Employer City"],
        ["employerState", "Employer State"],
        ["employerZip", "Employer ZIP"],
        ["hireDate", "Start Date"],
        ["borrowerYearsInLineOfWork", "Years in This Line of Work"],
        ["borrowerSelfEmployedShare", "Ownership Share (if self-employed) %"],
        ["grossMonthlyIncome", "Base Monthly Income"],
        ["incomeOvertime", "Overtime (monthly)"],
        ["incomeBonus", "Bonus (monthly)"],
        ["incomeCommission", "Commission (monthly)"],
        ["incomeMilitary", "Military Pay (monthly)"],
        ["incomeOther", "Other Employment Income (monthly)"],
        ["netMonthlyIncome", "Net / Take-Home Monthly"]
      ],
      routes: [["Continue", "jump:4"]]
    },
    {
      title: "1003 \u2014 Additional & Previous Income",
      script:
        "Do you have any other income we should count \u2014 things like rental income, Social Security, a pension, or a side business?\n\n" +
        "And if you\u2019ve been at your current job less than two years, tell me a little about the job before it.",
      fields: [
        ["otherIncomeSource", "Other Income Source"],
        ["otherIncomeAmount", "Other Income (monthly)"],
        ["previousEmployer", "Previous Employer"],
        ["previousPosition", "Previous Position"],
        ["previousEmploymentDates", "Previous Employment Dates"],
        ["previousMonthlyIncome", "Previous Monthly Income"]
      ],
      routes: [["Continue", "jump:5"]]
    },
    {
      title: "1003 \u2014 Assets",
      script:
        "Now let\u2019s document your accounts and reserves \u2014 checking, savings, and any retirement.\n\n" +
        "This actually strengthens your file, so we want to capture all of it. Where possible I\u2019ll note the bank and account number.",
      fields: [
        ["checkingBank", "Checking Institution"],
        ["checkingAccountNumber", "Checking Account #"],
        ["checkingSavings", "Checking Balance"],
        ["savingsBank", "Savings Institution"],
        ["savingsAccountNumber", "Savings Account #"],
        ["savingsBalance", "Savings Balance"],
        ["retirementInstitution", "Retirement Institution"],
        ["retirementAssets", "Retirement Balance"],
        ["otherAssetsDescription", "Other Assets (description)", "textarea"],
        ["otherAssetsValue", "Other Assets Value"],
        ["totalAssets", "Total Assets / Reserves"]
      ],
      routes: [["Continue", "jump:6"]]
    },
    {
      title: "1003 \u2014 Liabilities",
      script:
        "Let\u2019s get your monthly debts on paper \u2014 this is exactly what we reviewed earlier, so we\u2019re just formalizing it.\n\n" +
        "For each one, I\u2019ll note the creditor, the balance, and the monthly payment.",
      fields: [
        ["liability1Creditor", "Liability 1 \u2014 Creditor"],
        ["liability1Type", "Liability 1 \u2014 Type", "select", "Revolving|Installment|Mortgage|Lease|Other"],
        ["liability1Balance", "Liability 1 \u2014 Balance"],
        ["liability1Payment", "Liability 1 \u2014 Monthly Payment"],
        ["liability2Creditor", "Liability 2 \u2014 Creditor"],
        ["liability2Type", "Liability 2 \u2014 Type", "select", "Revolving|Installment|Mortgage|Lease|Other"],
        ["liability2Balance", "Liability 2 \u2014 Balance"],
        ["liability2Payment", "Liability 2 \u2014 Monthly Payment"],
        ["liability3Creditor", "Liability 3 \u2014 Creditor"],
        ["liability3Type", "Liability 3 \u2014 Type", "select", "Revolving|Installment|Mortgage|Lease|Other"],
        ["liability3Balance", "Liability 3 \u2014 Balance"],
        ["liability3Payment", "Liability 3 \u2014 Monthly Payment"],
        ["liabilitySummary", "Additional Liabilities", "textarea"],
        ["totalDebtToPayoff", "Total Debt to Pay Off"],
        ["totalPaymentsToPayoff", "Total Monthly Payments"]
      ],
      routes: [["Continue", "jump:7"]]
    },
    {
      title: "1003 \u2014 Real Estate Owned",
      script:
        "Do you own any other real estate besides this home?\n\n" +
        "If so, let\u2019s note the property, what it\u2019s worth, and whether there\u2019s a loan or rental income on it.",
      fields: [
        ["reoAddress", "REO Property Address", "textarea"],
        ["reoValue", "REO Market Value"],
        ["reoStatus", "REO Status", "select", "Retained|Sold|Pending Sale"],
        ["reoMortgageBalance", "REO Mortgage Balance"],
        ["reoMonthlyPayment", "REO Monthly Payment"],
        ["reoRentalIncome", "REO Gross Rental Income (monthly)"]
      ],
      routes: [["Continue", "jump:8"]]
    },
    {
      title: "1003 \u2014 Loan & Property",
      script:
        "Let\u2019s confirm the loan we put together and the details on the property itself, so everything on the application matches what we discussed.",
      fields: [
        ["loanPurpose", "Loan Purpose", "select", "Purchase|Refinance|Cash-Out Refinance|HELOC"],
        ["loanAmount", "Loan Amount"],
        ["interestRate", "Interest Rate"],
        ["loanTermMonths", "Loan Term (months)"],
        ["productType", "Product Type"],
        ["occupancy", "Occupancy", "select", "Primary Residence|Second Home|Investment Property"],
        ["propertyAddress", "Property Street"],
        ["propertyCity", "Property City"],
        ["propertyState", "Property State"],
        ["propertyZip", "Property ZIP"],
        ["propertyCounty", "Property County"],
        ["propertyUnits", "Number of Units"],
        ["propertyType", "Property Type", "select", "Single Family|Condominium|Townhouse|2-4 Units|Manufactured"],
        ["propertyYearBuilt", "Year Built"],
        ["estimatedValue", "Estimated / Appraised Value"],
        ["purchasePrice", "Purchase Price (if purchase)"],
        ["downPayment", "Down Payment"],
        ["newPayment", "Proposed Monthly Payment"],
        ["mixedUse", "Mixed-Use Property?", "select", "No|Yes"]
      ],
      routes: [["Continue", "jump:9"]]
    },
    {
      title: "1003 \u2014 Declarations",
      script:
        "Almost done \u2014 these are standard questions every application requires. I\u2019ll run through them quickly; just answer yes or no and I\u2019ll note anything that needs a detail.",
      fields: [
        ["declOccupyPrimary", "Will occupy as primary residence?", "select", "Yes|No"],
        ["declOwnershipInterest", "Ownership interest in property in last 3 years?", "select", "No|Yes"],
        ["declFamilyRelationship", "Family/business relationship with seller?", "select", "No|Yes"],
        ["declBorrowingMoney", "Borrowing undisclosed money for this loan?", "select", "No|Yes"],
        ["declOtherMortgage", "Applying for a mortgage on another property?", "select", "No|Yes"],
        ["declNewCredit", "Applying for new credit before closing?", "select", "No|Yes"],
        ["declSubjectToLien", "Property subject to a clean-energy (PACE) lien?", "select", "No|Yes"],
        ["declCoSigner", "Co-signer/guarantor on undisclosed debt?", "select", "No|Yes"],
        ["declOutstandingJudgments", "Any outstanding judgments?", "select", "No|Yes"],
        ["declDelinquentFederalDebt", "Delinquent/default on federal debt?", "select", "No|Yes"],
        ["declPartyToLawsuit", "Party to a lawsuit?", "select", "No|Yes"],
        ["declConveyedTitleInLieu", "Conveyed title in lieu of foreclosure (7 yrs)?", "select", "No|Yes"],
        ["declPreForeclosureShortSale", "Pre-foreclosure/short sale (7 yrs)?", "select", "No|Yes"],
        ["declPropertyForeclosed", "Property foreclosed (7 yrs)?", "select", "No|Yes"],
        ["declDeclaredBankruptcy", "Declared bankruptcy (7 yrs)?", "select", "No|Yes"],
        ["declBankruptcyType", "Bankruptcy Type (if yes)", "select", "Chapter 7|Chapter 11|Chapter 12|Chapter 13"]
      ],
      routes: [["Continue", "jump:10"]]
    },
    {
      title: "1003 \u2014 Demographic Information (HMDA)",
      script:
        "The last section is the government\u2019s demographic information \u2014 it\u2019s voluntary and used to make sure lenders treat everyone fairly. You\u2019re not required to answer, but I do have to ask.\n\n" +
        "For ethnicity, race, and sex, tell me what you\u2019d like recorded, or that you\u2019d prefer not to provide it.",
      coach:
        "URLA Section 8 (HMDA). Purely voluntary \u2014 if the borrower declines, select 'I do not wish to provide.' Race allows more than one; note any additional selections in the detail box.",
      fields: [
        ["demoEthnicity", "Ethnicity", "select", "Hispanic or Latino|Not Hispanic or Latino|I do not wish to provide"],
        ["demoEthnicityDetail", "Ethnicity Detail (Mexican, Puerto Rican, Cuban, other)"],
        ["demoRace", "Race", "select", "American Indian or Alaska Native|Asian|Black or African American|Native Hawaiian or Other Pacific Islander|White|I do not wish to provide"],
        ["demoRaceDetail", "Race Detail / Additional Selections", "textarea"],
        ["demoSex", "Sex", "select", "Female|Male|I do not wish to provide"],
        ["demoCollectionMethod", "How Collected", "select", "Face-to-Face|Telephone|Fax or Mail|Email or Internet"]
      ],
      routes: [["Continue", "jump:11"]]
    },
    {
      title: "1003 \u2014 Loan Originator",
      script:
        "That completes your application \u2014 great job, this is a big step. Let me confirm my information as your loan officer, and then we\u2019ll get everything submitted and moving.",
      fields: [
        ["loName", "Loan Originator Name"],
        ["loNmls", "LO NMLS ID"],
        ["loOrganization", "Organization Name"],
        ["loOrgNmls", "Organization NMLS ID"],
        ["loPhone", "LO Phone"],
        ["loEmail", "LO Email"],
        ["loStateLicense", "LO State License #"]
      ],
      routes: [["Save & go to export", "export"]]
    }
  ]
};
