import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to display in a readable format
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Format time to display in a readable format
export function formatTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Format date and time to display in a readable format
export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return `${formatDate(d)} at ${formatTime(d)}`;
}

// Get time elapsed since the given date (e.g., "2 hours ago")
export function timeAgo(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval === 1 ? "1 year ago" : `${interval} years ago`;
  }
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval === 1 ? "1 month ago" : `${interval} months ago`;
  }
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval === 1 ? "1 day ago" : `${interval} days ago`;
  }
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval === 1 ? "1 hour ago" : `${interval} hours ago`;
  }
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;
  }
  
  return "just now";
}

// Truncate text to a specific length with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

// Convert report status to CSS class for styling
export function getStatusClass(status: string): string {
  switch (status.toLowerCase()) {
    case "pending":
      return "status-badge status-pending";
    case "processing":
      return "status-badge status-processing";
    case "completed":
      return "status-badge status-completed";
    case "rejected":
      return "status-badge status-rejected";
    default:
      return "status-badge status-pending";
  }
}

// Get status icon based on report status
export function getStatusIcon(status: string): string {
  switch (status.toLowerCase()) {
    case "pending":
      return "clock";
    case "processing":
      return "spinner";
    case "completed":
      return "check-circle";
    case "rejected":
      return "x-circle";
    default:
      return "help-circle";
  }
}

// Format reward points with a "+" prefix
export function formatRewardPoints(points: number): string {
  return points > 0 ? `+${points}` : `${points}`;
}

// Validate that a form file input is an image with allowed extensions
export function validateImageFile(file: File): boolean {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
  return allowedTypes.includes(file.type);
}

// Check if a string is a valid email format
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Check if a string is a valid phone number (simple version)
export function isValidPhone(phone: string): boolean {
  const re = /^\+?[0-9\s\-\(\)]{10,15}$/;
  return re.test(phone);
}

// Convert file to base64 string
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
