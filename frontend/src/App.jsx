import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import AIChatbox from "./pages/ai-chatbox/ai-chatbox";
import RewardsPage from "./pages/RewardsPage";
import CreditScore from "./pages/CreditScore";
import MapsPage from "./pages/MapsPage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import Leaderboard from "./pages/Leaderboard";

function App() {
  const { data: authUser, isLoading } = useQuery({
    // Fetch the authenticated user
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        console.log("authUser is here:", data);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  const location = useLocation(); // Get the current route

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Define the center and locations for the MapsPage
  const mapCenter = { lat: 37.7749, lng: -122.4194 }; // San Francisco as the default center
  const mapLocations = [
    { lat: 37.7749, lng: -122.4194, name: "San Francisco", description: "City by the Bay" },
    { lat: 34.0522, lng: -118.2437, name: "Los Angeles", description: "City of Angels" },
    { lat: 40.7128, lng: -74.0060, name: "New York City", description: "The Big Apple" },
    { lat: 41.8781, lng: -87.6298, name: "Chicago", description: "The Windy City" },
  ];

  // Check if the current route is one where you don't want to show RightPanel
  const hideRightPanelRoutes = [
	"/leaderboard",
    
    "/maps",
    "/ai-chatbox"
  ];

  const showRightPanel = !hideRightPanelRoutes.includes(location.pathname);

  return (
    <div className="flex max-w-6xl mx-auto">
      {/* Sidebar is visible if the user is authenticated */}
      {authUser && <Sidebar />}
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
        <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/ai-chatbox" element={authUser ? <AIChatbox /> : <Navigate to="/login" />} />
        <Route path="/rewards" element={authUser ? <RewardsPage /> : <Navigate to="/login" />} />
        <Route path="/credit-score" element={<CreditScore />} />
		<Route path="/leaderboard" element={authUser ? <Leaderboard />  : <Navigate to="/login" />} />
        <Route
          path="/maps"
          element={
            authUser ? <MapsPage center={mapCenter} locations={mapLocations} /> : <Navigate to="/login" />
          }
        />
      </Routes>
      {/* Conditionally render the RightPanel */}
      {showRightPanel && authUser && <RightPanel />}
      <Toaster />
    </div>
  );
}

export default App;
