import React from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Function to fetch the user's credit score
const fetchCreditScore = async () => {
  const response = await fetch("/api/users/credit-score");
  if (!response.ok) {
    throw new Error("Failed to fetch credit score");
  }
  return response.json();
};

const CreditScore = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['creditScore'],
    queryFn: fetchCreditScore,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading...</div> {/* Add a loading spinner if needed */}
      </div>
    );
  }

  if (error) {
    toast.error("Failed to fetch credit score");
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Error loading credit score</div>
      </div>
    );
  }

  const creditScore = data?.creditScore || "N/A";

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-green-400 to-green-600">
      <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-4xl">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">Your Credit Score</h1>
        <div className="text-center">
          <div
            className={`text-7xl font-extrabold ${creditScore === "N/A" ? "text-gray-500" : "text-green-800"}`}
          >
            {creditScore === "N/A" ? (
              <span>No credit score available</span>
            ) : (
              <span>{creditScore}</span>
            )}
          </div>
          <p className="text-2xl mt-6 text-gray-700">Credit Score</p>
          {creditScore !== "N/A" && (
            <div className="mt-8 p-6 bg-green-100 rounded-lg shadow-md">
              <p className="text-lg font-semibold text-green-700">Good to go!</p>
              <p className="text-gray-600 mt-2">Your credit score is in good standing. Keep up the great work!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditScore;
