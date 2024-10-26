import React from "react";

function Loading() {
  return (
    <div className="w-screen select-none bg-indigo-600 h-screen">
      <div className="flex items-center justify-center min-h-screen relative">
        <div className="h-[500px] w-[500px] border border-white/10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_20s_linear_infinite]"></div>
        <div className="h-[400px] w-[400px] border border-white/10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_15s_linear_infinite_reverse]"></div>
        <div className="h-[300px] w-[300px] border border-white/10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_10s_linear_infinite]"></div>
        {/* Logo Will come Here 👇 (Search for the Logo) */}
        <h1 className="font-bold text-4xl text-blue-50">H</h1>
      </div>
    </div>
  );
}

export default Loading;
