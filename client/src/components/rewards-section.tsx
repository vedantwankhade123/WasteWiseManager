import React from "react";
import { CheckCircle, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import AuthModal from "@/components/dialogs/auth-modal";

const RewardsSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleSignupClick = () => {
    setShowSignupModal(true);
  };

  return (
    <section id="rewards" className="py-16 bg-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Earn Rewards for Your Efforts</h2>
          <p className="text-lg text-gray-600">Get rewarded for helping keep your city clean</p>
        </div>
        
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">How to Earn Points</h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="text-primary mt-1 h-5 w-5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Submit a Waste Report</h4>
                      <p className="text-gray-600">Earn 50 points for each verified report</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="text-primary mt-1 h-5 w-5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Additional Details</h4>
                      <p className="text-gray-600">Earn 25 bonus points for detailed reports with clear photos</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="text-primary mt-1 h-5 w-5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Consistent Reporting</h4>
                      <p className="text-gray-600">Earn 100 bonus points for 5 reports in a month</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="text-primary mt-1 h-5 w-5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Community Engagement</h4>
                      <p className="text-gray-600">Earn points for referring new users to the platform</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="p-8 bg-gradient-to-br from-accent to-secondary text-white">
                <h3 className="text-2xl font-bold mb-4">Redeem Your Points</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-white/30">
                    <div>
                      <h4 className="font-semibold text-lg">500 Points</h4>
                      <p className="text-white/80">₹500 Cash Reward</p>
                    </div>
                    <Coins className="h-6 w-6" />
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/30">
                    <div>
                      <h4 className="font-semibold text-lg">1000 Points</h4>
                      <p className="text-white/80">$12 Cash Reward</p>
                    </div>
                    <Coins className="h-6 w-6" />
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/30">
                    <div>
                      <h4 className="font-semibold text-lg">2500 Points</h4>
                      <p className="text-white/80">$35 Cash Reward</p>
                    </div>
                    <Coins className="h-6 w-6" />
                  </div>
                  <div>
                    {!isAuthenticated && (
                      <Button 
                        onClick={handleSignupClick}
                        className="mt-4 w-full py-3 px-4 bg-white text-accent font-medium rounded-md hover:bg-white/90 transition-colors"
                      >
                        Sign Up to Start Earning
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        type="signup"
        userType="user"
        onSwitchType={() => {}}
      />
    </section>
  );
};

export default RewardsSection;
