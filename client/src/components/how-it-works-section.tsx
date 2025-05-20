import React, { useState } from "react";
import { UserPlus, Camera, MapPin, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const handleStepHover = (step: number) => {
    setActiveStep(step);
  };

  const handleStepLeave = () => {
    setActiveStep(null);
  };

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Making a difference is easy with our simple 4-step process
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
          {/* Step 1 */}
          <motion.div 
            className="relative group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onMouseEnter={() => handleStepHover(1)}
            onMouseLeave={handleStepLeave}
          >
            <div className="absolute -left-4 md:left-1/2 top-10 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold z-10 transition-transform duration-300 group-hover:scale-110">
              <span className="text-sm">1</span>
            </div>
            <div className="hidden md:block absolute left-1/2 top-14 w-full h-0.5 bg-gray-200 -z-0 transition-colors duration-300 group-hover:bg-primary/50"></div>
            <div className="pl-8 md:pl-0 md:text-center mt-6 transition-all duration-300 group-hover:translate-y-[-4px]">
              <div className="step-icon bg-white rounded-xl p-4 shadow-lg transition-transform duration-300 group-hover:scale-110">
                <UserPlus className="text-2xl text-primary" />
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-primary">Sign Up</h3>
              <p className="mt-2 text-gray-600 text-lg transition-colors duration-300 group-hover:text-gray-700">
                Create your free account to get started.
              </p>
            </div>
          </motion.div>
          
          {/* Step 2 */}
          <motion.div 
            className="relative group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onMouseEnter={() => handleStepHover(2)}
            onMouseLeave={handleStepLeave}
          >
            <div className="absolute -left-4 md:left-1/2 top-10 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold z-10 transition-transform duration-300 group-hover:scale-110">
              <span className="text-sm">2</span>
            </div>
            <div className="hidden md:block absolute left-1/2 top-14 w-full h-0.5 bg-gray-200 -z-0 transition-colors duration-300 group-hover:bg-primary/50"></div>
            <div className="pl-8 md:pl-0 md:text-center mt-6 transition-all duration-300 group-hover:translate-y-[-4px]">
              <div className="step-icon bg-white rounded-xl p-4 shadow-lg transition-transform duration-300 group-hover:scale-110">
                <Camera className="text-2xl text-primary" />
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-primary">Take a Photo</h3>
              <p className="mt-2 text-gray-600 text-lg transition-colors duration-300 group-hover:text-gray-700">
                Capture the waste with your device camera.
              </p>
            </div>
          </motion.div>
          
          {/* Step 3 */}
          <motion.div 
            className="relative group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onMouseEnter={() => handleStepHover(3)}
            onMouseLeave={handleStepLeave}
          >
            <div className="absolute -left-4 md:left-1/2 top-10 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold z-10 transition-transform duration-300 group-hover:scale-110">
              <span className="text-sm">3</span>
            </div>
            <div className="hidden md:block absolute left-1/2 top-14 w-full h-0.5 bg-gray-200 -z-0 transition-colors duration-300 group-hover:bg-primary/50"></div>
            <div className="pl-8 md:pl-0 md:text-center mt-6 transition-all duration-300 group-hover:translate-y-[-4px]">
              <div className="step-icon bg-white rounded-xl p-4 shadow-lg transition-transform duration-300 group-hover:scale-110">
                <MapPin className="text-2xl text-primary" />
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-primary">Mark Location</h3>
              <p className="mt-2 text-gray-600 text-lg transition-colors duration-300 group-hover:text-gray-700">
                Set the waste location on the map.
              </p>
            </div>
          </motion.div>
          
          {/* Step 4 */}
          <motion.div 
            className="relative group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            onMouseEnter={() => handleStepHover(4)}
            onMouseLeave={handleStepLeave}
          >
            <div className="absolute -left-4 md:left-1/2 top-10 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold z-10 transition-transform duration-300 group-hover:scale-110">
              <span className="text-sm">4</span>
            </div>
            <div className="pl-8 md:pl-0 md:text-center mt-6 transition-all duration-300 group-hover:translate-y-[-4px]">
              <div className="step-icon bg-white rounded-xl p-4 shadow-lg transition-transform duration-300 group-hover:scale-110">
                <CheckCircle className="text-2xl text-primary" />
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-primary">Submit Report</h3>
              <p className="mt-2 text-gray-600 text-lg transition-colors duration-300 group-hover:text-gray-700">
                Complete your report and earn points.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
