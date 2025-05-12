import { useState } from "react";
import { fileToBase64 } from "@/lib/utils";

interface UseFileUploadProps {
  maxSizeInMB?: number;
  acceptedTypes?: string[];
}

export function useFileUpload({
  maxSizeInMB = 10,
  acceptedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"],
}: UseFileUploadProps = {}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Convert bytes to MB
  const bytesToMB = (bytes: number) => bytes / (1024 * 1024);

  // Handle file selection
  const handleFileChange = async (file: File | null) => {
    if (!file) {
      setFile(null);
      setPreview(null);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // Validate file size
      if (bytesToMB(file.size) > maxSizeInMB) {
        throw new Error(`File size should not exceed ${maxSizeInMB}MB`);
      }

      // Validate file type
      if (!acceptedTypes.includes(file.type)) {
        throw new Error(
          `Invalid file type. Accepted types: ${acceptedTypes
            .map((type) => type.split("/")[1])
            .join(", ")}`
        );
      }

      // Create preview
      const base64 = await fileToBase64(file);
      setFile(file);
      setPreview(base64);
    } catch (err: any) {
      setError(err.message);
      setFile(null);
      setPreview(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Set image directly from a base64 string (e.g., from camera capture)
  const setImage = (base64Image: string) => {
    setPreview(base64Image);
    // Create a blob from the base64 string
    try {
      const byteString = atob(base64Image.split(',')[1]);
      const mimeString = base64Image.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], "capture.jpg", { type: mimeString });
      
      setFile(file);
      setError(null);
    } catch (err: any) {
      setError("Failed to process captured image");
    }
  };

  // Clear selected file
  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
  };

  return {
    file,
    preview,
    error,
    isLoading,
    handleFileChange,
    setImage,
    clearFile,
  };
}
