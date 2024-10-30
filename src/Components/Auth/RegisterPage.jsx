import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { doSignInWithGoogle, doCreateUserWithEmailAndPassword } from './AllAuthFunctions';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    if (!isSigningUp) {
      setIsSigningUp(true);
      try {
        if (!email || !password) {
          setMessage("Please provide both email and password.");
          setIsSigningUp(false);
          return;
        }
  
        await doCreateUserWithEmailAndPassword(email, password);
        navigate("/home");
      } catch (error) {
        console.error("Error during sign-up:", error);
        setMessage(error.message);
        setIsSigningUp(false);
      }
    }
  };

  const onGoogleSignIn = async (event) => {
    event.preventDefault();
    if (!isSigningUp) {
      setIsSigningUp(true);
      await doSignInWithGoogle()
        .catch((err) => {
          setMessage(err.message);
          setIsSigningUp(false);
        });
    }
  };

  if (userLoggedIn) {
    return <Navigate to="/home" replace={true} />;
  }

  return (
    <div className="bg-indigo-600 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden text-white ">
      <div className="h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] border border-white/10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_20s_linear_infinite]"></div>
      <div className="h-[240px] w-[240px] sm:h-[400px] sm:w-[400px] border border-white/10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_15s_linear_infinite_reverse]"></div>
      <div className="h-[180px] w-[180px] sm:h-[300px] sm:w-[300px] border border-white/10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_10s_linear_infinite]"></div>

      <div className="z-10 w-full max-w-md bg-white/10 rounded-3xl p-6 sm:p-8 shadow-xl sm:h-[75vh]">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-3 text-center">Join Habitopia.</h2>
        <form onSubmit={handleRegister} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourEmail@email.com"
              className="w-full px-3 sm:px-4 py-2 sm:py-1 rounded-full bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/50 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 sm:px-4 py-2 sm:py-1 rounded-full bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/50 text-sm sm:text-base"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-indigo-600 py-2 sm:py-1 rounded-full font-semibold text-sm sm:text-base hover:bg-indigo-100 transition duration-300 ease-in-out"
            disabled={isSigningUp}
          >
            {isSigningUp ? 'Signing Up...' : 'Register'}
          </button>
        </form>
        {message && <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-red-300 text-center">{message}</p>}
        <div className="mt-4 flex">
          <button
            onClick={onGoogleSignIn}
            className="w-full bg-white text-gray-700 py-2 sm:py-1 rounded-full font-semibold text-sm sm:text-base hover:bg-gray-100 transition duration-300 ease-in-out flex items-center justify-center"
            disabled={isSigningUp}
          >
            <img src="./Google.svg" className="mr-2 h-5 w-5 sm:w-6 sm:h-6" alt="Google logo" />
            Sign up with Google
          </button>
        </div>
        <div className="mt-6 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm">Already have an account?</p>
          <a href="/login" className="text-xs sm:text-sm font-semibold hover:underline">Login Here</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;