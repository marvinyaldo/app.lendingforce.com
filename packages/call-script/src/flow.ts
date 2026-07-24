import type { Flow } from "@lf/types";

export const flow: Flow = {
  intro: [
    {
      title: "Outbound or inbound?",
      script: "",
      routes: [
        ["Outbound", "set:callDirection=Outbound;jump:1"],
        ["Inbound", "set:callDirection=Inbound Callback;jump:2"],
        ["Transfer", "set:callDirection=Transfer;jump:3"]
      ]
    },
    {
      title: "Outbound opener",
      script:
        "Hello {{borrowerFirstName}}, this is {{loName}} with Lending Force.\n\n" +
        "I know your time is valuable, so I\u2019ll keep this direct. We received your information and wanted to connect to take a fresh look at your mortgage options.\n\n" +
        "The goal today is simple: I\u2019ll ask a few questions, understand what you\u2019re trying to accomplish, and see whether there is a real financial benefit. If there is, I\u2019ll make the next steps easy. If there is not, I\u2019ll tell you that too. Fair enough?",
      variants: [
        {
          label: "Option 1",
          script:
            "Hello {{borrowerFirstName}}, this is {{loName}} with Lending Force.\n\n" +
            "I know your time is valuable, so I\u2019ll keep this direct. We received your information and wanted to connect to take a fresh look at your mortgage options.\n\n" +
            "The goal today is simple: I\u2019ll ask a few questions, understand what you\u2019re trying to accomplish, and see whether there is a real financial benefit. If there is, I\u2019ll make the next steps easy. If there is not, I\u2019ll tell you that too. Fair enough?"
        },
        {
          label: "Option 2",
          script:
            "Hello {{borrowerFirstName}}, this is {{loName}} with Lending Force.\n\n" +
            "I\u2019m reaching out because we received your information regarding your mortgage options. I\u2019d like to learn a little more about your current situation and what you would ideally like to improve.\n\n" +
            "What would benefit you most \u2014 lowering your payment or taking cash out?"
        }
      ],
      coach:
        "Use this opener when you are calling the lead. Two openers to choose from \u2014 use the Option 1 / Option 2 tabs. On agreement, jump to the shared \u201cConfirm contact information\u201d step \u2014 same one the inbound path lands on.",
      fields: [
        ["loName", "LO Name"],
        ["borrowerFirstName", "Borrower First Name"],
        ["borrowerMiddleName", "Middle Name"],
        ["borrowerLastName", "Borrower Last Name"],
        ["borrowerSuffix", "Suffix"],
        ["borrowerFullName", "Borrower Full Name"],
        ["preferredPhone", "Preferred Phone"]
      ],
      routes: [
        ["Client agrees", "jump:5"],
        ["Not interested", "rebuttal:notInterested"],
        ["Busy", "rebuttal:busy"],
        ["Send info", "rebuttal:sendInfo"],
        ["How'd you get my info?", "rebuttal:howGotInfo"],
        ["That was an old inquiry", "rebuttal:oldInquiry"]
      ]
    },
    {
      title: "Inbound refinance callback opener",
      script:
        "Thank you for calling Lending Force, this is {{loName}}, a licensed loan officer. Who do I have the pleasure of speaking with?\n\n" +
        "\u2014 Borrower provides name \u2014\n\n" +
        "Hi, {{borrowerFirstName}}. It looks like you\u2019re returning a call from our mortgage team \u2014 is that correct?\n\n" +
        "\u2022 If YES and you can locate the record:\n" +
        "  \u201cPerfect. Let me pull up the information associated with your number so I can see what prompted the call.\u201d\n" +
        "  \u201cI found it. It looks like we were reaching out regarding potential refinance options for your property at {{propertyAddress}}, {{propertyCity}}. Is that the property you\u2019re calling about?\u201d\n\n" +
        "\u2022 If NO record is available:\n" +
        "  \u201cNo problem. What phone number or property address would the original call have been associated with?\u201d\n\n" +
        "Great \u2014 while I have you, let me confirm a few basics so I can pull the right file and take a fresh look at your options.",
      coach:
        "Use this opener when the borrower is calling us back from a prior outreach. Try to locate the record first \u2014 if you cannot, ask for the phone number or property address so you can look them up. Then continue to the same \u201cConfirm contact information\u201d step the outbound path lands on so both paths converge on the same 1003.",
      fields: [
        ["loName", "LO Name"],
        ["borrowerFirstName", "Borrower First Name"],
        ["borrowerMiddleName", "Middle Name"],
        ["borrowerLastName", "Borrower Last Name"],
        ["borrowerSuffix", "Suffix"],
        ["borrowerFullName", "Borrower Full Name"],
        ["preferredPhone", "Preferred Phone"],
        ["callbackLookupPhone", "Phone Number on Original Call"],
        ["propertyAddress", "Property Street"],
        ["propertyCity", "Property City"],
        ["propertyState", "Property State"],
        ["propertyZip", "Property ZIP"],
        ["callbackRecordFound", "Record Found?", "select", "Yes|No"]
      ],
      routes: [
        ["Confirmed the property \u2014 continue", "jump:5"],
        ["Record not found \u2014 collected info, continue", "jump:5"],
        ["Not the right person / wrong number", "rebuttal:oldInquiry"],
        ["Busy \u2014 asked us to call back", "rebuttal:busy"]
      ]
    },
    {
      title: "Transfer opener (warm transfer)",
      script:
        "[Warm transfer — the telemarketer is bringing the client onto the line.]\n\n" +
        "You: “{{loName}} speaking.”\n" +
        "Telemarketer: “Hi {{loName}}, I have {{borrowerFirstName}} on the line.”\n\n" +
        "You: “Hi {{borrowerFirstName}}. Again, my name is {{loName}}, and I’m a licensed loan officer here with Lending Force. I hope you’re doing well today. I’ll have you fill me in on what you’re looking to accomplish — are you primarily looking to take cash out, lower your monthly payment, or a little bit of both?”",
      variants: [
        {
          label: "Standard",
          script:
            "You: “{{loName}} speaking.”\n" +
            "Telemarketer: “Hi {{loName}}, I have {{borrowerFirstName}} on the line.”\n\n" +
            "You: “Hi {{borrowerFirstName}}. Again, my name is {{loName}}, and I’m a licensed loan officer here with Lending Force. I hope you’re doing well today. I’ll have you fill me in on what you’re looking to accomplish — are you primarily looking to take cash out, lower your monthly payment, or a little bit of both?”"
        },
        {
          label: "Conversational",
          script:
            "You: “{{loName}} speaking.”\n" +
            "Telemarketer: “Hi {{loName}}, I have {{borrowerFirstName}} on the line.”\n\n" +
            "You: “Hi {{borrowerFirstName}}. Again, this is {{loName}}. I’m a licensed loan officer here with Lending Force. I hope you’re doing well today. Just fill me in on what you’re hoping to accomplish — are you looking to access some cash, lower your monthly payments, or possibly both?”"
        }
      ],
      coach:
        "Warm transfer from the telemarketer. If they already handed you the goal, tap “Client stated a goal” to acknowledge it and dig in. If not, ask the open question and tap “No goal — I asked.”",
      fields: [
        ["loName", "LO Name"],
        ["borrowerFirstName", "Borrower First Name"],
        ["borrowerLastName", "Borrower Last Name"],
        ["borrowerFullName", "Borrower Full Name"],
        ["preferredPhone", "Preferred Phone"],
        ["primaryGoal", "Stated Goal (if any)", "select", "Cash out|Lower payment|Both|Not sure"]
      ],
      routes: [
        ["Client stated a goal", "jump:4"],
        ["No goal — I asked", "jump:5"],
        ["Not interested", "rebuttal:notInterested"],
        ["Busy", "rebuttal:busy"]
      ]
    },
    {
      title: "Transfer — client already stated a goal",
      script:
        "“Perfect, thank you. Hi {{borrowerFirstName}}. Again, my name is {{loName}}, and I’m a licensed loan officer here with Lending Force. I hope you’re doing well today.”\n\n" +
        "If cash out: “I understand you’re interested in taking some cash out of the property. What are you hoping to use the funds for?”\n\n" +
        "If lowering the payment: “I understand you’re interested in lowering your monthly payment. Is the main goal to create more room in your monthly budget, or are there other debts or expenses you’re hoping to address as well?”",
      coach:
        "The telemarketer already gave you the goal — acknowledge it and dig into the why before moving to contact info.",
      fields: [
        ["primaryGoal", "Stated Goal", "select", "Cash out|Lower payment|Both|Not sure"],
        ["financialGoal", "What they want to accomplish", "textarea"]
      ],
      routes: [["Continue", "jump:5"]]
    },
    {
      title: "Confirm contact information",
      script:
        "Perfect. Before I go too far, let me make sure I have the best contact information for you.\n\n" +
        "What is the best number to reach you, your email, and the address where you currently live?",
      coach:
        "Shared step \u2014 both intro paths land here. This is where the 1003 borrower + address block gets captured up front. Confirm the current home address and how long they have been there.",
      fields: [
        ["borrowerCellPhone", "Cell Phone"],
        ["borrowerHomePhone", "Home Phone"],
        ["borrowerWorkPhone", "Work Phone"],
        ["email", "Email"],
        ["preferredContact", "Preferred Contact Method", "select", "Phone|Text|Email"],
        ["currentStreet", "Current Street Address"],
        ["currentUnit", "Unit #"],
        ["currentCity", "City"],
        ["currentState", "State"],
        ["currentZip", "ZIP"],
        ["currentCountry", "Country"],
        ["currentYears", "Years at Address"],
        ["currentMonths", "Months at Address"],
        ["currentHousingType", "Own or Rent", "select", "Own|Rent|No primary housing expense"],
        ["currentHousingPayment", "Monthly Housing Payment"],
        ["mailingAddress", "Mailing Address (if different)", "textarea"]
      ],
      routes: [["Continue", "jump:6"]]
    },
    {
      title: "Household & co-borrower",
      script:
        "A couple of quick questions for the application. What is your marital status, and how many dependents do you have?\n\n" +
        "And will anyone be on the loan with you — a spouse or co-borrower?",
      coach:
        "Captures the 1003 household + citizenship info and flags a co-borrower early so you can gather their details as you go.",
      fields: [
        ["borrowerMaritalStatus", "Marital Status", "select", "Married|Separated|Unmarried"],
        ["borrowerDependentsCount", "Number of Dependents"],
        ["borrowerDependentsAges", "Dependents' Ages"],
        ["borrowerCitizenship", "Citizenship", "select", "US Citizen|Permanent Resident|Non-Permanent Resident"],
        ["coBorrowerName", "Co-Borrower Full Name"],
        ["coBorrowerDob", "Co-Borrower Date of Birth"],
        ["coBorrowerSsn", "Co-Borrower SSN"],
        ["coBorrowerPhone", "Co-Borrower Phone"],
        ["coBorrowerEmail", "Co-Borrower Email"],
        ["coBorrowerMaritalStatus", "Co-Borrower Marital Status", "select", "Married|Separated|Unmarried"]
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
        ["brandProof", "Proof / Credibility", "textarea"],
        ["loNmls", "Your NMLS ID"],
        ["loOrganization", "Organization Name"],
        ["loOrgNmls", "Organization NMLS ID"],
        ["loPhone", "Your Phone"],
        ["loEmail", "Your Email"],
        ["loStateLicense", "Your State License #"]
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
        ["propertyAddress", "Property Street"],
        ["propertyCity", "City"],
        ["propertyState", "State"],
        ["propertyZip", "ZIP"],
        ["propertyCounty", "County"],
        ["propertyUnits", "Number of Units"],
        ["propertyType", "Property Type", "select", "Single Family|Condominium|Townhouse|2-4 Units|Manufactured"],
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
        ["propertyYearBuilt", "Year Built"],
        ["estimatedValue", "Estimated Market Value"],
        ["valueReason", "Why They Believe That Value", "textarea"]
      ],
      routes: [["Continue", "jump:2"]]
    },
    {
      title: "Home plans & other real estate",
      script:
        "Any recent renovations, upgrades, or planned improvements? And do you have any plans to move in the next few years?\n\n" +
        "Do you own any other real estate besides this home? If so, let’s note it for the application.",
      coach:
        "Capture any Real Estate Owned here — it belongs on the 1003 (value, loan balance, and rental income if any).",
      fields: [
        ["propertyNotes", "Renovations / Property Notes", "textarea"],
        ["movePlans", "Plans to Move"],
        ["reoAddress", "Other Property Address", "textarea"],
        ["reoValue", "Other Property Value"],
        ["reoStatus", "Status", "select", "Retained|Sold|Pending Sale"],
        ["reoMortgageBalance", "Mortgage Balance"],
        ["reoMonthlyPayment", "Monthly Payment"],
        ["reoRentalIncome", "Gross Rental Income (monthly)"]
      ],
      routes: [["Continue", "credit"]]
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
      coach: "Ask what they actually pay, not just minimum payment. Log each account in the numbered slots so it maps to the 1003 liabilities.",
      fields: [
        ["liability1Creditor", "Liability 1 — Creditor"],
        ["liability1Type", "Liability 1 — Type", "select", "Revolving|Installment|Mortgage|Lease|Other"],
        ["liability1Balance", "Liability 1 — Balance"],
        ["liability1Payment", "Liability 1 — Monthly Payment"],
        ["liability2Creditor", "Liability 2 — Creditor"],
        ["liability2Type", "Liability 2 — Type", "select", "Revolving|Installment|Mortgage|Lease|Other"],
        ["liability2Balance", "Liability 2 — Balance"],
        ["liability2Payment", "Liability 2 — Monthly Payment"],
        ["liability3Creditor", "Liability 3 — Creditor"],
        ["liability3Type", "Liability 3 — Type", "select", "Revolving|Installment|Mortgage|Lease|Other"],
        ["liability3Balance", "Liability 3 — Balance"],
        ["liability3Payment", "Liability 3 — Monthly Payment"],
        ["liabilitySummary", "Additional Liabilities", "textarea"],
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
        ["employer", "Employer / Business"],
        ["borrowerPosition", "Position / Title"],
        ["employerPhone", "Employer Phone"],
        ["employerStreet", "Employer Street"],
        ["employerCity", "Employer City"],
        ["employerState", "Employer State"],
        ["employerZip", "Employer ZIP"],
        ["borrowerYearsInLineOfWork", "Years in This Line of Work"]
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
        ["grossMonthlyIncome", "Base Monthly Income"],
        ["incomeOvertime", "Overtime (monthly)"],
        ["incomeBonus", "Bonus (monthly)"],
        ["incomeOther", "Other Employment Income (monthly)"],
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
        ["grossMonthlyIncome", "Base Monthly Income"],
        ["incomeCommission", "Commission (monthly)"]
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
        ["borrowerSelfEmployedShare", "Ownership Share %"],
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
        ["grossMonthlyIncome", "Gross Monthly Income"],
        ["incomeMilitary", "Military / VA Pay (monthly)"]
      ],
      routes: [["Continue", "jump:5"]]
    },
    {
      title: "Budget reality check",
      script:
        "Between your debt and other monthly expenses, you are spending roughly {{monthlyExpenseTotal}} per month. Your income is around {{grossMonthlyIncome}} gross and {{netMonthlyIncome}} take-home.\n\n" +
        "How much are you realistically able to put away at the end of the month?\n\n" +
        "Any other income we should count — rental, Social Security, pension, child support? And if you’ve been at your job under two years, what did you do before?",
      coach:
        "Round out the 1003 income: other income sources and prior employment for anyone under two years at their current job.",
      fields: [
        ["monthlyExpenseTotal", "Monthly Expense Total"],
        ["monthlySavings", "Amount Put Away Monthly"],
        ["otherIncomeSource", "Other Income Source"],
        ["otherIncomeAmount", "Other Income (monthly)"],
        ["previousEmployer", "Previous Employer"],
        ["previousPosition", "Previous Position"],
        ["previousEmploymentDates", "Previous Employment Dates"],
        ["previousMonthlyIncome", "Previous Monthly Income"]
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
      title: "The introduction & recap",
      script:
        "Hi {{borrowerFirstName}}, it\u2019s {{loName}} calling back from Lending Force. I have exciting news for you \u2014 you\u2019re going to love this! Everything came back better than expected!\n\n" +
        "What we\u2019re going to do is review everything together, answer any questions you have, get your loan documents out to you and signed, and your appraisal ordered today! Can you grab a pen and paper for me please?\n\n" +
        "When we first spoke, you mentioned your main goal is {{financialGoal}}, right?\n\n" +
        "And by doing so, you mentioned it would help you {{emotionalGoal}}, right?\n\n" +
        "And you mentioned your home should appraise for {{estimatedValue}}, right?\n\n" +
        "Great! Thank you for confirming all those for me. Here is your new solution!!",
      coach:
        "This is the refinance callback. Confirm each blank out loud and get the \u201cright?\u201d agreement before revealing the numbers.",
      fields: [
        ["financialGoal", "Financial Goal", "textarea"],
        ["emotionalGoal", "Emotional Goal", "textarea"],
        ["estimatedValue", "Home Should Appraise For"]
      ],
      routes: [
        ["Client confirms \u2014 show the solution", "jump:1"],
        ["Client corrects recap", "goals"]
      ]
    },
    {
      title: "The sale",
      script:
        "Here is your new solution!\n\n" +
        "Program: {{productType}}\n" +
        "Payment: {{newPayment}}  \u00b7  Savings: {{paymentSavingsMonthly}}/mo  &  {{paymentSavingsAnnual}}/yr\n" +
        "Interest rate: {{interestRate}}\n" +
        "Closing cost (range): {{closingCostRange}}\n" +
        "Loan amount: {{loanAmount}}",
      coach: "Present payment first, then the monthly and annual savings, then rate, closing-cost range, and loan amount.",
      fields: [
        ["productType", "Program / Product Type"],
        ["newPayment", "New Payment"],
        ["paymentSavingsMonthly", "Monthly Savings"],
        ["paymentSavingsAnnual", "Annual Savings"],
        ["interestRate", "Interest Rate"],
        ["closingCostRange", "Closing Cost (range)"],
        ["loanAmount", "Loan Amount"],
        ["loanPurpose", "Loan Purpose", "select", "Purchase|Refinance|Cash-Out Refinance|HELOC"],
        ["loanTermMonths", "Loan Term (months)"],
        ["purchasePrice", "Purchase Price (if purchase)"],
        ["downPayment", "Down Payment"],
        ["mixedUse", "Mixed-Use Property?", "select", "No|Yes"],
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
      title: "The close",
      script:
        "I\u2019m excited for you! We were able to accomplish everything you sought out when we started this process.\n\n" +
        "The next step is to secure the pricing on the application and get you e-signed. For the appraisal, did you want to use a credit or debit card?\n\n" +
        "In the meantime, I\u2019ll need your mortgage statement, homeowner\u2019s insurance, and income documents. Let\u2019s complete your application now so we can get this moving.",
      fields: [
        ["paymentMethod", "Appraisal Payment Method", "select", "Credit|Debit"],
        ["docsNeeded", "Documents Needed", "textarea"],
        ["followUpTime", "Follow-Up Time"]
      ],
      routes: [
        ["Complete the 1003 application", "application"],
        ["Pushback", "drawer"]
      ]
    }
  ],
  propertyConditions: [
    {
      title: "Property Condition",
      script:
        "A few property-condition questions for the appraisal. Any “yes” here means we dig deeper, ask more, and check Pathfinder/AMP before moving on.",
      coach:
        "Any Y = dig deeper, ask more questions, check Pathfinder. AMP surfaces the warning and the required action based on the client’s response. Use AMP!",
      fields: [
        ["pcOver20Acres", "Is the property size greater than 20 acres?", "select", "No|Yes"],
        ["pcCommercialUse", "Is the property set up for business/commercial use?", "select", "No|Yes"],
        ["pcHandrails", "FHA/USDA/VA: Any missing/broken/unsecured handrails (incl. deck)?", "select", "No|Yes"],
        ["pcFoundation", "Foundation sinking/cracked/uneven/crumbling/unsound?", "select", "No|Yes"],
        ["pcElectrical", "Exposed electric wire / missing switch plates?", "select", "No|Yes"],
        ["pcWindowsDoors", "Broken/damaged/missing windows or doors (home/garage)?", "select", "No|Yes"],
        ["pcWoodSiding", "Decaying/rotting wood or missing siding?", "select", "No|Yes"],
        ["pcWaterStains", "Any visible water stains / standing water?", "select", "No|Yes"],
        ["pcSubfloor", "Any exposed subfloor in the home?", "select", "No|Yes"],
        ["pcUnfinished", "Anything unfinished / under renovation / in a temp state?", "select", "No|Yes"],
        ["pcIncomeFromProperty", "Any income/loss derived from the property?", "select", "No|Yes"],
        ["pcPeelingPaint", "FHA/VA/USDA: Any chipped/peeling paint on home/deck/garage?", "select", "No|Yes"],
        ["pcRoofLeaks", "Any active leaks in roof / missing shingles?", "select", "No|Yes"],
        ["pcSolarPanels", "Does the property have solar panels?", "select", "No|Yes"],
        ["pcAppraiserAccess", "All rooms/outbuildings accessible to appraiser (crawl space & attic)?", "select", "Yes|No"],
        ["pcListedForSale", "Is the home currently listed for sale?", "select", "No|Yes"],
        ["pcUtilitiesOn", "FHA/VA: Are the utilities on and fully functioning?", "select", "Yes|No"],
        ["pcConditionNotes", "Property condition notes / dig-deeper details", "textarea"]
      ],
      routes: [["Continue to condo questions", "jump:1"]]
    },
    {
      title: "Condo Questions (if applicable)",
      script:
        "If the subject is a condo, a few extra questions. A “yes” on these can mean financing may not be available — foreshadow that a condo questionnaire may be required, and always check Pathfinder.",
      coach:
        "Condo-specific: if Yes, financing potentially not available (see Pathfinder). Foreshadow the condo questionnaire. Always check Pathfinder!",
      fields: [
        ["pcCondoBuilderControl", "Is the association still under the builder/developer’s control?", "select", "No|Yes"],
        ["pcCondoUnder5Units", "Are there fewer than 5 units in the complex?", "select", "No|Yes"],
        ["pcCondoInvestor49", "Are 49% or more units held as investment properties?", "select", "No|Yes"],
        ["pcHoaContact", "HOA contact information", "textarea"]
      ],
      routes: [["Save & go to export", "export"]]
    }
  ],
  declarations: [
    {
      title: "1003 \u2014 Declarations",
      script:
        "Before we wrap up the application, I have to walk through the standard declarations. These are required on every mortgage \u2014 just answer yes or no and I\u2019ll note details on anything that\u2019s a yes. I\u2019ll ask for both you and any co-borrower.",
      coach:
        "Any YES means dig deeper and check Pathfinder. Capture for both Borrower (B) and Co-Borrower (CB) \u2014 use the co-borrower notes box for any differences. Same field keys as the 1003 walk-through, so answers pre-fill in the application section.",
      fields: [
        ["borrowerCitizenship", "Citizenship", "select", "US Citizen|Permanent Resident|Non-Permanent Resident"],
        ["declAlimonyObligation", "Obligated to pay alimony, child support, or separate maintenance?", "select", "No|Yes"],
        ["declOccupyPrimary", "A. Will you occupy the property as your primary residence?", "select", "Yes|No"],
        ["declOwnershipInterest", "A1. Ownership interest in another property in last 3 years?", "select", "No|Yes"],
        ["declOwnershipType", "A1. If yes — type of property", "select", "Primary Residence|Second Home|Investment Property"],
        ["declTitleHeld", "A1. If yes — how did you hold title?", "select", "Sole|Joint with spouse|Joint with another person"],
        ["declFamilyRelationship", "B. Family/business affiliation with the seller? (purchase)", "select", "No|Yes"],
        ["declBorrowingMoney", "C. Borrowing undisclosed money for this transaction?", "select", "No|Yes"],
        ["declBorrowedAmount", "C. If yes — amount"],
        ["declOtherMortgage", "D1. Applying for another mortgage on/before closing (undisclosed)?", "select", "No|Yes"],
        ["declNewCredit", "D2. Applying for new credit on/before closing (undisclosed)?", "select", "No|Yes"],
        ["declSubjectToLien", "E. Property subject to a priority lien (e.g., PACE)?", "select", "No|Yes"],
        ["declCoSigner", "F. Co-signer or guarantor on undisclosed debt?", "select", "No|Yes"],
        ["declOutstandingJudgments", "G. Any outstanding judgments against you?", "select", "No|Yes"],
        ["declDelinquentFederalDebt", "H. Currently delinquent or in default on Federal debt?", "select", "No|Yes"],
        ["declPartyToLawsuit", "I. Party to a lawsuit with personal financial liability?", "select", "No|Yes"],
        ["declConveyedTitleInLieu", "J. Conveyed title in lieu of foreclosure (7 yrs)?", "select", "No|Yes"],
        ["declPreForeclosureShortSale", "K. Completed a pre-foreclosure or short sale (7 yrs)?", "select", "No|Yes"],
        ["declPropertyForeclosed", "L. Had property foreclosed (7 yrs)?", "select", "No|Yes"],
        ["declDeclaredBankruptcy", "M. Declared bankruptcy (past 7 yrs)?", "select", "No|Yes"],
        ["declBankruptcyHomeIncluded", "M. If yes — was a home included in the bankruptcy?", "select", "No|Yes"],
        ["declBankruptcyType", "M. If yes — bankruptcy type(s)", "select", "Chapter 7|Chapter 11|Chapter 12|Chapter 13"],
        ["declForbearance", "Currently in forbearance on any mortgage?", "select", "No|Yes"],
        ["coBorrowerDeclarationNotes", "Co-Borrower declaration differences (if any)", "textarea"],
        ["declarationNotes", "Additional Declaration Notes", "textarea"]
      ],
      routes: [["Continue to demographics", "jump:1"]]
    },
    {
      title: "1003 \u2014 Government Monitoring (Demographics)",
      script:
        "Now I\u2019ll ask a few demographic questions. We are required to ask them to comply with federal lending laws that prohibit creditors from discrimination against applicants. Answering the questions is optional but encouraged.\n\n" +
        "Let\u2019s start with ethnicity, then race, then gender \u2014 and we can select more than one category for race.",
      coach:
        "Government monitoring (HMDA) \u2014 see AMP. Voluntary but encouraged. Ethnicity: if Hispanic, what origin(s)? Gender: what would you like me to select? Race: what would you like me to select \u2014 we can do more than one. Same field keys as the 1003 walk-through, so answers pre-fill in the application section.",
      fields: [
        ["demoEthnicity", "Ethnicity", "select", "Hispanic or Latino|Not Hispanic or Latino|I do not wish to provide"],
        ["demoEthnicitySub", "If Hispanic or Latino — origin", "select", "Mexican|Puerto Rican|Cuban|Other Hispanic or Latino"],
        ["demoEthnicityOtherOrigin", "If other Hispanic/Latino — specify origin"],
        ["demoRace", "Race (select all that apply — note extras below)", "select", "American Indian or Alaska Native|Asian|Black or African American|Native Hawaiian or Other Pacific Islander|White|I do not wish to provide"],
        ["demoRaceAmIndianTribe", "If American Indian/Alaska Native — enrolled or principal tribe"],
        ["demoRaceAsianSub", "If Asian — subcategory", "select", "Asian Indian|Chinese|Filipino|Japanese|Korean|Vietnamese|Other Asian"],
        ["demoRacePacificSub", "If Pacific Islander — subcategory", "select", "Native Hawaiian|Guamanian or Chamorro|Samoan|Other Pacific Islander"],
        ["demoRaceDetail", "Additional race selections / other detail", "textarea"],
        ["demoSex", "Sex / Gender", "select", "Female|Male|I do not wish to provide"],
        ["demoCollectionMethod", "How Collected", "select", "Face-to-Face|Telephone|Fax or Mail|Email or Internet"]
      ],
      routes: [["Continue to property condition", "propertyConditions"]]
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
      title: "1003 \u2014 Loan Originator",
      script:
        "That completes the application data \u2014 great job. Let me confirm my information as your loan officer, then we\u2019ll run the standard declarations, monitoring, and property-condition questions.",
      fields: [
        ["loName", "Loan Originator Name"],
        ["loNmls", "LO NMLS ID"],
        ["loOrganization", "Organization Name"],
        ["loOrgNmls", "Organization NMLS ID"],
        ["loPhone", "LO Phone"],
        ["loEmail", "LO Email"],
        ["loStateLicense", "LO State License #"]
      ],
      routes: [["Continue to declarations", "declarations"]]
    }
  ]
};
