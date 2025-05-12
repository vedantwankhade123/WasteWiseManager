import React from "react";
import { cn } from "@/lib/utils";
import { 
  Clock, 
  Loader2, 
  CheckCircle, 
  XCircle,
  HelpCircle 
} from "lucide-react";

interface ReportStatusBadgeProps {
  status: string;
  className?: string;
}

const ReportStatusBadge: React.FC<ReportStatusBadgeProps> = ({ 
  status, 
  className
}) => {
  const getStatusConfig = () => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          className: "bg-gray-100 text-gray-700",
          icon: <Clock className="h-3 w-3 mr-1" />,
          label: "Pending"
        };
      case "processing":
        return {
          className: "bg-orange-100 text-orange-700",
          icon: <Loader2 className="h-3 w-3 mr-1 animate-spin" />,
          label: "Processing"
        };
      case "completed":
        return {
          className: "bg-green-100 text-green-700",
          icon: <CheckCircle className="h-3 w-3 mr-1" />,
          label: "Completed"
        };
      case "rejected":
        return {
          className: "bg-red-100 text-red-700",
          icon: <XCircle className="h-3 w-3 mr-1" />,
          label: "Rejected"
        };
      default:
        return {
          className: "bg-gray-100 text-gray-700",
          icon: <HelpCircle className="h-3 w-3 mr-1" />,
          label: status
        };
    }
  };

  const { className: statusClassName, icon, label } = getStatusConfig();

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-sm font-medium flex items-center", 
      statusClassName, 
      className
    )}>
      {icon}
      {label}
    </span>
  );
};

export default ReportStatusBadge;
