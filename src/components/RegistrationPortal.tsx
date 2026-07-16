import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building,
  Building2,
  Users,
  Mail,
  Phone,
  CircleCheck,
  CircleX,
  Search,
  Filter,
  Eye,
  ThumbsUp,
  ThumbsDown,
  LayoutDashboard,
  ClipboardList,
  ShieldCheck,
  Clock,
  Sparkles,
  PartyPopper,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowUpDown,
  LogOut,
  LogIn,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* ──────────────────────────────────────────── Types */
export type OrgType = "cooperative" | "union" | "private_enterprise" | "other";
export type ApplicationStatus = "pending" | "approved" | "denied";
export type PlanType = "free" | "silver" | "platinum";

export interface Application {
  id: string;
  organizationName: string;
  organizationType: OrgType;
  contactPerson: string;
  email: string;
  phone: string;
  memberCount: number;
  plan: PlanType;
  message: string;
  status: ApplicationStatus;
  createdAt: string;
  reviewedAt?: string;
}

/* ──────────────────────────────────────────── Constants */
const STORAGE_KEY = "rtsm_applications";

const ORG_TYPE_LABELS: Record<OrgType, string> = {
  cooperative: "Cooperative",
  union: "Union",
  private_enterprise: "Private Enterprise",
  other: "Other",
};

const PLAN_LABELS: Record<PlanType, string> = {
  free: "Free",
  silver: "Silver",
  platinum: "Platinum",
};

/* ──────────────────────────────────────────── Seed data */
const SEED_APPLICATIONS: Application[] = [
  {
    id: "app-001",
    organizationName: "Oromia Coffee Union",
    organizationType: "union",
    contactPerson: "Abebe Kebede",
    email: "abebe@oromiacoffee.et",
    phone: "+251-911-123456",
    memberCount: 12500,
    plan: "platinum",
    message: "We are the largest coffee cooperative union in Ethiopia with 12,500+ farmers. We need a robust share management system to track contributions and dividends across our member cooperatives.",
    status: "pending",
    createdAt: "2024-12-15T08:00:00Z",
  },
  {
    id: "app-002",
    organizationName: "Harar Farmers Cooperative",
    organizationType: "cooperative",
    contactPerson: "Fatima Hassan",
    email: "fatima@hararcoop.et",
    phone: "+251-912-987654",
    memberCount: 850,
    plan: "silver",
    message: "A mid-sized cooperative in Harar with 850 members. Looking for digital share management to replace our paper-based system.",
    status: "approved",
    createdAt: "2024-11-20T10:30:00Z",
    reviewedAt: "2024-11-25T14:00:00Z",
  },
  {
    id: "app-003",
    organizationName: "Addis Tech Hub PLC",
    organizationType: "private_enterprise",
    contactPerson: "Samuel Tadesse",
    email: "samuel@addistech.et",
    phone: "+251-930-456789",
    memberCount: 45,
    plan: "free",
    message: "A tech startup building financial tools for cooperatives. We want to test the platform for our own internal share tracking.",
    status: "denied",
    createdAt: "2024-10-05T09:15:00Z",
    reviewedAt: "2024-10-10T11:00:00Z",
  },
  {
    id: "app-004",
    organizationName: "Sidama Coffee Growers",
    organizationType: "cooperative",
    contactPerson: "Desta Wolde",
    email: "desta@sidamacoffee.et",
    phone: "+251-915-789123",
    memberCount: 3400,
    plan: "silver",
    message: "A well-established coffee growers cooperative in Sidama region with 3,400 active members. We need real-time tracking and reporting.",
    status: "pending",
    createdAt: "2024-12-28T14:20:00Z",
  },
  {
    id: "app-005",
    organizationName: "Tigray Women's Union",
    organizationType: "union",
    contactPerson: "Meron Girmay",
    email: "meron@tigraywomen.et",
    phone: "+251-920-321654",
    memberCount: 2100,
    plan: "silver",
    message: "A women's union with 2,100 members across Tigray region. We aim to empower women through cooperative savings and share ownership.",
    status: "pending",
    createdAt: "2025-01-03T16:45:00Z",
  },
  {
    id: "app-006",
    organizationName: "Ethio-Dairy Cooperative",
    organizationType: "cooperative",
    contactPerson: "Lemma Berhanu",
    email: "lemma@ethiodairy.et",
    phone: "+251-940-555777",
    memberCount: 620,
    plan: "free",
    message: "A dairy farmers cooperative with 620 members in the Oromia special zone. Starting with basic share tracking needs.",
    status: "approved",
    createdAt: "2024-09-12T07:30:00Z",
    reviewedAt: "2024-09-18T09:00:00Z",
  },
];

/* ──────────────────────────────────────────── localStorage helpers */
function loadApplications(): Application[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Application[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* corrupted data — re-seed */
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_APPLICATIONS));
  return SEED_APPLICATIONS;
}

