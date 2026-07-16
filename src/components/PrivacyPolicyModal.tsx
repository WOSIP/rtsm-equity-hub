import { ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PrivacyPolicyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const sections = [
  {
    title: "Introduction",
    content:
      "This Privacy Policy explains how RTSM Mgt ('we', 'us', or 'our') collects, uses, discloses, and protects your information when you use our real-time share management platform. We are committed to safeguarding the privacy of cooperative and union organizations that entrust us with their data. This policy is effective as of January 1, 2024, and applies to all users of our platform.",
  },
  {
    title: "Information We Collect",
    content:
      "When you register for and use RTSM Mgt, we collect the following categories of information: (a) Organization details — including your cooperative or union name, registration number, physical address, and industry classification; (b) Member data — aggregate member counts, contribution records, share allocation history, and member contact information as provided during registration; (c) Account credentials — administrator names, email addresses, phone numbers, and secure passcodes used for platform access; (d) Usage data — interaction logs, feature utilization patterns, and performance metrics that help us improve our service.",
  },
  {
    title: "How We Use Your Information",
    content:
      "We use the collected information exclusively for the following purposes: (a) To provide, maintain, and improve our share management platform, including processing share allocations, contributions, and withdrawal requests; (b) To administer your organization's account, including verifying registration details and managing administrator access permissions; (c) To communicate important updates, security alerts, and changes to our terms or policies; (d) To generate anonymized aggregate analytics that help us enhance platform performance and user experience. We do not sell, rent, or trade your personal information to third parties for marketing purposes.",
  },
  {
    title: "Data Security & Retention",
    content:
      "We implement industry-standard security measures to protect your data, including: end-to-end encryption for all data transmissions, secure passcode-protected administrator access, regular security audits and vulnerability assessments, and encrypted data storage at rest. We retain your information for as long as your account remains active or as needed to provide our services. Upon account closure, we securely delete or anonymize your data within 90 days, unless legal or regulatory obligations require extended retention. Access to sensitive administrative functions requires multi-factor authentication and is logged for audit purposes.",
  },
  {
    title: "Third-Party Services",
    content:
      "RTSM Mgt leverages Supabase as our database and authentication infrastructure provider. Supabase is a SOC 2 compliant platform that provides secure, scalable data storage with enterprise-grade encryption. Your data may be processed and stored on Supabase's infrastructure, which is hosted in secure data centers. We carefully vet all third-party service providers to ensure they maintain equivalent security and privacy standards. We do not share your data with any other third-party services beyond what is strictly necessary to operate the platform.",
  },
  {
    title: "Your Rights & Contact Information",
    content:
      "You have the right to: (a) Access the personal data we hold about your organization; (b) Request corrections to inaccurate or incomplete data; (c) Request deletion of your data, subject to legal retention requirements; (d) Withdraw consent for data processing at any time; (e) Receive a portable copy of your data in a structured format. To exercise these rights or if you have any questions about this Privacy Policy, please contact us at privacy@rtsmmgt.com or write to: RTSM Mgt, Data Protection Office, 123 Cooperative Avenue, Addis Ababa, Ethiopia. We will respond to all legitimate requests within 30 days.",
  },
];

export default function PrivacyPolicyModal({
  open,
  onOpenChange,
}: PrivacyPolicyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[680px] max-h-[85vh] p-0 gap-0 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 border border-primary/20 shadow-2xl shadow-primary/5">
        <DialogHeader className="relative px-6 pt-6 pb-4 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">
                Privacy Policy
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                Last updated: January 1, 2024
              </p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-5 max-h-[55vh]">
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={index}>
                <h3 className="text-base font-semibold text-primary mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                  {section.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t border-primary/10 flex items-center justify-between bg-zinc-950/50">
          <p className="text-xs text-muted-foreground">
            By using RTSM Mgt, you agree to this Privacy Policy.
          </p>
          <button
            onClick={() => onOpenChange(false)}
            className="px-5 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}