import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getSendungen } from "../services/api";

export default function DashboardV2() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sendungen, setSendungen] = useState([]);
  const [selectedSendung, setSelectedSendung] = useState(null);
  const [editForm, setEditForm] = useState({
    startadresse: "",
    zieladresse: "",
    status: "",
    prioritaet: "",
  });

  useEffect(() => {
    getSendungen().then((data) => {
      setSendungen(data);
    });
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "geliefert":
        return "bg-green-500/20 text-green-300";
      case "unterwegs":
        return "bg-blue-500/20 text-blue-300";
      case "wartet":
        return "bg-yellow-500/20 text-yellow-300";
      case "in bearbeitung":
        return "bg-purple-500/20 text-purple-300";
      case "offen":
        return "bg-orange-500/20 text-orange-300";
      case "zugewiesen":
        return "bg-cyan-500/20 text-cyan-300";
      default:
        return "bg-slate-500/20 text-slate-300";
    }
  };

  const openEditModal = (sendung) => {
    setSelectedSendung(sendung);
    setEditForm({
      startadresse: sendung.startadresse || "",
      zieladresse: sendung.zieladresse || "",
      status: sendung.status || "",
      prioritaet: sendung.prioritaet || "",
    });
  };

  const closeEditModal = () => {
    setSelectedSendung(null);
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
              className="block w-full px-4 py-3 text-left text-sm hover:bg-slate-800"
            >
              1.1 Detaillierte Berichte
            </button>

            <button
              onClick={() => {
                navigate("/transport");
                setMenuOpen(false);
              }}
              className="block w-full px-4 py-3 text-left text-sm hover:bg-slate-800 rounded-b-xl"
            >
              Transport Management
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-700 bg-slate-800 shadow-lg">
        <table className="min-w-full">
          <thead className="bg-slate-700/70">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                Startadresse
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                Zieladresse
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-200"></th>
            </tr>
          </thead>

          <tbody>
            {sendungen.map((sendung) => (
              <tr
                key={sendung.id}
                onClick={() => openEditModal(sendung)}
                className="cursor-pointer border-t border-slate-700 hover:bg-slate-700/40 transition"
              >
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                      sendung.status
                    )}`}
                  >
                    {sendung.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-slate-300">
                  {sendung.startadresse}
                </td>

                <td className="px-6 py-4 text-sm text-slate-300">
                  {sendung.zieladresse}
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="rounded p-2 text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      delete
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSendung && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-800 p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Sendung bearbeiten</h2>
              <button
                onClick={closeEditModal}
                className="flex items-center gap-2 rounded-lg bg-red-500/20 px-3 py-2 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition"
              >
                <span className="material-symbols-outlined text-[18px]">
                  delete
                </span>
                Löschen
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-slate-300">
                  Startadresse
                </label>
                <input
                  type="text"
                  value={editForm.startadresse}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      startadresse: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-slate-300">
                  Zieladresse
                </label>
                <input
                  type="text"
                  value={editForm.zieladresse}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      zieladresse: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Status
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      status: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                  <option value="offen">offen</option>
                  <option value="zugewiesen">zugewiesen</option>
                  <option value="unterwegs">unterwegs</option>
                  <option value="geliefert">geliefert</option>
                  <option value="wartet">wartet</option>
                  <option value="in bearbeitung">in bearbeitung</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Priorität
                </label>
                <select
                  value={editForm.prioritaet}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      prioritaet: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                  <option value="niedrig">niedrig</option>
                  <option value="normal">normal</option>
                  <option value="hoch">hoch</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeEditModal}
                className="rounded-lg bg-slate-700 px-5 py-3 hover:bg-slate-600 transition"
              >
                Abbrechen
              </button>

              <button className="rounded-lg bg-blue-600 px-5 py-3 hover:bg-blue-700 transition">
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}