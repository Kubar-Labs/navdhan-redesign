const messages = {
  meta: {
    title: "NavDhan: Fast Business Loans for India's MSMEs",
    description:
      "Get matched with loan options. One application, multiple offers, zero platform fee.",
  },
  global: {
    announcement: {
      message: "One stop-solution for all your working capital needs.",
      ctaLabel: "Check eligibility",
      href: "/apply",
    },
    nav: {
      loanProducts: "Loan Products",
      whyNavDhan: "Why NavDhan",
      emiCalculator: "EMI Calculator",
      customerStories: "Customer Stories",
      team: "Team",
    },
    cta: {
      applyLoan: "Apply Loan",
      checkEligibility: "Check Eligibility",
      talkToUs: "Talk to Us",
      applyOnline: "Apply Online",
      compareLoanOptions: "Compare Loan Options",
      learnMore: "Learn more",
      readMore: "Read more stories",
      joinTeam: "Join the team",
      backToHome: "Back to home",
      returnHome: "Return home",
    },
    alt: {
      navdhanLogo: "NavDhan logo",
      kubarLabsLogo: "Kubar logo",
      face: "FACE registered member",
      startupMahakumbh: "Startup Mahakumbh",
      stpiFinglobe: "STPI FinGlobe",
      finvision: "FinVision",
      rbi: "RBI Aligned",
      partnerLogo: "{name} logo",
      recognitionImage: "{title} recognition",
      customerPhoto: "Photo of {name}",
      teamPhoto: "Photo of {name}",
    },
    footer: {
      tagline: "One stop-solution for all your working capital needs",
      company: "Kubar Protocol Private Limited (CIN: U70200WB2024PTC274850)",
      address: "156, Tarvakere, BTM Layout 1st Stage, Bengaluru, Karnataka",
      copyright:
        "© 2026 Kubar Protocol Private Limited. NavDhan is a product of Kubar Protocol Private Limited.",
      contactHeading: "Contact",
      companyHeading: "Company",
      legalHeading: "Legal",
      badges: "RBI Aligned · FACE Registered · Powered by Kubar",
    },
    contact: {
      loan: "loan@kubar.tech",
      partnership: "partnerships@kubar.tech",
      support: "support@kubar.tech",
      careers: "careers@kubar.tech",
      press: "press@kubar.tech",
      outreach: "outreach@kubar.tech",
    },
  },
  home: {
    meta: {
      title: "NavDhan: Fast Business Loans for India's MSMEs",
      description:
        "Get matched with loan options. One application, multiple offers, zero platform fee.",
    },
    hero: {
      eyebrow: "Fast business loans for India's MSMEs",
      headline: "Get the right business loan, without chasing banks.",
      body: "NavDhan helps small and growing businesses get fair, fast loans. One application. Multiple options. Zero platform fee.",
      primaryCta: "Check Eligibility",
      secondaryCta: "Talk to Us",
      stat1value: "₹5L – ₹1Cr",
      stat1label: "loan range",
      stat2value: "12-24%",
      stat2label: "interest rate p.a.",
      stat3value: "3–12 month",
      stat3label: "tenures",
    },
    association: {
      eyebrow: "Recognised by",
    },
    ecosystem: {
      eyebrow: "Technology Partnerships",
    },
    loanProducts: {
      eyebrow: "Loan products",
      heading: "A loan that fits what your business actually needs.",
      body: "From buying stock and machinery to managing daily expenses, choose the loan that fits your plan, not the other way around.",
      cta: "Compare Loan Options",
    },
    whyNavDhan: {
      eyebrow: "Why NavDhan",
      heading: "Built for business owners, not paperwork collectors.",
      body: "You are running a business, not a bank branch. We keep the process digital, transparent, and focused on getting you an offer that works.",
      cta: "Apply Now",
    },
    recognition: {
      eyebrow: "Recognition",
      heading: "Built to earn your trust. Recognised along the way.",
    },
    customerStories: {
      eyebrow: "Customer stories",
      heading: "Real businesses. Real outcomes.",
      cta: "Read more stories",
    },
    emiCalculator: {
      eyebrow: "EMI Calculator",
      heading: "Plan your monthly outgo before you apply.",
      intro:
        "Move the sliders to see an estimate. Your final rate will depend on your business profile, lender, and tenure.",
      amount: "Loan amount",
      rate: "Interest rate",
      tenure: "Tenure",
      monthly: "Monthly EMI",
      principal: "Principal",
      totalInterest: "Total interest",
      totalPayable: "Total payable",
      cta: "Check Eligibility",
    },
    finalCta: {
      heading: "The right loan for your business is a few clicks away.",
      subtext: "Zero platform fee · Multiple loan offers · Quick, transparent process",
      primaryCta: "Apply Online",
      secondaryCta: "Talk to Us",
    },
  },
  team: {
    meta: {
      title: "Team: NavDhan",
      description: "Meet the people building fair, fast credit for India's MSMEs.",
    },
    hero: {
      heading: "Built by people who believe in small business.",
      subtext:
        "We are builders, engineers, designers, and operators working to make MSME credit calm, clear, and honest.",
      mission: "One stop-solution for all your working capital needs.",
    },
    members: {
      eyebrow: "Leadership",
      heading: "Meet the team",
    },
    advisors: {
      eyebrow: "Advisors",
      heading: "Guided by industry experts",
    },
    join: {
      heading: "Want to shape the future of MSME credit?",
      subtext:
        "We are always looking for thoughtful people who care about building fair financial products.",
      cta: "Join the team",
    },
  },
  legal: {
    meta: {
      title: "{title}: NavDhan",
      description: "Legal and regulatory information for NavDhan users.",
    },
    lastUpdated: "Last updated: {date}",
  },
  apply: {
    heading: "Get the right business loan, without chasing banks.",
    description: "Fill a few details to check your eligibility. It takes less than 5 minutes.",
    consentData:
      "I consent to NavDhan using my details to assess eligibility and share a loan offer.",
    consentLender:
      "I consent to sharing my details so NavDhan can find a loan offer for my business.",
    submit: "Check Eligibility",
  },
  errors: {
    notFound: {
      heading: "Page not found",
      body: "We could not find the page you were looking for.",
      cta: "Back to home",
    },
    boundary: {
      heading: "Something went wrong",
      body: "Please try again or return to the homepage.",
      cta: "Return home",
    },
  },
};

export type Messages = typeof messages;
export default messages;
