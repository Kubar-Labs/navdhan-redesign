import type {
  BadgeItem,
  PartnerItem,
  ProductCard,
  ReasonBlock,
  RecognitionItem,
  StoryCard,
  TeamMember,
  Advisor,
} from "@/src/types";

export const associationBadges: BadgeItem[] = [
  {
    name: "FACE",
    logoAsset: "/assets/badges/face.png",
    altKey: "global.alt.face",
    href: "#",
  },
  {
    name: "STPI FinGlobe",
    logoAsset: "/assets/badges/finglobe.png",
    altKey: "global.alt.stpiFinglobe",
    href: "#",
  },
  {
    name: "FinVision",
    logoAsset: "/assets/badges/finvision.png",
    altKey: "global.alt.finvision",
    href: "#",
  },
  {
    name: "RBI Aligned",
    logoAsset: "/assets/badges/rbi.png",
    altKey: "global.alt.rbi",
    href: "#",
  },
];

export const techPartners: PartnerItem[] = [
  {
    name: "Google",
    logoAsset: "/assets/partners/google.png",
    altKey: "global.alt.partnerLogo",
  },
  {
    name: "NVIDIA",
    logoAsset: "/assets/partners/nvidia.png",
    altKey: "global.alt.partnerLogo",
  },
  {
    name: "Microsoft",
    logoAsset: "/assets/partners/microsoft.png",
    altKey: "global.alt.partnerLogo",
  },
  {
    name: "Polkadot Blockchain Academy",
    logoAsset: "/assets/partners/pba.png",
    altKey: "global.alt.partnerLogo",
  },
  {
    name: "Perplexity",
    logoAsset: "/assets/partners/perplexity.png",
    altKey: "global.alt.partnerLogo",
  },
  {
    name: "OpenAI",
    logoAsset: "/assets/partners/openai.png",
    altKey: "global.alt.partnerLogo",
  },
  {
    name: "Uniswap",
    logoAsset: "/assets/partners/uniswap.png",
    altKey: "global.alt.partnerLogo",
  },
  {
    name: "Intel",
    logoAsset: "/assets/partners/intel.png",
    altKey: "global.alt.partnerLogo",
  },
  {
    name: "Amplitude",
    logoAsset: "/assets/partners/amplitude.png",
    altKey: "global.alt.partnerLogo",
  },
  {
    name: "ElevenLabs",
    logoAsset: "/assets/partners/eleven.png",
    altKey: "global.alt.partnerLogo",
  },
];

export const loanProducts: ProductCard[] = [
  {
    id: "collateral-free",
    titleKey: "Term Loan up to ₹1 Crore",
    descriptionKey:
      "Unsecured funding based on your business cash flow. No property or asset needed.",
    iconName: "ShieldCheck",
    ctaKey: "global.cta.learnMore",
    href: "/apply",
  },
  {
    id: "working-capital",
    titleKey: "Working Capital Loan",
    descriptionKey:
      "Cover salaries, stock, supplier payments, or everyday gaps with flexible repayment.",
    iconName: "Briefcase",
    ctaKey: "global.cta.learnMore",
    href: "/apply",
  },
  {
    id: "asset-finance",
    titleKey: "Asset / Machinery Finance",
    descriptionKey: "Buy equipment, vehicles, or tools with EMIs that match your cash cycle.",
    iconName: "Truck",
    ctaKey: "global.cta.learnMore",
    href: "/apply",
  },
  {
    id: "growth-loan",
    titleKey: "Business Growth Loan",
    descriptionKey:
      "Larger-ticket capital to expand to a new city, add capacity, or take on bigger orders.",
    iconName: "TrendingUp",
    ctaKey: "global.cta.learnMore",
    href: "/apply",
  },
];

export const whyReasons: ReasonBlock[] = [
  {
    id: "matched-offers",
    titleKey: "One application, matched offers.",
    bodyKey: "Apply once and see loan options worked out for your business.",
  },
  {
    id: "loan-sizes",
    titleKey: "Loan sizes that fit.",
    bodyKey: "From ₹5 Lakhs to ₹1 Crore, borrow what your business actually needs.",
  },
  {
    id: "clear-rates",
    titleKey: "Clear interest rates.",
    bodyKey: "Rates from 12% to 24% p.a., with all costs explained upfront.",
  },
  {
    id: "fast-decisions",
    titleKey: "Fast, honest decisions.",
    bodyKey: "Approvals typically within 24 hours to 7 days, depending on documents.",
  },
  {
    id: "online-process",
    titleKey: "Fully online process.",
    bodyKey: "Submit documents and e-sign from your phone or laptop.",
  },
  {
    id: "zero-fee",
    titleKey: "Zero platform fee.",
    bodyKey: "You only pay what your loan agreement says. Nothing extra to NavDhan.",
  },
];

