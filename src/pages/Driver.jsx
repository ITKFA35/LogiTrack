import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import deleteIcon from "../assets/delete.svg";
import {
    getFahrer,
    createFahrer,
    updateFahrer,
    deleteFahrer,
} from "../services/api";

const filter = [
    "alle",
    "verfuegbar",
    "unterwegs",
    "B",
    "BE",
    "C",
    "CE",
    "C1",
    "C1E",
    "D",
    "DE",
    "D1",
    "D1E",
    "CZV",
    "ADR",
];

const statusStyle = {
    verfuegbar: "bg-emerald-900 text-emerald-200",
    unterwegs: "bg-blue-900 text-blue-200",
    gesperrt: "bg-red-900 text-red-200",
};

const leeresFormular = {
    name: "",
    vorname: "",
    telefon: "",
    lenkzeitStunden: 0,
    verfuegbarkeit: "verfuegbar",
    fuehrerscheinKategorien: [],
    spezifikationen: [],
};

export default function Driver() {
    const navigate = useNavigate();

    const [fahrer, setFahrer] = useState([]);
    const [suche, setSuche] = useState("");
    const [aktiverFilter, setAktiverFilter] = useState("alle");
    const [modalOffen, setModalOffen] = useState(false);
    const [bearbeiteterFahrer, setBearbeiteterFahrer] = useState(null);
    const [formular, setFormular] = useState(leeresFormular);

    async function laden() {
        const daten = await getFahrer();
        setFahrer(daten);
    }

    useEffect(() => {
        laden();
    }, []);

    function toggleArray(feld, wert) {
        setFormular((alt) => {
            const liste = sicherArray(alt[feld]);

            return {
                ...alt,
                [feld]: liste.includes(wert)
                    ? liste.filter((x) => x !== wert)
                    : [...liste, wert],
            };
        });
    }

    async function speichern() {
        if (bearbeiteterFahrer) {
            await updateFahrer(bearbeiteterFahrer.id, formular);
        } else {
            await createFahrer(formular);
        }

        setModalOffen(false);
        setBearbeiteterFahrer(null);
        setFormular(leeresFormular);
        await laden();
    }

    async function loeschen() {
        if (!bearbeiteterFahrer) return;

        const ok = window.confirm("Fahrer wirklich loeschen?");
        if (!ok) return;

        await deleteFahrer(bearbeiteterFahrer.id);

        setModalOffen(false);
        setBearbeiteterFahrer(null);
        setFormular(leeresFormular);
        await laden();
    }

    const gefiltert = useMemo(() => {
        return fahrer.filter((f) => {
            const fs = f.fuehrerscheinKategorien || [];
            const sp = f.spezifikationen || [];

            const suchText = [
                f.name,
                f.vorname,
                f.telefon,
                f.verfuegbarkeit,
                ...fs,
                ...sp,
            ]
                .join(" ")
                .toLowerCase();

            const passtSuche = suchText.includes(suche.toLowerCase());

            const passtFilter =
                aktiverFilter === "alle" ||
                f.verfuegbarkeit === aktiverFilter ||
                fs.includes(aktiverFilter) ||
                sp.includes(aktiverFilter);

            return passtSuche && passtFilter;
        });
    }, [fahrer, suche, aktiverFilter]);

    function sicherArray(wert) {
        let value = wert;

        for (let i = 0; i < 3; i++) {
            if (Array.isArray(value)) return value;

            if (typeof value === "string") {
                try {
                    value = JSON.parse(value);
                } catch {
                    return value
                        .replaceAll("[", "")
                        .replaceAll("]", "")
                        .replaceAll('"', "")
                        .replaceAll("\\", "")
                        .split(",")
                        .map((x) => x.trim())
                        .filter(Boolean);
                }
            } else {
                return [];
            }
        }

        return Array.isArray(value) ? value : [];
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <button
                onClick={() => navigate("/")}
                className="mb-8 rounded-lg bg-slate-700 px-4 py-2 hover:bg-slate-600"
            >
                ← Zur Startseite
            </button>

            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold">Fahrer</h1>
                    <p className="mt-2 text-slate-300">
                        Uebersicht ueber Fahrer, Lizenzen und Verfuegbarkeit
                    </p>
                </div>

                <button
                    onClick={() => {
                        setBearbeiteterFahrer(null);
                        setFormular(leeresFormular);
                        setModalOffen(true);
                    }}
                    className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
                >
                    + Neuer Fahrer
                </button>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-2xl bg-slate-800 p-5">
                    <p className="text-slate-400">Gesamt</p>
                    <h2 className="text-3xl font-bold">{fahrer.length}</h2>
                </div>
                <div className="rounded-2xl bg-slate-800 p-5">
                    <p className="text-slate-400">Verfuegbar</p>
                    <h2 className="text-3xl font-bold">
                        {fahrer.filter((f) => f.verfuegbarkeit === "verfuegbar").length}
                    </h2>
                </div>
                <div className="rounded-2xl bg-slate-800 p-5">
                    <p className="text-slate-400">Unterwegs</p>
                    <h2 className="text-3xl font-bold">
                        {fahrer.filter((f) => f.verfuegbarkeit === "unterwegs").length}
                    </h2>
                </div>
                <div className="rounded-2xl bg-slate-800 p-5">
                    <p className="text-slate-400">ADR</p>
                    <h2 className="text-3xl font-bold">
                        {fahrer.filter((f) => (f.spezifikationen || []).includes("ADR")).length}
                    </h2>
                </div>
            </div>

            <div className="mb-6 rounded-2xl bg-slate-800 p-5">
                <input
                    value={suche}
                    onChange={(e) => setSuche(e.target.value)}
                    placeholder="Suche nach Name, Vorname, Telefon, Fuehrerschein oder Spezifikation..."
                    className="mb-4 w-full rounded-xl bg-slate-950 p-4 outline-none ring-1 ring-slate-700"
                />

                <div className="flex flex-wrap gap-3">
                    {filter.map((f) => (
                        <button
                            key={f}
                            onClick={() => setAktiverFilter(f)}
                            className={`rounded-lg px-4 py-2 ${aktiverFilter === f
                                ? "bg-blue-600"
                                : "bg-slate-700 hover:bg-slate-600"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-slate-800">
                <table className="w-full text-left">
                    <thead className="bg-slate-700">
                        <tr>
                            <th className="p-4">Status</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Vorname</th>
                            <th className="p-4">Telefon</th>
                            <th className="p-4">Lenkzeit</th>
                            <th className="p-4">Fuehrerschein</th>
                            <th className="p-4">Spezifikationen</th>
                        </tr>
                    </thead>

                    <tbody>
                        {gefiltert.map((f) => (
                            <tr
                                key={f.id}
                                onClick={() => {
                                    setBearbeiteterFahrer(f);
                                    setFormular({
                                        ...leeresFormular,
                                        ...f,
                                        fuehrerscheinKategorien: f.fuehrerscheinKategorien || [],
                                        spezifikationen: f.spezifikationen || [],
                                    });
                                    setModalOffen(true);
                                }}
                                className="cursor-pointer border-t border-slate-700 hover:bg-slate-700/40"
                            >
                                <td className="p-4">
                                    <span
                                        className={`rounded-full px-3 py-1 text-sm ${statusStyle[f.verfuegbarkeit] || "bg-slate-600"
                                            }`}
                                    >
                                        {f.verfuegbarkeit}
                                    </span>
                                </td>
                                <td className="p-4 font-semibold">{f.name}</td>
                                <td className="p-4">{f.vorname}</td>
                                <td className="p-4">{f.telefon}</td>
                                <td className="p-4">{f.lenkzeitStunden} h</td>
                                <td className="p-4">{sicherArray(f.fuehrerscheinKategorien).join(", ")}</td>
                                <td className="p-4">{sicherArray(f.spezifikationen).join(", ") || "—"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalOffen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="w-full max-w-4xl rounded-2xl bg-slate-800 p-8 shadow-xl">
                        <h2 className="mb-6 text-3xl font-bold">
                            {bearbeiteterFahrer ? "Fahrer bearbeiten" : "Fahrer erstellen"}
                        </h2>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <input className="rounded-lg bg-slate-950 p-3" placeholder="Name" value={formular.name} onChange={(e) => setFormular({ ...formular, name: e.target.value })} />
                            <input className="rounded-lg bg-slate-950 p-3" placeholder="Vorname" value={formular.vorname} onChange={(e) => setFormular({ ...formular, vorname: e.target.value })} />
                            <input className="rounded-lg bg-slate-950 p-3" placeholder="Telefon" value={formular.telefon} onChange={(e) => setFormular({ ...formular, telefon: e.target.value })} />
                            <input className="rounded-lg bg-slate-950 p-3" type="number" placeholder="Lenkzeit Stunden" value={formular.lenkzeitStunden} onChange={(e) => setFormular({ ...formular, lenkzeitStunden: Number(e.target.value) })} />

                            <select
                                className="rounded-lg bg-slate-950 p-3"
                                value={formular.verfuegbarkeit}
                                onChange={(e) => setFormular({ ...formular, verfuegbarkeit: e.target.value })}
                            >
                                <option value="verfuegbar">verfuegbar</option>
                                <option value="unterwegs">unterwegs</option>
                                <option value="gesperrt">gesperrt</option>
                            </select>
                        </div>

                        <h3 className="mt-6 mb-3 font-semibold">Fuehrerschein Kategorien</h3>
                        <div className="flex flex-wrap gap-3">
                            {["B", "BE", "C", "CE", "C1", "C1E", "D", "DE", "D1", "D1E", "CZV"].map((kat) => (
                                <button
                                    key={kat}
                                    type="button"
                                    onClick={() => toggleArray("fuehrerscheinKategorien", kat)}
                                    className={`rounded-lg px-4 py-2 ${formular.fuehrerscheinKategorien.includes(kat)
                                        ? "bg-blue-600"
                                        : "bg-slate-700"
                                        }`}
                                >
                                    {kat}
                                </button>
                            ))}
                        </div>

                        <h3 className="mt-6 mb-3 font-semibold">Spezifikationen</h3>
                        <div className="flex flex-wrap gap-3">
                            {["ADR", "Kuehltransport", "Gefahrengut"].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => toggleArray("spezifikationen", s)}
                                    className={`rounded-lg px-4 py-2 ${formular.spezifikationen.includes(s)
                                        ? "bg-blue-600"
                                        : "bg-slate-700"
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 flex items-center justify-between">
                            <button
                                onClick={loeschen}
                                disabled={!bearbeiteterFahrer}
                                className="flex items-center gap-2 rounded-lg bg-red-900 px-4 py-2 hover:bg-red-800 disabled:opacity-40"
                            >
                                <img src={deleteIcon} alt="Loeschen" className="h-5 w-5" />
                                Loeschen
                            </button>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setModalOffen(false)}
                                    className="rounded-lg bg-slate-700 px-5 py-2 hover:bg-slate-600"
                                >
                                    Abbrechen
                                </button>
                                <button
                                    onClick={speichern}
                                    className="rounded-lg bg-blue-600 px-5 py-2 font-semibold hover:bg-blue-500"
                                >
                                    Speichern
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}