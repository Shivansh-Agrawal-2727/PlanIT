import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query"; // Using React Query for data fetching
import toast from "react-hot-toast";

// Function to fetch the user's credit score
const fetchCreditScore = async () => {
  const response = await fetch("/api/credit-score"); // API endpoint to fetch credit score
  if (!response.ok) {
    throw new Error("Failed to fetch credit score");
  }
  return response.json();
};

const CreditScore = () => {
  const { data, error, isLoading } = useQuery(["creditScore"], fetchCreditScore);

  if (isLoading) {
    return <div>Loading...</div>; // Display loading state
  }

  if (error) {
    toast.error("Failed to fetch credit score"); // Show error if fetching fails
    return <div>Error loading credit score</div>;
  }

  return (
    <div className="credit-score-page">
      <h1>Your Credit Score</h1>
      <div className="credit-score-info">
        <p>Credit Score: {data?.score}</p> {/* Display the score */}
        <p>Credit Score History: {data?.history}</p> {/* You can also display other details */}
      </div>
    </div>
  );
};

export default CreditScore;
