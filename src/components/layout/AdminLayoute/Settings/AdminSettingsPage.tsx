// src/pages/admin/Settings/AdminSettingsPage.tsx
import { useState, useEffect } from "react";
import {
  Settings,
  Building,
  Mail,
  Shield,
  Truck,
  DollarSign,
  Save,
  RefreshCw,
  Loader2,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

// ============================================
// SCHEMAS
// ============================================

const generalSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteDescription: z.string().optional(),
  siteLogo: z.string().optional(),
  favicon: z.string().optional(),
  timezone: z.string().min(1, "Timezone is required"),
  dateFormat: z.string().min(1, "Date format is required"),
  timeFormat: z.string().min(1, "Time format is required"),
  currency: z.string().min(1, "Currency is required"),
  currencySymbol: z.string().min(1, "Currency symbol is required"),
  language: z.string().min(1, "Language is required"),
});

const companySettingsSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyAddress: z.string().min(1, "Company address is required"),
  companyPhone: z.string().min(1, "Company phone is required"),
  companyEmail: z.string().email("Invalid email address"),
  companyWebsite: z.string().optional(),
  companyRegistration: z.string().optional(),
  taxId: z.string().optional(),
  companyLogo: z.string().optional(),
  companyDescription: z.string().optional(),
});

const shippingSettingsSchema = z.object({
  defaultCarrier: z.string().min(1, "Default carrier is required"),
  shippingCountries: z.array(z.string()).default([]),
  shippingZones: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      countries: z.array(z.string()),
      rates: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          price: z.number(),
          weightRange: z.object({
            min: z.number(),
            max: z.number(),
          }),
        })
      ),
    })
  ).default([]),
  freeShippingThreshold: z.number().optional(),
  handlingFee: z.number().optional(),
  estimatedDeliveryDays: z.number().min(1, "Estimated delivery days is required"),
});

const taxSettingsSchema = z.object({
  taxRates: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Tax name is required"),
      rate: z.number().min(0, "Tax rate must be positive"),
      region: z.string().min(1, "Region is required"),
      isDefault: z.boolean().default(false),
    })
  ).default([]),
  taxInclusive: z.boolean().default(false),
  taxCalculationMethod: z.enum(["exclusive", "inclusive"]).default("exclusive"),
  displayTaxInTotal: z.boolean().default(true),
});

const emailSettingsSchema = z.object({
  smtpHost: z.string().min(1, "SMTP host is required"),
  smtpPort: z.number().min(1, "SMTP port is required"),
  smtpUser: z.string().min(1, "SMTP user is required"),
  smtpPassword: z.string().min(1, "SMTP password is required"),
  smtpEncryption: z.enum(["tls", "ssl", "none"]),
  fromEmail: z.string().email("Invalid email address"),
  fromName: z.string().min(1, "From name is required"),
  replyTo: z.string().email("Invalid email address").optional(),
  emailTemplates: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      subject: z.string(),
      body: z.string(),
    })
  ).default([]),
});

const securitySettingsSchema = z.object({
  twoFactorAuth: z.boolean().default(false),
  sessionTimeout: z.number().min(1, "Session timeout is required"),
  maxLoginAttempts: z.number().min(1, "Max login attempts is required"),
  passwordPolicy: z.object({
    minLength: z.number().min(6, "Minimum length must be at least 6"),
    requireUppercase: z.boolean().default(true),
    requireLowercase: z.boolean().default(true),
    requireNumbers: z.boolean().default(true),
    requireSpecialChars: z.boolean().default(true),
    expiryDays: z.number().optional(),
  }),
  ipWhitelist: z.array(z.string()).default([]),
  rateLimiting: z.boolean().default(true),
  apiAccess: z.boolean().default(true),
});

// ============================================
// TYPES
// ============================================

type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>;
type CompanySettingsValues = z.infer<typeof companySettingsSchema>;
type ShippingSettingsValues = z.infer<typeof shippingSettingsSchema>;
type TaxSettingsValues = z.infer<typeof taxSettingsSchema>;
type EmailSettingsValues = z.infer<typeof emailSettingsSchema>;
type SecuritySettingsValues = z.infer<typeof securitySettingsSchema>;

// ============================================
// MOCK DATA
// ============================================

