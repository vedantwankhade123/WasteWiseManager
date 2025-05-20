import React from "react";
import { motion } from 'framer-motion';
import AuthModal from "@/components/dialogs/auth-modal";
import { useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

const HeroSection: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [location, setLocation] = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [authType, setAuthType] = useState<'user' | 'admin'>('user');

  const handleLogin = () => {
    setShowLoginModal(true);
    setShowSignupModal(false);
  };

  const handleSignup = () => {
    setShowSignupModal(true);
    setShowLoginModal(false);
  };

  return (
    <section id="home" className="relative px-1.5">
      <div 
        className="hero-section w-full min-h-[90vh] md:min-h-[90vh] lg:min-h-[98vh] my-1.5 rounded-lg shadow-lg overflow-hidden"
        style={{ 
          backgroundImage: "url('/assets/bg8.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div className="w-full h-full flex items-center justify-center relative z-10 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl w-full text-center">
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Keep Your City Clean
            </motion.h1>
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Join our community effort to identify and clean up waste in your neighborhood. Report waste, earn rewards, and make a difference.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button 
                onClick={handleLogin} 
                size="lg"
                className="w-full sm:w-auto px-6 py-5 sm:py-6 text-base sm:text-lg bg-accent hover:bg-accent-dark text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Report Waste
              </Button>
              <Button
                onClick={handleSignup}
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto px-6 py-5 sm:py-6 text-base sm:text-lg bg-white/20 backdrop-blur-sm text-white border border-white hover:bg-white/30 hover:text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Admin Login
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
      {showLoginModal && (
        <AuthModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          type="login"
          userType={authType}
          onSwitchType={(type: 'user' | 'admin') => setAuthType(type)}
        />
      )}
      {showSignupModal && (
        <AuthModal
          isOpen={showSignupModal}
          onClose={() => setShowSignupModal(false)}
          type="signup"
          userType={authType}
          onSwitchType={(type: 'user' | 'admin') => setAuthType(type)}
        />
      )}
    </section>
  );
};

export default HeroSection;
