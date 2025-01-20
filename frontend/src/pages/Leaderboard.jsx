import React from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Function to fetch leaderboard data
const fetchLeaderboard = async () => {
  const response = await fetch("/api/users/leaderboard"); // Correct API endpoint
  if (!response.ok) {
    throw new Error("Failed to fetch leaderboard data");
  }
  return response.json();
};

const Leaderboard = () => {
  // Using React Query to fetch leaderboard data
  const { data, error, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: fetchLeaderboard,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-sm font-semibold text-gray-600">Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    toast.error("Failed to fetch leaderboard");
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-sm font-semibold text-red-600">Error loading leaderboard</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 space-y-6 h-full bg-black text-white">
      <h1 className="text-3xl font-semibold text-green-400 text-center">Leaderboard</h1>
      <div className="bg-black shadow-2xl rounded-lg p-8 flex-1 overflow-auto">
        <h2 className="text-xl font-semibold text-green-400 mb-6">Top Players</h2>
        {/* Rendering leaderboard entries */}
        <ul className="space-y-4">
          {data?.map((entry, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-4 rounded-lg border border-green-500 hover:bg-green-900 transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-white">{entry.username}</span>
              </div>
              <span className="text-sm font-medium text-white">{entry.score}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;
