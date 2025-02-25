import { useEffect, useState } from "react";
import InnerNav from "../components/InnerNav";
import Aside from "../components/Aside";
import DoneMedal from "../assets/colormedal.png";
import UndoneMedal from "../assets/medalbw.png";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axiosConfig";

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
      const response = await axiosInstance.get("/api/claims/eligibility");
      setEligibleTiers(response.data.eligibleTiers);
      setReferralCount(response.data.referralCount);
      setTotalEarnings(user?.total_ref_rev || 0);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching eligibility:", error);
      setIsLoading(false);
    }
  };

  const handleClaim = async (tierIndex: number) => {
    try {
      const response = await axiosInstance.post("/api/claims/claim", {
        tierIndex,
      });
      setTotalEarnings(response.data.newTotal);

      // Refresh eligibility after successful claim
      await fetchEligibility();
    } catch (error: unknown) {
      console.error("Error claiming reward:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An error occurred while claiming the reward");
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
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          <p className="text-black text-lg font-medium animate-pulse">
            Loading reward data...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex pt-10 md:pt-0 md:h-screen min-h-screen bg-gray-300 pb-16">
      <Aside />

      <main className="flex-1 md:p-6">
        <div className="p-4 md:p-6">
          <InnerNav user={user} />
        </div>
        <div className="max-w-2xl mx-auto mt-10 p-3 bg-gray-300 ">
          <h1 className="text-2xl font-bold mb-2">Invite more to earn more</h1>
          <h2 className="text-xl mb-2">Total Earnings</h2>
          <h3 className="text-3xl font-bold mb-10">${totalEarnings}</h3>

          <div className="space-y-6">
            {eligibleTiers.map((tier, index) => {
              const status = getStatus(tier);
              return (
                <div key={index} className="bg-white p-4 rounded-[20px] shadow">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <img
                        src={status === "Claimed" ? DoneMedal : UndoneMedal}
                        alt="tier status"
                        className="ms:w-8 md:h-8"
                      />
                      <div>
                        <h3 className="text-lg font-semibold">
                          Tier {index + 1}
                        </h3>
                        <h1>invite friends</h1>
                        <p className="text-sm text-gray-600">
                          {referralCount} - {tier.minReferrals} referrals
                          required
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center space-x-4">
                      <span className="md:text-xl ml-3 font-semibold">
                        ${tier.reward}
                      </span>
                      <button
                        onClick={() =>
                          status === "Claimable" && handleClaim(index)
                        }
                        disabled={status !== "Claimable"}
                        className={`px-4 py-2 rounded-[999px] hover:cursor-pointer duration-300 transition-colors ${getButtonStyle(
                          status
                        )}`}>
                        {status === "Claimable" ? "Claim" : status}
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
