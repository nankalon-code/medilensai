import { motion } from "framer-motion";
import { Zap, Globe, Layers, Lock, Fingerprint, Cpu } from "lucide-react";

const differentiators = [
  {
    icon: Fingerprint,
    title: "Zero-Knowledge Architecture",
    description: "Your reports are processed in ephemeral containers that self-destruct after analysis. We literally cannot see your data — even if subpoenaed.",
    highlight: "No data stored. Ever.",
  },
  {
    icon: Globe,
    title: "Multi-Language Report Support",
    description: "Upload reports in any language — English, Hindi, Arabic, Mandarin, Spanish. MediLens understands medical terminology across 40+ languages.",
    highlight: "40+ languages supported",
  },
  {
    icon: Layers,
    title: "Cross-Report Intelligence",
    description: "Upload multiple reports over time. MediLens spots trends, correlations, and risk patterns that even doctors miss in 15-minute appointments.",
    highlight: "Pattern recognition across visits",
  },
];

const competitors = [
  { name: "Manual Google Search", has: [false, false, false, false] },
  { name: "ChatGPT / Generic AI", has: [false, true, false, false] },
  { name: "Patient Portals", has: [true, false, false, false] },
  { name: "MediLens", has: [true, true, true, true] },
];

const compFeatures = ["Structured Analysis", "Plain Language", "Risk Scoring", "Cross-Report Trends"];

const WhyUnique = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Glowing orb background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-body text-sm tracking-[0.2em] uppercase mb-4 block">
            Why Us
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Not Another <span className="text-gradient-teal">Health App</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-body text-lg">
            Most tools just feed your report to a chatbot. MediLens is purpose-built medical infrastructure
            that treats health data with the rigor it deserves.
          </p>
        </motion.div>

        {/* Differentiator cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {differentiators.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="glass-card p-8 group hover:border-primary/40 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <d.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3 text-foreground">
                  {d.title}
                </h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4">
                  {d.description}
                </p>
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-body font-semibold">
                  {d.highlight}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h3 className="font-display text-2xl font-bold text-center mb-8 text-foreground">
            How We <span className="text-gradient-teal">Compare</span>
          </h3>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-display font-semibold text-foreground" />
                    {compFeatures.map((f) => (
                      <th key={f} className="p-4 font-display font-semibold text-foreground text-center text-xs md:text-sm">
                        {f}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {competitors.map((c, i) => {
                    const isMediLens = c.name === "MediLens";
                    return (
                      <tr
                        key={i}
                        className={`border-b border-border last:border-0 ${
                          isMediLens ? "bg-primary/5" : ""
                        }`}
                      >
                        <td className={`p-4 font-body ${isMediLens ? "font-bold text-primary" : "text-muted-foreground"}`}>
                          {isMediLens ? "✦ " : ""}{c.name}
                        </td>
                        {c.has.map((has, j) => (
                          <td key={j} className="p-4 text-center">
                            {has ? (
                              <span className={`text-lg ${isMediLens ? "text-primary" : "text-health-green"}`}>✓</span>
                            ) : (
                              <span className="text-muted-foreground/40">✗</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto"
        >
          {[
            { value: "< 5s", label: "Average analysis time" },
            { value: "40+", label: "Languages supported" },
            { value: "50+", label: "Report types parsed" },
            { value: "0", label: "Data stored on servers" },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 glass-card">
              <span className="font-display text-3xl md:text-4xl font-bold text-gradient-teal block mb-1">
                {stat.value}
              </span>
              <span className="text-muted-foreground text-xs font-body">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyUnique;
