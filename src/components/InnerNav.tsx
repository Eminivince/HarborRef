import React, { useEffect, useState } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";

// const config = getDefaultConfig({
//   appName: "My RainbowKit App",
//   projectId: "YOUR_PROJECT_ID",
//   chains: [mainnet, polygon, optimism, arbitrum, base],
//   ssr: true,
// });

interface InnerNavProps {
  user?: {
    username?: string;
  };
}

const InnerNav: React.FC<InnerNavProps> = ({ user }) => {
  const [username, setUsername] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
  
      if (response.ok) {
        dispatch(setUser(null));
        localStorage.removeItem("authenticatedUser");
        navigate("/signin");
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <ConnectButton />
      <div className="relative">
        <motion.div
          className="bg-black w-fit p-2 rounded-3xl px-6 flex items-center space-x-4 cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}>
          <h1 className="text-white">{username}</h1>
          <h1 className="border rounded-full p-1 px-3 bg-amber-950 text-white">
            {username[0]}
          </h1>
        </motion.div>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-48 bg-black rounded-xl shadow-lg py-2 z-50">
              <button
                className="w-full px-4 py-2 text-left text-white hover:bg-gray-800 transition-colors"
                onClick={() => navigate("/settings")}>
                Settings
              </button>
              <button
                className="w-full px-4 py-2 text-left text-white hover:bg-gray-800 transition-colors"
                onClick={handleLogout}>
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InnerNav;
