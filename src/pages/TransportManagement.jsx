import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createSendung } from "../services/api";

export default function TransportManagement() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    kundenId: 1,
    fahrerId: 1,
    fahrzeugId: 1,

    startStrasse: "",
    startHausnummer: "",
    startPlz: "",
    startOrt: "",
    startLand: "CH",

    zielStrasse: "",
    zielHausnummer: "",
    zielPlz: "",
    zielOrt: "",
    zielLand: "CH",

    erfassungsdatum: new Date().toISOString().split("T")[0],
    lieferdatum: "",
    status: "offen",
    prioritaet: "niedrig",
    lieferungTyp: "Paket",
    gewichtKg: "",
    benachrichtigung: false,
    bemerkungen: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const newSendung = {
    ...formData,
    gewichtKg: formData.gewichtKg === "" ? 0 : Number(formData.gewichtKg),
    kundenId: Number(formData.kundenId),
    fahrerId: Number(formData.fahrerId),
    fahrzeugId: Number(formData.fahrzeugId),
    benachrichtigung: Boolean(formData.benachrichtigung),
  };

  console.log("NEW SENDUNG:", newSendung);

  try {
    await createSendung(newSendung);
    alert("Sendung erfolgreich erstellt");
    navigate("/reports/dashboard");
  } catch (error) {
    console.error("CREATE ERROR:", error);
    alert("Fehler beim Erstellen der Sendung: " + error.message);
  }
};

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 md:p-10">
      <button
        onClick={() => navigate("/reports/dashboard")}
        className="mb-8 rounded-lg bg-slate-700 px-4 py-2 hover:bg-slate-600 transition"
      >
        ← Zur Startseite
      </button>

      <div className="mb-8">
        <p className="text-sm text-slate-400">LogiTrack</p>
        <h1 className="text-3xl font-bold md:text-4xl">Transport Management</h1>
        <p className="mt-2 text-slate-300">Erstelle und verwalte Sendungen</p>
      </div>

      <div className="w-full rounded-2xl bg-slate-800 p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <h2 className="mb-2 text-lg font-semibold text-slate-200">Startadresse</h2>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Strasse</label>
            <input
              type="text"
              value={formData.startStrasse}
              onChange={(e) => handleChange("startStrasse", e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Hausnummer</label>
            <input
              type="text"
              value={formData.startHausnummer}
              onChange={(e) => handleChange("startHausnummer", e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">PLZ</label>
            <input
              type="text"
              value={formData.startPlz}
              onChange={(e) => handleChange("startPlz", e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Ort</label>
            <input
              type="text"
              value={formData.startOrt}
              onChange={(e) => handleChange("startOrt", e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-slate-300">Land</label>
            <input
              type="text"
              value={formData.startLand}
              onChange={(e) => handleChange("startLand", e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2 mt-4">
            <h2 className="mb-2 text-lg font-semibold text-slate-200">Zieladresse</h2>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Strasse</label>
            <input
              type="text"
              value={formData.zielStrasse}
              onChange={(e) => handleChange("zielStrasse", e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Hausnummer</label>
            <input
              type="text"
              value={formData.zielHausnummer}
              onChange={(e) => handleChange("zielHausnummer", e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">PLZ</label>
            <input
              type="text"
              value={formData.zielPlz}
              onChange={(e) => handleChange("zielPlz", e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Ort</label>
            <input
              type="text"
              value={formData.zielOrt}
              onChange={(e) => handleChange("zielOrt", e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-slate-300">Land</label>
            <input
              type="text"
              value={formData.zielLand}
              onChange={(e) => handleChange("zielLand", e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm text-slate-300">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
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

          <div className="mt-4">
            <label className="mb-2 block text-sm text-slate-300">Priorität</label>
            <select
              value={formData.prioritaet}
              onChange={(e) => handleChange("prioritaet", e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            >
              <option value="niedrig">niedrig</option>
              <option value="normal">normal</option>
              <option value="hoch">hoch</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Lieferdatum</label>
            <input
              type="date"
              value={formData.lieferdatum}
              onChange={(e) => handleChange("lieferdatum", e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Lieferung Typ</label>
            <input
              type="text"
              value={formData.lieferungTyp}
              onChange={(e) => handleChange("lieferungTyp", e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Gewicht (kg)</label>
            <input
              type="number"
              value={formData.gewichtKg}
              onChange={(e) => handleChange("gewichtKg", e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Benachrichtigung</label>
            <select
              value={formData.benachrichtigung ? "true" : "false"}
              onChange={(e) =>
                handleChange("benachrichtigung", e.target.value === "true")
              }
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            >
              <option value="false">Nein</option>
              <option value="true">Ja</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-slate-300">Bemerkungen</label>
            <textarea
              value={formData.bemerkungen}
              onChange={(e) => handleChange("bemerkungen", e.target.value)}
              rows="4"
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/reports/dashboard")}
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