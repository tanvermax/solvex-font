"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { 
  Search, 
  Truck, 
  PackageCheck, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  FileText, 
  PhoneCall, 
  AlertCircle, 
  Sparkles,
  Building2,
  Download,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock Tracking Data Structure
const MOCK_SHIPMENT = {
  trackingNo: "SLX-8829104",
  poNumber: "PO-2026-9921",
  status: "In Transit",
  estimatedDelivery: "Aug 08, 2026",
  origin: "Chattogram Port Yard #4",
  destination: "Gazipur Industrial Zone, Dhaka",
  carrier: "SolveX Express Freight",
  driverName: "Md. Rafiqul Islam",
  driverPhone: "+880 1711-223344",
  itemsCount: "450 Units (Safety Equipment & PPE)",
  timeline: [
    {
      title: "Order Processed & BOQ Verified",
      location: "SolveX Dhaka HQ",
      date: "Aug 04, 2026 - 10:30 AM",
      completed: true,
    },
    {
      title: "Quality Inspection & Packaging Passed",
      location: "Central Warehouse, Chattogram",
      date: "Aug 05, 2026 - 02:15 PM",
      completed: true,
    },
    {
      title: "Dispatched & In Transit on Highway",
      location: "Dhaka-Chattogram Highway (Near Comilla)",
      date: "Aug 06, 2026 - 06:45 AM",
      completed: true,
      current: true,
    },
    {
      title: "Out for Factory Site Delivery",
      location: "Gazipur Industrial Zone",
      date: "Estimated: Aug 08, 2026",
      completed: false,
    },
  ],
};

