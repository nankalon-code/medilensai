import { motion } from "framer-motion";
import { FileText, Brain, Shield, TrendingUp, Upload, Sparkles } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced NLP breaks down complex medical terminology into language anyone can understand.",
  },
  {
    icon: TrendingUp,
    title: "Health Timeline",
    description: "Track your health metrics over time with beautiful, interactive visualizations.",
  },
  {
    icon: Shield,
    title: "Privacy-First",
    description: "Your data never leaves your device. All processing happens locally with end-to-end encryption.",
  },
  {
    icon: Sparkles,
    title: "Smart Insights",
    description: "Get personalized recommendations and risk assessments based on your results.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-body text-sm tracking-[0.2em] uppercase mb-4 block">
            How It Works
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Your Reports, <span className="text-gradient-teal">Simplified</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto font-body">
            Upload any medical report or lab result. MediLens translates it into
            clear, actionable health insights in seconds.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-6 hover:border-primary/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm font-body leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
