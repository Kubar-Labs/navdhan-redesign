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
    logoAsset: "/assets/badges/face-logo.svg",
    altKey: "global.alt.face",
    href: "#",
  },
  {
    name: "Startup Mahakumbh",
    logoAsset: "/assets/badges/startup-mahakumbh-logo.svg",
    altKey: "global.alt.startupMahakumbh",
    href: "#",
  },
  {
    name: "STPI FinGlobe",
    logoAsset: "/assets/badges/stpi-finglobe-logo.svg",
    altKey: "global.alt.stpiFinglobe",
    href: "#",
  },
  {
    name: "FinVision",
    logoAsset: "/assets/badges/finvision-logo.svg",
    altKey: "global.alt.finvision",
    href: "#",
  },
];

export const techPartners: PartnerItem[] = [
  {
    name: "Google",
    logoAsset: "/assets/partners/google-logo.svg",
    altKey: "global.alt.partnerLogo",
  },
  {
    name: "NVIDIA",
    logoAsset: "/assets/partners/nvidia-logo.svg",
    altKey: "global.alt.partnerLogo",
  },
  {
    name: "Microsoft",
    logoAsset: "/assets/partners/microsoft-logo.svg",
    altKey: "global.alt.partnerLogo",
  },
  { name: "Intel", logoAsset: "/assets/partners/intel-logo.svg", altKey: "global.alt.partnerLogo" },
  {
    name: "Perplexity",
    logoAsset: "/assets/partners/perplexity-logo.svg",
    altKey: "global.alt.partnerLogo",
  },
  {
    name: "OpenAI",
    logoAsset: "/assets/partners/openai-logo.svg",
    altKey: "global.alt.partnerLogo",
  },
  {
    name: "Amplitude",
    logoAsset: "/assets/partners/amplitude-logo.svg",
    altKey: "global.alt.partnerLogo",
  },
  {
    name: "Eleven Labs",
    logoAsset: "/assets/partners/elevenlabs-logo.svg",
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
    id: "finvision",
    titleKey: "FinVision 2026, NIBM",
    descriptionKey: "Showcased NavDhan's work in building simpler credit access for India's MSMEs.",
    imageAsset: "/assets/recognition/finvision-2026.jpg",
    date: "2026",
  },
  {
    id: "india-ai",
    titleKey: "India AI Summit",
    descriptionKey:
      "Shared NavDhan's vision for simple, fair business loans with policymakers and investors.",
    imageAsset: "/assets/recognition/india-ai-summit.jpg",
    date: "2026",
  },
  {
    id: "startup-mahakumbh",
    titleKey: "Startup Mahakumbh",
    descriptionKey:
      "Chosen by India's largest startup gathering for making finance more accessible to small businesses.",
    imageAsset: "/assets/recognition/startup-mahakumbh.jpg",
    date: "2026",
  },
  {
    id: "bengaluru-tech",
    titleKey: "Bengaluru Tech Summit",
    descriptionKey:
      "Introduced NavDhan as a calm, simple way for Karnataka businesses to access working capital.",
    imageAsset: "/assets/recognition/bengaluru-tech-summit.jpg",
    date: "2026",
  },
  {
    id: "stpi-imc",
    titleKey: "STPI IMC",
    descriptionKey:
      "Recognised by STPI's India Accelerator for innovation in small business finance.",
    imageAsset: "/assets/recognition/stpi-imc.jpg",
    date: "2026",
  },
  {
    id: "kotak-bizlabs",
    titleKey: "Kotak BizLabs Demo Day",
    descriptionKey:
      "Featured by Kotak's enterprise startup network for practical financial tools for MSMEs.",
    imageAsset: "/assets/recognition/kotak-bizlabs.jpg",
    date: "2026",
  },
  {
    id: "bharat-innovation",
    titleKey: "Bharat Innovation Conclave",
    descriptionKey:
      "Showcased at a national forum for inclusive finance solutions that support real businesses.",
    imageAsset: "/assets/recognition/bharat-innovation-conclave.jpg",
    date: "2026",
  },
  {
    id: "rubrix-t-hub",
    titleKey: "Rubrix, T-Hub",
    descriptionKey:
      "Selected by T-Hub's Rubrix program for building high-impact solutions for Indian businesses.",
    imageAsset: "/assets/recognition/rubrix-t-hub.jpg",
    date: "2026",
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
