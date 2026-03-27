import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "I finally understand what my blood work means. MediLens explained everything my doctor didn't have time to.",
    name: "Sarah K.",
    role: "Patient, Age 34",
  },
  {
    quote: "As a caregiver for my elderly parents, this tool helps me track and understand their multiple reports effortlessly.",
    name: "James R.",
    role: "Family Caregiver",
  },
  {
    quote: "The visual health timeline is incredible. I can see my cholesterol trending down over the past 6 months.",
    name: "Priya M.",
    role: "Health-Conscious User",
  },
];

const Testimonials = () => (
  <section className="py-24 relative">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-primary font-body text-sm tracking-[0.2em] uppercase mb-4 block">
          Testimonials
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-bold">
          Trusted by <span className="text-gradient-teal">Thousands</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <Quote className="w-8 h-8 text-primary/30 mb-4" />
            <p className="text-secondary-foreground font-body leading-relaxed mb-6 italic">
              "{t.quote}"
            </p>
            <div>
              <p className="font-display font-semibold text-foreground">{t.name}</p>
              <p className="text-muted-foreground text-sm font-body">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