export const recognitionItems: RecognitionItem[] = [
  {
    id: "ai-summit",
    titleKey: "AI Impact Summit, India 2026",
    descriptionKey:
      "Discussed inclusive finance for Indian MSMEs with policymakers, builders and investors.",
    writeUp:
      "At the AI Impact Summit Bharat 2026, we shared how NavDhan is using calm, responsible technology to bring working capital closer to small business owners. The room was full of founders, regulators and researchers working on welfare for all, and it reminded us why borrower-first design matters.",
    imageAsset: "/assets/recognition/ai-summit/01.jpeg",
    galleryAssets: [
      "/assets/recognition/ai-summit/02.jpeg",
      "/assets/recognition/ai-summit/03.jpeg",
    ],
    date: "2026",
  },
  {
    id: "nibm",
    titleKey: "FinTech Edge Winner, NIBM",
    descriptionKey:
      "Won the FinTech Edge award for practical credit tools built for small businesses.",
    writeUp:
      "NIBM’s FinTech Edge competition brought together early-stage teams solving real problems in banking and credit. We walked away a winner, judged on clarity of problem, strength of execution and potential impact on India’s MSMEs.",
    imageAsset: "/assets/recognition/nibm/01.jpeg",
    galleryAssets: ["/assets/recognition/nibm/02.jpeg", "/assets/recognition/nibm/03.jpeg"],
    date: "2026",
  },
  {
    id: "startup-mahakumbh",
    titleKey: "Startup Mahakumbh",
    descriptionKey:
      "Selected at India’s largest startup gathering for making business loans simpler.",
    writeUp:
      "Startup Mahakumbh is where India’s startup ecosystem shows up. NavDhan was chosen to present to a packed audience of founders, operators and investors, and the conversations reinforced how badly small businesses need a calm, transparent loan experience.",
    imageAsset: "/assets/recognition/startup-mahakumbh/01.jpeg",
    galleryAssets: [
      "/assets/recognition/startup-mahakumbh/02.jpeg",
      "/assets/recognition/startup-mahakumbh/03.jpeg",
    ],
    date: "2024",
  },
  {
    id: "iima",
    titleKey: "IIM Ahmedabad",
    descriptionKey: "Shared NavDhan’s story with the IIM Ahmedabad entrepreneurship community.",
    writeUp:
      "At IIM Ahmedabad, we met founders, professors and alumni who have spent decades building and backing Indian enterprises. Presenting NavDhan there was a chance to stress-test our assumptions and come back sharper about what borrowers truly need.",
    imageAsset: "/assets/recognition/iima/01.jpg",
    galleryAssets: ["/assets/recognition/iima/02.jpg", "/assets/recognition/iima/03.jpg"],
    date: "2024",
  },
  {
    id: "iit-kharagpur-grandx",
    titleKey: "IIT Kharagpur - Campus Fund GrandX",
    descriptionKey:
      "Pitched at IIT Kharagpur’s GrandX, connecting with student builders and investors.",
    writeUp:
      "Campus Fund GrandX at IIT Kharagpur brings together some of the most ambitious student founders and early investors. We pitched NavDhan’s mission of fair, fast MSME credit and left with thoughtful feedback and new champions for the cause.",
    imageAsset: "/assets/recognition/iit-kharagpur-grandx/01.jpg",
    galleryAssets: [
      "/assets/recognition/iit-kharagpur-grandx/02.jpg",
      "/assets/recognition/iit-kharagpur-grandx/03.jpg",
    ],
    date: "2025",
  },
  {
    id: "jindal-2024",
    titleKey: "Jindal 2024",
    descriptionKey:
      "Showcased NavDhan at Jindal 2024, exploring credit access for local entrepreneurs.",
    writeUp:
      "Jindal 2024 gave us a stage to talk directly to young entrepreneurs and ecosystem enablers. The theme kept returning to one idea: financial products should be explained in plain language and built around the borrower’s real cash flow.",
    imageAsset: "/assets/recognition/jindal-2024/01.jpeg",
    galleryAssets: [
      "/assets/recognition/jindal-2024/02.jpeg",
      "/assets/recognition/jindal-2024/03.jpeg",
    ],
    date: "2024",
  },
  {
    id: "pba-2024",
    titleKey: "PBA 2024",
    descriptionKey:
      "Participated in PBA 2024, demonstrating NavDhan’s borrower-first loan experience.",
    writeUp:
      "PBA 2024 was a deep dive into product, distribution and customer trust. We demonstrated NavDhan’s end-to-end experience and collected candid reactions from operators who see credit from both sides of the table.",
    imageAsset: "/assets/recognition/pba-2024/01.jpeg",
    galleryAssets: [
      "/assets/recognition/pba-2024/03.jpg",
    ],
    date: "2024",
  },
  {
    id: "simi-event",
    titleKey: "SI Event",
    descriptionKey:
      "Engaged with the SI community to learn from small business owners about working capital needs.",
    writeUp:
      "At the SI event, we stepped out of the builder bubble and listened to shop owners, traders and service providers describe their cash-flow pressures. Their stories now sit at the centre of how we design NavDhan’s product.",
    imageAsset: "/assets/recognition/simi-event/01.jpg",
    galleryAssets: ["/assets/recognition/simi-event/02.jpg"],
    date: "2024",
  },
];

