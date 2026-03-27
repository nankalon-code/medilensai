import { motion } from "framer-motion";
import { Upload, FileText, Sparkles, BookOpen } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Report",
    description: "Drag & drop any medical report, lab result, or prescription — PDF, image, or text.",
  },
  {
    icon: Sparkles,
    step: "02",
    title: "AI Analysis",
    description: "Our AI reads, categorizes, and interprets every metric against medical reference ranges.",
  },
  {
    icon: BookOpen,
    step: "03",
    title: "Get Insights",
    description: "Receive clear explanations, risk flags, and actionable recommendations in seconds.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(174 72% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(174 72% 50%) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-body text-sm tracking-[0.2em] uppercase mb-4 block">
            Simple Process
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Three Steps to <span className="text-gradient-teal">Clarity</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center relative"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/30 to-transparent" />
              )}
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center relative">
                <step.icon className="w-10 h-10 text-primary" />
                <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground font-display font-bold text-sm flex items-center justify-center">
                  {step.step}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold mb-2 text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
