// pages/RFQ/RFQPage.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  Building2,
  PhoneCall,
  Loader2,
  ArrowRight,
  Quote,
  Users,
  Globe,
  Zap,
  Shield,
  Check,
  HelpCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCreateRFQMutation, RFQFormData } from "@/redux/features/rfq/rfq.api";

// ============================================
// SCHEMA
// ============================================
const rfqSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  companyName: z.string().min(2, "Company name is required"),
  workEmail: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  industry: z.string().min(1, "Industry is required"),
  productDetails: z.string().min(10, "Please provide product details"),
  quantity: z.string().min(1, "Quantity is required"),
  targetPrice: z.string().optional(),
  paymentTerms: z.string().min(1, "Payment terms are required"),
  deliveryTimeline: z.string().min(1, "Delivery timeline is required"),
});

type RFQFormValues = z.infer<typeof rfqSchema>;

// ============================================
// CONSTANTS
// ============================================
const INDUSTRIES = [
  { value: "rmg", label: "Ready-Made Garments & Textiles", icon: Globe },
  { value: "construction", label: "Construction & Infrastructure", icon: Building2 },
  { value: "power", label: "Power, Energy & Electrical", icon: Zap },
  { value: "pharma", label: "Pharmaceuticals & Healthcare", icon: Shield },
  { value: "other", label: "Other Industrial Sector", icon: HelpCircle },
];

const DELIVERY_OPTIONS = [
  { value: "urgent", label: "Urgent (Within 3–5 Days)" },
  { value: "standard", label: "Standard (7–14 Days)" },
  { value: "scheduled", label: "Scheduled Monthly Delivery" },
];

const PAYMENT_OPTIONS = [
  { value: "cash", label: "Advance / Bank Transfer" },
  { value: "lc", label: "Letter of Credit (L/C)" },
  { value: "credit", label: "30-Day Corporate Credit" },
];

// ============================================
// COMPONENTS
// ============================================

const HeroSection = () => (
  <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 md:mb-16">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold uppercase tracking-widest"
    >
      <Sparkles className="size-3.5 animate-pulse" />
      <span>Fast-Track Corporate Bidding</span>
    </motion.div>

    <motion.h1
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]"
    >
      Request a{" "}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/60">
        Formal RFQ
      </span>
    </motion.h1>

    <motion.p
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto"
    >
      Submit your material requirements. Our procurement team will review
      and issue a verified quote within <span className="font-semibold text-foreground">24 hours</span>.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground"
    >
      <Badge variant="secondary" className="gap-1">
        <Check className="size-3 text-emerald-500" />
        24hr Response
      </Badge>
      <Badge variant="secondary" className="gap-1">
        <Check className="size-3 text-emerald-500" />
        Verified Quotes
      </Badge>
      <Badge variant="secondary" className="gap-1">
        <Check className="size-3 text-emerald-500" />
        NDA Protected
      </Badge>
    </motion.div>
  </div>
);

