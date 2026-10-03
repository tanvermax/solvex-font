// src/components/layout/AboutLayout/constants.ts
import {
  Target,
  TrendingUp,
  Zap,
  DollarSign,
  Activity,
  Users,
  Clock,
  ShieldCheck,
  Lock,
  Globe,
  Award,
  FileCheck,
  Building2,
  BarChart3,
  Eye,
  Handshake,
  Shield,
  Truck,
  FileText,
  Layers,
  Rocket,
  Sparkles,
  Cpu,
  LineChart,
  Package,
} from "lucide-react";

// ============================================
// TEAM MEMBERS
// ============================================
export const TEAM_MEMBERS = [
  {
    name: "Sayem Kabir Saurav",
    position: "Managing Director",
    badge: "Strategic Vision",
    badgeIcon: Target,
    phone: "+880 1820-889194",
    email: "sayem@solvexsupply.com",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop",
    quote:
      "The future of B2B procurement isn't about transactions — it's about partnerships that scale with your ambitions.",
    bio: "Driving SolveX's vision to redefine industrial supply chains across South Asia. 15+ years scaling enterprise operations.",
    linkedin: "#",
  },
  {
    name: "Nehal Ahmmed Nayeem",
    position: "Marketing Manager",
    badge: "Market Empathy",
    badgeIcon: TrendingUp,
    phone: "+880 1624-270740",
    email: "nehal@solvexsupply.com",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    quote:
      "We don't sell products. We build trust, one verified supplier at a time.",
    bio: "Shaping SolveX's brand as the trusted bridge between enterprise buyers and world-class manufacturers.",
    linkedin: "#",
  },
  {
    name: "MD. Mehadi Hasan",
    position: "Manager - Operations",
    badge: "Operational Excellence",
    badgeIcon: Zap,
    phone: "+880 1402-535421",
    email: "mehadi@solvexsupply.com",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop",
    quote: "A promise of 24 hours means 24 hours. No exceptions. No excuses.",
    bio: "Orchestrating end-to-end logistics, quality assurance, and SLA compliance across 15+ industries.",
    linkedin: "#",
  },
];

// ============================================
// METRICS
// ============================================
export const METRICS = [
  {
    value: "৳500M+",
    label: "Processed Annually",
    icon: DollarSign,
  },
  {
    value: "99.9%",
    label: "Platform Uptime",
    icon: Activity,
  },
  {
    value: "500+",
    label: "Enterprise Clients",
    icon: Users,
  },
  {
    value: "< 24h",
    label: "Quote SLA",
    icon: Clock,
  },
];

// ============================================
// COMPLIANCE BADGES
// ============================================
export const COMPLIANCE = [
  { name: "ISO 27001", icon: ShieldCheck },
  { name: "SOC 2 Type II", icon: Lock },
  { name: "GDPR Ready", icon: Globe },
  { name: "BSTI", icon: Award },
  { name: "Trade Licensed", icon: FileCheck },
  { name: "MSME Registered", icon: Building2 },
];

// ============================================
// CORE VALUES
// ============================================
export const CORE_VALUES = [
  {
    icon: BarChart3,
    title: "Data-Driven Precision",
    description:
      "Every decision is backed by metrics. We don't guess — we measure, we test, we optimize. What gets measured, gets scaled.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Eye,
    title: "Radical Transparency",
    description:
      "Every price is explained. Every timeline is honest. Every SLA is contractual. No hidden fees, no vague promises.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Reliability",
    description:
      "Uptime isn't aspirational — it's contractual. We build systems that perform under pressure, at scale, without excuses.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Handshake,
    title: "Long-Term Partnership",
    description:
      "We don't optimize for single transactions. We optimize for decade-long relationships that grow with your business.",
    color: "from-orange-500 to-orange-600",
  },
];

// ============================================
// MILESTONES
// ============================================
export const MILESTONES = [
  {
    year: "2020",
    title: "Foundation",
    description:
      "SolveX founded with a mission to digitize B2B procurement in Bangladesh.",
    icon: Sparkles,
  },
  {
    year: "2022",
    title: "100 Clients",
    description:
      "Reached 100 active enterprise clients across 5 industries.",
    icon: Users,
  },
  {
    year: "2023",
    title: "Logistics Network",
    description:
      "Launched integrated fleet network covering all major divisional cities.",
    icon: Truck,
  },
  {
    year: "2024",
    title: "500+ Enterprises",
    description:
      "Crossed 500 active enterprise accounts with 24-hour SLA guarantee.",
    icon: Award,
  },
  {
    year: "2025",
    title: "Series A & Expansion",
    description:
      "Raised Series A funding and expanded to international B2B markets.",
    icon: Rocket,
  },
];

// ============================================
// WHY CHOOSE US
// ============================================
export const WHY_US = [
  {
    icon: ShieldCheck,
    title: "Verified Suppliers",
    description:
      "Every supplier is vetted and certified for quality and reliability.",
  },
  {
    icon: Truck,
    title: "Own Fleet Logistics",
    description:
      "Reliable delivery across the nation with real-time tracking.",
  },
  {
    icon: LineChart,
    title: "Wholesale Pricing",
    description:
      "Direct factory procurement eliminates all middlemen markups.",
  },
  {
    icon: FileText,
    title: "24h RFQ Turnaround",
    description:
      "Get formal quotations within 24 hours with transparent pricing.",
  },
];