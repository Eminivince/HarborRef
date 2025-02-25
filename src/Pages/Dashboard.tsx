import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { fetchUserData } from "../store/thunks/authThunks";
import axiosInstance from "../config/axiosConfig";
import type { AppDispatch } from "../store/store";

// Import your layout components
import Aside from "../components/Aside";
import InnerNav from "../components/InnerNav";

// Interface for the user data
// interface User {
//   _id?: string;
//   user_id?: string;
//   username?: string;
//   email?: string;
//   earnings_over_time?: Record<string, number>;
//   stake_amount_over_time?: Record<string, number>;
//   friends_earnings?: Record<string, number>;
//   [key: string]: any;
// }

interface ChartData {
  earnings_over_time: Record<string, number>;
  stake_amount_over_time: Record<string, number>;
  friends_earnings: Record<string, number>;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [chartLoading, setChartLoading] = useState(true);
  // Track collapsible states (false = expanded by default)
  const [isCollapsed, setIsCollapsed] = useState<boolean[]>([
    false,
    true,
    true,
  ]);

  // Handle authentication and navigation
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check URL parameters for token from OAuth
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get("token");

        if (urlToken) {
          localStorage.setItem("jwtToken", urlToken);
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${urlToken}`;
        }

        const token = localStorage.getItem("jwtToken");

        if (!token) {
          navigate("/signin");
          return;
        }

        // Configure axios with the token
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;

        if (!user) {
          const userData = await dispatch(fetchUserData());
          // @ts-expect-error unknown
          if (userData.error) {
            // @ts-expect-error unknown
            console.error("[Dashboard] Error in user data:", userData.error);
            navigate("/signin");
            return;
          }
        }
      } catch (error) {
        console.error("[Dashboard] Error in authentication check:", error);
        setChartLoading(false);
        navigate("/signin");
      }
    };
    checkAuth();
  }, [user, navigate, dispatch]);

  // Fetch chart data
  useEffect(() => {
    const fetchChartData = async () => {
      if (!user) return;
      try {
        const response = await axiosInstance.get<ChartData>(
          "/api/user/chart-data"
        );
        setChartData(response.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setChartLoading(false);
      }
    };

    fetchChartData();
  }, [user]);

  // If still loading, show a placeholder
  if (loading || chartLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          <p className="text-black text-lg font-medium animate-pulse">
            Loading data...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, return null as navigation is handled in useEffect
  if (!user || !chartData) {
    return null;
  }

  let totalEarnings;

  // Setup small chart data based on the type
  const getChartData = (type: string) => {
    let data = {};
    switch (type) {
      case "Stake":
        data = chartData.stake_amount_over_time;
        break;
      case "Earnings":
        data = chartData.earnings_over_time;

        // Calculate and log total earnings
        {
          totalEarnings = Object.values(chartData.earnings_over_time).reduce(
            (sum, value) => sum + value,
            0
          );
          console.log(totalEarnings);
        }
        break;
      case "Friends":
        data = chartData.friends_earnings;
        break;
      default:
        data = {};
    }

    //glacial-river-04858-a83417b9c48e.herokuapp.com/api/auth/google

    return {
      labels: Object.keys(data),
      datasets: [
        {
          label: `${type} (USD)`,
          data: Object.values(data),
          borderColor: "#ffffff",
          backgroundColor: "transparent",
          tension: 0.4,
        },
      ],
    };
  };
  /* eslint-disable @typescript-eslint/no-explicit-any */

  const smallChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (tooltipItem: any) => `$${tooltipItem.raw.toFixed(2)}`,
        },
        displayColors: false,
        intersect: false,
        mode: "index",
      },
    },
    scales: {
      x: {
        display: true,
        grid: { display: false },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          color: "#ffffff",
          font: { size: 10 },
          maxTicksLimit: 8,
        },
      },
      y: {
        display: true,
        grid: {
          display: true,
          color: "rgba(255, 255, 255, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "#ffffff",
          font: { size: 10 },
          callback: (value: number) => `$${value.toFixed(0)}`,
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 2,
        fill: true,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      },
      point: {
        radius: 0,
        hitRadius: 8,
        hoverRadius: 4,
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    animation: {
      duration: 750,
      easing: "easeInOutQuart",
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    },
    aspectRatio: 2,
  };

  // Titles for the three small charts
  const smallCharts = [
    {
      title: "Earnings",
      iconUrl:
        "https://img.icons8.com/?size=100&id=20749&format=png&color=000000",
    },
    {
      title: "Friends",
      iconUrl:
        "https://img.icons8.com/?size=100&id=20749&format=png&color=000000",
    },
  ];

  const toggleCollapse = (index: number) => {
    setIsCollapsed((prev) => prev.map((val, i) => (i === index ? !val : val)));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}>
      <div
        className="flex bg-gray-300 min-h-screen z-0 pt-20 md:pt-0 pb-32
       md:pb-0 text-white">
        <Aside />
        <main className="flex-1 p-6">
          <div className="text-white">
            {" "}
            <InnerNav user={user} />
          </div>

          {/* Cards containing the 3 small charts */}
          <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {smallCharts.map((chart, index) => (
              <div
                key={index}
                className="bg-black p-4 md:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ">
                {/* Title and icon */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-base md:text-lg font-semibold">
                    {chart.title}
                  </h2>
                  {/* Toggle button */}
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleCollapse(index)}
                      className="text-white hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white rounded-md p-1">
                      {isCollapsed[index] ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 md:h-6 md:w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 md:h-6 md:w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      )}
                    </button>
                    <img
                      src={chart.iconUrl}
                      alt={`${chart.title} icon`}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                    />
                  </div>
                </div>

                {/* Collapsible chart area with improved height transition */}
                <AnimatePresence>
                  {!isCollapsed[index] && (
                    <motion.div
                      key={`chart-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden">
                      <div className="h-[200px] md:h-[250px] lg:h-[300px]">
                        <Line
                          data={getChartData(chart.title)}
                          options={smallChartOptions as any}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Bigger chart with improved container */}
          <motion.div
            className="bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-lg z-0 mt-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
              <h2 className="text-lg md:text-xl font-semibold text-black">
                Earning Statistics
              </h2>
              <select className="bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-700">
                <option value="15min">15 min</option>
                <option value="3days">3 days</option>
                <option value="1week">1 week</option>
                <option value="1month">1 month</option>
                <option value="1year">1 year</option>
              </select>
            </div>

            <div className="h-[300px] md:h-[400px] lg:h-[500px]">
              <Line
                data={getChartData("Earnings")}
                options={
                  {
                    ...smallChartOptions,
                    scales: {
                      ...smallChartOptions.scales,
                      x: {
                        ...smallChartOptions.scales.x,
                        ticks: { color: "#000" },
                      },
                      y: {
                        ...smallChartOptions.scales.y,
                        ticks: { color: "#000" },
                      },
                    },
                  } as any
                }
              />
            </div>
          </motion.div>
        </main>
      </div>
    </motion.div>
  );
};

export default Dashboard;
