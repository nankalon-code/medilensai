import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Activity,
  ArrowLeft,
  Sparkles,
  ClipboardPaste,
  ShieldAlert,
  ShieldCheck,
  Shield,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PdfUploadZone from "@/components/analyze/PdfUploadZone";
import { toast } from "sonner";

interface Metric {
  name: string;
  value: string;
  unit: string;
  normalRange: string;
  status: "normal" | "warning" | "critical";
  explanation: string;
}

interface AnalysisResult {
  summary: string;
  metrics: Metric[];
  recommendations: string[];
  riskLevel: "low" | "moderate" | "high";
  riskExplanation: string;
}

const SAMPLE_REPORT = `Complete Blood Count (CBC) Report
Patient: John Doe, Age: 45, Male

Hemoglobin: 14.2 g/dL (Normal: 13.5-17.5)
Hematocrit: 42% (Normal: 38.3-48.6)
WBC: 7.2 x10^3/uL (Normal: 4.5-11.0)
RBC: 5.1 x10^6/uL (Normal: 4.7-6.1)
Platelets: 250 x10^3/uL (Normal: 150-400)

Metabolic Panel:
Glucose Fasting: 118 mg/dL (Normal: 70-100)
BUN: 18 mg/dL (Normal: 7-20)
Creatinine: 1.0 mg/dL (Normal: 0.7-1.3)

Lipid Panel:
Total Cholesterol: 245 mg/dL (Normal: <200)
LDL Cholesterol: 165 mg/dL (Normal: <130)
HDL Cholesterol: 42 mg/dL (Normal: >40)
Triglycerides: 190 mg/dL (Normal: <150)`;

const statusColors: Record<string, string> = {
  normal: "text-health-green",
  warning: "text-health-yellow",
  critical: "text-health-red",
};

const statusBg: Record<string, string> = {
  normal: "bg-health-green/10 border-health-green/20",
  warning: "bg-health-yellow/10 border-health-yellow/20",
  critical: "bg-health-red/10 border-health-red/20",
};

const riskIcons: Record<string, typeof Shield> = {
  low: ShieldCheck,
  moderate: Shield,
  high: ShieldAlert,
};

const riskColors: Record<string, string> = {
  low: "text-health-green",
  moderate: "text-health-yellow",
  high: "text-health-red",
};

