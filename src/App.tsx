import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Shield,
  Wallet,
  ChartBar,
  Zap,
  CircleCheck,
  ArrowRight,
  Menu,
  X,
  FileText,
  ShieldCheck,
} from "lucide-react";
import RegistrationPortal, { AdminDashboard } from "@/components/RegistrationPortal";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import TermsAndConditionsModal from "@/components/TermsAndConditionsModal";
import ContactFormModal from "@/components/ContactFormModal";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [simulatorData, setSimulatorData] = useState({
    initialShares: 10000,
    monthlyContribution: 500,
    years: 5,
    growthRate: 8,
  });

  const calculateProjection = () => {
    const { initialShares, monthlyContribution, years, growthRate } =
      simulatorData;
    const monthlyRate = growthRate / 100 / 12;
    const months = years * 12;

    let total = initialShares;
    for (let i = 0; i < months; i++) {
      total = total * (1 + monthlyRate) + monthlyContribution;
    }

    return {
      finalValue: Math.round(total),
      totalContributions: initialShares + monthlyContribution * months,
      totalGrowth: Math.round(total - (initialShares + monthlyContribution * months)),
    };
  };

  const projection = calculateProjection();

  const features = [
    {
      icon: TrendingUp,
      title: "Real-Time Tracking",
      description:
        "Monitor your cooperative shares in real-time with live updates and instant notifications.",
    },
    {
      icon: Users,
      title: "Member Management",
      description:
        "Effortlessly manage member profiles, contributions, and share allocations in one place.",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description:
        "Bank-grade security with full regulatory compliance for cooperative financial management.",
    },
    {
      icon: Wallet,
      title: "Smart Contributions",
      description:
        "Automated contribution tracking with flexible payment schedules and reminders.",
    },
    {
      icon: ChartBar,
      title: "Advanced Analytics",
      description:
        "Deep insights into portfolio performance, growth trends, and member engagement metrics.",
    },
    {
      icon: Zap,
      title: "Instant Reports",
      description:
        "Generate comprehensive reports in seconds with customizable templates and exports.",
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for small cooperatives getting started",
      features: [
        "Up to 50 members",
        "Basic share tracking",
        "Monthly reports",
        "Email support",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Professional",
      price: "$49",
      period: "/month",
      description: "For growing cooperatives with advanced needs",
      features: [
        "Up to 500 members",
        "Real-time tracking",
        "Advanced analytics",
        "Custom reports",
        "Priority support",
        "API access",
      ],
      cta: "Click on Apply now and start with the Free version",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with complex requirements",
      features: [
        "Unlimited members",
        "White-label solution",
        "Dedicated account manager",
        "Custom integrations",
        "24/7 phone support",
        "On-premise deployment",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">RTSM Mgt</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-primary transition-colors">
                Features
              </a>
              <a href="#simulator" className="hover:text-primary transition-colors">
                Simulator
              </a>
              <a href="#pricing" className="hover:text-primary transition-colors">
                Pricing
              </a>
              <a
                href="https://admin.rtsm.belcashlabs.com/login"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity inline-block"
              >
                Members login
              </a>
            </div>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b border-border">
            <div className="px-4 py-4 space-y-3">
              <a
                href="#features"
                className="block hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#simulator"
                className="block hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Simulator
              </a>
              <a
                href="#pricing"
                className="block hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="https://admin.rtsm.belcashlabs.com/login"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Members login
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-gold" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-gold" />

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <CircleCheck className="w-4 h-4 text-primary" />
              <span className="text-sm">Trusted by 50+ cooperatives</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Real-Time Share
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Management
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Track, manage, and grow your cooperative shares with intelligent
              insights and live simulation. Built for modern cooperatives.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => setShowForm(true)} className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 group">
                <span>Click on Apply now and start with the Free version</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Cooperatives</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">$2M+</div>
                <div className="text-sm text-muted-foreground">Transactions Managed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed specifically for cooperative share
              management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulator Section */}
      <section
        id="simulator"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Live Growth Simulator
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how your cooperative shares can grow over time with our
              interactive calculator
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card border border-border rounded-xl p-8"
            >
              <h3 className="text-2xl font-semibold mb-6">Adjust Parameters</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Initial Shares (ETB)
                  </label>
                  <input
                    type="number"
                    value={simulatorData.initialShares}
                    onChange={(e) =>
                      setSimulatorData({
                        ...simulatorData,
                        initialShares: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Monthly Contribution (ETB)
                  </label>
                  <input
                    type="number"
                    value={simulatorData.monthlyContribution}
                    onChange={(e) =>
                      setSimulatorData({
                        ...simulatorData,
                        monthlyContribution: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Time Period (Years)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={simulatorData.years}
                    onChange={(e) =>
                      setSimulatorData({
                        ...simulatorData,
                        years: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                  <div className="text-right text-sm text-muted-foreground">
                    {simulatorData.years} years
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Annual Growth Rate (%)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={simulatorData.growthRate}
                    onChange={(e) =>
                      setSimulatorData({
                        ...simulatorData,
                        growthRate: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                  <div className="text-right text-sm text-muted-foreground">
                    {simulatorData.growthRate}%
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card border border-border rounded-xl p-8"
            >
              <h3 className="text-2xl font-semibold mb-6">Projected Results</h3>

              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-xl">
                  <div className="text-sm text-muted-foreground mb-2">
                    Final Value
                  </div>
                  <div className="text-4xl font-bold text-primary">
                    ETB {projection.finalValue.toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-background border border-border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">
                      Total Contributions
                    </div>
                    <div className="text-xl font-semibold">
                      ETB {projection.totalContributions.toLocaleString()}
                    </div>
                  </div>

                  <div className="p-4 bg-background border border-border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">
                      Total Growth
                    </div>
                    <div className="text-xl font-semibold text-primary">
                      ETB {projection.totalGrowth.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Growth Multiple</span>
                    <span className="font-semibold">
                      {(
                        projection.finalValue /
                        projection.totalContributions
                      ).toFixed(2)}
                      x
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your cooperative's needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-8 rounded-xl border ${
                  plan.highlighted
                    ? "bg-gradient-to-br from-primary/10 to-accent/10 border-primary"
                    : "bg-card border-border"
                }`}
              >
                {plan.highlighted && (
                  <div className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CircleCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-opacity ${
                    plan.highlighted
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Ready to Transform Your Cooperative?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join 50+ cooperatives already using RTSM Mgt to manage their
              shares more effectively
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 group">
                <span>Click on Apply now and start with the Free version</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => setContactOpen(true)} className="px-8 py-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
                Schedule Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">RTSM Mgt</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Real-Time Share Management for modern cooperatives
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#features" className="hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-primary transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#simulator" className="hover:text-primary transition-colors">
                    Simulator
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="https://wosip.hpass.belcashlabs.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => setContactOpen(true)}
                    className="hover:text-primary transition-colors"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowAdmin(true)}
                    className="hover:text-primary transition-colors flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() => setPrivacyOpen(true)}
                    className="hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setTermsOpen(true)}
                    className="hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; 2024 RTSM Mgt. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <RegistrationPortal open={showForm} onOpenChange={setShowForm} />
      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}
      <PrivacyPolicyModal open={privacyOpen} onOpenChange={setPrivacyOpen} />
      <TermsAndConditionsModal open={termsOpen} onOpenChange={setTermsOpen} />
      <ContactFormModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
      <Toaster position="bottom-right" richColors />
    </div>
  );
}

export default App;