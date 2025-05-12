import { useState, useCallback } from "react";

interface Position {
  coords: {
    latitude: number;
    longitude: number;
  };
}

interface UseLocationReturn {
  getCurrentLocation: () => Promise<Position>;
  isLoading: boolean;
  error: string | null;
}

export function useLocation(): UseLocationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback((): Promise<Position> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setError(null);

      if (!navigator.geolocation) {
        setIsLoading(false);
        const geoError = new Error(
          "Geolocation is not supported by your browser"
        );
        setError(geoError.message);
        reject(geoError);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLoading(false);
          resolve(position);
        },
        (err) => {
          setIsLoading(false);
          let errorMessage = "Unknown error occurred while getting location";

          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = "User denied the request for geolocation";
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable";
              break;
            case err.TIMEOUT:
              errorMessage = "The request to get user location timed out";
              break;
          }

          setError(errorMessage);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // 10 seconds
          maximumAge: 0,
        }
      );
    });
  }, []);

  return {
    getCurrentLocation,
    isLoading,
    error,
  };
}
