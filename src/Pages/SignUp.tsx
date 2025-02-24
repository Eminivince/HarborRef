import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setError } from "../store/slices/authSlice";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { API_BASE_URL } from "../config/api";

interface PasswordRequirements {
  minLength: boolean;
  specialChar: boolean;
  number: boolean;
  upperCase: boolean;
  lowerCase: boolean;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): PasswordRequirements => {
  return {
    minLength: password.length >= 8,
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    number: /\d/.test(password),
    upperCase: /[A-Z]/.test(password),
    lowerCase: /[a-z]/.test(password),
  };
};

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [refCode, setrefCode] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      setrefCode(code);
    }
  }, []);
  // const [emailValid, setEmailValid] = useState(true);
  const [passwordRequirements, setPasswordRequirements] =
    useState<PasswordRequirements>({
      minLength: false,
      specialChar: false,
      number: false,
      upperCase: false,
      lowerCase: false,
    });

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      dispatch(setError("Please enter a valid email address"));
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!Object.values(passwordValidation).every(Boolean)) {
      dispatch(setError("Password does not meet all requirements"));
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
          ...(refCode && { refCode }),
        }),
        credentials: "include",
      });

      if (response.ok) {
        navigate("/signin");
      } else {
        const data = await response.json();
        dispatch(setError(data.message || "Something went wrong"));
      }
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (err: any) {
      dispatch(
        setError(err.response?.data?.message || "Something went wrong.")
      );
    }
  };

  return (
    <div className="items-center h-screen bg-black">
      <Navbar />
      <div className="bg-black p-8 rounded-2xl shadow-lg w-96 mx-auto mt-10 text-white">
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block mb-1 text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                // setEmailValid(validateEmail(e.target.value));
              }}
              className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:bg-transparent"
              placeholder="johndoe@gmail.com"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-gray-300">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:bg-transparent"
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="block mb-1 text-gray-300">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordRequirements(validatePassword(e.target.value));
              }}
              className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:bg-transparent"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-10 right-3 text-gray-400 hover:text-gray-200">
              {showPassword ? <FaEyeSlash size={20} /> : <FaRegEye size={20} />}
            </button>
          </div>

          <div className="text-sm text-gray-300">
            <h3 className="font-medium mb-2">Password Requirements:</h3>
            <ul className="space-y-1">
              <li
                className={`flex items-center ${
                  passwordRequirements.minLength
                    ? "text-green-500"
                    : "text-gray-400"
                }`}>
                <span className="mr-2">
                  {passwordRequirements.minLength ? "✓" : "○"}
                </span>
                At least 8 characters
              </li>
              <li
                className={`flex items-center ${
                  passwordRequirements.specialChar
                    ? "text-green-500"
                    : "text-gray-400"
                }`}>
                <span className="mr-2">
                  {passwordRequirements.specialChar ? "✓" : "○"}
                </span>
                One special character
              </li>
              <li
                className={`flex items-center ${
                  passwordRequirements.number
                    ? "text-green-500"
                    : "text-gray-400"
                }`}>
                <span className="mr-2">
                  {passwordRequirements.number ? "✓" : "○"}
                </span>
                One number
              </li>
              <li
                className={`flex items-center ${
                  passwordRequirements.upperCase
                    ? "text-green-500"
                    : "text-gray-400"
                }`}>
                <span className="mr-2">
                  {passwordRequirements.upperCase ? "✓" : "○"}
                </span>
                One uppercase letter
              </li>
              <li
                className={`flex items-center ${
                  passwordRequirements.lowerCase
                    ? "text-green-500"
                    : "text-gray-400"
                }`}>
                <span className="mr-2">
                  {passwordRequirements.lowerCase ? "✓" : "○"}
                </span>
                One lowercase letter
              </li>
            </ul>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-200 hover:bg-amber-300 text-black font-semibold py-2 rounded-lg mt-4">
            Sign Up
          </button>
        </form>

        <div className="my-4 text-center text-gray-400">or continue with</div>

        <div className="flex gap-4 mb-4">
          <button
            onClick={() => {
              window.location.href = `${API_BASE_URL}/api/auth/google`;
            }}
            className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-2 rounded-lg flex items-center justify-center gap-2">
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5"
            />
            Google
          </button>
        </div>

        <div className="text-center mt-4">
          <Link to="/signin" className="text-amber-200 hover:text-amber-400">
            <span className="text-gray-600">Already have an account?</span> Sign
            in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
