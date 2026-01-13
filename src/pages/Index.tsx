import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { FeaturedActivities } from "@/components/home/FeaturedActivities";
import { Newsletter } from "@/components/home/Newsletter";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <FeaturedActivities />
        <WhyChooseUs />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;