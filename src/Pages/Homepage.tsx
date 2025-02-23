import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import dollar from "../assets/dollar.png";
import Padlock from "../assets/padlock.png";
import { motion } from "framer-motion";
import Logo from "../assets/Harbourlogo.png";
import HBR from "../assets/HBR.png";
import X from "../assets/x.png";
import TG from "../assets/tg.png";
import upArrow from "../assets/upArrow.png";

const Homepage = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const topics = [
    {
      title: "What is Harbor?",
      content:
        "Content for Topic 1 sit amet consectetur adipisicing  elitsit amet adipisicing  elitsit ametadipisicing  elitsit amet adipisicing  elitsit amet consectetur adipi sicing elitsit amet consectetur adipisicing elit .",
    },
    { title: "How to stake?", content: "Content for Topic 2." },
    { title: "Is my stake safe?", content: "Content for Topic 3." },
    { title: "What is AirDAO", content: "Content for Topic 4." },
  ];

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="text-white pt-6 pb-20  bg-[radial-gradient(circle_at_top_left,rgba(234,179,8,0.15)_0%,transparent_50%),radial-gradient(circle_at_bottom_right,rgba(234,179,8,0.15)_0%,transparent_50%)] bg-cover bg-center bg-no-repeat">
      <Navbar />
      <div className="mb-[280px] px-4 md:px-0">
        <div className="text-center w-full md:w-[612px] mx-auto mt-20 md:mt-52">
          <h1 className="text-4xl md:text-[64px] md:w-[612px] mx-auto">
            Stake Your Crypto, Grow Your Network, Earn More Rewards.
          </h1>
          <p className="mt-8 text-[15px] px-4 md:px-0">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Earum
            ullam reprehenderit dicta laborum, deleniti explicabo nihil, sint
            perferendis culpa delectus aliquam distinctio natus nam? Deserunt!
          </p>
        </div>
        <div className="flex justify-center">
          <Link
            to="/signup"
            className="mt-12 border border-gray-100 hover:bg-yellow-600 w-fit text-gray-300 font-semibold py-2 px-12 md:px-28 rounded-full">
            Join Us
          </Link>
        </div>
      </div>

      {/* STAKING GUIDE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mt-[140px] w-[90%] md:w-[60%] mx-auto px-4 md:px-0">
        <div className="w-full border rounded-2xl p-6 md:p-10">
          <h1 className="text-2xl">Staking Options</h1>
          <div className="mt-7">
            <div className="flex flex-col md:flex-row md:space-x-28 space-y-4 md:space-y-0 mb-8">
              <div className="flex space-x-3">
                <img src={upArrow} alt="" className="w-6 h-6" />
                <div>
                  <h1>APY</h1>
                  <h1 className="text-green-600">30%</h1>
                </div>
              </div>
              <div className="flex space-x-3">
                <img src={Padlock} alt="" className="w-6 h-6" />
                <div>
                  <h1>Lock-Up Period</h1>
                  <h1>30 days</h1>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <img src={dollar} alt="" className="w-6 h-6" />
              <div>
                <h1>Minimum Stake</h1>
                <h1>30%</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="text-4xl md:text-[80px] text-center md:text-left">
          STAKING <br /> GUIDE
        </div>
        <div className="p-4 md:p-8 text-xl md:text-2xl opacity-70 mt-8 md:mt-14">
          <h1>Lorem ipsum dolor sit amet.</h1>
          <h1>Lorem ipsum dolor sit amet amet lu.</h1>
          <h1>Lorem ipsum dolor sit amet amet lu.</h1>
        </div>
        <div className="p-6 md:p-10 text-xl md:text-2xl border rounded-2xl">
          <div className="flex flex-col md:flex-row justify-between mb-4 space-y-2 md:space-y-0">
            <h1>Staking Calculator</h1>
            <p className="bg-green-400 text-green-800 font-semibold opacity-80 rounded-3xl px-4 py-2 text-sm w-fit">
              $HBR
            </p>
          </div>
          <h1 className="text-sm mb-4">
            Lorem ipsum dolor sit amet. Incidunt minus, consectetur dignissimos
            alias praesentium omnis!
          </h1>
          <h1 className="text-sm mb-2">Stake</h1>
          <h1 className="mb-2">0.0</h1>
          <hr />
          <h1 className="text-sm my-2">Receive</h1>
          <h1 className="mb-2">0.0</h1>
        </div>
      </div>

      {/* ACCORDION SECTION */}
      <div className="w-[90%] md:w-1/2 mt-28 mx-auto px-4 md:px-0">
        <h1 className="text-center mb-10 text-3xl">FAQ</h1>
        {topics.map((topic, index) => (
          <div
            key={index}
            className="mb-2 border border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full text-left p-4 cursor-pointer bg-[#1E1E1E] hover:bg-[#181616]">
              <span className="mr-4">{index + 1}</span>
              {topic.title}
            </button>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: activeIndex === index ? "auto" : 0,
                opacity: activeIndex === index ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden">
              {activeIndex === index && (
                <div className="p-4 bg-[#181616] text-white">
                  {topic.content}
                </div>
              )}
            </motion.div>
          </div>
        ))}
      </div>

      {/* ABOUT US SECTION */}
      <div className="w-[90%] md:w-[40%] mx-auto mt-28 text-center px-4 md:px-0">
        <h1 className="text-2xl">About Us</h1>
        <img className="w-24 md:w-32 mx-auto my-4" src={HBR} alt="" />
        <p className="w-full md:w-[70%] mx-auto text-justify">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae ratione
          minus culpa molestias laboriosam voluptatum tempora, at minima
          voluptatibus corporis doloribus? Nostrum commodi id odit, libero sequi
          vero in velit!
          <br />
          <span className="text-yellow-400">Read More</span>
        </p>
      </div>

      {/* FOOTER Section */}
      <div className="px-6 md:px-20">
        <div className="flex items-center space-x-4 mt-32 mb-10">
          <img src={Logo} alt="" className="w-8 md:w-auto" />
          <h1 className="text-2xl">Harbor</h1>
        </div>
        <div className="text-sm flex flex-col md:flex-row justify-between space-y-6 md:space-y-0">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-4">
              <img src={X} alt="" className="w-6 h-6" />
              <h1>Follow us on X</h1>
            </div>
            <div className="flex items-center space-x-4">
              <img src={TG} alt="TG" className="w-6 h-6" />
              <h1>Join our Telegram community</h1>
            </div>
          </div>
          <div>
            <div className="flex flex-col space-y-2">
              <h1 className="text-2xl">Sitemaps</h1>
              <h1>Staking</h1>
              <h1>FAQ</h1>
              <h1>About Us</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
