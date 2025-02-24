import React, { useEffect, useState } from "react";
import axios from "axios";
import Aside from "../components/Aside";
// import InnerNav from "../components/InnerNav";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { API_BASE_URL } from "../config/api";

// We'll define an interface for the *referred* users we fetch
interface ReferredUser {
  _id: string;
  user_id: string;
  username: string;
  email: string;
  // etc.
}

const Referral: React.FC = () => {
  const [referralCode, setReferralCode] = useState<string>("");
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);

  // 1) On mount, fetch or generate the referral code
  useEffect(() => {
    const fetchOrGenerateReferral = async () => {
      if (!user) {
        return;
      }
      // If user already has a code
      if (user.referral_code) {
        setReferralCode(user.referral_code);
      } else {
        // no referral code => ask backend to generate one
        try {
          const res = await axios.post(
            `${API_BASE_URL}/api/user/referral`,
            {},
            { withCredentials: true }
          );
          setReferralCode(res.data.referral_code);
        } catch (error) {
          console.error("Error generating referral code:", error);
        }
      }
    };

    fetchOrGenerateReferral();
  }, [user]);

  // 2) Fetch the *list* of referred users
  useEffect(() => {
    const fetchReferrals = async () => {
      if (!user) return;
      try {
        const res = await axios.get<ReferredUser[]>(
          `${API_BASE_URL}/api/user/referrallist`,
          { withCredentials: true }
        );
        setReferredUsers(res.data);
      } catch (error) {
        console.error("Error fetching referrals:", error);
      }
    };

    fetchReferrals();
  }, [user]);

  if (!user) {
    console.log("no user");
    navigate("/signin");
    return null;
  }

  // 3) Handler for copying link
  const copyLink = () => {
    const link = `${window.location.origin}/signup?code=${referralCode}`;
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  return (
    // Make the container flexible for mobile and larger screens
    <div className="flex flex-col md:flex-row md:min-h-screen  bg-white pb-20 text-white">
      <Aside />

      {/* Main Content */}
      <div className="w-full md:w-3/4 text-black px-4 md:px-20 mt-8 md:mt-20">
        <h1 className="font-bold">Refer a friend</h1>
        <hr />

        {/* Invite Link Section */}
        {/* Stack on mobile, align horizontally on md+ */}
        <div className="my-7 flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
          <h1>Invite Link</h1>
          <p className="border w-full md:w-fit p-3 rounded break-all">
            {referralCode && API_BASE_URL == "http://localhost:5002"
              ? `http://localhost:5173/signup?code=${referralCode}`
              : `https://harbor-r.vercel.app/signup?code=${referralCode}`}
          </p>
          <button
            className="bg-gray-500 w-full md:w-fit p-3 rounded text-center"
            onClick={copyLink}>
            <p>Copy Link</p>
          </button>
        </div>

        <hr />
        {/* Email Invites Section */}
        <div className="my-7 flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
          <h1>Email Invites</h1>

          <div className="flex flex-col space-y-6 w-full md:w-auto">
            <input
              type="text"
              placeholder="Enter email here"
              className="border p-3 rounded"
            />
            <input
              type="text"
              placeholder="Enter email here"
              className="border p-3 rounded"
            />
            <input
              type="text"
              placeholder="Enter email here"
              className="border p-3 rounded"
            />
          </div>

          <div className="bg-gray-500 w-full md:w-fit p-3 rounded text-center">
            <p>Send Invite</p>
          </div>
        </div>
        <hr />

        {/* 4) Display the "Referrals" list */}
        <h1 className="my-7 font-bold text-lg">Referrals</h1>

        {referredUsers.length === 0 ? (
          <p>No referrals yet.</p>
        ) : (
          <ul className="">
            {referredUsers.map((rUser, index) => (
              <li key={rUser._id} className="my-2">
                <strong className="pr-4">No. {index + 1} | </strong>
                <strong>ID:</strong> {rUser.user_id.slice(0, 8)} |{" "}
                <strong className="pl-4">Username:</strong> {rUser.username} |{" "}
                <strong className="pl-4">Email:</strong> {rUser.email}
              </li>
            ))}
          </ul>
        )}
        <hr />
      </div>
    </div>
  );
};

export default Referral;
