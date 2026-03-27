import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorks from "@/components/HowItWorks";
import ReportDemo from "@/components/ReportDemo";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <div id="features">
        <FeaturesSection />
      </div>
      <div id="how">
        <HowItWorks />
      </div>
      <div id="demo">
        <ReportDemo />
      </div>
      <Testimonials />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
