// src/pages/admin/RFQ/AdminQuotationTemplatesPage.tsx
import { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  MoreVertical,
  Eye,
  Loader2,
  RefreshCw,
  CheckCircle,
  Star,
  FileSpreadsheet,
  Layers,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Types
interface TemplateItem {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  deliveryTime: string;
  notes?: string;
}

interface QuotationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  items: TemplateItem[];
  subtotal: number;
  taxRate: number;
  discountRate: number;
  total: number;
  currency: string;
  validityDays: number;
  paymentTerms: string;
  deliveryTerms: string;
  termsAndConditions: string;
  isDefault: boolean;
  usageCount: number;
  lastUsed?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
  notes?: string;
}

// Zod Schema for Template
const templateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  items: z.array(
    z.object({
      id: z.string().optional(),
      productName: z.string().min(1, "Product name is required"),
      sku: z.string().optional(),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      unit: z.string().min(1, "Unit is required"),
      unitPrice: z.number().min(0, "Unit price must be positive"),
      deliveryTime: z.string().min(1, "Delivery time is required"),
      notes: z.string().optional(),
    })
  ),
  taxRate: z.number().min(0, "Tax rate must be positive"),
  discountRate: z.number().min(0, "Discount rate must be positive"),
  currency: z.string().min(1, "Currency is required"),
  validityDays: z.number().min(1, "Validity days must be at least 1"),
  paymentTerms: z.string().min(1, "Payment terms are required"),
  deliveryTerms: z.string().min(1, "Delivery terms are required"),
  termsAndConditions: z.string().optional(),
  isDefault: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

// Mock Data
const mockTemplates: QuotationTemplate[] = [
  {
    id: "temp-001",
    name: "Standard Industrial Equipment Quote",
    description: "Standard quotation template for industrial equipment",
    category: "Industrial Equipment",
    items: [
      {
        id: "item-001",
        productName: "Hydraulic Pump",
        sku: "HP-2024-001",
        quantity: 1,
        unit: "unit",
        unitPrice: 25000,
        deliveryTime: "7-10 business days",
        notes: "Standard model with 2-year warranty",
      },
      {
        id: "item-002",
        productName: "Hydraulic Cylinder",
        sku: "HC-2024-002",
        quantity: 2,
        unit: "unit",
        unitPrice: 18000,
        deliveryTime: "5-7 business days",
      },
    ],
    subtotal: 61000,
    taxRate: 15,
    discountRate: 5,
    total: 66547.5,
    currency: "BDT",
    validityDays: 15,
    paymentTerms: "30% advance, 70% upon delivery",
    deliveryTerms: "FOB Chittagong",
    termsAndConditions:
      "All equipment comes with standard manufacturer warranty. Installation and training available at additional cost.",
    isDefault: true,
    usageCount: 45,
    lastUsed: "2026-09-08T10:00:00Z",
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-09-01T10:00:00Z",
    createdBy: "Admin",
    tags: ["industrial", "hydraulic", "standard"],
  },
  {
    id: "temp-002",
    name: "Corporate Bulk Order Template",
    description: "For corporate clients ordering in bulk quantities",
    category: "Corporate",
    items: [
      {
        id: "item-003",
        productName: "Steel Roller - Heavy Duty",
        sku: "SR-2024-003",
        quantity: 10,
        unit: "units",
        unitPrice: 8750,
        deliveryTime: "10-15 business days",
        notes: "Bulk discount applied",
      },
      {
        id: "item-004",
        productName: "Conveyor Belt System",
        sku: "CBS-2024-004",
        quantity: 2,
        unit: "system",
        unitPrice: 42500,
        deliveryTime: "15-20 business days",
      },
    ],
    subtotal: 172500,
    taxRate: 15,
    discountRate: 15,
    total: 168543.75,
    currency: "BDT",
    validityDays: 20,
    paymentTerms: "40% advance, 60% upon delivery",
    deliveryTerms: "CIF Chittagong",
    termsAndConditions:
      "Special bulk pricing applies for orders above 50 units. Lead time may vary based on availability.",
    isDefault: false,
    usageCount: 18,
    lastUsed: "2026-09-05T14:00:00Z",
    createdAt: "2026-02-20T10:00:00Z",
    updatedAt: "2026-08-25T10:00:00Z",
    createdBy: "Admin",
    tags: ["corporate", "bulk", "discount"],
  },
  {
    id: "temp-003",
    name: "Quick Quote - Small Orders",
    description: "Template for small and urgent orders",
    category: "Small Orders",
    items: [
      {
        id: "item-005",
        productName: "Industrial Grease 5L",
        sku: "IG-2024-005",
        quantity: 5,
        unit: "liters",
        unitPrice: 450,
        deliveryTime: "2-3 business days",
      },
      {
        id: "item-006",
        productName: "Air Hose Pipe 50ft",
        sku: "AHP-2024-006",
        quantity: 3,
        unit: "units",
        unitPrice: 1200,
        deliveryTime: "2-3 business days",
      },
    ],
    subtotal: 5850,
    taxRate: 15,
    discountRate: 0,
    total: 6727.5,
    currency: "BDT",
    validityDays: 7,
    paymentTerms: "100% advance payment",
    deliveryTerms: "Door delivery",
    termsAndConditions:
      "Small orders are processed within 24 hours. Express shipping available.",
    isDefault: false,
    usageCount: 32,
    lastUsed: "2026-09-07T09:00:00Z",
    createdAt: "2026-03-10T10:00:00Z",
    updatedAt: "2026-08-30T10:00:00Z",
    createdBy: "Admin",
    tags: ["small", "quick", "urgent"],
  },
  {
    id: "temp-004",
    name: "International Export Template",
    description: "For international clients and export orders",
    category: "International",
    items: [
      {
        id: "item-007",
        productName: "Air Compressor 50L",
        sku: "AC-2024-007",
        quantity: 5,
        unit: "units",
        unitPrice: 12500,
        deliveryTime: "25-30 business days",
        notes: "Export packaging included",
      },
      {
        id: "item-008",
        productName: "Electric Motor 5HP",
        sku: "EM-2024-008",
        quantity: 3,
        unit: "units",
        unitPrice: 8500,
        deliveryTime: "20-25 business days",
      },
    ],
    subtotal: 88000,
    taxRate: 0,
    discountRate: 8,
    total: 80960,
    currency: "USD",
    validityDays: 30,
    paymentTerms: "50% advance, 50% against shipping documents",
    deliveryTerms: "CIF by sea",
    termsAndConditions:
      "All prices in USD. Shipping and insurance included. Customs duties are buyer's responsibility.",
    isDefault: false,
    usageCount: 8,
    lastUsed: "2026-08-20T10:00:00Z",
    createdAt: "2026-04-05T10:00:00Z",
    updatedAt: "2026-07-15T10:00:00Z",
    createdBy: "Admin",
    tags: ["international", "export", "usd"],
  },
];

