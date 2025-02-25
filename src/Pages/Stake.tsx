// import React from "react";
import Aside from "../components/Aside";
import upArrow from "../assets/upArrow.png";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InnerNav from "../components/InnerNav";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const Stake = () => {
  const navigate = useNavigate();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          <p className="text-black text-lg font-medium animate-pulse">
            Loading user data...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen pt-20 md:pt-0 bg-gray-300 text-white">
      <Aside />
      <div className="pt-6 px-4 md:px-10 w-full">
        <InnerNav user={user} />
        <div className="text-black w-full md:w-[70%] lg:w-[70%] mx-auto text-center pt-10 md:pt-20 px-4">
          <p className="text-sm md:text-base">
            Stake your tokens to earn rewards and participate in our yield
            farming program. Earn competitive APY while contributing to the
            platform's liquidity and security.
          </p>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mt-6 md:mt-10">
            <div className="bg-black text-white rounded-xl p-3 sm:p-4 md:p-5 transition-transform hover:scale-105">
              <div className="flex flex-col space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <h1 className="text-xs sm:text-sm md:text-base font-medium text-gray-300">
                    TVL
                  </h1>
                  <img
                    src={upArrow}
                    alt=""
                    className="w-3 sm:w-4 md:w-5 hover:animate-bounce"
                  />
                </div>
                <h1 className="font-bold text-sm sm:text-lg md:text-2xl text-center">
                  $1900.87
                </h1>
              </div>
            </div>
            <div className="bg-black text-white rounded-xl p-3 sm:p-4 md:p-5 transition-transform hover:scale-105">
              <div className="flex flex-col space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <h1 className="text-xs sm:text-sm md:text-base font-medium text-gray-300">
                    APY
                  </h1>
                  <img
                    src={upArrow}
                    alt=""
                    className="w-3 sm:w-4 md:w-5 hover:animate-bounce"
                  />
                </div>
                <h1 className="font-bold text-sm sm:text-lg md:text-2xl text-center">
                  30%
                </h1>
              </div>
            </div>
            <div className="bg-black text-white rounded-xl p-3 sm:p-4 md:p-5 transition-transform hover:scale-105">
              <div className="flex flex-col space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <h1 className="text-xs sm:text-sm md:text-base font-medium text-gray-300">
                    Duration
                  </h1>
                  <img
                    src={upArrow}
                    alt=""
                    className="w-3 sm:w-4 md:w-5 hover:animate-bounce"
                  />
                </div>
                <h1 className="font-bold text-sm sm:text-lg md:text-2xl text-center">
                  30 Days
                </h1>
              </div>
            </div>
          </div>
          <div className="bg-black text-white w-full rounded-xl mt-6 md:mt-10 flex flex-col md:flex-row justify-around p-4 md:p-6 space-y-4 md:space-y-0">
            <div>
              <div className="flex items-center space-x-4 justify-between mb-4">
                <img src={upArrow} alt="" className="w-4 md:w-6" />
                <h1 className="font-semibold text-sm md:text-base">$1900.87</h1>

                <h1 className="text-xs md:text-sm">Balance</h1>
              </div>
            </div>
          </div>
          <input
            placeholder="Enter amount"
            className="border rounded w-full mt-6 md:mt-7 p-2 md:p-3 text-sm md:text-base"
          />
          <button className="bg-black mt-6 md:mt-7 rounded-3xl text-white cursor-pointer hover:bg-slate-800 duration-300 w-full p-3 md:p-3 text-sm md:text-base">
            Stake Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stake;
