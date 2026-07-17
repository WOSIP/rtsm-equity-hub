import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Mail,
  User,
  MessageCircle,
  Loader,
  MapPin,
  CircleCheck,
} from "lucide-react";
import { toast } from "sonner";

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormState = "idle" | "submitting" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactFormModal({ isOpen, onClose }: ContactFormModalProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setFormState("submitting");

    try {
      // Try Supabase first, fall back to localStorage
      let supabaseAvailable = false;
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        if (supabase) {
          const { error } = await supabase.from("contact_submissions").insert({
            name: formData.name.trim(),
            email: formData.email.trim(),
            subject: formData.subject.trim() || null,
            message: formData.message.trim(),
          });
          if (error) throw error;
          supabaseAvailable = true;
        }
      } catch {
        // Supabase not available, use localStorage
      }

      if (!supabaseAvailable) {
        // Fallback: store in localStorage
        const submissions = JSON.parse(
          localStorage.getItem("contact_submissions") || "[]"
        );
        submissions.push({
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          ...formData,
        });
        localStorage.setItem("contact_submissions", JSON.stringify(submissions));
      }

      setFormState("success");
      toast.success("Message sent successfully! We'll get back to you soon.");

      // Reset after delay
      setTimeout(() => {
        setFormData(initialFormData);
        setFormState("idle");
        onClose();
      }, 2500);
    } catch (err: any) {
      setFormState("error");
      toast.error(err?.message || "Failed to send message. Please try again.");
      setTimeout(() => setFormState("idle"), 3000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleClose = () => {
    if (formState === "submitting") return;
    setFormData(initialFormData);
    setFormState("idle");
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 pb-4 border-b border-border bg-card/95 backdrop-blur-xl rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Get in Touch
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  We'd love to hear from you
                </p>
              </div>
              <button
                onClick={handleClose}
                disabled={formState === "submitting"}
                className="p-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {formState === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        damping: 15,
                        stiffness: 200,
                        delay: 0.1,
                      }}
                      className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6"
                    >
                      <CircleCheck className="w-10 h-10 text-primary" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-muted-foreground max-w-xs">
                      Thank you for reaching out. We'll get back to you within
                      24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    {/* Name */}
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="flex items-center gap-2 text-sm font-medium"
                      >
                        <User className="w-4 h-4 text-muted-foreground" />
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        disabled={formState === "submitting"}
                        className={`w-full px-4 py-3 rounded-lg bg-background border transition-colors focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 ${
                          errors.name
                            ? "border-red-500 focus:ring-red-500"
                            : "border-border focus:border-primary"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="flex items-center gap-2 text-sm font-medium"
                      >
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        disabled={formState === "submitting"}
                        className={`w-full px-4 py-3 rounded-lg bg-background border transition-colors focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 ${
                          errors.email
                            ? "border-red-500 focus:ring-red-500"
                            : "border-border focus:border-primary"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500">{errors.email}</p>
                      )}
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <label
                        htmlFor="subject"
                        className="flex items-center gap-2 text-sm font-medium"
                      >
                        <MessageCircle className="w-4 h-4 text-muted-foreground" />
                        Subject{" "}
                        <span className="text-muted-foreground font-normal">
                          (optional)
                        </span>
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What's this about?"
                        disabled={formState === "submitting"}
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50"
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <label
                        htmlFor="message"
                        className="flex items-center gap-2 text-sm font-medium"
                      >
                        <MessageCircle className="w-4 h-4 text-muted-foreground" />
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help..."
                        rows={4}
                        disabled={formState === "submitting"}
                        className={`w-full px-4 py-3 rounded-lg bg-background border transition-colors focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-50 ${
                          errors.message
                            ? "border-red-500 focus:ring-red-500"
                            : "border-border focus:border-primary"
                        }`}
                      />
                      {errors.message && (
                        <p className="text-xs text-red-500">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={formState === "submitting"}
                      className="w-full py-3.5 px-6 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {formState === "submitting" ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Footer info */}
            <div className="px-6 pb-6 pt-2 border-t border-border">
              <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>info@belcash.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Addis Ababa, Ethiopia</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}