import { motion } from "framer-motion";
import { Mic, BookOpen, Heart } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <div className="h-px w-12 bg-gold/40" />
          <span className="text-gold font-body text-sm tracking-[0.3em] uppercase">
            Preserve What Matters
          </span>
          <div className="h-px w-12 bg-gold/40" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6"
        >
          Every Voice
          <br />
          <span className="text-gradient-gold italic">Tells a Story</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 font-body"
        >
          Record your loved ones' stories before they fade. VoiceVault uses AI to
          transcribe, organize, and preserve family memories as a beautiful digital legacy.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-gold to-accent font-body font-semibold text-primary-foreground hover:opacity-90 transition-opacity glow-gold text-lg">
            Start Recording
          </button>
          <button className="px-8 py-4 rounded-lg border border-gold/30 font-body font-medium text-foreground hover:bg-gold/5 transition-colors text-lg">
            Watch Demo
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { icon: Mic, label: "Stories Recorded", value: "12K+" },
            { icon: BookOpen, label: "Pages Preserved", value: "85K+" },
            { icon: Heart, label: "Families Connected", value: "3.2K" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <stat.icon className="w-5 h-5 text-gold mx-auto mb-2" />
              <div className="font-display text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-xs font-body">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
