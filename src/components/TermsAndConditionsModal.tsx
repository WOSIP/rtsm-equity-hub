import { FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsAndConditionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const sections = [
  {
    title: "Acceptance of Terms",
    content:
      "By accessing or using RTSM Mgt ('the Platform'), you agree to be bound by these Terms and Conditions ('Terms'). If you are registering on behalf of a cooperative, union, or other organization, you represent that you have the authority to bind that organization to these Terms. If you do not agree to all provisions, you must not access or use the Platform. These Terms constitute a binding legal agreement between you ('User' or 'Organization') and RTSM Mgt regarding your use of the share management services provided.",
  },
  {
    title: "Registration Eligibility",
    content:
      "To register for an account, you must be a legally recognized cooperative, union, thrift society, or similar member-based organization. You must provide accurate, complete, and up-to-date registration information, including your organization's legal name, registration number, and authorized administrator contact details. RTSM Mgt reserves the right to verify submitted information and deny registration to any entity that does not meet eligibility criteria. Each registration is limited to a single organization account; multi-entity registration under one account is prohibited without prior written approval.",
  },
  {
    title: "User Conduct & Responsibilities",
    content:
      "You are solely responsible for maintaining the confidentiality of your account credentials, including administrator passcodes and access tokens. You agree to: (a) provide accurate member data and share records at all times; (b) immediately notify RTSM Mgt of any unauthorized access or security breach; (c) comply with all applicable local, regional, and national cooperative regulations; (d) refrain from using the Platform for any unlawful, fraudulent, or abusive purpose; (e) not attempt to circumvent security measures, access other users' data, or disrupt Platform operations. RTSM Mgt may suspend or terminate accounts that violate these obligations.",
  },
  {
    title: "Intellectual Property",
    content:
      "RTSM Mgt, including its software, design, trademarks, service marks, trade names, logos, and all underlying technology, is the exclusive intellectual property of RTSM Mgt or its licensors. You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Platform for your organization's internal share management purposes. No ownership rights are transferred to you. You may not copy, modify, reverse-engineer, distribute, sell, or create derivative works of the Platform without explicit written consent from RTSM Mgt. All rights not expressly granted are reserved.",
  },
  {
    title: "Limitation of Liability",
    content:
      "To the maximum extent permitted by applicable law, RTSM Mgt, its affiliates, officers, and employees shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Platform. This includes, but is not limited to: (a) loss of data, share records, or member information; (b) Platform downtime, service interruptions, or technical errors; (c) administrative denial or delay of registration applications; (d) unauthorized access to your account due to compromised credentials. RTSM Mgt's total cumulative liability for any claim shall not exceed the total fees paid by you in the twelve (12) months preceding the claim.",
  },
  {
    title: "Governing Law & Updates",
    content:
      "These Terms shall be governed by and construed in accordance with the laws of England and Wales. Any disputes arising from these Terms shall be resolved through binding arbitration in London, United Kingdom, in accordance with the rules of the London Court of International Arbitration (LCIA). RTSM Mgt reserves the right to update or modify these Terms at any time. Material changes will be communicated via email to the registered administrator address and/or through a prominent notice on the Platform at least fifteen (15) days before the effective date. Continued use of the Platform after the effective date constitutes acceptance of the revised Terms.",
  },
];

export default function TermsAndConditionsModal({
  open,
  onOpenChange,
}: TermsAndConditionsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[680px] max-h-[85vh] p-0 gap-0 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 border border-primary/20 shadow-2xl shadow-primary/5">
        <DialogHeader className="relative px-6 pt-6 pb-4 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">
                Terms and Conditions
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
            By using RTSM Mgt, you agree to these Terms and Conditions.
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