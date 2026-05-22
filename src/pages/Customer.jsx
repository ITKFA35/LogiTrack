import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import deleteIcon from "../assets/delete.svg";
import {
    getKunden,
    createKunde,
    updateKunde,
    deleteKunde,
} from "../services/api";

const leeresFormular = {
    kundenNummer: "",
    firmenname: "",
    ansprechperson: "",
    strasse: "",
    hausnummer: "",
    plz: "",
    ort: "",
    land: "CH",
    email: "",
    telefon: "",
    sprache: "de",
    branche: "",
    kundentyp: "standard",
    zahlungszielTage: 30,
    mwstNummer: "",
    status: "aktiv",
    bemerkungen: "",
};

const filter = ["alle", "aktiv", "inaktiv", "gesperrt", "standard", "premium", "partner"];

export default function Customer() {
    const navigate = useNavigate();

    const [kunden, setKunden] = useState([]);
    const [suche, setSuche] = useState("");
    const [aktiverFilter, setAktiverFilter] = useState("alle");
    const [modalOffen, setModalOffen] = useState(false);
    const [bearbeiteterKunde, setBearbeiteterKunde] = useState(null);
    const [formular, setFormular] = useState(leeresFormular);

    async function laden() {
        const daten = await getKunden();
        setKunden(daten);
    }

    useEffect(() => {
        laden();
    }, []);

    async function speichern() {
        if (bearbeiteterKunde) {
            await updateKunde(bearbeiteterKunde.id, formular);
        } else {
            await createKunde(formular);
        }

        setModalOffen(false);
        setBearbeiteterKunde(null);
        setFormular(leeresFormular);
        await laden();
    }

    async function loeschen() {
        if (!bearbeiteterKunde) return;

        const ok = window.confirm("Kunde wirklich loeschen?");
        if (!ok) return;

        try {
            await deleteKunde(bearbeiteterKunde.id);

            setModalOffen(false);
            setBearbeiteterKunde(null);
            setFormular(leeresFormular);

            await laden();

        } catch (error) {
            console.error(error);

            alert(
                "Kunde kann nicht geloescht werden. Vermutlich sind noch Sendungen mit diesem Kunden verknuepft."
            );
        }
    }

    const gefiltert = useMemo(() => {
        return kunden.filter((k) => {
            const text = [
                k.kundenNummer,
                k.firmenname,
                k.ansprechperson,
                k.strasse,
                k.hausnummer,
                k.plz,
                k.ort,
                k.land,
                k.email,
                k.telefon,
                k.sprache,
                k.branche,
                k.kundentyp,
                k.status,
                k.mwstNummer,
            ]
                .join(" ")
                .toLowerCase();

            const passtSuche = text.includes(suche.toLowerCase());

            const passtFilter =
                aktiverFilter === "alle" ||
                k.status === aktiverFilter ||
                k.kundentyp === aktiverFilter;

            return passtSuche && passtFilter;
        });
    }, [kunden, suche, aktiverFilter]);

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
                    <h1 className="text-4xl font-bold">Kunden</h1>
                    <p className="mt-2 text-slate-300">
                        Kundenverwaltung mit Adressen, Zahlungsziel und MWST-Nummer
                    </p>
                </div>

                <button
                    onClick={() => {
                        setBearbeiteterKunde(null);
                        setFormular(leeresFormular);
                        setModalOffen(true);
                    }}
                    className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
                >
                    + Neuer Kunde
                </button>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-2xl bg-slate-800 p-5">
                    <p className="text-slate-400">Gesamt</p>
                    <h2 className="text-3xl font-bold">{kunden.length}</h2>
                </div>
                <div className="rounded-2xl bg-slate-800 p-5">
                    <p className="text-slate-400">Aktiv</p>
                    <h2 className="text-3xl font-bold">
                        {kunden.filter((k) => k.status === "aktiv").length}
                    </h2>
                </div>
                <div className="rounded-2xl bg-slate-800 p-5">
                    <p className="text-slate-400">Premium</p>
                    <h2 className="text-3xl font-bold">
                        {kunden.filter((k) => k.kundentyp === "premium").length}
                    </h2>
                </div>
                <div className="rounded-2xl bg-slate-800 p-5">
                    <p className="text-slate-400">Partner</p>
                    <h2 className="text-3xl font-bold">
                        {kunden.filter((k) => k.kundentyp === "partner").length}
                    </h2>
                </div>
            </div>

            <div className="mb-6 rounded-2xl bg-slate-800 p-5">
                <input
                    value={suche}
                    onChange={(e) => setSuche(e.target.value)}
                    placeholder="Suche nach Kunde, Ort, PLZ, Branche, Telefon, E-Mail..."
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
                            <th className="p-4">Kunden-Nr.</th>
                            <th className="p-4">Firma</th>
                            <th className="p-4">Ansprechperson</th>
                            <th className="p-4">Ort</th>
                            <th className="p-4">Telefon</th>
                            <th className="p-4">Typ</th>
                            <th className="p-4">Zahlungsziel</th>
                        </tr>
                    </thead>

                    <tbody>
                        {gefiltert.map((k) => (
                            <tr
                                key={k.id}
                                onClick={() => {
                                    setBearbeiteterKunde(k);
                                    setFormular({
                                        ...leeresFormular,
                                        ...k,
                                        zahlungszielTage: Number(k.zahlungszielTage || 30),
                                    });
                                    setModalOffen(true);
                                }}
                                className="cursor-pointer border-t border-slate-700 hover:bg-slate-700/40"
                            >
                                <td className="p-4">{k.status}</td>
                                <td className="p-4 font-semibold">{k.kundenNummer}</td>
                                <td className="p-4">{k.firmenname}</td>
                                <td className="p-4">{k.ansprechperson}</td>
                                <td className="p-4">{k.plz} {k.ort}</td>
                                <td className="p-4">{k.telefon}</td>
                                <td className="p-4">{k.kundentyp}</td>
                                <td className="p-4">{k.zahlungszielTage} Tage</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalOffen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="w-full max-w-5xl rounded-2xl bg-slate-800 p-8 shadow-xl">
                        <h2 className="mb-6 text-3xl font-bold">
                            {bearbeiteterKunde ? "Kunde bearbeiten" : "Kunde erstellen"}
                        </h2>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                            <input className="rounded-lg bg-slate-950 p-3" placeholder="KundenNummer" value={formular.kundenNummer} onChange={(e) => setFormular({ ...formular, kundenNummer: e.target.value })} />
                            <input className="rounded-lg bg-slate-950 p-3" placeholder="Firmenname" value={formular.firmenname} onChange={(e) => setFormular({ ...formular, firmenname: e.target.value })} />
                            <input className="rounded-lg bg-slate-950 p-3" placeholder="Ansprechperson" value={formular.ansprechperson} onChange={(e) => setFormular({ ...formular, ansprechperson: e.target.value })} />

                            <input className="rounded-lg bg-slate-950 p-3" placeholder="Strasse" value={formular.strasse} onChange={(e) => setFormular({ ...formular, strasse: e.target.value })} />
                            <input className="rounded-lg bg-slate-950 p-3" placeholder="Hausnummer" value={formular.hausnummer} onChange={(e) => setFormular({ ...formular, hausnummer: e.target.value })} />
                            <input className="rounded-lg bg-slate-950 p-3" placeholder="PLZ" value={formular.plz} onChange={(e) => setFormular({ ...formular, plz: e.target.value })} />

                            <input className="rounded-lg bg-slate-950 p-3" placeholder="Ort" value={formular.ort} onChange={(e) => setFormular({ ...formular, ort: e.target.value })} />
                            <input className="rounded-lg bg-slate-950 p-3" placeholder="Land" value={formular.land} onChange={(e) => setFormular({ ...formular, land: e.target.value })} />
                            <input className="rounded-lg bg-slate-950 p-3" placeholder="E-Mail" value={formular.email} onChange={(e) => setFormular({ ...formular, email: e.target.value })} />

                            <input className="rounded-lg bg-slate-950 p-3" placeholder="Telefon" value={formular.telefon} onChange={(e) => setFormular({ ...formular, telefon: e.target.value })} />
                            <input className="rounded-lg bg-slate-950 p-3" placeholder="Branche" value={formular.branche} onChange={(e) => setFormular({ ...formular, branche: e.target.value })} />
                            <input className="rounded-lg bg-slate-950 p-3" placeholder="Sprache" value={formular.sprache} onChange={(e) => setFormular({ ...formular, sprache: e.target.value })} />

                            <select className="rounded-lg bg-slate-950 p-3" value={formular.kundentyp} onChange={(e) => setFormular({ ...formular, kundentyp: e.target.value })}>
                                <option value="standard">standard</option>
                                <option value="premium">premium</option>
                                <option value="partner">partner</option>
                                <option value="privat">privat</option>
                            </select>

                            <input className="rounded-lg bg-slate-950 p-3" type="number" placeholder="Zahlungsziel Tage" value={formular.zahlungszielTage} onChange={(e) => setFormular({ ...formular, zahlungszielTage: Number(e.target.value) })} />

                            <input className="rounded-lg bg-slate-950 p-3" placeholder="MWST-Nummer" value={formular.mwstNummer} onChange={(e) => setFormular({ ...formular, mwstNummer: e.target.value })} />

                            <select className="rounded-lg bg-slate-950 p-3" value={formular.status} onChange={(e) => setFormular({ ...formular, status: e.target.value })}>
                                <option value="aktiv">aktiv</option>
                                <option value="inaktiv">inaktiv</option>
                                <option value="gesperrt">gesperrt</option>
                            </select>

                            <textarea
                                className="rounded-lg bg-slate-950 p-3 md:col-span-2"
                                placeholder="Bemerkungen"
                                value={formular.bemerkungen}
                                onChange={(e) => setFormular({ ...formular, bemerkungen: e.target.value })}
                            />
                        </div>

                        <div className="mt-8 flex items-center justify-between">
                            <button
                                onClick={loeschen}
                                disabled={!bearbeiteterKunde}
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