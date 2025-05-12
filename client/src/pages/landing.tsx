import React, { useState } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import HowItWorksSection from "@/components/how-it-works-section";
import RewardsSection from "@/components/rewards-section";
import ContactSection from "@/components/contact-section";
import { Helmet } from "react-helmet";

const Landing: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>CleanCity - Waste Management Platform</title>
        <meta name="description" content="Join CleanCity to identify and clean up waste in your neighborhood. Report waste, earn rewards, and make a difference for a cleaner, greener environment." />
        <meta property="og:title" content="CleanCity - Waste Management Platform" />
        <meta property="og:description" content="Join our community effort to identify and clean up waste in your neighborhood. Report waste, earn rewards, and make a difference." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://pixabay.com/get/g43909b8fe0031cc5132a6c379627a6a02380090fa7d05cdfcf683908705533dd9d5fbcf483f37cad7d47eba363b0da0f9c618ebac6e0f78a382c01d2aaa906d3_1280.jpg" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar transparent={true} />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <HeroSection />
          
          {/* About Section */}
          <AboutSection />
          
          {/* How It Works Section */}
          <HowItWorksSection />
          
          {/* Success Stories/Featured Reports Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Recent Success Stories</h2>
                <p className="text-lg text-gray-600">See how our community is making a difference</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Success Story 1 */}
                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                  <div className="relative h-48 bg-gray-200">
                    <img src="https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&q=80&w=600&h=400" alt="Cleaned up park area" className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-sm font-medium">Completed</div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold mb-2">Park Cleanup Initiative</h3>
                    <p className="text-gray-600 text-sm mb-3">Reported by: Sarah J.</p>
                    <p className="text-gray-700 mb-4">A community park was cleaned up after multiple reports. The area is now safe for children to play.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-medium">5 days ago</span>
                      <span className="bg-accent/10 text-accent px-2 py-1 rounded text-sm font-medium">+150 points</span>
                    </div>
                  </div>
                </div>
                
                {/* Success Story 2 */}
                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                  <div className="relative h-48 bg-gray-200">
                    <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600&h=400" alt="Recycling effort in urban area" className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-sm font-medium">Completed</div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold mb-2">Illegal Dumping Removed</h3>
                    <p className="text-gray-600 text-sm mb-3">Reported by: Michael T.</p>
                    <p className="text-gray-700 mb-4">Construction debris was promptly removed after being reported by concerned citizens.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-medium">2 weeks ago</span>
                      <span className="bg-accent/10 text-accent px-2 py-1 rounded text-sm font-medium">+200 points</span>
                    </div>
                  </div>
                </div>
                
                {/* Success Story 3 */}
                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                  <div className="relative h-48 bg-gray-200">
                    <img src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600&h=400" alt="Clean city street" className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-sm font-medium">Completed</div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold mb-2">Street Waste Collection</h3>
                    <p className="text-gray-600 text-sm mb-3">Reported by: Emily R.</p>
                    <p className="text-gray-700 mb-4">Street corners were cleared of litter and debris, improving the appearance of the neighborhood.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-medium">1 month ago</span>
                      <span className="bg-accent/10 text-accent px-2 py-1 rounded text-sm font-medium">+120 points</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Rewards Section */}
          <RewardsSection />
          
          {/* Contact Section */}
          <ContactSection />
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Landing;
