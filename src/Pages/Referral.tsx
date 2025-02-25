import React, { useEffect, useState } from "react";
import axiosInstance from "../config/axiosConfig";
import Aside from "../components/Aside";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { motion } from "framer-motion";

import InnerNav from "../components/InnerNav";

// Define interface for referred users
interface ReferredUser {
  _id: string;
  user_id: string;
  username: string;
  email: string;
}

const Referral: React.FC = () => {
  const [referralCode, setReferralCode] = useState<string>("");
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchOrGenerateReferral = async () => {
      if (!user) return;

      if (user.referral_code) {
        setReferralCode(user.referral_code);
      } else {
        try {
          const res = await axiosInstance.post("/api/user/referral", {});
          setReferralCode(res.data.referral_code);
        } catch (error) {
          console.error("Error generating referral code:", error);
        }
      }
    };

    fetchOrGenerateReferral();
  }, [user]);

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!user) return;
      try {
        const res = await axiosInstance.get<ReferredUser[]>(
          "/api/user/referrallist"
        );
        setReferredUsers(res.data);
      } catch (error) {
        console.error("Error fetching referrals:", error);
      }
    };

    fetchReferrals();
  }, [user]);

  if (!user) {
    navigate("/signin");
    return null;
  }

  const copyLink = () => {
    const link = `${window.location.origin}/signup?code=${referralCode}`;
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row min-h-screen bg-gray-300 pb-20 text-black">
      <Aside />

      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full">
        <div className="mt-3 w-[95%] mx-auto">
          <InnerNav user={user} />
        </div>

        <div className="md:mt-20 md:mx-20 px-6 mt-10">
          <h1 className="font-bold">Refer a friend</h1>
          <hr />
          <div className="my-7 flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
            <h1>Invite Link</h1>
            <p className="border w-full md:w-fit text-sm md:text-base p-3 rounded break-all">
              {`${window.location.origin}/signup?code=${referralCode}`}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-500 w-full md:w-fit p-3 rounded-[10px] opacity-60 text-black hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
              onClick={copyLink}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy Link
            </motion.button>
          </div>
          <hr />
          <h1 className="my-7 font-bold text-lg">Referrals</h1>
          {referredUsers.length === 0 ? (
            <p>No referrals yet.</p>
          ) : (
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}>
              {referredUsers.map((rUser, index) => (
                <motion.li
                  key={rUser._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="my-2 border p-2 rounded hover:shadow-md transition-shadow">
                  <strong className="pr-4">No. {index + 1} | </strong>
                  <strong>ID:</strong> {rUser.user_id.slice(12)} |
                  <strong className="pl-4">Username:</strong> {rUser.username} |
                  <strong className="pl-4">Email:</strong>{" "}
                  {rUser.email.replace(/(?<=.{3}).(?=.*@)/g, "*")}
                </motion.li>
              ))}
            </motion.ul>
          )}
          <hr className="mt-10" />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Referral;
