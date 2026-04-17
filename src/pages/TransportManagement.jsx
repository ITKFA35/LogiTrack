import { useNavigate } from "react-router-dom";

export default function TransportManagement() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-8 md:px-10">
      <button
        onClick={() => navigate("/")}
        className="mb-8 rounded-lg bg-slate-700 px-4 py-2 hover:bg-slate-600 transition"
      >
        ← Zur Startseite
      </button>

      <div className="mb-8">
        <p className="text-sm text-slate-400">LogiTrack</p>
        <h1 className="text-3xl font-bold md:text-4xl">
          Transport Management
        </h1>
        <p className="mt-2 text-slate-300">
          Erstelle und verwalte Sendungen
        </p>
      </div>

      <div className="w-full rounded-2xl bg-slate-800 p-8 shadow-lg">
        <form className="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-slate-300">
              Startadresse
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-slate-300">
              Zieladresse
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Status
            </label>
            <select className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white">
              <option>offen</option>
              <option>zugewiesen</option>
              <option>unterwegs</option>
              <option>geliefert</option>
              <option>wartet</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Priorität
            </label>
            <select className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white">
              <option>niedrig</option>
              <option>normal</option>
              <option>hoch</option>
            </select>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-lg bg-slate-700 px-5 py-3 hover:bg-slate-600 transition"
            >
              Abbrechen
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-3 hover:bg-blue-700 transition"
            >
              Sendung erstellen
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}