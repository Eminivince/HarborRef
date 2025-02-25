import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  DollarOutlined,
  ShareAltOutlined,
  TeamOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import Logo from "../assets/Cairclebg.png";

const Aside = () => {
  const [collapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Sidebar for Desktop */}
      <aside
        className={`hidden md:block bg-[#1E1E1E] text-white transition-all z-50 duration-300 ${
          collapsed ? "w-20" : "w-64"
        }  min-h-screen`}>
        <Link to="/">
          <div className="flex  items-center space-x-4 m-4 text-xl font-bold">
            <img src={Logo} alt="Logo" className="w-20" />
            {!collapsed && <h1></h1>}
          </div>
        </Link>

        <nav className="mt-4">
          <ul>
            <Link
              to="/dashboard"
              className={`p-4 hover:bg-gray-700 flex items-center ${
                isActive("/dashboard") ? "bg-gray-700" : ""
              }`}>
              <HomeOutlined className="mr-2" />
              {!collapsed && <span>Dashboard</span>}
            </Link>
            <Link
              to="/reward"
              className={`p-4 hover:bg-gray-700 flex items-center ${
                isActive("/reward") ? "bg-gray-700" : ""
              }`}>
              <TrophyOutlined className="mr-2" />
              {!collapsed && <span>Reward</span>}
            </Link>
            <Link
              to="/stake"
              className={`p-4 hover:bg-gray-700 flex items-center ${
                isActive("/stake") ? "bg-gray-700" : ""
              }`}>
              <DollarOutlined className="mr-2" />
              {!collapsed && <span>Stake</span>}
            </Link>
            <Link
              to="/referral"
              className={`p-4 hover:bg-gray-700 flex items-center ${
                isActive("/referral") ? "bg-gray-700" : ""
              }`}>
              <ShareAltOutlined className="mr-2" />
              {!collapsed && <span>Referral</span>}
            </Link>
            <Link
              to="/network"
              className={`p-4 hover:bg-gray-700 flex items-center ${
                isActive("/network") ? "bg-gray-700" : ""
              }`}>
              <TeamOutlined className="mr-2" />
              {!collapsed && <span>Your Network</span>}
            </Link>
          </ul>
        </nav>
      </aside>

      {/* Footer Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-gray-900 p-6 flex justify-around text-white">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center ${
            isActive("/dashboard") ? "text-yellow-500 font-bold text-xl" : ""
          }`}>
          <HomeOutlined />
        </Link>
        <Link
          to="/reward"
          className={`flex flex-col items-center ${
            isActive("/reward") ? "text-yellow-500 font-bold text-xl" : ""
          }`}>
          <TrophyOutlined />
        </Link>
        <Link
          to="/stake"
          className={`flex flex-col items-center ${
            isActive("/stake") ? "text-yellow-500 font-bold text-xl" : ""
          }`}>
          <DollarOutlined />
        </Link>
        <Link
          to="/referral"
          className={`flex flex-col items-center ${
            isActive("/referral") ? "text-yellow-500 font-bold text-xl" : ""
          }`}>
          <ShareAltOutlined />
        </Link>
        <Link
          to="/network"
          className={`flex flex-col items-center ${
            isActive("/network") ? "text-yellow-500 font-bold text-xl" : ""
          }`}>
          <TeamOutlined />
        </Link>
      </nav>
    </>
  );
};

export default Aside;