function saveApplications(apps: Application[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
}

function generateId(): string {
  return `app-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/* ──────────────────────────────────────────── Form Component */
function RegistrationForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    organizationName: "",
    organizationType: "" as OrgType | "",
    contactPerson: "",
    email: "",
    phone: "",
    memberCount: 0,
    plan: "" as PlanType | "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.organizationName.trim()) errs.organizationName = "Required";
    if (!form.organizationType) errs.organizationType = "Select a type";
    if (!form.contactPerson.trim()) errs.contactPerson = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = "Valid email required";
    if (!form.phone.trim()) errs.phone = "Required";
    if (form.memberCount < 1) errs.memberCount = "Must be at least 1";
    if (!form.plan) errs.plan = "Select a plan";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const apps = loadApplications();
    const newApp: Application = {
      id: generateId(),
      organizationName: form.organizationName.trim(),
      organizationType: form.organizationType as OrgType,
      contactPerson: form.contactPerson.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      memberCount: form.memberCount,
      plan: form.plan as PlanType,
      message: form.message.trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    apps.unshift(newApp);
    saveApplications(apps);
    setSubmitted(true);
    toast.success("Application submitted successfully!");
  };

  const autoSuggestPlan = (count: number) => {
    if (count === 0) return;
    if (count < 1000) setForm((f) => ({ ...f, plan: "free" }));
    else if (count < 5000) setForm((f) => ({ ...f, plan: "silver" }));
    else setForm((f) => ({ ...f, plan: "platinum" }));
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center text-center py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mb-6"
        >
          <PartyPopper className="w-10 h-10 text-primary" />
        </motion.div>
        <h3 className="text-2xl font-bold mb-2">Application Submitted!</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Thank you for your application. Our team will review it and get back to you within 2-3 business days.
        </p>
        <div className="flex gap-3">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
          <Button onClick={() => { setSubmitted(false); setForm({ organizationName: "", organizationType: "", contactPerson: "", email: "", phone: "", memberCount: 0, plan: "", message: "" }); }}>
            Apply Again
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1.5">Organization Name</label>
          <Input
            value={form.organizationName}
            onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
            placeholder="e.g. Oromia Coffee Union"
            className={cn(errors.organizationName && "border-destructive")}
          />
          {errors.organizationName && <p className="text-xs text-destructive mt-1">{errors.organizationName}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1.5">Organization Type</label>
          <Select
            value={form.organizationType}
            onValueChange={(v) => setForm({ ...form, organizationType: v as OrgType })}
          >
            <SelectTrigger className={cn("w-full", errors.organizationType && "border-destructive")}>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cooperative">Cooperative</SelectItem>
              <SelectItem value="union">Union</SelectItem>
              <SelectItem value="private_enterprise">Private Enterprise</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.organizationType && <p className="text-xs text-destructive mt-1">{errors.organizationType}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Contact Person</label>
          <Input
            value={form.contactPerson}
            onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
            placeholder="Full name"
            className={cn(errors.contactPerson && "border-destructive")}
          />
          {errors.contactPerson && <p className="text-xs text-destructive mt-1">{errors.contactPerson}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Number of Members</label>
          <Input
            type="number"
            min={1}
            value={form.memberCount || ""}
            onChange={(e) => {
              const count = Number(e.target.value);
              setForm({ ...form, memberCount: count });
              autoSuggestPlan(count);
            }}
            placeholder="e.g. 500"
            className={cn(errors.memberCount && "border-destructive")}
          />
          {errors.memberCount && <p className="text-xs text-destructive mt-1">{errors.memberCount}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="email@organization.et"
            className={cn(errors.email && "border-destructive")}
          />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Phone</label>
          <Input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+251-XXX-XXXXXX"
            className={cn(errors.phone && "border-destructive")}
          />
          {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1.5">Chosen Plan</label>
          <Select
            value={form.plan}
            onValueChange={(v) => setForm({ ...form, plan: v as PlanType })}
          >
            <SelectTrigger className={cn("w-full", errors.plan && "border-destructive")}>
              <SelectValue placeholder={form.memberCount > 0 ? "Auto-suggested based on members" : "Select a plan"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Free — Up to 1,000 members
                </span>
              </SelectItem>
              <SelectItem value="silver">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  Silver — 1,000 to 5,000 members
                </span>
              </SelectItem>
              <SelectItem value="platinum">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Platinum — 5,000+ members
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.plan && <p className="text-xs text-destructive mt-1">{errors.plan}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1.5">Message / Justification</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Tell us about your organization and why you need share management..."
            rows={4}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-primary to-accent">
          <Sparkles className="w-4 h-4" />
          Submit Application
        </Button>
      </DialogFooter>
    </form>
  );
}

/* ──────────────────────────────────────────── Status Badge */
function StatusBadge({ status }: { status: ApplicationStatus }) {
  const config = {
    pending: { label: "Pending", classes: "bg-amber-500/15 text-amber-500 border-amber-500/30", icon: Clock },
    approved: { label: "Approved", classes: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30", icon: CircleCheck },
    denied: { label: "Denied", classes: "bg-rose-500/15 text-rose-500 border-rose-500/30", icon: CircleX },
  };
  const c = config[status];
  const Icon = c.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border", c.classes)}>
      <Icon className="w-3.5 h-3.5" />
      {c.label}
    </span>
  );
}

/* ──────────────────────────────────────────── Stat Card */
function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-5 flex items-center gap-4 hover:border-primary/30 transition-all"
    >
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", color)}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-2xl font-bold">{typeof value === "number" ? value.toLocaleString() : value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────── Detail Drawer */
function DetailDrawer({ app, onClose, onAction }: { app: Application; onClose: () => void; onAction: (id: string, status: "approved" | "denied") => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 320 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 320 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl z-50 overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">Application Details</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-lg">{app.organizationName}</div>
                <StatusBadge status={app.status} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Type</div>
              <div className="font-medium text-sm">{ORG_TYPE_LABELS[app.organizationType]}</div>
            </div>
            <div className="bg-background/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Plan</div>
              <div className="font-medium text-sm">{PLAN_LABELS[app.plan]}</div>
            </div>
            <div className="bg-background/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Members</div>
              <div className="font-medium text-sm">{app.memberCount.toLocaleString()}</div>
            </div>
            <div className="bg-background/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Submitted</div>
              <div className="font-medium text-sm">{new Date(app.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2">Contact Person</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-muted-foreground" />
                {app.contactPerson}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                {app.email}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                {app.phone}
              </div>
            </div>
          </div>

          {app.message && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Message</h4>
              <p className="text-sm text-muted-foreground bg-background/50 rounded-lg p-3 leading-relaxed">
                {app.message}
              </p>
            </div>
          )}

          {app.reviewedAt && (
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Reviewed on {new Date(app.reviewedAt).toLocaleDateString()}
            </div>
          )}

          {app.status === "pending" && (
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                className="flex-1 border-rose-500/30 text-rose-500 hover:bg-rose-500/10"
                onClick={() => onAction(app.id, "denied")}
              >
                <ThumbsDown className="w-4 h-4" />
                Deny
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                onClick={() => onAction(app.id, "approved")}
              >
                <ThumbsUp className="w-4 h-4" />
                Approve
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────── Admin Dashboard */
export function AdminDashboard({ onClose }: { onClose: () => void }) {
  const [apps, setApps] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<OrgType | "all">("all");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [sortField, setSortField] = useState<"createdAt" | "memberCount" | "organizationName">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [adminAuth, setAdminAuth] = useState(false);
  const [passcode, setPasscode] = useState("");

  useEffect(() => {
    setApps(loadApplications());
  }, []);

  const refresh = useCallback(() => {
    setApps(loadApplications());
  }, []);

  const handleAction = (id: string, status: "approved" | "denied") => {
    const current = loadApplications();
    const updated = current.map((a) =>
      a.id === id ? { ...a, status, reviewedAt: new Date().toISOString() } : a
    );
    saveApplications(updated);
    setApps(updated);
    setSelectedApp(null);
    const app = current.find((a) => a.id === id);
    toast.success(
      `Application ${status === "approved" ? "approved" : "denied"}`,
      {
        description: app ? `Notification email sent to ${app.email} regarding ${status}` : undefined,
      }
    );
  };

  const handleAuth = () => {
    if (passcode === "demo") {
      setAdminAuth(true);
      toast.success("Welcome, Admin");
    } else {
      toast.error("Invalid passcode");
    }
  };

  const stats = {
    total: apps.length,
    pending: apps.filter((a) => a.status === "pending").length,
    approved: apps.filter((a) => a.status === "approved").length,
    denied: apps.filter((a) => a.status === "denied").length,
    totalMembers: apps.reduce((sum, a) => sum + a.memberCount, 0),
  };

  const filtered = apps
    .filter((a) => statusFilter === "all" || a.status === statusFilter)
    .filter((a) => typeFilter === "all" || a.organizationType === typeFilter)
    .filter(
      (a) =>
        a.organizationName.toLowerCase().includes(search.toLowerCase()) ||
        a.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === "createdAt") cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      else if (sortField === "memberCount") cmp = a.memberCount - b.memberCount;
      else cmp = a.organizationName.localeCompare(b.organizationName);
      return sortDir === "asc" ? cmp : -cmp;
    });

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  };

  if (!adminAuth) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full shadow-2xl"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Admin Access</h3>
            <p className="text-sm text-muted-foreground mt-1">Enter passcode to continue</p>
          </div>
          <Input
            type="password"
            placeholder="Enter passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAuth()}
            className="mb-4 text-center"
          />
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleAuth}>
              <LogIn className="w-4 h-4" />
              Unlock
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md overflow-y-auto">
      <AnimatePresence>
        {selectedApp && (
          <DetailDrawer
            key="detail"
            app={selectedApp}
            onClose={() => setSelectedApp(null)}
            onAction={handleAction}
          />
        )}
      </AnimatePresence>

      {selectedApp && (
        <div className="fixed inset-0 z-40" onClick={() => setSelectedApp(null)} />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen p-4 sm:p-6 lg:p-8"
      >
        {/* Admin Header */}
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage registration applications</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={refresh}>
                <ClipboardList className="w-4 h-4" />
                Refresh
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setAdminAuth(false); setPasscode(""); onClose(); }}>
                <LogOut className="w-4 h-4" />
                Exit
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            <StatCard icon={ClipboardList} label="Total Demands" value={stats.total} color="bg-primary/15 text-primary" />
            <StatCard icon={Clock} label="Pending" value={stats.pending} color="bg-amber-500/15 text-amber-500" />
            <StatCard icon={CircleCheck} label="Approved" value={stats.approved} color="bg-emerald-500/15 text-emerald-500" />
            <StatCard icon={CircleX} label="Denied" value={stats.denied} color="bg-rose-500/15 text-rose-500" />
            <StatCard icon={Users} label="Total Members" value={stats.totalMembers} color="bg-blue-500/15 text-blue-500" className="sm:col-span-2 lg:col-span-1" />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search organizations, contacts, emails..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ApplicationStatus | "all")}>
              <SelectTrigger className="w-full sm:w-36">
                <Filter className="w-4 h-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as OrgType | "all")}>
              <SelectTrigger className="w-full sm:w-44">
                <Building className="w-4 h-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="cooperative">Cooperative</SelectItem>
                <SelectItem value="union">Union</SelectItem>
                <SelectItem value="private_enterprise">Private Enterprise</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="bg-card/40 backdrop-blur-sm border border-border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => toggleSort("organizationName")}>
                    <span className="flex items-center gap-1">
                      Organization
                      <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => toggleSort("memberCount")}>
                    <span className="flex items-center gap-1">
                      Members
                      <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="cursor-pointer hidden lg:table-cell" onClick={() => toggleSort("createdAt")}>
                    <span className="flex items-center gap-1">
                      Date
                      <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <ClipboardList className="w-8 h-8 opacity-40" />
                          <span>No applications found</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((app) => (
                      <motion.tr
                        key={app.id}
                        layout
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.25 }}
                        className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedApp(app)}
                      >
                        <TableCell>
                          <div className="font-medium">{app.organizationName}</div>
                          <div className="text-xs text-muted-foreground md:hidden">{ORG_TYPE_LABELS[app.organizationType]}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline" className="text-xs">
                            <Building2 className="w-3 h-3" />
                            {ORG_TYPE_LABELS[app.organizationType]}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell font-mono">
                          {app.memberCount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span className={cn(
                            "text-xs font-semibold px-2 py-0.5 rounded",
                            app.plan === "platinum" ? "text-amber-500 bg-amber-500/10" :
                            app.plan === "silver" ? "text-slate-400 bg-slate-400/10" :
                            "text-emerald-400 bg-emerald-400/10"
                          )}>
                            {PLAN_LABELS[app.plan]}
                          </span>
                        </TableCell>
                        <TableCell><StatusBadge status={app.status} /></TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon-sm" onClick={() => setSelectedApp(app)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            {app.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                                  onClick={() => handleAction(app.id, "approved")}
                                >
                                  <ThumbsUp className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10"
                                  onClick={() => handleAction(app.id, "denied")}
                                >
                                  <ThumbsDown className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-muted-foreground text-center">
            Showing {filtered.length} of {apps.length} applications
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────── Main Portal Component */
export default function RegistrationPortal({ open: showForm, onOpenChange: setShowForm }: { open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = showForm !== undefined;
  const isOpen = isControlled ? (showForm ?? false) : internalOpen;
  const setIsOpen = isControlled
    ? (v: boolean) => setShowForm?.(v)
    : setInternalOpen;

  return (
    <>
      {/* Apply Now FAB */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <Plus className="w-5 h-5" />
        <span className="font-semibold text-sm hidden sm:inline">Apply Now</span>
      </motion.button>


      {/* Registration Form Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl bg-card/95 backdrop-blur-xl border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Building2 className="w-6 h-6 text-primary" />
              Register Your Organization
            </DialogTitle>
            <DialogDescription>
              Submit your application to join the RTSM platform for cooperatives and unions.
            </DialogDescription>
          </DialogHeader>
          <RegistrationForm onClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>

    </>
  );
}