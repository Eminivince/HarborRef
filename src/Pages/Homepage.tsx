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
  const [showModal, setShowModal] = useState(false);

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
    <div className="text-white md:pb-10 min-h-screen">
      <Navbar />
      <div className="px-4 md:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center w-full md:w-[612px] mx-auto mt-20 md:mt-52">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-[64px] md:w-[612px] mx-auto">
            Stake Your Crypto, Grow Your Network, Earn More Rewards.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-8 text-[15px] px-4 md:px-0">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Earum
            ullam reprehenderit dicta laborum, deleniti explicabo nihil, sint
            perferendis culpa delectus aliquam distinctio natus nam? Deserunt!
          </motion.p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex justify-center">
          <Link
            to="/signup"
            className="mt-12 border border-gray-100 hover:bg-yellow-600 w-fit text-gray-300 font-semibold py-2 px-12 md:px-28 rounded-full transition-all duration-300 hover:scale-105">
            Join Us
          </Link>
        </motion.div>
      </div>

      {/* STAKING GUIDE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mt-[90px] w-[90%] md:w-[60%] mx-auto px-4 md:px-0">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-full border rounded-2xl p-6 md:p-10">
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
        </motion.div>
        <div className="text-4xl md:text-[80px] mt-10 text-center md:text-left">
          STAKING <br /> GUIDE
        </div>
        <div className="py-4 md:p-8 md:text-2xl opacity-70 md:mt-14 text-center">
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
      <div className="w-[90%] md:w-1/2 mt-10 mx-auto px-4 md:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 text-3xl">
          FAQ
        </motion.div>
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
      <div className="w-[90%] md:w-[40%] mx-auto mt-16 text-center px-4 md:px-0">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl">
          ABOUT US
        </motion.h1>
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="w-24 md:w-32 mx-auto my-4"
          src={HBR}
          alt=""
        />
        <>
          <p className="w-full md:w-[70%] mx-auto text-justify">
            Harbor is a cutting-edge staking platform designed to revolutionize
            the way you interact with cryptocurrency. Founded in 2025, we've
            quickly established ourselves as a trusted name in the digital asset
            space...
            <button
              onClick={() => setShowModal(true)}
              className="text-yellow-400 hover:text-yellow-500 transition-colors mt-2 cursor-pointer">
              Read More
            </button>
          </p>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
              <div className="bg-[#1E1E1E] rounded-lg p-6 md:p-8 max-w-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">About Harbor</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-white transition-colors">
                    ✕
                  </button>
                </div>
                <div className="space-y-4 text-gray-200">
                  <p>
                    Harbor is a cutting-edge staking platform designed to
                    revolutionize the way you interact with cryptocurrency.
                    Founded in 2025, we've quickly established ourselves as a
                    trusted name in the digital asset space, offering secure,
                    transparent, and rewarding staking solutions for crypto
                    enthusiasts and investors alike. Our platform leverages
                    advanced blockchain technology to provide industry-leading
                    APY rates while maintaining the highest standards of
                    security and reliability.
                  </p>
                  <p>
                    At Harbor, we understand that the future of finance is
                    decentralized, which is why we've built our platform with
                    scalability and user experience in mind. Our team consists
                    of experienced blockchain developers, security experts, and
                    financial professionals who work tirelessly to ensure your
                    assets are protected while generating optimal returns. We've
                    partnered with leading blockchain networks and implemented
                    rigorous security protocols to safeguard your investments.
                  </p>
                  <p>
                    What sets us apart is our commitment to community-driven
                    development and transparent operations. We regularly engage
                    with our users through various channels to gather feedback
                    and implement improvements that matter most to our
                    community. Our innovative staking solutions are designed to
                    accommodate both newcomers and experienced crypto investors,
                    with flexible lock-up periods and competitive reward
                    structures.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      </div>

      {/* FOOTER Section */}
      <footer className="px-4 sm:px-6 lg:px-20 py-12 backdrop-blur-sm mt-10">
        <div className="max-w-7xl mx-auto">
          {/* Logo and Brand Section */}
          <div className="flex items-center md:space-x-4 ml-2 md:ml-0 space-x-2 md:mb-12 mb-1">
            <img
              src={Logo}
              alt="Harbor Logo"
              className="w-8 sm:w-10 lg:w-12 transition-transform duration-300 hover:scale-110"
            />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              Harbor
            </h1>
          </div>

          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Social Links */}
            <div className="md:space-y-6 space-y-1">
              <a
                href="#"
                className="flex items-center space-x-4 group hover:bg-white/5 p-3 rounded-lg transition-all duration-300">
                <img
                  src={X}
                  alt="X (Twitter)"
                  className="w-6 h-6 group-hover:scale-110 transition-transform"
                />
                <span className="text-sm sm:text-base group-hover:text-yellow-400">
                  Follow us on X
                </span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-4 group hover:bg-white/5 p-3 rounded-lg transition-all duration-300">
                <img
                  src={TG}
                  alt="Telegram"
                  className="w-6 h-6 group-hover:scale-110 transition-transform"
                />
                <span className="text-sm sm:text-base group-hover:text-yellow-400">
                  Join our Telegram community
                </span>
              </a>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h2 className="text-xl sm:text-2xl font-semibold mb-6 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                Quick Links
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <a
                  href="#"
                  className="hover:text-yellow-400 transition-colors duration-300">
                  Staking
                </a>
                <a
                  href="#"
                  className="hover:text-yellow-400 transition-colors duration-300">
                  FAQ
                </a>
                <a
                  href="#"
                  className="hover:text-yellow-400 transition-colors duration-300">
                  About Us
                </a>
                <a
                  href="#"
                  className="hover:text-yellow-400 transition-colors duration-300">
                  Terms
                </a>
                <a
                  href="#"
                  className="hover:text-yellow-400 transition-colors duration-300">
                  Privacy
                </a>
                <a
                  href="#"
                  className="hover:text-yellow-400 transition-colors duration-300">
                  Contact
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Harbor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