const AnalyzePage = () => {
  const [reportText, setReportText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<number | null>(null);

  const handleAnalyze = async () => {
    if (!reportText.trim()) {
      toast.error("Please paste or type your medical report text");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-report", {
        body: { reportText: reportText.trim() },
      });

      if (error) {
        throw new Error(error.message || "Analysis failed");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data as AnalysisResult);
      setSelectedMetric(0);
      toast.success("Report analyzed successfully!");
    } catch (err: any) {
      console.error("Analysis error:", err);
      toast.error(err.message || "Failed to analyze report. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSample = () => {
    setReportText(SAMPLE_REPORT);
    toast.info("Sample report loaded — click Analyze!");
  };

  const reset = () => {
    setResult(null);
    setReportText("");
    setSelectedMetric(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">MediLens</span>
          </a>
          {result && (
            <button onClick={reset} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm">
              <ArrowLeft className="w-4 h-4" /> New Analysis
            </button>
          )}
        </div>
      </nav>

      <div className="pt-24 pb-16 container mx-auto px-6">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-10">
                <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                  Analyze Your <span className="text-gradient-teal">Report</span>
                </h1>
                <p className="text-muted-foreground font-body text-lg">
                  Paste your medical report or lab results below. Our AI will explain everything in plain language.
                </p>
              </div>

              <div className="glass-card p-6">
                <PdfUploadZone
                  onTextExtracted={(text) => setReportText(text)}
                  disabled={isAnalyzing}
                />

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">or paste text</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <div className="flex items-center justify-between mb-4">
                  <label className="font-display font-semibold text-foreground flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Report Text
                  </label>
                  <button
                    onClick={loadSample}
                    className="text-sm text-primary hover:text-primary/80 transition-colors font-body flex items-center gap-1"
                  >
                    <ClipboardPaste className="w-4 h-4" /> Load Sample
                  </button>
                </div>

                <textarea
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Paste your lab results, blood work, or any medical report here..."
                  rows={12}
                  className="w-full bg-background/60 border border-border rounded-lg p-4 text-foreground placeholder:text-muted-foreground font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />

                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !reportText.trim()}
                    className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-primary to-accent font-body font-semibold text-primary-foreground hover:opacity-90 transition-opacity glow-teal text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" /> Analyze Report
                      </>
                    )}
                  </button>
                </div>

                <p className="mt-4 text-xs text-muted-foreground font-body text-center">
                  🔒 Your data is processed securely and never stored. For informational purposes only — always consult your doctor.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto"
            >
              {/* Summary + Risk */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="md:col-span-2 glass-card p-6"
                >
                  <h2 className="font-display text-2xl font-bold mb-3 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary" /> Summary
                  </h2>
                  <p className="text-secondary-foreground font-body leading-relaxed text-lg">
                    {result.summary}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`glass-card p-6 ${
                    result.riskLevel === "low"
                      ? "border-health-green/20"
                      : result.riskLevel === "moderate"
                      ? "border-health-yellow/20"
                      : "border-health-red/20"
                  }`}
                >
                  <h3 className="font-display font-semibold mb-3 text-foreground">Risk Assessment</h3>
                  {(() => {
                    const RiskIcon = riskIcons[result.riskLevel];
                    return (
                      <div className="flex items-center gap-3 mb-3">
                        <RiskIcon className={`w-10 h-10 ${riskColors[result.riskLevel]}`} />
                        <span className={`font-display text-2xl font-bold capitalize ${riskColors[result.riskLevel]}`}>
                          {result.riskLevel}
                        </span>
                      </div>
                    );
                  })()}
                  <p className="text-muted-foreground text-sm font-body">{result.riskExplanation}</p>
                </motion.div>
              </div>

              {/* Metrics */}
              <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-primary" /> Health Metrics
              </h2>
              <div className="grid lg:grid-cols-5 gap-6 mb-8">
                <div className="lg:col-span-2 space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {result.metrics.map((metric, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      onClick={() => setSelectedMetric(i)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selectedMetric === i
                          ? "border-primary/40 bg-primary/5"
                          : "border-border bg-card/50 hover:border-border/80"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-display font-semibold text-foreground text-sm">{metric.name}</span>
                        {metric.status === "normal" ? (
                          <CheckCircle2 className={`w-4 h-4 ${statusColors[metric.status]}`} />
                        ) : (
                          <AlertTriangle className={`w-4 h-4 ${statusColors[metric.status]}`} />
                        )}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-xl font-display font-bold ${statusColors[metric.status]}`}>
                          {metric.value}
                        </span>
                        <span className="text-muted-foreground text-xs">{metric.unit}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {selectedMetric !== null && result.metrics[selectedMetric] && (
                  <motion.div
                    key={selectedMetric}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-3"
                  >
                    <div className={`glass-card p-8 h-full ${statusBg[result.metrics[selectedMetric].status]}`}>
                      <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                        {result.metrics[selectedMetric].name}
                      </h3>
                      <span className={`text-sm font-body ${statusColors[result.metrics[selectedMetric].status]}`}>
                        {result.metrics[selectedMetric].status === "normal"
                          ? "✓ Within Normal Range"
                          : result.metrics[selectedMetric].status === "warning"
                          ? "⚠ Outside Normal Range"
                          : "⚠ Significantly Abnormal"}
                      </span>

                      <div className="flex items-baseline gap-3 my-6">
                        <span className={`text-5xl font-display font-bold ${statusColors[result.metrics[selectedMetric].status]}`}>
                          {result.metrics[selectedMetric].value}
                        </span>
                        <span className="text-muted-foreground text-lg">{result.metrics[selectedMetric].unit}</span>
                      </div>

                      <div className="h-2 rounded-full bg-muted overflow-hidden mb-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width:
                              result.metrics[selectedMetric].status === "normal"
                                ? "55%"
                                : result.metrics[selectedMetric].status === "warning"
                                ? "75%"
                                : "90%",
                          }}
                          transition={{ duration: 0.8 }}
                          className={`h-full rounded-full ${
                            result.metrics[selectedMetric].status === "normal"
                              ? "bg-health-green"
                              : result.metrics[selectedMetric].status === "warning"
                              ? "bg-health-yellow"
                              : "bg-health-red"
                          }`}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mb-6">
                        Normal Range: {result.metrics[selectedMetric].normalRange}
                      </p>

                      <div className="bg-background/40 rounded-lg p-4">
                        <h4 className="font-display font-semibold mb-2 text-foreground">💡 What This Means</h4>
                        <p className="text-secondary-foreground font-body leading-relaxed">
                          {result.metrics[selectedMetric].explanation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-6"
              >
                <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-primary" /> Recommendations
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {result.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10"
                    >
                      <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-display font-bold text-xs flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-secondary-foreground font-body text-sm leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>

                <p className="mt-6 text-xs text-muted-foreground font-body text-center">
                  ⚕️ These insights are for informational purposes only. Always consult a healthcare professional for medical advice.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnalyzePage;
