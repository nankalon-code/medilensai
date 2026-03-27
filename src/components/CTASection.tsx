import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CTASection = () => (
  <section className="py-24 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
    <div className="container mx-auto px-6 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center"
      >
        <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
          Your Health Data,
          <br />
          <span className="text-gradient-teal">Your Understanding</span>
        </h2>
        <p className="text-muted-foreground text-lg font-body mb-10 max-w-xl mx-auto">
          Stop being confused by medical reports. Start making informed health decisions with AI-powered clarity.
        </p>
        <button className="group px-10 py-5 rounded-xl bg-gradient-to-r from-primary to-accent font-body font-semibold text-primary-foreground hover:opacity-90 transition-opacity glow-teal text-lg inline-flex items-center gap-2">
          Get Started — It's Free
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