export const customerStories: StoryCard[] = [
  {
    id: "rajiv",
    name: "Rajiv K.",
    roleKey: "Garment Shop Owner",
    questionKey:
      "I wanted to stock up for the wedding season, but I did not have collateral. Could I still get a loan?",
    outcomeKey: "Rajiv qualified for a collateral-free ₹25 Lakh business loan.",
    imageAsset: "/assets/stories/rajiv-k.jpg",
  },
  {
    id: "sunita",
    name: "Sunita M.",
    roleKey: "Handicraft Artisan, Varanasi",
    questionKey:
      "Our loom needed upgrading, but cash flow was tight. Could we get a loan for equipment?",
    outcomeKey: "Sunita secured a ₹15 Lakh machinery loan at a competitive rate.",
    imageAsset: "/assets/stories/sunita-m.jpg",
  },
  {
    id: "amit",
    name: "Amit V.",
    roleKey: "E-commerce Logistics, Gurugram",
    questionKey:
      "We needed working capital to hire more staff and take on bigger orders. What was the simplest way?",
    outcomeKey: "Amit received an ₹18 Lakh working capital loan in days.",
    imageAsset: "/assets/stories/amit-v.jpg",
  },
];

export const emiDefaults = {
  minAmount: 500_000,
  maxAmount: 10_00_00_000,
  defaultAmount: 25_00_000,
  minRate: 12,
  maxRate: 24,
  defaultRate: 18,
  minTenure: 3,
  maxTenure: 12,
  defaultTenure: 9,
};

export const trustBadges = ["RBI Aligned", "FACE Registered", "Powered by Kubar"];

export const teamMembers: TeamMember[] = [
  {
    id: "founder-1",
    name: "Vaibhav Sharma",
    roleKey: "Founder & Head of Product",
    bioKey:
      "Building NavDhan to make MSME credit calm, clear, and accessible for every business owner in India.",
    imageAsset: "/assets/team/placeholder-avatar.jpg",
    linkedIn: "https://www.linkedin.com",
  },
  {
    id: "cto-1",
    name: "Engineering Lead",
    roleKey: "Chief Technology Officer",
    bioKey:
      "Architecting the secure, scalable technology that makes business loans simple and fair.",
    imageAsset: "/assets/team/placeholder-avatar.jpg",
    linkedIn: "https://www.linkedin.com",
  },
  {
    id: "credit-1",
    name: "Credit Lead",
    roleKey: "Head of Credit",
    bioKey: "Designing underwriting standards that treat borrowers fairly while managing risk.",
    imageAsset: "/assets/team/placeholder-avatar.jpg",
  },
  {
    id: "ops-1",
    name: "Operations Lead",
    roleKey: "Head of Operations",
    bioKey: "Ensuring every application gets the responsive, human support it deserves.",
    imageAsset: "/assets/team/placeholder-avatar.jpg",
  },
];

export const advisors: Advisor[] = [
  {
    id: "advisor-1",
    name: "Fintech Advisor",
    domainKey: "Digital Lending & Compliance",
    contributionKey:
      "Advises on regulatory alignment, transparent product design, and trust-building practices.",
    imageAsset: "/assets/team/placeholder-avatar.jpg",
    linkedIn: "https://www.linkedin.com",
  },
  {
    id: "advisor-2",
    name: "MSME Advisor",
    domainKey: "Small Business Banking",
    contributionKey: "Helps shape the borrower experience around real MSME cash-flow needs.",
    imageAsset: "/assets/team/placeholder-avatar.jpg",
  },
];
