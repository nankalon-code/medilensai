import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  ArrowLeft,
  Info,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";

// Demo data simulating 6 months of blood work
const demoData = [
  {
    date: "Oct 2025",
    hemoglobin: 13.8,
    glucose: 125,
    cholesterol: 260,
    ldl: 175,
    hdl: 38,
    triglycerides: 210,
    creatinine: 1.1,
    wbc: 7.5,
  },
  {
    date: "Nov 2025",
    hemoglobin: 14.0,
    glucose: 120,
    cholesterol: 250,
    ldl: 168,
    hdl: 40,
    triglycerides: 200,
    creatinine: 1.05,
    wbc: 7.2,
  },
  {
    date: "Dec 2025",
    hemoglobin: 14.1,
    glucose: 118,
    cholesterol: 245,
    ldl: 165,
    hdl: 42,
    triglycerides: 190,
    creatinine: 1.0,
    wbc: 7.0,
  },
  {
    date: "Jan 2026",
    hemoglobin: 14.3,
    glucose: 112,
    cholesterol: 235,
    ldl: 155,
    hdl: 44,
    triglycerides: 178,
    creatinine: 0.98,
    wbc: 6.8,
  },
  {
    date: "Feb 2026",
    hemoglobin: 14.5,
    glucose: 108,
    cholesterol: 225,
    ldl: 145,
    hdl: 46,
    triglycerides: 165,
    creatinine: 0.95,
    wbc: 6.9,
  },
  {
    date: "Mar 2026",
    hemoglobin: 14.6,
    glucose: 102,
    cholesterol: 218,
    ldl: 138,
    hdl: 48,
    triglycerides: 155,
    creatinine: 0.93,
    wbc: 7.1,
  },
];

interface MetricConfig {
  key: string;
  name: string;
  unit: string;
  normalMin: number;
  normalMax: number;
  color: string;
  trend: "improving" | "stable" | "worsening";
  latestValue: number;
  change: number;
}

const metrics: MetricConfig[] = [
  { key: "hemoglobin", name: "Hemoglobin", unit: "g/dL", normalMin: 13.5, normalMax: 17.5, color: "#14b8a6", trend: "improving", latestValue: 14.6, change: 5.8 },
  { key: "glucose", name: "Fasting Glucose", unit: "mg/dL", normalMin: 70, normalMax: 100, color: "#f59e0b", trend: "improving", latestValue: 102, change: -18.4 },
  { key: "cholesterol", name: "Total Cholesterol", unit: "mg/dL", normalMin: 0, normalMax: 200, color: "#ef4444", trend: "improving", latestValue: 218, change: -16.2 },
  { key: "ldl", name: "LDL Cholesterol", unit: "mg/dL", normalMin: 0, normalMax: 130, color: "#f97316", trend: "improving", latestValue: 138, change: -21.1 },
  { key: "hdl", name: "HDL Cholesterol", unit: "mg/dL", normalMin: 40, normalMax: 100, color: "#22c55e", trend: "improving", latestValue: 48, change: 26.3 },
  { key: "triglycerides", name: "Triglycerides", unit: "mg/dL", normalMin: 0, normalMax: 150, color: "#a855f7", trend: "improving", latestValue: 155, change: -26.2 },
  { key: "creatinine", name: "Creatinine", unit: "mg/dL", normalMin: 0.7, normalMax: 1.3, color: "#06b6d4", trend: "stable", latestValue: 0.93, change: -15.5 },
  { key: "wbc", name: "White Blood Cells", unit: "x10³/µL", normalMin: 4.5, normalMax: 11.0, color: "#ec4899", trend: "stable", latestValue: 7.1, change: -5.3 },
];

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "improving") return <TrendingUp className="w-4 h-4 text-health-green" />;
  if (trend === "worsening") return <TrendingDown className="w-4 h-4 text-health-red" />;
  return <Minus className="w-4 h-4 text-health-yellow" />;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
      <p className="font-display font-semibold text-foreground text-sm mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-xs font-body" style={{ color: entry.color }}>
          {entry.name}: <span className="font-semibold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

