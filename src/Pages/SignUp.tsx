import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setError } from '../store/slices/authSlice';

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
    lowerCase: /[a-z]/.test(password)
  };
};

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailValid, setEmailValid] = useState(true);
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirements>({
    minLength: false,
    specialChar: false,
    number: false,
    upperCase: false,
    lowerCase: false
  });

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      dispatch(setError('Please enter a valid email address'));
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!Object.values(passwordValidation).every(Boolean)) {
      dispatch(setError('Password does not meet all requirements'));
      return;
    }

    try {
      const response = await fetch("http://localhost:5002/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
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
      dispatch(setError(err.response?.data?.message || 'Something went wrong.'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${emailValid ? 'border-gray-300' : 'border-red-500'} placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailValid(validateEmail(e.target.value));
                }}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordRequirements(validatePassword(e.target.value));
                }}
              />
            </div>
          </div>

          <div className="text-sm text-gray-300">
            <h3 className="font-medium mb-2">Password Requirements:</h3>
            <ul className="space-y-1">
              <li className={`flex items-center ${passwordRequirements.minLength ? 'text-green-500' : 'text-gray-400'}`}>
                <span className="mr-2">{passwordRequirements.minLength ? '✓' : '○'}</span>
                At least 8 characters
              </li>
              <li className={`flex items-center ${passwordRequirements.specialChar ? 'text-green-500' : 'text-gray-400'}`}>
                <span className="mr-2">{passwordRequirements.specialChar ? '✓' : '○'}</span>
                One special character
              </li>
              <li className={`flex items-center ${passwordRequirements.number ? 'text-green-500' : 'text-gray-400'}`}>
                <span className="mr-2">{passwordRequirements.number ? '✓' : '○'}</span>
                One number
              </li>
              <li className={`flex items-center ${passwordRequirements.upperCase ? 'text-green-500' : 'text-gray-400'}`}>
                <span className="mr-2">{passwordRequirements.upperCase ? '✓' : '○'}</span>
                One uppercase letter
              </li>
              <li className={`flex items-center ${passwordRequirements.lowerCase ? 'text-green-500' : 'text-gray-400'}`}>
                <span className="mr-2">{passwordRequirements.lowerCase ? '✓' : '○'}</span>
                One lowercase letter
              </li>
            </ul>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Sign up
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <Link
            to="/signin"
            className="font-medium text-indigo-600 hover:text-indigo-500">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
