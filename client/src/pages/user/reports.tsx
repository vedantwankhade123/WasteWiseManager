import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Loader2 } from "lucide-react";
import { Report } from "@shared/schema";
import ReportCard from "@/components/report-card";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Helmet } from "react-helmet";
import { apiRequest } from "@/lib/api";
import { toast } from "@/hooks/use-toast";



const UserReports: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch user reports
  const { 
    data: reports, 
    isLoading, 
    isError,
    error 
  } = useQuery<Report[]>({
    queryKey: ["/api/reports"],
    queryFn: async (): Promise<Report[]> => {
      try {
        const data = await apiRequest<Report[]>("/reports", "GET");
        return Array.isArray(data) ? data : [];
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast({
            title: "Error fetching reports",
            description: err.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error fetching reports",
            description: "Failed to fetch reports",
            variant: "destructive"
          });
        }
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Filter reports based on status
  const filteredReports = useMemo<Report[]>(() => {
    if (!reports) return [];
    return reports.filter((report: Report) => 
      statusFilter === "all" || report.status === statusFilter
    );
  }, [reports, statusFilter]);

  // Handle search
  const searchFilteredReports = useMemo<Report[]>(() => {
    return filteredReports.filter((report: Report) => 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [filteredReports, searchQuery]);

  // Get report count
  const reportCount = searchFilteredReports.length;



  // Handle status update
  const handleStatusUpdate = (reportId: number, status: string) => {
    return apiRequest(`/reports/${reportId}/status`, "PUT", { status })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["/reports"] });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Failed to update report status",
          variant: "destructive",
        });
      });
  };

  // Check if user is admin
  const isAdmin = true; // TODO: Implement proper admin check

  return (
    <>
      <Helmet>
        <title>My Reports | CleanCity</title>
        <meta name="description" content="View and manage all your waste reports. Track the status of your submissions and help keep your city clean." />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <CardTitle>My Reports</CardTitle>
                <CardDescription>
                  View and manage all your waste reports
                </CardDescription>
              </div>
              
              <Link href="/user/report-new">
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  New Report
                </Button>
              </Link>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search reports..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : isError ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-md">
                  Error loading reports: {(error as Error).message}
                </div>
              ) : !reports || reports.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">No reports found</h3>
                  <p className="text-gray-500 mt-2 mb-4">
                    You haven't submitted any waste reports yet
                  </p>
                  <Link href="/user/report-new">
                    <Button>Submit a Report</Button>
                  </Link>
                </div>
              ) : filteredReports && filteredReports.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">No matching reports</h3>
                  <p className="text-gray-500 mt-2">
                    Try changing your filters to see more results
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {searchFilteredReports.map((report) => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      isAdmin={isAdmin}
                      onUpdateStatus={handleStatusUpdate}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default UserReports;
