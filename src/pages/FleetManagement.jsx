import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFahrzeuge, createFahrzeug, updateFahrzeug, deleteFahrzeug } from "../services/api";
import deleteIcon from "../assets/delete.svg";

const kategorien = ["alle", "lkw", "szm", "transporter", "anhaenger", "auflieger"];

const labelKategorie = {
  alle: "Alle",
  lkw: "LKW",
  szm: "SZM",
  transporter: "Transporter",
  anhaenger: "Anhänger",
  auflieger: "Auflieger",
};

const labelArt = {
  pritsche_plane: "Pritsche/Plane",
  koffer: "Koffer",
  kuehler: "Kuehler",
  tank: "Tank",
  silo: "Silo",
  tieflader: "Tieflader",
};

const statusStyle = {
  verfuegbar: "bg-emerald-900 text-emerald-200",
  in_nutzung: "bg-blue-900 text-blue-200",
  wartung: "bg-yellow-900 text-yellow-200",
  reserviert: "bg-purple-900 text-purple-200",
  gesperrt: "bg-red-900 text-red-200",
};

export default function FleetManagement() {
  const navigate = useNavigate();
  const [fahrzeuge, setFahrzeuge] = useState([]);
  const [aktiveKategorie, setAktiveKategorie] = useState("alle");
  const [suche, setSuche] = useState("");
  const [modalOffen, setModalOffen] = useState(false);
  const [bearbeitetesFahrzeug, setBearbeitetesFahrzeug] = useState(null);
  const [formular, setFormular] = useState({});

  async function speichern() {
    const payload = {
      ...formular,
      aktuellerKmStand: Number(formular.aktuellerKmStand),
      letzteWartungKm: Number(formular.letzteWartungKm),
      naechsteWartungKm: Number(formular.naechsteWartungKm),
      nutzlastKg:
        formular.fahrzeugKategorie === "szm" ? null : Number(formular.nutzlastKg),
      palettenPlaetze:
        formular.fahrzeugKategorie === "szm" ? null : Number(formular.palettenPlaetze),
      fahrzeugArt:
        formular.fahrzeugKategorie === "szm" ? null : formular.fahrzeugArt,
    };

    if (bearbeitetesFahrzeug) {
      await updateFahrzeug(bearbeitetesFahrzeug.id, payload);
    } else {
      await createFahrzeug(payload);
    }

    const daten = await getFahrzeuge();
    setFahrzeuge(daten);
    setModalOffen(false);
  }

  useEffect(() => {
    getFahrzeuge()
      .then(setFahrzeuge)
      .catch((err) => console.error("Fehler beim Laden der Fahrzeuge:", err));
  }, []);

  const gefiltert = useMemo(() => {
    return fahrzeuge.filter((fz) => {
      const passtKategorie =
        aktiveKategorie === "alle" || fz.fahrzeugKategorie === aktiveKategorie;

      const suchtext = [
        fz.interneNummer,
        fz.kennzeichen,
        fz.vin,
        fz.marke,
        fz.modell,
      ]
        .join(" ")
        .toLowerCase();

      return passtKategorie && suchtext.includes(suche.toLowerCase());
    });
  }, [fahrzeuge, aktiveKategorie, suche]);

  const stats = {
    gesamt: fahrzeuge.length,
    verfuegbar: fahrzeuge.filter((fz) => fz.status === "verfuegbar").length,
    inNutzung: fahrzeuge.filter((fz) => fz.status === "in_nutzung").length,
    wartung: fahrzeuge.filter((fz) => fz.status === "wartung").length,
    gesperrt: fahrzeuge.filter((fz) => fz.status === "gesperrt").length,
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <button
        onClick={() => navigate("/")}
        className="mb-6 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg"
      >
        ← Zur Startseite
      </button>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold">Fahrzeugflotte</h1>
          <p className="text-slate-300 mt-2">
            Übersicht über LKW, SZM, Transporter, Anhänger und Auflieger
          </p>
        </div>

        <button
          onClick={() => {
            setBearbeitetesFahrzeug(null);
            setFormular({
              interneNummer: "",
              kennzeichen: "",
              vin: "",
              marke: "",
              modell: "",
              fahrzeugKategorie: "lkw",
              fahrzeugArt: "koffer",
              status: "verfuegbar",
              mfkDatum: "",
              aktuellerKmStand: 0,
              letzteWartungKm: 0,
              naechsteWartungKm: 30000,
              nutzlastKg: 0,
              palettenPlaetze: 0,
            });
            setModalOffen(true);
          }}
          className="bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-xl font-semibold"
        >
          + Neues Fahrzeug
        </button>
        {modalOffen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">
                {bearbeitetesFahrzeug ? "Fahrzeug bearbeiten" : "Neues Fahrzeug"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Interne Nummer" name="interneNummer" formular={formular} setFormular={setFormular} />
                <Input label="Kennzeichen" name="kennzeichen" formular={formular} setFormular={setFormular} />
                <Input label="VIN" name="vin" formular={formular} setFormular={setFormular} />
                <Input label="Marke" name="marke" formular={formular} setFormular={setFormular} />
                <Input label="Modell" name="modell" formular={formular} setFormular={setFormular} />

                <Select label="Kategorie" name="fahrzeugKategorie" formular={formular} setFormular={setFormular}
                  options={["lkw", "szm", "transporter", "anhaenger", "auflieger"]} />

                {formular.fahrzeugKategorie !== "szm" && (
                  <Select label="Art" name="fahrzeugArt" formular={formular} setFormular={setFormular}
                    options={["pritsche_plane", "koffer", "kuehler", "tank", "silo", "tieflader"]} />
                )}

                <Select label="Status" name="status" formular={formular} setFormular={setFormular}
                  options={["verfuegbar", "in_nutzung", "wartung", "reserviert", "gesperrt"]} />

                <Input label="MFK Datum" name="mfkDatum" type="date" formular={formular} setFormular={setFormular} />
                <Input label="Aktueller KM Stand" name="aktuellerKmStand" type="number" formular={formular} setFormular={setFormular} />
                <Input label="Letzte Wartung KM" name="letzteWartungKm" type="number" formular={formular} setFormular={setFormular} />
                <Input label="Naechste Wartung KM" name="naechsteWartungKm" type="number" formular={formular} setFormular={setFormular} />

                {formular.fahrzeugKategorie !== "szm" && (
                  <>
                    <Input label="Nutzlast kg" name="nutzlastKg" type="number" formular={formular} setFormular={setFormular} />
                    <Input label="Palettenplaetze" name="palettenPlaetze" type="number" formular={formular} setFormular={setFormular} />
                  </>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={async () => {
                    if (!bearbeitetesFahrzeug) return;

                    const bestaetigt = window.confirm(
                      "Fahrzeug wirklich löschen?"
                    );

                    if (!bestaetigt) return;

                    try {
                      await deleteFahrzeug(bearbeitetesFahrzeug.id);

                      setModalOffen(false);

                      const daten = await getFahrzeuge();
                      setFahrzeuge(daten);
                    } catch (error) {
                      console.error(error);
                      alert("Fehler beim Löschen");
                    }
                  }}
                  className="flex items-center gap-2 rounded-lg bg-red-900 px-4 py-2 text-white hover:bg-red-800"
                >
                  <img
                    src={deleteIcon}
                    alt="Löschen"
                    className="h-5 w-5"
                  />
                  Löschen
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={() => setModalOffen(false)}
                    className="px-5 py-2 rounded-lg bg-slate-700 hover:bg-slate-600"
                  >
                    Abbrechen
                  </button>

                  <button
                    onClick={speichern}
                    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold"
                  >
                    Speichern
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard title="Gesamt" value={stats.gesamt} />
        <StatCard title="Verfuegbar" value={stats.verfuegbar} />
        <StatCard title="In Nutzung" value={stats.inNutzung} />
        <StatCard title="Wartung" value={stats.wartung} />
        <StatCard title="Gesperrt" value={stats.gesperrt} />
      </div>

      <div className="bg-slate-800 rounded-2xl p-4 mb-6">
        <input
          value={suche}
          onChange={(e) => setSuche(e.target.value)}
          placeholder="Suche nach Kennzeichen, interner Nr, VIN, Marke oder Modell..."
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 mb-4 outline-none focus:border-blue-500"
        />

        <div className="flex flex-wrap gap-2">
          {kategorien.map((kat) => (
            <button
              key={kat}
              onClick={() => setAktiveKategorie(kat)}
              className={`px-4 py-2 rounded-lg ${aktiveKategorie === kat
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
            >
              {labelKategorie[kat]}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto bg-slate-800 rounded-2xl">
        <table className="w-full text-left">
          <thead className="bg-slate-700 text-slate-200">
            <tr>
              <th className="p-4">Status</th>
              <th className="p-4">Interne Nr</th>
              <th className="p-4">Kennzeichen</th>
              <th className="p-4">Kategorie</th>
              <th className="p-4">Art</th>
              <th className="p-4">Fahrzeug</th>
              <th className="p-4">KM</th>
              <th className="p-4">MFK</th>
              <th className="p-4">Wartung</th>
              <th className="p-4">Nutzlast</th>
              <th className="p-4">Paletten</th>
            </tr>
          </thead>

          <tbody>
            {gefiltert.map((fz) => (
              <tr
                key={fz.id}
                onClick={() => {
                  setBearbeitetesFahrzeug(fz);

                  setFormular({
                    ...fz,
                    mfkDatum: fz.mfkDatum
                      ? fz.mfkDatum.slice(0, 10)
                      : "",
                  });

                  setModalOffen(true);
                }}
                className="border-t border-slate-700 hover:bg-slate-700/40 cursor-pointer"
              >
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${statusStyle[fz.status] || "bg-slate-600"}`}>
                    {fz.status}
                  </span>
                </td>
                <td className="p-4 font-semibold">{fz.interneNummer}</td>
                <td className="p-4">{fz.kennzeichen}</td>
                <td className="p-4">{labelKategorie[fz.fahrzeugKategorie] || fz.fahrzeugKategorie}</td>
                <td className="p-4">{fz.fahrzeugArt ? labelArt[fz.fahrzeugArt] : "—"}</td>
                <td className="p-4">{fz.marke} {fz.modell}</td>
                <td className="p-4">{fz.aktuellerKmStand?.toLocaleString("de-CH")} km</td>
                <td className="p-4">{new Date(fz.mfkDatum).toLocaleDateString("de-CH")}</td>
                <td className="p-4">
                  {fz.naechsteWartungKm
                    ? `${fz.naechsteWartungKm.toLocaleString("de-CH")} km`
                    : "—"}
                </td>
                <td className="p-4">
                  {fz.nutzlastKg
                    ? `${fz.nutzlastKg.toLocaleString("de-CH")} kg`
                    : "—"}
                </td>
                <td className="p-4">{fz.palettenPlaetze ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-5">
      <p className="text-slate-400 text-sm">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function Input({ label, name, type = "text", formular, setFormular }) {
  return (
    <label className="block">
      <span className="text-sm text-slate-300">{label}</span>
      <input
        type={type}
        value={formular[name] ?? ""}
        onChange={(e) =>
          setFormular({ ...formular, [name]: e.target.value })
        }
        className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
      />
    </label>
  );
}

function Select({ label, name, options, formular, setFormular }) {
  return (
    <label className="block">
      <span className="text-sm text-slate-300">{label}</span>
      <select
        value={formular[name] ?? ""}
        onChange={(e) =>
          setFormular({ ...formular, [name]: e.target.value })
        }
        className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}