const mockGeneralSettings: GeneralSettingsValues = {
  siteName: "B2B Logistics Platform",
  siteDescription: "Modern B2B E-Commerce & Fleet Logistics Platform",
  siteLogo: "/logo.png",
  favicon: "/favicon.ico",
  timezone: "Asia/Dhaka",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "12h",
  currency: "BDT",
  currencySymbol: "৳",
  language: "en",
};

const mockCompanySettings: CompanySettingsValues = {
  companyName: "Islam Industries Ltd.",
  companyAddress: "125, New Elephant Road, Dhaka-1205, Bangladesh",
  companyPhone: "+880 1712-345678",
  companyEmail: "info@islamindustries.com",
  companyWebsite: "www.islamindustries.com",
  companyRegistration: "REG-2024-001",
  taxId: "TAX-2024-001",
  companyLogo: "/company-logo.png",
  companyDescription: "Leading industrial equipment manufacturer and supplier",
};

const mockShippingSettings: ShippingSettingsValues = {
  defaultCarrier: "SA Paribahan",
  shippingCountries: ["Bangladesh", "India", "China", "Singapore", "Malaysia"],
  shippingZones: [
    {
      id: "zone-001",
      name: "Dhaka Metro",
      countries: ["Bangladesh"],
      rates: [
        {
          id: "rate-001",
          name: "Standard",
          price: 50,
          weightRange: { min: 0, max: 10 },
        },
        {
          id: "rate-002",
          name: "Express",
          price: 100,
          weightRange: { min: 0, max: 10 },
        },
      ],
    },
  ],
  freeShippingThreshold: 5000,
  handlingFee: 20,
  estimatedDeliveryDays: 3,
};

const mockTaxSettings: TaxSettingsValues = {
  taxRates: [
    {
      id: "tax-001",
      name: "VAT Standard",
      rate: 15,
      region: "Bangladesh",
      isDefault: true,
    },
    {
      id: "tax-002",
      name: "VAT Reduced",
      rate: 5,
      region: "Bangladesh",
      isDefault: false,
    },
  ],
  taxInclusive: false,
  taxCalculationMethod: "exclusive",
  displayTaxInTotal: true,
};

const mockEmailSettings: EmailSettingsValues = {
  smtpHost: "smtp.gmail.com",
  smtpPort: 587,
  smtpUser: "noreply@islamindustries.com",
  smtpPassword: "********",
  smtpEncryption: "tls",
  fromEmail: "noreply@islamindustries.com",
  fromName: "Islam Industries",
  replyTo: "support@islamindustries.com",
  emailTemplates: [
    {
      id: "temp-001",
      name: "Order Confirmation",
      subject: "Order Confirmation - {{orderNumber}}",
      body: "Dear {{customerName}}, your order has been confirmed...",
    },
    {
      id: "temp-002",
      name: "Order Shipped",
      subject: "Your order has been shipped - {{orderNumber}}",
      body: "Dear {{customerName}}, your order has been shipped...",
    },
  ],
};

const mockSecuritySettings: SecuritySettingsValues = {
  twoFactorAuth: true,
  sessionTimeout: 60,
  maxLoginAttempts: 5,
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expiryDays: 90,
  },
  ipWhitelist: ["192.168.1.1", "10.0.0.1"],
  rateLimiting: true,
  apiAccess: true,
};

// ============================================
// CONSTANTS
// ============================================

const CURRENCIES = [
  { value: "BDT", label: "Bangladeshi Taka (BDT)", symbol: "৳" },
  { value: "USD", label: "US Dollar (USD)", symbol: "$" },
  { value: "EUR", label: "Euro (EUR)", symbol: "€" },
  { value: "GBP", label: "British Pound (GBP)", symbol: "£" },
];

const TIMEZONES = [
  "Asia/Dhaka",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Dubai",
  "Asia/Tokyo",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Australia/Sydney",
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "bn", label: "Bengali" },
  { value: "hi", label: "Hindi" },
];

const DATE_FORMATS = [
  "DD/MM/YYYY",
  "MM/DD/YYYY",
  "YYYY-MM-DD",
];

const TIME_FORMATS = ["12h", "24h"];

