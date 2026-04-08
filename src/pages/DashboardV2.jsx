import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function DashboardV2() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const sendungen = [
    {
      id: 1,
      status: "Unterwegs",
      startadresse: "Bern",
      zieladresse: "Zürich",
    },
    {
      id: 2,
      status: "Geliefert",
      startadresse: "Basel",
      zieladresse: "Luzern",
    },
    {
      id: 3,
      status: "Wartet",
      startadresse: "Genf",
      zieladresse: "St. Gallen",
    },
    {
      id: 4,
      status: "In Bearbeitung",
      startadresse: "Thun",
      zieladresse: "Interlaken",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Geliefert":
        return "bg-green-500/20 text-green-300";
      case "Unterwegs":
        return "bg-blue-500/20 text-blue-300";
      case "Wartet":
        return "bg-yellow-500/20 text-yellow-300";
      case "In Bearbeitung":
        return "bg-purple-500/20 text-purple-300";
      default:
        return "bg-slate-500/20 text-slate-300";
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 md:p-10">
      <button
        onClick={() => navigate("/reports")}
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
          1.1 Detaillierte Berichte
          <span className="text-base">▾</span>
        </h1>

        <p className="mt-2 text-slate-300">
          Übersicht der Sendungen mit Status, Start- und Zieladresse
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

      <div className="overflow-x-auto rounded-2xl border border-slate-700 bg-slate-800 shadow-lg">
        <table className="min-w-full">
          <thead className="bg-slate-700/70">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Startadresse</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Zieladresse</th>
            </tr>
          </thead>

          <tbody>
            {sendungen.map((sendung) => (
              <tr
                key={sendung.id}
                className="border-t border-slate-700 hover:bg-slate-700/40 transition"
              >
                <td className="px-6 py-4 text-sm text-slate-200">{sendung.id}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                      sendung.status
                    )}`}
                  >
                    {sendung.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">{sendung.startadresse}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{sendung.zieladresse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}