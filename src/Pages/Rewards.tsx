import  { useEffect, useState } from "react";
import InnerNav from "../components/InnerNav";
import Aside from "../components/Aside";
import DoneMedal from "../assets/colormedal.png";
import UndoneMedal from "../assets/medalbw.png";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

interface TierData {
  minReferrals: number;
  reward: number;
  eligible: boolean;
  claimed: boolean;
}

const Rewards = () => {
  const navigate = useNavigate();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const [eligibleTiers, setEligibleTiers] = useState<TierData[]>([]);
  const [referralCount, setReferralCount] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchEligibility();
    }
  }, [user]);

  const fetchEligibility = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/claims/eligibility`,
        {
          credentials: "include",
        }
      );
      console.log(response);
      if (!response.ok) throw new Error("Failed to fetch eligibility");

      const data = await response.json();
      setEligibleTiers(data.eligibleTiers);
      setReferralCount(data.referralCount);
      console.log(referralCount);
      setTotalEarnings(user?.total_ref_rev || 0);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching eligibility:", error);
      setIsLoading(false);
    }
  };

  const handleClaim = async (tierIndex: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/claims/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tierIndex }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to claim reward");
      }

      const result = await response.json();
      setTotalEarnings(result.newTotal);

      // Refresh eligibility after successful claim
      await fetchEligibility();
    } catch (error: unknown) {
      console.error("Error claiming reward:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An error occurred while claiming the reward');
      }
    }
  };

  const getStatus = (tier: TierData): "Claimed" | "Claimable" | "Locked" => {
    if (tier.claimed) return "Claimed";
    if (tier.eligible) return "Claimable";
    return "Locked";
  };

  const getButtonStyle = (status: "Claimed" | "Claimable" | "Locked") => {
    switch (status) {
      case "Claimed":
        return "bg-green-300 text-white cursor-not-allowed opacity-60";
      case "Claimable":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "Locked":
        return "bg-gray-400 text-gray-200 cursor-not-allowed";
      default:
        return "bg-gray-500";
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <p>Loading user data...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex md:h-screen bg-white pb-16">
      <Aside />

      <main className="flex-1 p-6">
        <InnerNav user={user} />
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-2">
            Invite more to earn more
          </h1>
          <h2 className="text-xl text-center mb-2">Total Earnings</h2>
          <h3 className="text-3xl font-bold text-center mb-10 text-green-600">
            ${totalEarnings}
          </h3>

          <div className="space-y-6">
            {eligibleTiers.map((tier, index) => {
              const status = getStatus(tier);
              return (
                <div key={index} className="bg-gray-100 p-6 rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <img
                        src={status === "Claimed" ? DoneMedal : UndoneMedal}
                        alt="tier status"
                        className="w-8 h-8"
                      />
                      <div>
                        <h3 className="text-lg font-semibold">
                          Tier {index + 1}
                        </h3>
                        <h1>invite friends</h1>
                        <p className="text-sm text-gray-600">
                          {referralCount} - {tier.minReferrals} referrals required
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center space-x-4">
                      <span className="text-xl font-bold">${tier.reward}</span>
                      <button
                        onClick={() =>
                          status === "Claimable" && handleClaim(index)
                        }
                        disabled={status !== "Claimable"}
                        className={`px-4 py-2 rounded-lg transition-colors ${getButtonStyle(
                          status
                        )}`}>
                        {status === "Claimable" ? "Claim Now" : status}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Rewards;
