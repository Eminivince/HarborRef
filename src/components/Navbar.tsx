import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../assets/Harbourlogo.png";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";
import { removeAuthToken } from "../utils/auth";
import { API_BASE_URL } from "../config/api";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const user = useSelector((state: any) => state.auth.user);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        dispatch(setUser(null));
        removeAuthToken();
        localStorage.removeItem("authenticatedUser");
        navigate("/signin");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <>
      <motion.nav
        className="flex  justify-between items-center px-4 md:px-14 py-4 bg-[#1E1E1E] relative shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <Link to="/">
          <motion.img
            src={Logo}
            alt="logo"
            className="w-10 md:hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        </Link>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden text-white p-2 z-50 relative"
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.95 }}>
          <motion.div
            className="w-6 h-0.5 bg-white mb-1.5 transform origin-center"
            animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 6 : 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className="w-6 h-0.5 bg-white mb-1.5"
            animate={{ opacity: isOpen ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className="w-6 h-0.5 bg-white transform origin-center"
            animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -6 : 0 }}
            transition={{ duration: 0.2 }}
          />
        </motion.button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex w-[30%] justify-between text-white items-center">
          {[
            { to: "/stake", text: "Staking" },
            { to: "/staking", text: "FAQ" },
            { to: "/", text: "About Us" },
          ].map((item) => (
            <motion.li
              key={item.text}
              whileHover={{ scale: 1.1 }}
              className="hover:text-amber-200 transition-colors">
              <Link to={item.to}>{item.text}</Link>
            </motion.li>
          ))}
        </ul>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden absolute min-h-screen z-50 top-full left-0 right-0 bg-[#1E1E1E] flex flex-col items-center py-4 text-white shadow-lg overflow-hidden">
              {[
                { to: "/stake", text: "Staking" },
                { to: "/staking", text: "FAQ" },
                { to: "/", text: "About Us" },
              ].map((item, index) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}>
                  <Link
                    to={item.to}
                    className="py-3 px-6 block hover:text-amber-200 transition-colors w-full text-center">
                    {item.text}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                className="bg-amber-200 py-2 px-18 text-black text-sm rounded-full mt-4 hover:bg-amber-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                <Link to="/signin">
                  {" "}
                  <h1>Login</h1>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Login/Logout Button */}
        {user ? (
          <motion.button
            className="hidden md:block bg-amber-200 py-2 px-7 text-black rounded-full hover:bg-amber-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}>
            <h1>Logout</h1>
          </motion.button>
        ) : (
          <motion.div
            className="hidden md:block bg-amber-200 py-2 px-7 text-black rounded-full hover:bg-amber-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
            <Link to="/signin">
              <h1>Login</h1>
            </Link>
          </motion.div>
        )}
      </motion.nav>
    </>
  );
};

export default Navbar;
