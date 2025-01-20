import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "250%",
  height: "80vh",
};

const MapsPage = ({ defaultCenter = { lat: 28.6139, lng: 77.2090 }, locations = [] }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Replace with your Vite environment variable
  });

  const [center, setCenter] = useState(defaultCenter); // Map center
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Use Geolocation API to get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("User's location:", { lat: latitude, lng: longitude }); // Debugging output
          setCenter({ lat: latitude, lng: longitude }); // Update the center
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
    }
  }, []);

  if (loadError) {
    return <div>Error loading map: {loadError.message}</div>;
  }

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Explore Locations on the Map</h1>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        {/* Display markers for provided locations */}
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={{ lat: location.lat, lng: location.lng }}
            onClick={() => setSelectedLocation(location)}
          />
        ))}

        {/* Display a marker at the user's current location */}
        <Marker position={center} title="You are here" />

        {/* Show information for selected marker */}
        {selectedLocation && (
          <InfoWindow
            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
            onCloseClick={() => setSelectedLocation(null)}
          >
            <div>
              <h2 className="font-bold">{selectedLocation.name}</h2>
              <p>{selectedLocation.description}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapsPage;
