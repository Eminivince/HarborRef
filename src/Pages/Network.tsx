import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import Aside from "../components/Aside";
import InnerNav from "../components/InnerNav";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axiosConfig";

interface ReferralUser {
  _id: string;
  user_id: string;
  username: string;
  email: string;
  referrals: ReferralUser[];
  createdAt: string;
}

const Network = () => {
  const navigate = useNavigate();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [referralTree, setReferralTree] = useState<ReferralUser[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchReferralTree();
    }
  }, [user]);

  const fetchReferralTree = async () => {
    try {
      const response = await axiosInstance.get("/api/user/referraltree");
      setReferralTree(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching referral tree:", error);
      setIsLoading(false);
    }
  };

  const toggleExpand = (userId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const ReferralNode = ({
    referral,
    level = 0,
  }: {
    referral: ReferralUser;
    level?: number;
  }) => {
    const isExpanded = expandedNodes.has(referral.user_id);
    const hasChildren = referral.referrals && referral.referrals.length > 0;
    const joinDate = new Date(referral.createdAt).toLocaleDateString();

    return (
      <div className="ml-4">
        <motion.div
          className={`flex items-center p-4 my-2 rounded-lg ${
            level === 0 ? "bg-gray-100" : "bg-white border"
          } cursor-pointer transition-colors hover:bg-gray-50`}
          onClick={() => hasChildren && toggleExpand(referral.user_id)}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}>
          <div className="flex items-center flex-1">
            {hasChildren && (
              <motion.span
                className="mr-2"
                initial={{ rotate: 0 }}
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}>
                {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
              </motion.span>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-black">
                {referral.username}
              </h3>
              <p className="text-sm text-gray-600">{referral.email}</p>
              <p className="text-xs text-gray-500">Joined: {joinDate}</p>
            </div>
          </div>
        </motion.div>
        <AnimatePresence>
          {isExpanded && hasChildren && (
            <motion.div
              className="ml-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}>
              {referral.referrals.map((child) => (
                <ReferralNode
                  key={child.user_id}
                  referral={child}
                  level={level + 1}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          <p className="text-black text-lg font-medium animate-pulse">
            Loading network data...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const filteredReferrals = referralTree.filter(
    (referral) =>
      referral.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}>
      <div className="flex bg-white text-white min-h-screen">
        <Aside />
        <main className="w-full mt-6 px-4">
          <InnerNav user={user} />
          <section className="text-black mt-4">
            <div className="relative w-full max-w-sm mx-auto mb-8">
              <input
                type="text"
                placeholder="Search by username, email"
                className="w-full rounded-3xl border p-3 pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500" />
            </div>

            <div className="max-w-4xl mx-auto">
              {filteredReferrals.length === 0 ? (
                <p className="text-center text-gray-500">
                  {searchTerm
                    ? "No matching referrals found"
                    : "No referrals yet"}
                </p>
              ) : (
                filteredReferrals.map((referral) => (
                  <ReferralNode key={referral.user_id} referral={referral} />
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </motion.div>
  );
};

export default Network;
