import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton"; // Import Skeleton component
import "react-loading-skeleton/dist/skeleton.css"; // Import the CSS

const RewardsPage = () => {
  const [currentSection, setCurrentSection] = useState("rewards");

  // Static rewards based on credit score
  const staticRewards = [
    {
      id: "reward1",
      name: "Bronze Membership",
      description: "Exclusive discounts for credit score 300 and above.",
      requiredCreditScore: 300,
    },
    {
      id: "reward2",
      name: "Silver Membership",
      description: "Special deals for credit score 600 and above.",
      requiredCreditScore: 600,
    },
    {
      id: "reward3",
      name: "Gold Membership",
      description: "Premium rewards for credit score 800 and above.",
      requiredCreditScore: 800,
    },
  ];

  // General rewards added for better variety
  const generalRewards = [
    {
      id: "reward4",
      name: "Free Movie Tickets",
      description: "Enjoy free movie tickets for every 5 purchases.",
    },
    {
      id: "reward5",
      name: "Weekend Getaway",
      description: "Get a free weekend getaway for a valid membership.",
    },
    {
      id: "reward6",
      name: "Gift Vouchers",
      description: "Earn gift vouchers for every 10 transactions.",
    },
  ];

  const { data: rewardsData, isLoading } = useQuery({
    queryKey: ["rewards"],
    queryFn: async () => {
      const res = await fetch("/api/rewards");
      if (!res.ok) {
        throw new Error("Failed to fetch rewards data");
      }
      return res.json();
    },
  });

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { mutate: claimReward } = useMutation({
    mutationFn: async (rewardId) => {
      const res = await fetch(`/api/rewards/claim/${rewardId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: authUser?.id }),
      });
      if (!res.ok) {
        throw new Error("Failed to claim reward");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Reward claimed successfully!");
    },
    onError: () => {
      toast.error("Failed to claim reward");
    },
  });

  if (isLoading) {
    return (
      <div className="p-4 bg-black text-white h-screen overflow-auto">
        <div className="mb-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-2">
            <Skeleton width={150} height={20} />
          </h2>
          <ul>
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <li key={index} className="mb-4 border p-4 rounded-lg">
                  <Skeleton width={200} height={20} />
                  <Skeleton width={300} height={15} />
                  <Skeleton width={180} height={15} />
                  <Skeleton width={100} height={30} />
                </li>
              ))}
          </ul>
        </div>
        <div className="w-full max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-2">
            <Skeleton width={150} height={20} />
          </h2>
          <ul>
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <li key={index} className="mb-4 border p-4 rounded-lg">
                  <Skeleton width={200} height={20} />
                  <Skeleton width={300} height={15} />
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Rewards</h1>

      {currentSection === "rewards" && (
        <>
          {/* Static Rewards */}
          <div className="mb-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-2">Rewards Based on Credit Score</h2>
            <ul>
              {staticRewards.map((reward) => (
                <li key={reward.id} className="mb-4 border-2 border-green-500 p-4 rounded-lg">
                  <h3 className="font-bold">{reward.name}</h3>
                  <p>{reward.description}</p>
                  <p>Required Credit Score: {reward.requiredCreditScore}</p>
                  <button
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400"
                    disabled={authUser?.creditScore < reward.requiredCreditScore}
                    onClick={() => claimReward(reward.id)}
                  >
                    Claim
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* General Rewards Only */}
          <div className="w-full max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-2">General Rewards</h2>
            <ul>
              {generalRewards.map((reward) => (
                <li key={reward.id} className="mb-4 border-2 border-green-500 p-4 rounded-lg">
                  <h3 className="font-bold">{reward.name}</h3>
                  <p>{reward.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default RewardsPage;
