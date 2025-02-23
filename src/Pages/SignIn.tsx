import { useState, useEffect } from "react";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading, setError } from "../store/slices/authSlice";
import { fetchUserData } from "../store/thunks/authThunks";
import type { RootState, AppDispatch } from "../store/store";
import Navbar from "../components/Navbar";

interface User {
  id: string;
  email: string;
  username?: string;
  displayName?: string;
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
    window.location.href = "http://localhost:5002/api/auth/google";
  };

  const handleXLogin = () => {
    setInitialLoad(false);
    dispatch(setLoading(true));
    dispatch(setError(null));
    window.location.href = "http://localhost:5002/api/auth/x";
  };

  useEffect(() => {
    // Check if this is a redirect from OAuth
    const checkOAuthAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const isGoogleAuth = urlParams.get("google");
      const isXAuth = urlParams.get("x");

      if (isGoogleAuth || isXAuth) {
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
    console.log("[handleLogin] Login attempt started");
    const usernameOrEmail = email;

    if (!usernameOrEmail || !password) {
      console.log("[handleLogin] Validation failed: Missing fields");
      dispatch(setError("Please fill in all fields"));
      return;
    }

    console.log("[handleLogin] Validation passed, proceeding with login");
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      console.log("[handleLogin] Making login API request...");
      const res = await axios.post<ApiResponse>(
        "http://localhost:5002/api/auth/login",
        { usernameOrEmail, password },
        { withCredentials: true }
      );

      console.log("[handleLogin] Login API response:", res.data);
      console.log("[handleLogin] Response status:", res.data.user);
      console.log("[handleLogin] Response status:", res.data.user_id);

      if (res.data.message === "Logged in successfully" && res.data.user_id) {
        console.log("[handleLogin] Login successful, setting user data");
        dispatch(setUser({ id: res.data.user_id })); // Pass an object with id property instead of just the string
        console.log(
          "[handleLogin] User data set, fetching additional user data"
        );
        await dispatch(fetchUserData());
        console.log("[handleLogin] Navigating to dashboard");
        navigate("/dashboard");
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
      console.log("[handleLogin] Login process completed");
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="h-screen bg-black">
      <Navbar />
      <div className="bg-black p-8 rounded-2xl shadow-lg w-96 mx-auto mt-10 text-white">
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign In</h2>

        {!initialLoad && error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        <div className="mb-4">
          <label className="block mb-1 text-gray-300">Email/Username</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700
              focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter email or username"
          />
        </div>

        <div className="mb-4 relative">
          <label className="block mb-1 text-gray-300">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700
              focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
          className="w-full bg-yellow-500 hover:bg-yellow-600
            text-black font-semibold py-2 rounded-lg">
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <div className="my-4 text-center text-gray-400">or continue with</div>

        <div className="flex gap-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-2 rounded-lg flex items-center justify-center gap-2">
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5"
            />
            Google
          </button>
          <button
            onClick={handleXLogin}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold py-2 rounded-lg">
            X
          </button>
        </div>

        <p className="mt-4 text-center text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-yellow-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
