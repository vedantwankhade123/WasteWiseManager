import React from "react";
import { UserPlus, Camera, MapPin, CheckCircle } from "lucide-react";

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600">Making a difference is easy with our simple 4-step process</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="relative">
            <div className="absolute -left-3 md:left-1/2 top-8 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold z-10">1</div>
            <div className="hidden md:block absolute left-1/2 top-12 w-full h-0.5 bg-gray-200 -z-0"></div>
            <div className="pl-6 md:pl-0 md:text-center mt-4">
              <div className="step-icon">
                <UserPlus className="text-xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
              <p className="text-gray-600">Create your free account to get started.</p>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="relative">
            <div className="absolute -left-3 md:left-1/2 top-8 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold z-10">2</div>
            <div className="hidden md:block absolute left-1/2 top-12 w-full h-0.5 bg-gray-200 -z-0"></div>
            <div className="pl-6 md:pl-0 md:text-center mt-4">
              <div className="step-icon">
                <Camera className="text-xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Take a Photo</h3>
              <p className="text-gray-600">Capture the waste with your device camera.</p>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="relative">
            <div className="absolute -left-3 md:left-1/2 top-8 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold z-10">3</div>
            <div className="hidden md:block absolute left-1/2 top-12 w-full h-0.5 bg-gray-200 -z-0"></div>
            <div className="pl-6 md:pl-0 md:text-center mt-4">
              <div className="step-icon">
                <MapPin className="text-xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mark Location</h3>
              <p className="text-gray-600">Set the waste location on the map.</p>
            </div>
          </div>
          
          {/* Step 4 */}
          <div className="relative">
            <div className="absolute -left-3 md:left-1/2 top-8 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold z-10">4</div>
            <div className="pl-6 md:pl-0 md:text-center mt-4">
              <div className="step-icon">
                <CheckCircle className="text-xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Submit Report</h3>
              <p className="text-gray-600">Complete your report and earn points.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