const SuccessCard = ({ referenceId, onReset }: { referenceId: string; onReset: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="py-12 text-center space-y-6 bg-gradient-to-br from-emerald-50/50 to-emerald-50/20 dark:from-emerald-950/20 dark:to-emerald-950/10 rounded-2xl border border-emerald-500/30 p-8"
  >
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl animate-pulse" />
      <div className="relative size-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="size-10" />
      </div>
    </div>
    <div>
      <h2 className="text-2xl font-black text-foreground">RFQ Submitted Successfully!</h2>
      <p className="text-sm text-muted-foreground mt-2">
        Your reference ID is{" "}
        <span className="font-mono font-bold text-primary">{referenceId}</span>
      </p>
    </div>
    <div className="max-w-sm mx-auto p-4 bg-background/50 rounded-xl border border-border/50 text-xs text-muted-foreground space-y-1">
      <p>📧 You'll receive the official quotation via email shortly</p>
      <p>⏱️ Our team will respond within 24 hours</p>
      <p>📄 Check your spam folder if you don't see our email</p>
    </div>
    <Button onClick={onReset} variant="outline" className="rounded-xl text-sm font-bold gap-2">
      <Sparkles className="size-4" />
      Submit Another RFQ
    </Button>
  </motion.div>
);

// ============================================
// COMPLETE FORMFIELDS - সব ফিল্ড সহ
// ============================================
const FormFields = ({ form }: { form: any }) => (
  <div className="space-y-6">
    {/* Section 1: Contact Information */}
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <Building2 className="size-4" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-wider">1. Company & Contact Details</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="e.g. Tanveer Hossain" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company / Organization <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="e.g. SolveX Textiles Ltd." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="workEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work Email <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input type="email" placeholder="procurement@company.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone / WhatsApp <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="+880 1700-000000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>

    {/* Section 2: Procurement Details */}
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <FileText className="size-4" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-wider">2. Order Specifications</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Industry <span className="text-destructive">*</span></FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {INDUSTRIES.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <SelectItem key={opt.value} value={opt.value}>
                        <span className="flex items-center gap-2">
                          <Icon className="size-4" />
                          {opt.label}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required Quantity <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="e.g. 2,000 Pcs or 50 Rolls" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="productDetails"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Requirements <span className="text-destructive">*</span></FormLabel>
            <FormControl>
              <Textarea
                rows={4}
                placeholder="Specify material grade, measurements, color, delivery date, or OEM references..."
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription className="text-xs">
              Be as specific as possible for accurate quotation
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="targetPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Target Price <span className="text-muted-foreground">(Optional)</span></FormLabel>
            <FormControl>
              <Input placeholder="e.g. ৳500 per unit" {...field} />
            </FormControl>
            <FormDescription className="text-xs">
              Your expected price range (helps us tailor the quote)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    {/* Section 3: Commercial Preferences */}
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <Clock className="size-4" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-wider">3. Delivery & Payment Terms</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="deliveryTimeline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery Timeline <span className="text-destructive">*</span></FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DELIVERY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="paymentTerms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Terms <span className="text-destructive">*</span></FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PAYMENT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  </div>
);

const SidebarContent = () => (
  <div className="space-y-6 sticky top-24">
    <Card className="border-primary/10 shadow-lg shadow-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-extrabold flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary" />
          SolveX RFQ Guarantees
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {[
          { icon: Zap, text: "24-Hour Turnaround: Official PDF quote in your inbox" },
          { icon: Quote, text: "Transparent Pricing: Clear breakdown of costs" },
          { icon: Shield, text: "NDA & IP Protection: Your specs are confidential" },
        ].map((item, index) => (
          <div key={index} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-muted/30 transition-colors">
            <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <item.icon className="size-3" />
            </div>
            <span className="text-xs">{item.text}</span>
          </div>
        ))}
      </CardContent>
    </Card>

    <Card className="bg-gradient-to-br from-primary/5 to-primary/2 border-primary/20">
      <CardContent className="p-6 text-center space-y-3">
        <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <PhoneCall className="size-5" />
        </div>
        <h4 className="font-bold text-sm">Need Immediate Help?</h4>
        <p className="text-xs text-muted-foreground">
          For tenders or orders over ৳1,000,000
        </p>
        <Button asChild variant="outline" size="sm" className="w-full text-xs font-bold rounded-xl border-primary/20 hover:bg-primary/5">
          <a href="tel:+8801700000000">
            <PhoneCall className="size-3 mr-2" />
            Call Help Desk (+880) 1700-000000
          </a>
        </Button>
      </CardContent>
    </Card>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
export default function RFQPage() {
  const [searchParams] = useSearchParams();
  const prefilledProduct = searchParams.get("product") || "";
  const prefilledIndustry = searchParams.get("industry") || "";
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  const [createRFQ, { isLoading }] = useCreateRFQMutation();

  const form = useForm<RFQFormValues>({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      fullName: "",
      companyName: "",
      workEmail: "",
      phone: "",
      industry: prefilledIndustry || "rmg",
      productDetails: prefilledProduct ? `RFQ for Product ID: ${prefilledProduct}` : "",
      quantity: "",
      targetPrice: "",
      paymentTerms: "cash",
      deliveryTimeline: "standard",
    },
  });

  // 🔥 FIXED: সঠিকভাবে payload তৈরি করুন
  const onSubmit = async (data: RFQFormValues) => {
    try {
      // API Payload তৈরি করুন - সব required ফিল্ড সহ
      const payload: RFQFormData = {
        fullName: data.fullName,
        companyName: data.companyName,
        workEmail: data.workEmail,
        phone: data.phone,
        industry: data.industry,
        productDetails: data.productDetails,
        quantity: data.quantity,
        paymentTerms: data.paymentTerms,
        deliveryTimeline: data.deliveryTimeline,
        targetPrice: data.targetPrice || undefined,
      };

      console.log("📤 Submitting RFQ payload:", payload);

      const response = await createRFQ(payload).unwrap();
      
      if (response.success) {
        setReferenceId(response.data.rfqNumber);
        setSubmitted(true);
        toast.success("RFQ submitted successfully!", {
          description: `Reference ID: ${response.data.rfqNumber}`,
        });
        form.reset();
      }
    } catch (error: any) {
      console.error("RFQ submission error:", error);
      const message = error?.data?.message || "Failed to submit RFQ. Please try again.";
      toast.error(message);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setReferenceId("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/50 pt-24 pb-20 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[200px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <HeroSection />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-8"
          >
            <Card className="border-border/70 shadow-2xl shadow-primary/5 backdrop-blur-sm bg-background/95">
              <CardContent className="p-6 sm:p-8">
                {submitted ? (
                  <SuccessCard referenceId={referenceId} onReset={handleReset} />
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <FormFields form={form} />

                      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-border/50">
                        <div className="flex-1 text-xs text-muted-foreground text-center sm:text-left">
                          <p>By submitting, you agree to our</p>
                          <p>
                            <a href="#" className="text-primary hover:underline">Terms of Service</a>
                            {" and "}
                            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                          </p>
                        </div>
                        <Button
                          type="submit"
                          size="lg"
                          disabled={isLoading}
                          className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-bold text-sm h-12 px-8 rounded-xl shadow-lg shadow-primary/25 transition-all duration-300 gap-2 disabled:opacity-70"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="size-4" />
                              Submit RFQ
                              <ArrowRight className="size-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-4"
          >
            <SidebarContent />
          </motion.div>
        </div>
      </div>
    </div>
  );
}