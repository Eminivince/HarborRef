// App.tsx

import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./Pages/SignIn";
import Signup from "./Pages/SignUp";
import Homepage from "./Pages/Homepage";
import Dashboard from "./Pages/Dashboard";
import Stake from "./Pages/Stake";
import Referral from "./Pages/Referral";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Network from "./Pages/Network";
import { useDispatch } from "react-redux";
import { fetchUserData } from "./store/thunks/authThunks";
import type { AppDispatch } from "./store/store";
import Rewards from "./Pages/Rewards";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import axiosInstance from "./config/axiosConfig";
import Settings from "./Pages/Settings";

const queryClient = new QueryClient();

const AirDAO_NETWORK = {
  id: 16718,
  name: "AirDAO Mainnet",
  nativeCurrency: { name: "AMB", symbol: "AMB", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://network.ambrosus.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "AirDAO Explorer",
      url: "https://airdao.io/explorer/",
      apiUrl: "https://airdao.io/explorer//api",
    },
  },
};

// import { mainnet, sepolia, polygon, optimism, arbitrum } from "wagmi/chains";

const config = getDefaultConfig({
  appName: "HarborStake",
  projectId: "c4a7e569513c0a57eab30b6824f31e04",
  chains: [AirDAO_NETWORK],
  ssr: true,
});

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      dispatch(fetchUserData());
    }
  }, [dispatch]);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          initialChain={AirDAO_NETWORK}
          theme={darkTheme()}>
          <div className="space-grotesk-font bg-[#1E1E1E]">
            <Router>
              <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<Homepage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/stake" element={<Stake />} />
                <Route path="/referral" element={<Referral />} />
                <Route path="/network" element={<Network />} />
                <Route path="/reward" element={<Rewards />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Router>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