const CATEGORIES = [
  "Industrial Equipment",
  "Corporate",
  "Small Orders",
  "International",
  "Construction",
  "Automotive",
  "Electronics",
  "Machinery",
  "Spare Parts",
  "Other",
];

const UNITS = ["unit", "kg", "lbs", "tons", "liters", "meters", "feet", "system", "set"];

export default function AdminQuotationTemplatesPage() {
  const [templates, setTemplates] = useState<QuotationTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selectedTemplate, setSelectedTemplate] = useState<QuotationTemplate | null>(
    null
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      category: "",
      items: [
        {
          productName: "",
          sku: "",
          quantity: 1,
          unit: "unit",
          unitPrice: 0,
          deliveryTime: "",
          notes: "",
        },
      ],
      taxRate: 15,
      discountRate: 0,
      currency: "BDT",
      validityDays: 15,
      paymentTerms: "",
      deliveryTerms: "",
      termsAndConditions: "",
      isDefault: false,
      tags: [],
      notes: "",
    },
  } as any);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setTemplates(mockTemplates);
    } catch (error) {
      console.error("Failed to load templates:", error);
      toast.error("Failed to load templates");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTemplate = async (data: TemplateFormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const subtotal = data.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      const discount = (subtotal * data.discountRate) / 100;
      const tax = (subtotal - discount) * (data.taxRate / 100);
      const total = subtotal - discount + tax;

      const newTemplate: QuotationTemplate = {
        id: `temp-${Date.now()}`,
        name: data.name,
        description: data.description || "",
        category: data.category,
        items: data.items.map((item, index) => ({
          id: `item-${Date.now()}-${index}`,
          ...item,
        }) as any),
        subtotal,
        taxRate: data.taxRate,
        discountRate: data.discountRate,
        total,
        currency: data.currency,
        validityDays: data.validityDays,
        paymentTerms: data.paymentTerms,
        deliveryTerms: data.deliveryTerms,
        termsAndConditions: data.termsAndConditions || "",
        isDefault: data.isDefault,
        usageCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "Admin",
        tags: data.tags || [],
        notes: data.notes || "",
      };

      // If this template is set as default, unset others
      if (data.isDefault) {
        setTemplates((prev) =>
          prev.map((t) => ({ ...t, isDefault: false }))
        );
      }

      setTemplates([newTemplate, ...templates]);
      setIsAddDialogOpen(false);
      form.reset();
      toast.success("Template created successfully");
    } catch (error) {
      console.error("Failed to add template:", error);
      toast.error("Failed to add template");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTemplate = async (data: TemplateFormValues) => {
    if (!selectedTemplate) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const subtotal = data.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      const discount = (subtotal * data.discountRate) / 100;
      const tax = (subtotal - discount) * (data.taxRate / 100);
      const total = subtotal - discount + tax;

      const updatedTemplate: QuotationTemplate = {
        ...selectedTemplate,
        name: data.name,
        description: data.description || "",
        category: data.category,
        items: data.items.map((item, index) => ({
          id: item.id || `item-${Date.now()}-${index}`,
          ...item,
        }) as any),
        subtotal,
        taxRate: data.taxRate,
        discountRate: data.discountRate,
        total,
        currency: data.currency,
        validityDays: data.validityDays,
        paymentTerms: data.paymentTerms,
        deliveryTerms: data.deliveryTerms,
        termsAndConditions: data.termsAndConditions || "",
        isDefault: data.isDefault,
        tags: data.tags || [],
        notes: data.notes || "",
        updatedAt: new Date().toISOString(),
      };

      // If this template is set as default, unset others
      if (data.isDefault) {
        setTemplates((prev) =>
          prev.map((t) => ({ ...t, isDefault: t.id === selectedTemplate.id }))
        );
      }

      setTemplates(
        templates.map((t) => (t.id === selectedTemplate.id ? updatedTemplate : t))
      );
      setIsEditDialogOpen(false);
      toast.success("Template updated successfully");
    } catch (error) {
      console.error("Failed to update template:", error);
      toast.error("Failed to update template");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!selectedTemplate) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setTemplates(templates.filter((t) => t.id !== selectedTemplate.id));
      setIsDeleteDialogOpen(false);
      toast.success("Template deleted successfully");
    } catch (error) {
      console.error("Failed to delete template:", error);
      toast.error("Failed to delete template");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetDefault = async (templateId: string) => {
    try {
      setTemplates(
        templates.map((t) => ({
          ...t,
          isDefault: t.id === templateId,
        }))
      );
      toast.success("Default template updated");
    } catch (error) {
      console.error("Failed to set default template:", error);
      toast.error("Failed to set default template");
    }
  };

  const handleDuplicate = async (template: QuotationTemplate) => {
    try {
      const newTemplate: QuotationTemplate = {
        ...template,
        id: `temp-${Date.now()}`,
        name: `${template.name} (Copy)`,
        isDefault: false,
        usageCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTemplates([newTemplate, ...templates]);
      toast.success("Template duplicated successfully");
    } catch (error) {
      console.error("Failed to duplicate template:", error);
      toast.error("Failed to duplicate template");
    }
  };

  const formatCurrency = (amount: number, currency: string = "BDT") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };


  const calculateTemplateTotal = (items: TemplateItem[], taxRate: number, discountRate: number) => {
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const discount = (subtotal * discountRate) / 100;
    const tax = (subtotal - discount) * (taxRate / 100);
    return subtotal - discount + tax;
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "ALL" || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
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
          <h1 className="text-2xl font-bold">Quotation Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage reusable quotation templates for faster responses
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={loadTemplates}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90"
            onClick={() => {
              form.reset({
                name: "",
                description: "",
                category: "",
                items: [
                  {
                    productName: "",
                    sku: "",
                    quantity: 1,
                    unit: "unit",
                    unitPrice: 0,
                    deliveryTime: "",
                    notes: "",
                  },
                ],
                taxRate: 15,
                discountRate: 0,
                currency: "BDT",
                validityDays: 15,
                paymentTerms: "",
                deliveryTerms: "",
                termsAndConditions: "",
                isDefault: false,
                tags: [],
                notes: "",
              });
              setIsAddDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Templates
                </p>
                <p className="text-2xl font-bold">{templates.length}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Default Template
                </p>
                <p className="text-2xl font-bold">
                  {templates.filter((t) => t.isDefault).length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Usage
                </p>
                <p className="text-2xl font-bold">
                  {templates.reduce((sum, t) => sum + t.usageCount, 0)}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Categories
                </p>
                <p className="text-2xl font-bold">
                  {new Set(templates.map((t) => t.category)).size}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Layers className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===== FILTERS ===== */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates by name, category, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ===== TEMPLATES LIST ===== */}
      {filteredTemplates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Templates Found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchTerm || categoryFilter !== "ALL"
                ? "Try adjusting your search or filter criteria"
                : "Create your first quotation template to get started"}
            </p>
            {(searchTerm || categoryFilter !== "ALL") && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("ALL");
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className={cn(
                "hover:shadow-lg transition-all cursor-pointer",
                template.isDefault && "border-2 border-primary/50"
              )}
              onClick={() => {
                setSelectedTemplate(template);
                setIsPreviewDialogOpen(true);
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-lg">{template.name}</h3>
                      {template.isDefault && (
                        <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                          <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                          Default
                        </Badge>
                      )}
                      <Badge variant="outline">{template.category}</Badge>
                      {template.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {template.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span>
                        Items: {template.items.length} •{" "}
                        {formatCurrency(template.total, template.currency)}
                      </span>
                      <span className="text-muted-foreground">
                        Used {template.usageCount} times
                      </span>
                      {template.lastUsed && (
                        <span className="text-muted-foreground">
                          Last used: {formatDate(template.lastUsed)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTemplate(template);
                        setIsPreviewDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTemplate(template);
                            form.reset({
                              name: template.name,
                              description: template.description,
                              category: template.category,
                              items: template.items.map((item) => ({
                                productName: item.productName,
                                sku: item.sku || "",
                                quantity: item.quantity,
                                unit: item.unit,
                                unitPrice: item.unitPrice,
                                deliveryTime: item.deliveryTime,
                                notes: item.notes || "",
                              })),
                              taxRate: template.taxRate,
                              discountRate: template.discountRate,
                              currency: template.currency,
                              validityDays: template.validityDays,
                              paymentTerms: template.paymentTerms,
                              deliveryTerms: template.deliveryTerms,
                              termsAndConditions: template.termsAndConditions,
                              isDefault: template.isDefault,
                              tags: template.tags,
                              notes: template.notes || "",
                            });
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicate(template);
                          }}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        {!template.isDefault && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetDefault(template.id);
                            }}
                          >
                            <Star className="h-4 w-4 mr-2" />
                            Set as Default
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTemplate(template);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ===== ADD/EDIT TEMPLATE DIALOG ===== */}
      <Dialog
        open={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
            form.reset();
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isAddDialogOpen ? "Create New Template" : "Edit Template"}
            </DialogTitle>
            <DialogDescription>
              {isAddDialogOpen
                ? "Create a reusable quotation template"
                : "Update the template details"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                isAddDialogOpen ? handleAddTemplate : handleEditTemplate
              )}
              className="space-y-6"
            >
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Name</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Standard Quote" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of this template..."
                        className="h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <FormLabel className="text-base">Items</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({
                        productName: "",
                        sku: "",
                        quantity: 1,
                        unit: "unit",
                        unitPrice: 0,
                        deliveryTime: "",
                        notes: "",
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 bg-muted/30 rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Item #{index + 1}
                        </span>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name={`items.${index}.productName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Product Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Product name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`items.${index}.sku`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SKU</FormLabel>
                              <FormControl>
                                <Input placeholder="SKU code" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="1"
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
                          control={form.control}
                          name={`items.${index}.unit`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select unit" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {UNITS.map((unit) => (
                                    <SelectItem key={unit} value={unit}>
                                      {unit.charAt(0).toUpperCase() + unit.slice(1)}
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
                          name={`items.${index}.unitPrice`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit Price</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0.00"
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
                        <FormField
                          control={form.control}
                          name={`items.${index}.deliveryTime`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Delivery Time</FormLabel>
                              <FormControl>
                                <Input placeholder="7-10 business days" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name={`items.${index}.notes`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Additional notes for this item"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & Terms */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="taxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="15"
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
                <FormField
                  control={form.control}
                  name="discountRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
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
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="BDT">BDT</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="validityDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Validity Period (Days)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="15"
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
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Set as Default</FormLabel>
                        <FormDescription>
                          Use this template as the default quotation
                        </FormDescription>
                      </div>
                      <FormControl>
                        <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          <span
                            className={cn(
                              "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
                              field.value ? "translate-x-5" : "translate-x-0"
                            )}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="paymentTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Terms</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="E.g., 30% advance, 70% upon delivery"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deliveryTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Terms</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., FOB Chittagong" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="termsAndConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Terms & Conditions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Terms and conditions for this quotation..."
                        className="h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Internal notes for this template..."
                        className="h-16"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Summary */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="font-medium mb-2">Summary</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Items:</span>
                    <span className="ml-2 font-medium">{fields.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="ml-2 font-medium">
                      {formatCurrency(
                        fields.reduce(
                          (sum, _, index) =>
                            sum +
                            (form.watch(`items.${index}.unitPrice`) || 0) *
                              (form.watch(`items.${index}.quantity`) || 0),
                          0
                        ),
                        form.watch("currency")
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tax:</span>
                    <span className="ml-2 font-medium">
                      {form.watch("taxRate")}%
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total:</span>
                    <span className="ml-2 font-medium text-primary">
                      {formatCurrency(
                        calculateTemplateTotal(
                          fields.map((_, index) => ({
                            productName: "",
                            sku: "",
                            quantity: form.watch(`items.${index}.quantity`) || 0,
                            unit: "",
                            unitPrice: form.watch(`items.${index}.unitPrice`) || 0,
                            deliveryTime: "",
                          }) as any),
                          form.watch("taxRate") || 0,
                          form.watch("discountRate") || 0
                        ),
                        form.watch("currency")
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setIsEditDialogOpen(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isAddDialogOpen ? "Creating..." : "Updating..."}
                    </>
                  ) : (
                    <>{isAddDialogOpen ? "Create Template" : "Update Template"}</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* ===== PREVIEW DIALOG ===== */}
      <Dialog
        open={isPreviewDialogOpen}
        onOpenChange={setIsPreviewDialogOpen}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedTemplate && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-xl">
                      {selectedTemplate.name}
                    </DialogTitle>
                    <DialogDescription>
                      {selectedTemplate.description}
                    </DialogDescription>
                  </div>
                  {selectedTemplate.isDefault && (
                    <Badge className="bg-yellow-500/10 text-yellow-600">
                      <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                      Default
                    </Badge>
                  )}
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Template Info */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Category</span>
                    <p className="font-medium">{selectedTemplate.category}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Currency</span>
                    <p className="font-medium">{selectedTemplate.currency}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Validity</span>
                    <p className="font-medium">{selectedTemplate.validityDays} days</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Created</span>
                    <p className="font-medium">{formatDate(selectedTemplate.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Usage</span>
                    <p className="font-medium">{selectedTemplate.usageCount} times</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tags</span>
                    <div className="flex gap-1 flex-wrap mt-1">
                      {selectedTemplate.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Items Table */}
                <div>
                  <h4 className="font-medium mb-3">Items</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedTemplate.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.productName}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.deliveryTime} • {item.notes}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{item.sku || "-"}</TableCell>
                          <TableCell className="text-center">
                            {item.quantity} {item.unit}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.unitPrice, selectedTemplate.currency)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(
                              item.unitPrice * item.quantity,
                              selectedTemplate.currency
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <Separator />

                {/* Pricing Summary */}
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>
                        {formatCurrency(selectedTemplate.subtotal, selectedTemplate.currency)}
                      </span>
                    </div>
                    {selectedTemplate.discountRate > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount ({selectedTemplate.discountRate}%)</span>
                        <span>
                          -
                          {formatCurrency(
                            (selectedTemplate.subtotal * selectedTemplate.discountRate) / 100,
                            selectedTemplate.currency
                          )}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax ({selectedTemplate.taxRate}%)</span>
                      <span>
                        {formatCurrency(
                          ((selectedTemplate.subtotal -
                            (selectedTemplate.subtotal * selectedTemplate.discountRate) / 100) *
                            selectedTemplate.taxRate) /
                            100,
                          selectedTemplate.currency
                        )}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-lg text-primary">
                        {formatCurrency(selectedTemplate.total, selectedTemplate.currency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Payment Terms</p>
                    <p className="font-medium">{selectedTemplate.paymentTerms}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Delivery Terms</p>
                    <p className="font-medium">{selectedTemplate.deliveryTerms}</p>
                  </div>
                </div>

                {selectedTemplate.termsAndConditions && (
                  <div>
                    <p className="text-muted-foreground text-sm">Terms & Conditions</p>
                    <p className="text-sm mt-1">{selectedTemplate.termsAndConditions}</p>
                  </div>
                )}

                {selectedTemplate.notes && (
                  <div>
                    <p className="text-muted-foreground text-sm">Notes</p>
                    <p className="text-sm mt-1">{selectedTemplate.notes}</p>
                  </div>
                )}

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
                    Close
                  </Button>
                  <Button>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== DELETE DIALOG ===== */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="py-4">
              <p className="font-medium">{selectedTemplate.name}</p>
              <p className="text-sm text-muted-foreground">
                Used {selectedTemplate.usageCount} times
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteTemplate}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Template"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}