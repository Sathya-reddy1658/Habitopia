import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";
import { ChevronRight } from "lucide-react";

function AuthChecker() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div>
      {" "}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {" "}
          <div className="bg-indigo-600 h-[100vh] w-full flex flex-col items-center justify-center sm:justify-start p-6 relative  text-white ">
            <div className="h-[500px] w-[500px] border border-white/10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_20s_linear_infinite]"></div>
            <div className="h-[400px] w-[400px] border border-white/10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_15s_linear_infinite_reverse]"></div>
            <div className="h-[300px] w-[300px] border border-white/10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_10s_linear_infinite]"></div>

            <div className="z-10 w-full max-w-sm pt-8">
              <h1 className="text-2xl font-semibold mb-4">Habitopia.</h1>

              <div className="bg-white/10 rounded-2xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold">Leader Board</p>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-400 border-2 border-indigo-600">
                        🥇
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-300 border-2 border-indigo-600">
                        🥈
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-lg font-semibold mb-2">Habits</h2>
              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-center bg-indigo-500/30 rounded-xl p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-xl">
                      🔥
                    </div>
                    <span className="text-sm">Streaks</span>
                  </div>
                  <ChevronRight size={20} className="text-indigo-300" />
                </div>
                <div className="flex justify-between items-center bg-indigo-500/30 rounded-xl p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center text-xl">
                      ⚡
                    </div>
                    <span className="text-sm">Leader Board</span>
                  </div>
                  <ChevronRight size={20} className="text-indigo-300" />
                </div>
                <div className="flex justify-between items-center bg-indigo-500/30 rounded-xl p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-purple-400 flex items-center justify-center text-xl">
                      🪄
                    </div>
                    <span className="text-sm">Goal tracker</span>
                  </div>
                  <ChevronRight size={20} className="text-indigo-300" />
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-3">Track Your Progress</h2>
              <p className="mb-6 text-sm text-indigo-200">
                Every day you become one step closer to your goal. Don't give
                up!
              </p>

             <Link to={"/login"} className="w-full bg-white text-indigo-600 py-3 rounded-full mb-10 mt-3 font-semibold text-sm" >
             <button className="w-full mb-10">
                Let's Begin the Journey
              </button>
             </Link>
              <div className="flex space-x-3">
                <Link to="/login" className="flex-1 bg-black text-white py-3 rounded-full font-semibold text-sm flex items-center justify-center" >
                <button className="flex items-center justify-center " >
                  <span className="mr-2"><img className="w-4" src="./Google.svg" alt="" /></span> Google
                </button></Link>
                <Link to="/login"  className="flex-1 bg-blue-600 text-white py-3 rounded-full font-semibold text-sm flex items-center justify-center" >
                <button className="flex items-center justify-center " >
                  <span className="mr-2"><img className="w-4" src="./Github.svg" alt="./Github.svg" /></span> Github
                </button></Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AuthChecker;

