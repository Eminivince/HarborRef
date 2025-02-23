// import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../assets/Harbourlogo.png";

const Navbar = () => {
  return (
    <>
      <motion.nav className="flex justify-between items-center px-14 py-2 bg-[#1E1E1E]">
        <img src={Logo} alt="logo" />
        <ul className="flex w-[30%] justify-between">
          <li className="hover:underline">
            <Link to="/stake">Staking </Link>
          </li>
          <li className="hover:underline">
            <Link to="/staking">FAQ </Link>
          </li>
          <li className="hover:underline">
            <Link to="/">About Us </Link>
          </li>
        </ul>
        <div className=" bg-amber-200 py-2 px-7 text-black cursor-pointer hover:scale-110 duration-300 rounded-4xl">
          <h1>Login</h1>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;
