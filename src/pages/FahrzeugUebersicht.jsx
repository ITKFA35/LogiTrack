import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFahrzeuge } from "../services/api";
import DataTable from "../components/DataTable";

export default function FahrzeugUebersicht() {
  const navigate = useNavigate();
  const [fahrzeuge, setFahrzeuge] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    getFahrzeuge().then((data) => {
      setFahrzeuge(data);
    });
  }, []);

const columns = [
  {
    key: "status",
    label: "Status",
    render: (fahrzeug) => (
        <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(fahrzeug.status)}`}
        >
        {fahrzeug.status}
        </span>
    ),
    },
  { key: "kontrollschild", label: "Kontrollschild" },
  { key: "seriennummer", label: "Seriennummer" },
  { key: "interneNummer", label: "Interne Nummer" },
  { key: "fahrzeugTyp", label: "Fahrzeugtyp" },
  {
    key: "serviceDatum",
    label: "Service Datum",
    render: (fahrzeug) => formatDateToGerman(fahrzeug.serviceDatum),
  },
  {
    key: "mfkDatum",
    label: "MFK Datum",
    render: (fahrzeug) => formatDateToGerman(fahrzeug.mfkDatum),
  },
];

  const formatDateToGerman = (dateValue) => {
    if (!dateValue) return "";
    const [year, month, day] = dateValue.split("-");
    return `${day}.${month}.${year}`;
  };

  const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "frei":
      return "bg-green-500/20 text-green-300";

    case "unterwegs":
      return "bg-blue-500/20 text-blue-300";

    case "wartung":
      return "bg-yellow-500/20 text-yellow-300";

    default:
      return "bg-slate-500/20 text-slate-300";
  }
};

return (
  <div className="min-h-screen bg-slate-900 p-8 text-white md:p-10">
    <button
      type="button"
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
        1.2 Fahrzeugübersicht
        <span className="text-base">▾</span>
      </h1>

      <p className="mt-2 text-slate-300">
        Übersicht aller Fahrzeuge aus dem Backend
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
            className="block w-full px-4 py-3 text-left text-sm hover:bg-slate-800"
          >
            1.1 Detaillierte Berichte
          </button>

          <button
            onClick={() => {
              navigate("/fahrzeuge");
              setMenuOpen(false);
            }}
            className="block w-full px-4 py-3 text-left text-sm hover:bg-slate-800 rounded-b-xl"
          >
            1.2 Fahrzeugübersicht
          </button>
        </div>
      )}
    </div>

    <div className="mt-8">
      <DataTable columns={columns} data={fahrzeuge} />
    </div>
  </div>
)}