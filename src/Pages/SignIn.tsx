import { useState, useEffect } from "react";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading, setError } from "../store/slices/authSlice";
import { fetchUserData } from "../store/thunks/authThunks";
import type { RootState, AppDispatch } from "../store/store";
import Navbar from "../components/Navbar";
import { API_BASE_URL } from "../config/api";
// import { setAuthToken } from "../utils/auth";
import axiosInstance from "../config/axiosConfig";
import { IoMailOutline } from "react-icons/io5";

interface User {
  id: string;
  email: string;
  username?: string;
  displayName?: string;
  token?: string; // Ensure token is part of the User type
}

interface ApiResponse {
  message?: string;
  error?: string;
  user_id?: string;
  user?: User;
}

export default function SignIn() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, user } = useSelector(
    (state: RootState) => state.auth
  );
  const [initialLoad, setInitialLoad] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    setInitialLoad(false);
    dispatch(setLoading(true));
    dispatch(setError(null));
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  // const handleXLogin = () => {
  //   setInitialLoad(false);
  //   dispatch(setLoading(true));
  //   dispatch(setError(null));
  //   window.location.href = `${API_BASE_URL}/api/auth/x`;
  // };

  useEffect(() => {
    // Check if this is a redirect from OAuth
    const checkOAuthAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {

        // Store the token in localStorage
        localStorage.setItem("jwtToken", token);
        // Set the token in axios headers
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          await dispatch(fetchUserData());
          navigate("/dashboard");
        } catch (error) {
          console.error("Error fetching user data after OAuth auth:", error);
          dispatch(setError("Failed to complete authentication"));
        }
      }
      setInitialLoad(false);
    };

    checkOAuthAuth();
  }, [dispatch, navigate]);

  useEffect(() => {

    if (!initialLoad && user) {
      navigate("/dashboard");
    }
  }, [user, navigate, initialLoad]);

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setInitialLoad(false);

    const usernameOrEmail = email;

    if (!usernameOrEmail || !password) {

      dispatch(setError("Please fill in all fields"));
      return;
    }


    dispatch(setLoading(true));
    dispatch(setError(null));

    try {

      const res = await axios.post<ApiResponse>(
        `${API_BASE_URL}/api/auth/login`,
        { usernameOrEmail, password },
        { withCredentials: true }
      );



      if (res.data.message === "Logged in successfully" && res.data.user) {


        // @ts-expect-error unknown
        if (res.data.token) {
          // @ts-expect-error unknown
          localStorage.setItem("jwtToken", res.data.token);
          axiosInstance.defaults.headers.common[
            "Authorization"
            // @ts-expect-error unknown
          ] = `Bearer ${res.data.token}`;
        } // Store the JWT token

        dispatch(setUser(res.data.user));
        
        try {
          await dispatch(fetchUserData());
          navigate("/dashboard");
        } catch (error) {
          console.error("[handleLogin] Error fetching user data:", error);
          dispatch(setError("Error fetching user data"));
        }
      } else {
        console.warn("[handleLogin] Unexpected server response:", res.data);
        dispatch(setError("Invalid response from server"));
      }
    } catch (err) {
      console.error("[handleLogin] Login error:", err);
      const error = err as AxiosError<ApiResponse>;
      console.error("[handleLogin] Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.response?.data?.message,
        error: error.message,
      });
      dispatch(
        setError(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "An error occurred during login"
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="h-screen bg-[[#1E1E1E]]">
      <Navbar />
      <div className=" p-8 rounded-2xl shadow-lg w-96 mx-auto mt-28 text-white">
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign In</h2>

        {!initialLoad && error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        <div className="mb-4 relative">
          <label className="block mb-1 text-gray-300">Email/Username</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700
              focus:outline-none focus:bg-transparent"
            placeholder="Enter email or username"
          />
          <button
            type="button"
            className="absolute top-10 right-3 text-gray-400 hover:text-gray-200">
            <IoMailOutline size={20} />
          </button>
        </div>

        <div className="mb-4 relative">
          <label className="block mb-1 text-gray-300">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700
              focus:outline-none focus:bg-transparent"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-10 right-3 text-gray-400 hover:text-gray-200">
            {showPassword ? <FaEyeSlash size={20} /> : <FaRegEye size={20} />}
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#FFEE52] hover:bg-amber-300
            text-black font-semibold py-2 rounded-[999px]">
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <div className="my-4 mt-8 text-center flex items-center justify-center gap-4">
          <div className="h-[2px] bg-white flex-1"></div>
          <div>or continue with</div>
          <div className="h-[2px] bg-white flex-1"></div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleGoogleLogin}
            className="p-3 mx-auto bg-white text-black hover:bg-gray-200 font-semibold py-2 rounded-xl flex items-center justify-center gap-2">
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5"
            />
          </button>
        </div>

        <p className="mt-4 text-center ">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#FFEE52] hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