const TrendsPage = () => {
  const [selectedMetric, setSelectedMetric] = useState<MetricConfig>(metrics[0]);
  const [chartType, setChartType] = useState<"line" | "area" | "bar">("area");

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">MediLens</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/analyze" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
              Analyze
            </Link>
            <Link to="/chat" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
              Chat
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
            Health <span className="text-gradient-teal">Trends</span>
          </h1>
          <p className="text-muted-foreground font-body text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Tracking 6 months of health data (demo)
          </p>
        </motion.div>

        {/* Overview cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {metrics.slice(0, 4).map((m, i) => (
            <motion.button
              key={m.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedMetric(m)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedMetric.key === m.key
                  ? "border-primary/40 bg-primary/5"
                  : "border-border bg-card/50 hover:border-border/80"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground font-body">{m.name}</span>
                <TrendIcon trend={m.trend} />
              </div>
              <span className="font-display text-2xl font-bold" style={{ color: m.color }}>
                {m.latestValue}
              </span>
              <span className="text-xs text-muted-foreground ml-1">{m.unit}</span>
              <div className="mt-1">
                <span className={`text-xs font-body font-semibold ${m.change > 0 && m.key !== "hdl" ? "text-health-red" : "text-health-green"}`}>
                  {m.change > 0 ? "+" : ""}{m.change}%
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Main chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">{selectedMetric.name}</h2>
              <p className="text-sm text-muted-foreground font-body">
                Normal: {selectedMetric.normalMin} – {selectedMetric.normalMax} {selectedMetric.unit}
              </p>
            </div>
            <div className="flex gap-1 bg-muted rounded-lg p-1">
              {(["area", "line", "bar"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`px-3 py-1.5 rounded-md text-xs font-body font-semibold capitalize transition-colors ${
                    chartType === type ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "bar" ? (
                <BarChart data={demoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={selectedMetric.normalMax} stroke="hsl(var(--health-green))" strokeDasharray="5 5" label={{ value: "Max Normal", fill: "hsl(var(--health-green))", fontSize: 10 }} />
                  {selectedMetric.normalMin > 0 && (
                    <ReferenceLine y={selectedMetric.normalMin} stroke="hsl(var(--health-yellow))" strokeDasharray="5 5" label={{ value: "Min Normal", fill: "hsl(var(--health-yellow))", fontSize: 10 }} />
                  )}
                  <Bar dataKey={selectedMetric.key} name={selectedMetric.name} fill={selectedMetric.color} radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : chartType === "line" ? (
                <LineChart data={demoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={selectedMetric.normalMax} stroke="hsl(var(--health-green))" strokeDasharray="5 5" />
                  {selectedMetric.normalMin > 0 && (
                    <ReferenceLine y={selectedMetric.normalMin} stroke="hsl(var(--health-yellow))" strokeDasharray="5 5" />
                  )}
                  <Line type="monotone" dataKey={selectedMetric.key} name={selectedMetric.name} stroke={selectedMetric.color} strokeWidth={3} dot={{ fill: selectedMetric.color, r: 5 }} activeDot={{ r: 7 }} />
                </LineChart>
              ) : (
                <AreaChart data={demoData}>
                  <defs>
                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={selectedMetric.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={selectedMetric.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={selectedMetric.normalMax} stroke="hsl(var(--health-green))" strokeDasharray="5 5" />
                  {selectedMetric.normalMin > 0 && (
                    <ReferenceLine y={selectedMetric.normalMin} stroke="hsl(var(--health-yellow))" strokeDasharray="5 5" />
                  )}
                  <Area type="monotone" dataKey={selectedMetric.key} name={selectedMetric.name} stroke={selectedMetric.color} strokeWidth={3} fill="url(#colorMetric)" dot={{ fill: selectedMetric.color, r: 4 }} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* All metrics grid */}
        <h2 className="font-display text-2xl font-bold mb-4 text-foreground">All Metrics</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <motion.button
              key={m.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.04 }}
              onClick={() => { setSelectedMetric(m); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className={`glass-card p-5 text-left hover:border-primary/30 transition-all ${
                selectedMetric.key === m.key ? "border-primary/40" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-display font-semibold text-foreground text-sm">{m.name}</span>
                <TrendIcon trend={m.trend} />
              </div>
              <div className="h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={demoData}>
                    <Area type="monotone" dataKey={m.key} stroke={m.color} strokeWidth={2} fill={m.color} fillOpacity={0.1} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-display text-xl font-bold" style={{ color: m.color }}>{m.latestValue}</span>
                <span className="text-xs text-muted-foreground">{m.unit}</span>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-8 glass-card p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground font-body">
            This is a demo visualization with sample data. In the full version, your analyzed reports will automatically populate these charts to track your health journey over time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrendsPage;
