import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getSendungen, getFahrzeuge } from "../services/api";

export default function Reports() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const [sendungen, setSendungen] = useState([]);
  const [fahrzeuge, setFahrzeuge] = useState([]);

  useEffect(() => {
    getSendungen().then((data) => {
      setSendungen(data);
    });

    getFahrzeuge().then((data) => {
      setFahrzeuge(data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 md:p-10">
      <button
        onClick={() => navigate("/")}
        className="mb-8 rounded-lg bg-slate-700 px-4 py-2 hover:bg-slate-600 transition"
      >
        ← Zur Startseite
      </button>

      <div className="relative mb-8">
        <p className="text-sm text-slate-400">LogiTrack</p>

        <h1
          onClick={() => setMenuOpen(!menuOpen)}
          className="inline-flex cursor-pointer items-center gap-2 text-3xl font-bold md:text-4xl hover:text-blue-400 transition"
        >
          1. Reporting & Dashboard
          <span className="text-base">▾</span>
        </h1>

        <p className="mt-2 text-slate-300">
          Übersicht der wichtigsten Kennzahlen
        </p>

        {menuOpen && (
          <div className="absolute mt-3 w-72 rounded-xl border border-slate-700 bg-slate-900 shadow-xl z-50">
            <button
              onClick={() => {
                navigate("/reports");
                setMenuOpen(false);
              }}
              className="block w-full px-4 py-3 text-left text-sm hover:bg-slate-800 rounded-t-xl"
            >
              1. Reporting & Dashboard
            </button>

            <button
              onClick={() => {
                navigate("/reports/dashboard");
                setMenuOpen(false);
              }}
              className="block w-full px-4 py-3 text-left text-sm hover:bg-slate-800 rounded-b-xl"
            >
              1.1 Detaillierte Berichte
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <button
          type="button"
          onClick={() => navigate("/reports/dashboard")}
          className="rounded-2xl bg-slate-800 p-6 text-left shadow-lg transition hover:bg-slate-700/80"
        >
          <p className="text-gray-400">Anzahl Sendungen</p>
          <h2 className="mt-2 text-3xl font-bold">{sendungen.length}</h2>
        </button>


        <div className="rounded-2xl bg-slate-800 p-6 shadow-lg">
          <p className="text-gray-400">Anzahl Fahrzeuge</p>
          <h2 className="mt-2 text-3xl font-bold">{fahrzeuge.length}</h2>
        </div>
      </div>
    </div>
  );
}