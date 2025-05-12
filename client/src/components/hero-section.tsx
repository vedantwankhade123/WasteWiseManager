import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/dialogs/auth-modal";
import { useLocation } from "wouter";
import { useState } from "react";

const HeroSection: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [, navigate] = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [authType, setAuthType] = useState<"user" | "admin">("user");

  const handleReportWaste = () => {
    if (isAuthenticated) {
      navigate(user?.role === "admin" ? "/admin/reports" : "/user/report-new");
    } else {
      setAuthType("user");
      setShowSignupModal(true);
    }
  };

  const handleAdminLogin = () => {
    if (isAuthenticated && user?.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      setAuthType("admin");
      setShowLoginModal(true);
    }
  };

  return (
    <section id="home" className="relative">
      <div 
        className="hero-section"
        style={{ 
          backgroundImage: "url('https://pixabay.com/get/g43909b8fe0031cc5132a6c379627a6a02380090fa7d05cdfcf683908705533dd9d5fbcf483f37cad7d47eba363b0da0f9c618ebac6e0f78a382c01d2aaa906d3_1280.jpg')",
          backgroundSize: "cover", 
          backgroundPosition: "center" 
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl mb-6">
              Keep Your City Clean & Green
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Join our community effort to identify and clean up waste in your neighborhood. Report waste, earn rewards, and make a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleReportWaste} 
                size="lg"
                className="px-6 py-6 bg-accent hover:bg-accent-dark text-white text-lg font-medium"
              >
                Report Waste
              </Button>
              <Button
                onClick={handleAdminLogin}
                variant="secondary"
                size="lg"
                className="px-6 py-6 bg-white/20 backdrop-blur-sm text-white border border-white hover:bg-white/30 text-lg font-medium"
              >
                Admin Login
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modals */}
      <AuthModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        type="login"
        userType={authType}
        onSwitchType={(type) => {
          setShowLoginModal(false);
          setShowSignupModal(true);
          setAuthType(type);
        }}
      />

      <AuthModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        type="signup"
        userType={authType}
        onSwitchType={(type) => {
          setShowSignupModal(false);
          setShowLoginModal(true);
          setAuthType(type);
        }}
      />
    </section>
  );
};

export default HeroSection;
