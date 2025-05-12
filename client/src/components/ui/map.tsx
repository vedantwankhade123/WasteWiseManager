import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Locate } from "lucide-react";
import { useLocation } from "@/hooks/use-location";

interface MapComponentProps {
  onLocationSelect: (latitude: string, longitude: string, address: string) => void;
  initialLatitude?: string;
  initialLongitude?: string;
  initialAddress?: string;
}

declare global {
  interface Window {
    L: any;
  }
}

const MapComponent: React.FC<MapComponentProps> = ({
  onLocationSelect,
  initialLatitude,
  initialLongitude,
  initialAddress,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: string;
    lng: string;
    address: string;
  }>({
    lat: initialLatitude || "",
    lng: initialLongitude || "",
    address: initialAddress || "",
  });
  
  const { 
    getCurrentLocation,
    isLoading: isLocationLoading,
    error: locationError
  } = useLocation();

  // Initialize map when component mounts
  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    link.crossOrigin = "";
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    script.crossOrigin = "";
    script.onload = initializeMap;
    document.head.appendChild(script);

    return () => {
      // Cleanup
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.L) return;

    // Initialize the map
    const leafletMap = window.L.map(mapRef.current).setView([20, 0], 2);

    // Add OpenStreetMap tile layer
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(leafletMap);

    // Set initial marker if coordinates provided
    if (initialLatitude && initialLongitude) {
      const initialMarker = window.L.marker(
        [parseFloat(initialLatitude), parseFloat(initialLongitude)],
        { draggable: true }
      ).addTo(leafletMap);
      
      leafletMap.setView([parseFloat(initialLatitude), parseFloat(initialLongitude)], 15);
      
      initialMarker.on("dragend", handleMarkerDragEnd);
      setMarker(initialMarker);
    }

    // Add click event to map
    leafletMap.on("click", handleMapClick);

    setMap(leafletMap);
  };

  const handleMapClick = async (e: any) => {
    const { lat, lng } = e.latlng;
    
    // Update or create marker
    if (marker) {
      marker.setLatLng([lat, lng]);
    } else {
      const newMarker = window.L.marker([lat, lng], { draggable: true }).addTo(map);
      newMarker.on("dragend", handleMarkerDragEnd);
      setMarker(newMarker);
    }
    
    // Get address from coordinates
    const address = await getAddressFromCoordinates(lat, lng);
    
    // Update selected location
    const newLocation = {
      lat: lat.toFixed(6),
      lng: lng.toFixed(6),
      address,
    };
    
    setSelectedLocation(newLocation);
    onLocationSelect(newLocation.lat, newLocation.lng, newLocation.address);
  };

  const handleMarkerDragEnd = async (e: any) => {
    const { lat, lng } = e.target.getLatLng();
    
    // Get address from coordinates
    const address = await getAddressFromCoordinates(lat, lng);
    
    // Update selected location
    const newLocation = {
      lat: lat.toFixed(6),
      lng: lng.toFixed(6),
      address,
    };
    
    setSelectedLocation(newLocation);
    onLocationSelect(newLocation.lat, newLocation.lng, newLocation.address);
  };

  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      return data.display_name || "Unknown location";
    } catch (error) {
      console.error("Error getting address:", error);
      return "Address lookup failed";
    }
  };

  const searchLocation = async () => {
    if (!searchQuery.trim() || !map) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        
        // Move map to the location
        map.setView([lat, lon], 15);
        
        // Update or create marker
        if (marker) {
          marker.setLatLng([lat, lon]);
        } else {
          const newMarker = window.L.marker([lat, lon], { draggable: true }).addTo(map);
          newMarker.on("dragend", handleMarkerDragEnd);
          setMarker(newMarker);
        }
        
        // Update selected location
        const newLocation = {
          lat: lat,
          lng: lon,
          address: display_name,
        };
        
        setSelectedLocation(newLocation);
        onLocationSelect(newLocation.lat, newLocation.lng, newLocation.address);
      } else {
        alert("Location not found. Please try a different search term.");
      }
    } catch (error) {
      console.error("Error searching location:", error);
      alert("Error searching for location. Please try again.");
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      const position = await getCurrentLocation();
      
      if (position && map) {
        const { latitude, longitude } = position.coords;
        
        // Move map to current location
        map.setView([latitude, longitude], 15);
        
        // Update or create marker
        if (marker) {
          marker.setLatLng([latitude, longitude]);
        } else {
          const newMarker = window.L.marker([latitude, longitude], { draggable: true }).addTo(map);
          newMarker.on("dragend", handleMarkerDragEnd);
          setMarker(newMarker);
        }
        
        // Get address from coordinates
        const address = await getAddressFromCoordinates(latitude, longitude);
        
        // Update selected location
        const newLocation = {
          lat: latitude.toFixed(6),
          lng: longitude.toFixed(6),
          address,
        };
        
        setSelectedLocation(newLocation);
        onLocationSelect(newLocation.lat, newLocation.lng, newLocation.address);
      }
    } catch (error) {
      console.error("Error getting current location:", error);
      alert("Error getting your current location. Please enable location services in your browser.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchLocation()}
            className="pr-10"
          />
          <Button
            variant="ghost"
            type="button"
            size="icon"
            className="absolute right-0 top-0"
            onClick={searchLocation}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="secondary"
          onClick={handleUseCurrentLocation}
          disabled={isLocationLoading}
          className="gap-2"
        >
          <Locate className="h-4 w-4" />
          {isLocationLoading ? "Getting Location..." : "Use Current Location"}
        </Button>
      </div>

      <div 
        ref={mapRef} 
        className="h-[300px] w-full rounded-md border border-input bg-gray-50"
      ></div>

      {selectedLocation.address && (
        <div className="mt-2 p-2 bg-primary/10 rounded-md text-sm flex items-start gap-2">
          <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <span>{selectedLocation.address}</span>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