export default function TrackShipmentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeShipment, setActiveShipment] = useState<typeof MOCK_SHIPMENT | null>(MOCK_SHIPMENT);
  const [hasSearched, setHasSearched] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      setActiveShipment(MOCK_SHIPMENT);
      setHasSearched(true);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#FF5500]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* ================= 1. HERO & SEARCH BAR ================= */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-10 md:mb-14">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/20 text-[#FF5500] text-[11px] font-extrabold uppercase tracking-widest"
          >
            <Sparkles className="size-3.5 fill-current animate-pulse" />
            <span>Real-Time Fleet & Freight Tracking</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.15]"
          >
            Track Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-primary to-[#FF5500]">Industrial Delivery</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed max-w-2xl mx-auto"
          >
            Enter your Waybill Tracking ID, Purchase Order (PO) number, or Order ID to view real-time location, customs status, and delivery ETA.
          </motion.p>

          {/* Search Box */}
          <motion.form 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSearch}
            className="pt-4 max-w-xl mx-auto"
          >
            <div className="relative flex items-center bg-card border border-border/80 focus-within:border-[#FF5500] rounded-2xl p-1.5 shadow-[0_8px_25px_rgba(0,0,0,0.05)] transition-all">
              <Search className="size-5 text-muted-foreground ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Enter Tracking ID (e.g. SLX-8829104 or PO-2026-9921)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/60"
              />
              <Button 
                type="submit" 
                size="sm" 
                className="bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold text-xs h-10 px-5 rounded-xl shrink-0"
              >
                Track Now
              </Button>
            </div>
          </motion.form>
        </div>

        {/* ================= 2. TRACKING RESULT DISPLAY ================= */}
        <AnimatePresence mode="wait">
          {hasSearched && activeShipment && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl mx-auto space-y-6"
            >
              {/* Shipment Header Card */}
              <div className="rounded-3xl bg-card border border-border/70 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] relative overflow-hidden">
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border/50 pb-6">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <h2 className="text-xl sm:text-2xl font-black text-foreground">
                        Tracking #{activeShipment.trackingNo}
                      </h2>
                      <Badge className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5">
                        {activeShipment.status}
                      </Badge>
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                      <span>PO Ref: <strong className="text-foreground">{activeShipment.poNumber}</strong></span>
                      <span>•</span>
                      <span>Cargo: <strong className="text-foreground">{activeShipment.itemsCount}</strong></span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 w-full md:w-auto">
                    <Button variant="outline" size="sm" className="h-9 text-xs font-bold rounded-xl border-border/80 gap-1.5 flex-1 md:flex-initial">
                      <Download className="size-3.5 text-muted-foreground" />
                      <span>Download Delivery Challan</span>
                    </Button>
                  </div>
                </div>

                {/* Key Status Overview Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs">
                  <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/40 space-y-1">
                    <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-[#FF5500]" />
                      Estimated Arrival:
                    </span>
                    <p className="text-sm font-extrabold text-foreground">{activeShipment.estimatedDelivery}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/40 space-y-1">
                    <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-blue-500" />
                      Origin & Destination:
                    </span>
                    <p className="text-xs font-extrabold text-foreground truncate">
                      {activeShipment.origin} ➔ {activeShipment.destination}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/40 space-y-1">
                    <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                      <Truck className="size-3.5 text-emerald-500" />
                      Assigned Freight Carrier:
                    </span>
                    <p className="text-xs font-extrabold text-foreground">
                      {activeShipment.carrier} ({activeShipment.driverName})
                    </p>
                  </div>
                </div>

              </div>

              {/* Progress Timeline & Logistics Detail Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Timeline Card */}
                <div className="lg:col-span-8 rounded-3xl bg-card border border-border/70 p-6 sm:p-8 shadow-sm space-y-6">
                  <h3 className="text-base font-extrabold text-foreground border-b border-border/40 pb-3 flex items-center gap-2">
                    <Clock className="size-4 text-[#FF5500]" />
                    <span>Live Tracking Milestones</span>
                  </h3>

                  <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                    {activeShipment.timeline.map((item, idx) => (
                      <div key={idx} className="relative group">
                        
                        {/* Timeline Icon Node */}
                        <div className={`absolute -left-6 sm:-left-8 top-0 size-6 sm:size-7 rounded-full flex items-center justify-center border-2 transition-colors ${
                          item.current 
                            ? "bg-[#FF5500] border-white text-white shadow-md shadow-[#FF5500]/30 animate-pulse" 
                            : item.completed 
                            ? "bg-emerald-500 border-emerald-500 text-white" 
                            : "bg-background border-border text-muted-foreground"
                        }`}>
                          {item.completed ? (
                            <CheckCircle2 className="size-3.5 sm:size-4" />
                          ) : (
                            <span className="size-2 bg-current rounded-full" />
                          )}
                        </div>

                        {/* Event Details */}
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className={`text-xs sm:text-sm font-extrabold ${item.current ? "text-[#FF5500]" : "text-foreground"}`}>
                              {item.title}
                            </h4>
                            <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                              {item.date}
                            </span>
                          </div>

                          <p className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                            <MapPin className="size-3 text-muted-foreground" />
                            <span>{item.location}</span>
                          </p>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

                {/* Driver Contact & Help Box */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Assigned Fleet Contact */}
                  <div className="rounded-2xl bg-card border border-border/70 p-5 space-y-4 shadow-sm">
                    <h4 className="text-xs font-black uppercase text-foreground tracking-wider border-b border-border/40 pb-2">
                      Assigned Driver Info
                    </h4>

                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Driver:</span>
                        <span className="font-bold text-foreground">{activeShipment.driverName}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Carrier Fleet:</span>
                        <span className="font-bold text-foreground">Volvo Heavy Truck 10-Ton</span>
                      </div>
                    </div>

                    <Button asChild size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 rounded-xl gap-2">
                      <a href={`tel:${activeShipment.driverPhone}`}>
                        <PhoneCall className="size-3.5" />
                        <span>Call Driver Directly</span>
                      </a>
                    </Button>
                  </div>

                  {/* Delivery Support Callout */}
                  <div className="rounded-2xl bg-muted/30 border border-border/60 p-5 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                      <AlertCircle className="size-4 text-[#FF5500]" />
                      <span>Issue with this Delivery?</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      If your gate entry requires custom clearance documents or vehicle registration details, contact our logistics desk.
                    </p>
                    <Link to="/contact" className="text-xs font-bold text-[#FF5500] hover:underline block pt-1">
                      Contact Logistics Desk →
                    </Link>
                  </div>

                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}