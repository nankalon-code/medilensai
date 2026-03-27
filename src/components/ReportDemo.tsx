import { motion } from "framer-motion";
import { Activity, Droplets, Heart, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useState } from "react";

type MetricStatus = "normal" | "warning" | "critical";

interface HealthMetric {
  name: string;
  value: string;
  unit: string;
  range: string;
  status: MetricStatus;
  icon: typeof Activity;
  explanation: string;
}

const sampleMetrics: HealthMetric[] = [
  {
    name: "Hemoglobin",
    value: "14.2",
    unit: "g/dL",
    range: "13.5 - 17.5",
    status: "normal",
    icon: Droplets,
    explanation: "Your hemoglobin is within the healthy range. This means your blood is carrying oxygen effectively throughout your body.",
  },
  {
    name: "Blood Glucose",
    value: "118",
    unit: "mg/dL",
    range: "70 - 100",
    status: "warning",
    icon: Zap,
    explanation: "Your fasting blood glucose is slightly elevated. This could indicate pre-diabetes. Consider reducing sugar intake and increasing physical activity.",
  },
  {
    name: "Heart Rate",
    value: "72",
    unit: "bpm",
    range: "60 - 100",
    status: "normal",
    icon: Heart,
    explanation: "Your resting heart rate is in the normal range, suggesting good cardiovascular fitness.",
  },
  {
    name: "Cholesterol (LDL)",
    value: "165",
    unit: "mg/dL",
    range: "< 130",
    status: "critical",
    icon: Activity,
    explanation: "Your LDL cholesterol is above the recommended level. High LDL increases risk of heart disease. Consult your doctor about dietary changes or medication.",
  },
];

const statusColors: Record<MetricStatus, string> = {
  normal: "text-health-green",
  warning: "text-health-yellow",
  critical: "text-health-red",
};

const statusBg: Record<MetricStatus, string> = {
  normal: "bg-health-green/10 border-health-green/20",
  warning: "bg-health-yellow/10 border-health-yellow/20",
  critical: "bg-health-red/10 border-health-red/20",
};

const statusIcon: Record<MetricStatus, typeof CheckCircle2> = {
  normal: CheckCircle2,
  warning: AlertTriangle,
  critical: AlertTriangle,
};

const ReportDemo = () => {
  const [selectedMetric, setSelectedMetric] = useState<number>(1);

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-body text-sm tracking-[0.2em] uppercase mb-4 block">
            Live Demo
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            See It In <span className="text-gradient-teal">Action</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto font-body">
            Here's how MediLens transforms a standard blood panel into understandable insights.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {/* Metrics list */}
          <div className="lg:col-span-2 space-y-3">
            {sampleMetrics.map((metric, i) => {
              const StatusIcon = statusIcon[metric.status];
              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedMetric(i)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedMetric === i
                      ? "border-primary/40 bg-primary/5"
                      : "border-border bg-card/50 hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <metric.icon className={`w-5 h-5 ${statusColors[metric.status]}`} />
                      <span className="font-display font-semibold text-foreground">
                        {metric.name}
                      </span>
                    </div>
                    <StatusIcon className={`w-4 h-4 ${statusColors[metric.status]}`} />
                  </div>
                  <div className="flex items-baseline gap-2 ml-8">
                    <span className={`text-2xl font-display font-bold ${statusColors[metric.status]}`}>
                      {metric.value}
                    </span>
                    <span className="text-muted-foreground text-sm">{metric.unit}</span>
                    <span className="text-muted-foreground text-xs ml-auto">
                      Range: {metric.range}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Explanation panel */}
          <motion.div
            key={selectedMetric}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-3"
          >
            <div className={`glass-card p-8 h-full ${statusBg[sampleMetrics[selectedMetric].status]}`}>
              <div className="flex items-center gap-3 mb-6">
                {(() => {
                  const Icon = sampleMetrics[selectedMetric].icon;
                  return <Icon className={`w-8 h-8 ${statusColors[sampleMetrics[selectedMetric].status]}`} />;
                })()}
                <div>
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    {sampleMetrics[selectedMetric].name}
                  </h3>
                  <span className={`text-sm font-body capitalize ${statusColors[sampleMetrics[selectedMetric].status]}`}>
                    {sampleMetrics[selectedMetric].status === "normal"
                      ? "✓ Within Normal Range"
                      : sampleMetrics[selectedMetric].status === "warning"
                      ? "⚠ Slightly Elevated"
                      : "⚠ Above Recommended"}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className={`text-5xl font-display font-bold ${statusColors[sampleMetrics[selectedMetric].status]}`}>
                    {sampleMetrics[selectedMetric].value}
                  </span>
                  <span className="text-muted-foreground text-lg">
                    {sampleMetrics[selectedMetric].unit}
                  </span>
                </div>

                {/* Visual bar */}
                <div className="h-2 rounded-full bg-muted overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: sampleMetrics[selectedMetric].status === "normal" ? "60%" : sampleMetrics[selectedMetric].status === "warning" ? "75%" : "90%" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      sampleMetrics[selectedMetric].status === "normal"
                        ? "bg-health-green"
                        : sampleMetrics[selectedMetric].status === "warning"
                        ? "bg-health-yellow"
                        : "bg-health-red"
                    }`}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground font-body">
                  <span>Low</span>
                  <span>Normal Range: {sampleMetrics[selectedMetric].range}</span>
                  <span>High</span>
                </div>
              </div>

              <div className="bg-background/40 rounded-lg p-4">
                <h4 className="font-display font-semibold mb-2 text-foreground flex items-center gap-2">
                  <span className="text-primary">💡</span> Plain Language Explanation
                </h4>
                <p className="text-secondary-foreground font-body leading-relaxed">
                  {sampleMetrics[selectedMetric].explanation}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReportDemo;
