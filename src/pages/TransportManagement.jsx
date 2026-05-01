import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { createSendung } from "../services/api";

export default function TransportManagement() {
  const navigate = useNavigate();
  const datePickerRef = useRef(null);
  const [errors, setErrors] = useState({});

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

  const inputClass = (field) =>
    `w-full rounded-lg border bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500 ${errors[field] ? "border-red-500" : "border-slate-600"
    }`;

  const formatDateToGerman = (dateValue) => {
    if (!dateValue) return "";

    const [year, month, day] = dateValue.split("-");
    return `${day}.${month}.${year}`;
  };

  const formatDateToApi = (dateValue) => {
    if (!dateValue) return "";

    const [day, month, year] = dateValue.split(".");
    return `${year}-${month}-${day}`;
  };

  const validate = () => {
    const newErrors = {};
    const messages = [];

    const addError = (field, message) => {
      newErrors[field] = true;
      messages.push(message);
    };

    const checkPlz = (field, landField, label) => {
      const plz = String(formData[field]).trim();
      const land = String(formData[landField]).trim().toUpperCase();

      if (!plz) {
        addError(field, `${label}: Bitte gib eine Postleitzahl ein.`);
        return;
      }

      if (!/^\d+$/.test(plz)) {
        addError(field, `${label}: Die Postleitzahl darf nur Zahlen enthalten.`);
        return;
      }

      const expectedLength = {
        CH: 4,
        AT: 4,
        DE: 5,
        FR: 5,
        IT: 5,
      }[land];

      if (expectedLength && plz.length !== expectedLength) {
        addError(
          field,
          `${label}: Bitte gib eine ${expectedLength}-stellige Postleitzahl ein.`
        );
      }
    };

    if (!formData.startStrasse.trim()) {
      addError("startStrasse", "Startadresse: Bitte gib eine Strasse ein.");
    }

    if (!formData.startHausnummer.trim()) {
      addError("startHausnummer", "Startadresse: Bitte gib eine Hausnummer ein.");
    }

    checkPlz("startPlz", "startLand", "Startadresse");

    if (!formData.startOrt.trim()) {
      addError("startOrt", "Startadresse: Bitte gib einen Ort ein.");
    } else if (!/^[A-Za-zÄÖÜäöüéèàçÉÈÀÇ\s-]+$/.test(formData.startOrt)) {
      addError("startOrt", "Startadresse: Der Ort enthält ungültige Zeichen.");
    }

    if (!formData.zielStrasse.trim()) {
      addError("zielStrasse", "Zieladresse: Bitte gib eine Strasse ein.");
    }

    if (!formData.zielHausnummer.trim()) {
      addError("zielHausnummer", "Zieladresse: Bitte gib eine Hausnummer ein.");
    }

    checkPlz("zielPlz", "zielLand", "Zieladresse");

    if (!formData.zielOrt.trim()) {
      addError("zielOrt", "Zieladresse: Bitte gib einen Ort ein.");
    } else if (!/^[A-Za-zÄÖÜäöüéèàçÉÈÀÇ\s-]+$/.test(formData.zielOrt)) {
      addError("zielOrt", "Zieladresse: Der Ort enthält ungültige Zeichen.");
    }

    if (!formData.lieferdatum.trim()) {
      addError("lieferdatum", "Bitte wähle ein gültiges Lieferdatum.");
    }

    if (!formData.gewichtKg) {
      addError("gewichtKg", "Bitte gib ein Gewicht ein.");
    } else if (Number(formData.gewichtKg) <= 0) {
      addError("gewichtKg", "Das Gewicht muss grösser als 0 sein.");
    }

    setErrors(newErrors);

    if (messages.length === 10) {
      alert("Bitte alle Pflichtfelder ausfüllen.");
      return false;
    }

    if (messages.length > 0) {
      alert("Bitte korrigieren:\n\n" + messages.join("\n"));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

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
      <div className="mb-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="rounded-lg bg-slate-700 px-4 py-2 hover:bg-slate-600 transition"
        >
          ← Zur Startseite
        </button>

        <button
          type="button"
          onClick={() => navigate("/reports/dashboard")}
          className="rounded-lg bg-blue-700 px-4 py-2 hover:bg-blue-600 transition"
        >
          Sendungen
        </button>

        <button
          type="button"
          onClick={() => navigate("/reports")}
          className="rounded-lg bg-indigo-700 px-4 py-2 hover:bg-indigo-600 transition"
        >
          Reports
        </button>
      </div>

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
              className={inputClass("startStrasse")}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Hausnummer</label>
            <input
              type="text"
              value={formData.startHausnummer}
              onChange={(e) => handleChange("startHausnummer", e.target.value)}
              className={inputClass("startHausnummer")}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">PLZ</label>
            <input
              type="text"
              value={formData.startPlz}
              onChange={(e) => handleChange("startPlz", e.target.value)}
              className={inputClass("startPlz")}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Ort</label>
            <input
              type="text"
              value={formData.startOrt}
              onChange={(e) => handleChange("startOrt", e.target.value)}
              className={inputClass("startOrt")}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-slate-300">Land</label>
            <select
              value={formData.startLand}
              onChange={(e) => handleChange("startLand", e.target.value)}
              className={inputClass("startLand")}
            >
              <option value="CH">Schweiz</option>
              <option value="DE">Deutschland</option>
              <option value="AT">Österreich</option>
              <option value="FR">Frankreich</option>
              <option value="IT">Italien</option>
            </select>
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
              className={inputClass("zielStrasse")}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Hausnummer</label>
            <input
              type="text"
              value={formData.zielHausnummer}
              onChange={(e) => handleChange("zielHausnummer", e.target.value)}
              className={inputClass("zielHausnummer")}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">PLZ</label>
            <input
              type="text"
              value={formData.zielPlz}
              onChange={(e) => handleChange("zielPlz", e.target.value)}
              className={inputClass("zielPlz")}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Ort</label>
            <input
              type="text"
              value={formData.zielOrt}
              onChange={(e) => handleChange("zielOrt", e.target.value)}
              className={inputClass("zielOrt")}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-slate-300">Land</label>
            <select
              value={formData.zielLand}
              onChange={(e) => handleChange("zielLand", e.target.value)}
              className={inputClass("zielLand")}
            >
              <option value="CH">Schweiz</option>
              <option value="DE">Deutschland</option>
              <option value="AT">Österreich</option>
              <option value="FR">Frankreich</option>
              <option value="IT">Italien</option>
            </select>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm text-slate-300">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className={inputClass("status")}
            >
              <option value="offen">offen</option>
              <option value="zugewiesen">zugewiesen</option>
              <option value="unterwegs">unterwegs</option>
              <option value="geliefert">geliefert</option>
              <option value="wartet">wartet</option>
            </select>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm text-slate-300">Priorität</label>
            <select
              value={formData.prioritaet}
              onChange={(e) => handleChange("prioritaet", e.target.value)}
              className={inputClass("prioritaet")}
            >
              <option value="niedrig">niedrig</option>
              <option value="normal">normal</option>
              <option value="hoch">hoch</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Lieferdatum</label>

            <div className="relative">
              <input
                type="text"
                placeholder="TT.MM.JJJJ"
                value={formData.lieferdatum}
                onChange={(e) => handleChange("lieferdatum", e.target.value)}
                className={inputClass("lieferdatum")}
              />

              <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[22px] text-slate-400">
                calendar_month
              </span>

              <input
                type="date"
                className="absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2 cursor-pointer opacity-0"
                onChange={(e) =>
                  handleChange("lieferdatum", formatDateToGerman(e.target.value))
                }
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Lieferung Typ</label>
            <select
              value={formData.lieferungTyp}
              onChange={(e) => handleChange("lieferungTyp", e.target.value)}
              className={inputClass("lieferungTyp")}>
              <option value="Paket">Paket</option>
              <option value="Palette">Palette</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Gewicht (kg)</label>
            <input
              type="number"
              value={formData.gewichtKg}
              onChange={(e) => handleChange("gewichtKg", e.target.value)}
              className={inputClass("gewichtKg")}
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