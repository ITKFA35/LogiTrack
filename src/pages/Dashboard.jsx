import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";



export default function Dashboard() {
  const navigate = useNavigate();


  const buttons = [
    { name: "Customer Portal", path: "/customer-portal" },
    { name: "Transport", path: "/transport" },
    { name: "Flotte", path: "/flotte" },
    { name: "Inventar", path: "/inventar" },
    { name: "Reports", path: "/reports" },
  ];



  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <h1 className="text-5xl font-bold">LogiTrack</h1>
        <p className="mt-4 text-slate-300">Deine Logistik. Perfekt im Blick</p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {buttons.map((btn) => (
            <button
              key={btn.name}
              onClick={() => navigate(btn.path)}
              className="min-w-[180px] rounded-2xl bg-blue-600 px-8 py-4 font-semibold transition hover:scale-105 hover:bg-blue-700"
            >
              {btn.name}
            </button>
          ))}
        </div>
                  
      </div>
    </div>
  );
}