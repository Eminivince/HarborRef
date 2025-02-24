import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { fetchUserData } from "../store/thunks/authThunks";
import axios from "axios";
// import { useDispatch as useDispatchRedux } from "react-redux";
import type { AppDispatch } from "../store/store";
import { API_BASE_URL } from "../config/api";

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
      if (!loading && !user) {
        try {
          await dispatch(fetchUserData());
        } catch (error) {
          console.error("Error fetching user data:", error);
          navigate("/signin");
        }
      }
    };
    checkAuth();
  }, [user, loading, navigate, dispatch]);

  // Fetch chart data
  useEffect(() => {
    const fetchChartData = async () => {
      if (!user) return;
      try {
        const response = await axios.get<ChartData>(
          `${API_BASE_URL}/api/user/chart-data`,
          { withCredentials: true }
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
        }
        console.log(`Total Earnings: $${totalEarnings.toFixed(2)}`);
        break;
      case "Friends":
        data = chartData.friends_earnings;
        break;
      default:
        data = {};
    }

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
      },
    },
    scales: {
      x: {
        display: false,
        grid: { display: false },
      },
      y: {
        display: false,
        grid: { display: false },
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
      <div className="flex bg-white md:h-screen pb-20 text-white">
        <Aside />
        <main className="flex-1 p-6">
          <div className="text-white">
            {" "}
            <InnerNav user={user} />
          </div>

          {/* Cards containing the 3 small charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 w-[90%] mx-auto">
            {smallCharts.map((chart, index) => (
              <div key={index} className="bg-black p-4 rounded-lg shadow">
                {/* Title and icon */}
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">{chart.title}</h2>
                  {/* Toggle button */}
                  <button
                    onClick={() => toggleCollapse(index)}
                    className="bg-gray-600 text-white px-2 py-1 rounded mb-2 text-sm">
                    {isCollapsed[index] ? "View" : "Hide"}
                  </button>
                  <img
                    src={chart.iconUrl}
                    alt="Avatar"
                    className="mr-2 w-10 rounded-full"
                  />
                </div>

                {/* Collapsible area for the chart */}
                <AnimatePresence>
                  {!isCollapsed[index] && (
                    <motion.div
                      key={`chart-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="overflow-hidden">
                      <Line
                        data={getChartData(chart.title)}
                        options={smallChartOptions as any}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Bigger chart */}
          <motion.div
            className="bg-white p-6 rounded-lg shadow mt-6 w-[90%] mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-black">
                Earning Statistics
              </h2>
              <select className="bg-gray-700 text-white p-2 rounded">
                <option value="15min">15 min</option>
                <option value="3days">3 days</option>
                <option value="1week">1 week</option>
                <option value="1month">1 month</option>
                <option value="1year">1 year</option>
              </select>
            </div>

            <div className="h-[400px]">
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
