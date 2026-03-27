import { motion } from "framer-motion";
import { FileText, ArrowRight, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-health.jpg";

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
    <div className="container mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Activity className="w-4 h-4 text-primary" />
        </div>
        <span className="font-display font-bold text-lg text-foreground">MediLens</span>
      </div>
      <div className="hidden md:flex items-center gap-8 font-body text-sm text-muted-foreground">
        <a href="#features" className="hover:text-foreground transition-colors">Features</a>
        <a href="#why-unique" className="hover:text-foreground transition-colors">Why Us</a>
        <a href="#demo" className="hover:text-foreground transition-colors">Demo</a>
        <Link to="/trends" className="hover:text-foreground transition-colors">Trends</Link>
        <Link to="/chat" className="hover:text-foreground transition-colors">Chat</Link>
      </div>
      <Link to="/analyze" className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition-opacity">
        Try Free
      </Link>
    </div>
  </nav>
);

const HeroSection = () => {
  return (
    <>
      <Navbar />
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover opacity-30" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-body font-medium tracking-wide">
              🏆 Protex Hackathon 2026 — Open Innovation
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6"
          >
            Understand Your
            <br />
            <span className="text-gradient-teal">Health Reports</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 font-body"
          >
            Upload any medical report or lab result. MediLens uses AI to translate
            complex medical jargon into plain-language insights you can actually understand.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/analyze" className="group px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent font-body font-semibold text-primary-foreground hover:opacity-90 transition-opacity glow-teal text-lg flex items-center justify-center gap-2">
              Upload Your Report
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#demo" className="px-8 py-4 rounded-xl border border-primary/30 font-body font-medium text-foreground hover:bg-primary/5 transition-colors text-lg text-center">
              See Demo
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-6 text-muted-foreground text-sm font-body"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-health-green" />
              HIPAA-Ready Architecture
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-health-green" />
              100% Private — On-Device Processing
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-health-green" />
              50+ Report Types Supported
            </span>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