// ============================================
// COMPONENT
// ============================================

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [showPassword, setShowPassword] = useState(false);

  // Forms
  const generalForm = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema) as any,
    defaultValues: mockGeneralSettings,
  });

  const companyForm = useForm<CompanySettingsValues>({
    resolver: zodResolver(companySettingsSchema) as any,
    defaultValues: mockCompanySettings,
  });

  const shippingForm = useForm<ShippingSettingsValues>({
    resolver: zodResolver(shippingSettingsSchema)  as any,
    defaultValues: mockShippingSettings,
  });

  const taxForm = useForm<TaxSettingsValues>({
    resolver: zodResolver(taxSettingsSchema) as any,
    defaultValues: mockTaxSettings,
  });

  const emailForm = useForm<EmailSettingsValues>({
    resolver: zodResolver(emailSettingsSchema) as any,
    defaultValues: mockEmailSettings,
  });

// Security Settings - স্পেসিফিক টাইপ সহ
const securityForm = useForm<SecuritySettingsValues>({
  resolver: zodResolver(securitySettingsSchema) as any, // 🔥 টাইপ ইস্যু এড়ানোর জন্য
  defaultValues: mockSecuritySettings,
});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
    } catch (error) {
      console.error("Failed to load settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: any, section: string) => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`Saving ${section}:`, data);
      toast.success(`${section} saved successfully`);
    } catch (error) {
      console.error(`Failed to save ${section}:`, error);
      toast.error(`Failed to save ${section}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = (form: any, defaultValues: any, section: string) => {
    form.reset(defaultValues);
    toast.info(`${section} reset to default`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage system settings and configurations
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadSettings}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* ===== TABS ===== */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="flex flex-wrap gap-1 h-auto">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Shipping
          </TabsTrigger>
          <TabsTrigger value="tax" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Tax
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* ===== GENERAL SETTINGS ===== */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic site settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalForm}>
                <form
                  onSubmit={generalForm.handleSubmit((data) =>
                    handleSave(data, "General settings")
                  )}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={generalForm.control}
                      name="siteName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter site name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="siteDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter site description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="siteLogo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Logo</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input placeholder="/logo.png" {...field} className="flex-1" />
                              <Button variant="outline" type="button">Upload</Button>
                            </div>
                          </FormControl>
                          <FormDescription>Upload your site logo (PNG, JPG, SVG)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="favicon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Favicon</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input placeholder="/favicon.ico" {...field} className="flex-1" />
                              <Button variant="outline" type="button">Upload</Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timezone</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select timezone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {TIMEZONES.map((tz) => (
                                <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Language</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {LANGUAGES.map((lang) => (
                                <SelectItem key={lang.value} value={lang.value}>
                                  {lang.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="dateFormat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date Format</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select date format" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {DATE_FORMATS.map((format) => (
                                <SelectItem key={format} value={format}>{format}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="timeFormat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Format</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select time format" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {TIME_FORMATS.map((format) => (
                                <SelectItem key={format} value={format}>{format}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CURRENCIES.map((curr) => (
                                <SelectItem key={curr.value} value={curr.value}>
                                  {curr.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="currencySymbol"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency Symbol</FormLabel>
                          <FormControl>
                            <Input placeholder="৳" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleReset(generalForm, mockGeneralSettings, "General settings")}
                    >
                      Reset
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== COMPANY SETTINGS ===== */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Settings</CardTitle>
              <CardDescription>
                Configure company information and branding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...companyForm}>
                <form
                  onSubmit={companyForm.handleSubmit((data) =>
                    handleSave(data, "Company settings")
                  )}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={companyForm.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={companyForm.control}
                      name="companyEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="info@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={companyForm.control}
                      name="companyPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+880 1712-345678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={companyForm.control}
                      name="companyWebsite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Website</FormLabel>
                          <FormControl>
                            <Input placeholder="www.company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={companyForm.control}
                      name="companyRegistration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Registration</FormLabel>
                          <FormControl>
                            <Input placeholder="Registration number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={companyForm.control}
                      name="taxId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax ID / VAT</FormLabel>
                          <FormControl>
                            <Input placeholder="Tax ID number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={companyForm.control}
                      name="companyAddress"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Company Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter full company address" className="h-20" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={companyForm.control}
                      name="companyDescription"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Company Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter company description" className="h-20" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleReset(companyForm, mockCompanySettings, "Company settings")}
                    >
                      Reset
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== SHIPPING SETTINGS ===== */}
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Settings</CardTitle>
              <CardDescription>
                Configure shipping carriers, zones, and rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...shippingForm}>
                <form
                  onSubmit={shippingForm.handleSubmit((data) =>
                    handleSave(data, "Shipping settings")
                  )}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={shippingForm.control}
                      name="defaultCarrier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Carrier</FormLabel>
                          <FormControl>
                            <Input placeholder="SA Paribahan" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={shippingForm.control}
                      name="estimatedDeliveryDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Delivery (Days)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="3"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={shippingForm.control}
                      name="freeShippingThreshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Free Shipping Threshold</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="5000"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Minimum order amount for free shipping
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={shippingForm.control}
                      name="handlingFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Handling Fee</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="20"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleReset(shippingForm, mockShippingSettings, "Shipping settings")}
                    >
                      Reset
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== TAX SETTINGS ===== */}
        <TabsContent value="tax">
          <Card>
            <CardHeader>
              <CardTitle>Tax Settings</CardTitle>
              <CardDescription>
                Configure tax rates and calculation methods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...taxForm}>
                <form
                  onSubmit={taxForm.handleSubmit((data) =>
                    handleSave(data, "Tax settings")
                  )}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <FormField
                      control={taxForm.control}
                      name="taxCalculationMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax Calculation Method</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="exclusive">
                                Exclusive (Tax added at checkout)
                              </SelectItem>
                              <SelectItem value="inclusive">
                                Inclusive (Tax included in price)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose how tax is calculated on orders
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={taxForm.control}
                      name="taxInclusive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Tax Inclusive Pricing
                            </FormLabel>
                            <FormDescription>
                              Show prices including tax
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={taxForm.control}
                      name="displayTaxInTotal"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Display Tax in Total
                            </FormLabel>
                            <FormDescription>
                              Show tax breakdown in order total
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Separator />

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Tax Rates</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const currentRates = taxForm.getValues("taxRates") || [];
                            taxForm.setValue("taxRates", [
                              ...currentRates,
                              {
                                id: `tax-${Date.now()}`,
                                name: "",
                                rate: 0,
                                region: "",
                                isDefault: false,
                              },
                            ]);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Tax Rate
                        </Button>
                      </div>

                      <div className="border rounded-lg overflow-hidden">
                        <div className="grid grid-cols-12 gap-2 bg-muted/50 px-4 py-2 text-sm font-medium">
                          <div className="col-span-4">Name</div>
                          <div className="col-span-2">Rate (%)</div>
                          <div className="col-span-3">Region</div>
                          <div className="col-span-2">Default</div>
                          <div className="col-span-1 text-right">Action</div>
                        </div>

                        {taxForm.watch("taxRates")?.map((_, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-12 gap-2 items-center px-4 py-2 border-t"
                          >
                            <div className="col-span-4">
                              <FormField
                                control={taxForm.control}
                                name={`taxRates.${index}.name`}
                                render={({ field }) => (
                                  <FormItem className="space-y-0">
                                    <FormControl>
                                      <Input
                                        placeholder="VAT Standard"
                                        className="h-8 text-sm"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="col-span-2">
                              <FormField
                                control={taxForm.control}
                                name={`taxRates.${index}.rate`}
                                render={({ field }) => (
                                  <FormItem className="space-y-0">
                                    <FormControl>
                                      <Input
                                        type="number"
                                        placeholder="15"
                                        className="h-8 text-sm"
                                        {...field}
                                        onChange={(e) =>
                                          field.onChange(parseFloat(e.target.value) || 0)
                                        }
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="col-span-3">
                              <FormField
                                control={taxForm.control}
                                name={`taxRates.${index}.region`}
                                render={({ field }) => (
                                  <FormItem className="space-y-0">
                                    <FormControl>
                                      <Input
                                        placeholder="Bangladesh"
                                        className="h-8 text-sm"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="col-span-2">
                              <FormField
                                control={taxForm.control}
                                name={`taxRates.${index}.isDefault`}
                                render={({ field }) => (
                                  <FormItem className="space-y-0 flex justify-center">
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            const rates = taxForm.getValues("taxRates");
                                            rates.forEach((_, i) => {
                                              taxForm.setValue(
                                                `taxRates.${i}.isDefault`,
                                                i === index
                                              );
                                            });
                                          } else {
                                            field.onChange(false);
                                          }
                                        }}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="col-span-1 text-right">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                onClick={() => {
                                  const rates = taxForm.getValues("taxRates");
                                  if (rates.length > 1) {
                                    taxForm.setValue(
                                      "taxRates",
                                      rates.filter((_, i) => i !== index)
                                    );
                                  } else {
                                    toast.error("At least one tax rate is required");
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}

                        {(!taxForm.watch("taxRates") || taxForm.watch("taxRates").length === 0) && (
                          <div className="p-8 text-center text-sm text-muted-foreground">
                            No tax rates configured. Add your first tax rate.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleReset(taxForm, mockTaxSettings, "Tax settings")}
                    >
                      Reset
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== EMAIL SETTINGS ===== */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>
                Configure SMTP and email templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...emailForm}>
                <form
                  onSubmit={emailForm.handleSubmit((data) =>
                    handleSave(data, "Email settings")
                  )}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={emailForm.control}
                      name="smtpHost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Host</FormLabel>
                          <FormControl>
                            <Input placeholder="smtp.gmail.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={emailForm.control}
                      name="smtpPort"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Port</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="587"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={emailForm.control}
                      name="smtpUser"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Username</FormLabel>
                          <FormControl>
                            <Input placeholder="noreply@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={emailForm.control}
                      name="smtpPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                {...field}
                                className="pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={emailForm.control}
                      name="smtpEncryption"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Encryption</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select encryption" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="tls">TLS</SelectItem>
                              <SelectItem value="ssl">SSL</SelectItem>
                              <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={emailForm.control}
                      name="fromEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="noreply@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={emailForm.control}
                      name="fromName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Company Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={emailForm.control}
                      name="replyTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reply-to Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="reply@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>SMTP Configuration</AlertTitle>
                    <AlertDescription>
                      Make sure your SMTP server is configured correctly before saving.
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleReset(emailForm, mockEmailSettings, "Email settings")}
                    >
                      Reset
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== SECURITY SETTINGS ===== */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security policies and access controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form
                  onSubmit={securityForm.handleSubmit((data) =>
                    handleSave(data, "Security settings")
                  )}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={securityForm.control}
                        name="twoFactorAuth"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Two-Factor Authentication
                              </FormLabel>
                              <FormDescription>
                                Require 2FA for admin access
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={securityForm.control}
                        name="rateLimiting"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Rate Limiting
                              </FormLabel>
                              <FormDescription>
                                Prevent brute force attacks
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={securityForm.control}
                        name="apiAccess"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                API Access
                              </FormLabel>
                              <FormDescription>
                                Enable REST API for integrations
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={securityForm.control}
                        name="sessionTimeout"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Session Timeout (Minutes)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="60"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={securityForm.control}
                        name="maxLoginAttempts"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Login Attempts</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="5"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="border rounded-lg p-4 space-y-4">
                      <h4 className="font-medium">Password Policy</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={securityForm.control}
                          name="passwordPolicy.minLength"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minimum Length</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="8"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(parseInt(e.target.value) || 0)
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={securityForm.control}
                          name="passwordPolicy.expiryDays"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Days</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="90"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(parseInt(e.target.value) || 0)
                                  }
                                />
                              </FormControl>
                              <FormDescription>Leave empty for no expiry</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <FormField
                          control={securityForm.control}
                          name="passwordPolicy.requireUppercase"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="text-sm">Uppercase</FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={securityForm.control}
                          name="passwordPolicy.requireLowercase"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="text-sm">Lowercase</FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={securityForm.control}
                          name="passwordPolicy.requireNumbers"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="text-sm">Numbers</FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={securityForm.control}
                          name="passwordPolicy.requireSpecialChars"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="text-sm">Special Characters</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertTitle>Security Best Practices</AlertTitle>
                      <AlertDescription>
                        Enable 2FA and rate limiting for enhanced security.
                      </AlertDescription>
                    </Alert>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleReset(securityForm, mockSecuritySettings, "Security settings")}
                    >
                      Reset
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}