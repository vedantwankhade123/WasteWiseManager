import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, CheckCircle, Loader2, CreditCard, ChevronRight } from "lucide-react";
import { Report } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import { Helmet } from "react-helmet";

const UserRewards: React.FC = () => {
  const { user } = useAuth();
  
  // Fetch user reports to calculate total points earned
  const { 
    data: reports, 
    isLoading, 
    isError 
  } = useQuery<Report[]>({
    queryKey: ["/api/reports"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mock function to handle reward redemption
  const handleRedeemReward = (points: number, amount: string) => {
    // In a real app, this would call an API to redeem the reward
    toast({
      title: "Reward Redeemed",
      description: `You've successfully redeemed ${points} points for ${amount}. We'll process your reward shortly.`,
    });
  };

  // Calculate total reward points
  const totalPoints = user?.rewardPoints || 0;
  
  // Get completed reports with rewards
  const completedReportsWithRewards = reports?.filter(
    (report) => report.status === "completed" && report.rewardPoints
  ) || [];

  return (
    <>
      <Helmet>
        <title>Rewards | CleanCity</title>
        <meta name="description" content="View your reward points earned from waste reports and redeem them for cash rewards." />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Rewards Center</h1>
            <p className="text-gray-600">Redeem your earned points for cash rewards</p>
          </div>
          
          {/* Points Summary Card */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <Coins className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Available Points</p>
                    <h2 className="text-3xl font-bold">{totalPoints}</h2>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" disabled>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Payment History
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Available Rewards */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Available Rewards</CardTitle>
                  <CardDescription>
                    Redeem your points for these rewards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <Coins className="h-6 w-6" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold">$5 Cash Reward</h3>
                                <p className="text-sm text-gray-500">500 points</p>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleRedeemReward(500, "$5")}
                              disabled={totalPoints < 500}
                            >
                              Redeem
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <Coins className="h-6 w-6" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold">$12 Cash Reward</h3>
                                <p className="text-sm text-gray-500">1000 points</p>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleRedeemReward(1000, "$12")}
                              disabled={totalPoints < 1000}
                            >
                              Redeem
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <Coins className="h-6 w-6" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold">$35 Cash Reward</h3>
                                <p className="text-sm text-gray-500">2500 points</p>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleRedeemReward(2500, "$35")}
                              disabled={totalPoints < 2500}
                            >
                              Redeem
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Points History */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Points History</CardTitle>
                  <CardDescription>
                    History of points earned and redeemed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : isError || completedReportsWithRewards.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                        <Coins className="h-6 w-6 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium">No points history yet</h3>
                      <p className="text-gray-500 mt-2">
                        Complete waste reports to earn points
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {completedReportsWithRewards.map((report) => (
                        <div 
                          key={report.id} 
                          className="flex items-start justify-between border-b border-gray-100 pb-3"
                        >
                          <div>
                            <p className="font-medium">{report.title}</p>
                            <p className="text-sm text-gray-500">
                              {formatDate(report.completedAt || report.createdAt)}
                            </p>
                          </div>
                          <div className="text-accent font-medium">
                            +{report.rewardPoints} points
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default UserRewards;
