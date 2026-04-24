import {
  getSendungen,
  createSendung,
  updateSendung,
  deleteSendung,
} from "../services/api";
import { patchSendung } from "../services/api";
import { getSendungenFiltered } from "../services/api";
import { getSendungenSorted, getSendungenAdvanced } from "../services/api";

export default function ApiTest() {
  async function handleGet() {
    try {
      const data = await getSendungen();
      console.log("GET /sendungen", data);
      alert("GET erfolgreich. Siehe Konsole.");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  async function handlePost() {
    try {
      const neueSendung = {
        kundenId: 1,
        fahrerId: 1,
        fahrzeugId: 2,
        startStrasse: "Testweg",
        startHausnummer: "1",
        startPlz: "3000",
        startOrt: "Bern",
        startLand: "CH",
        zielStrasse: "Teststrasse",
        zielHausnummer: "99",
        zielPlz: "8000",
        zielOrt: "Zuerich",
        zielLand: "CH",
        erfassungsdatum: "2026-04-08",
        lieferdatum: "2026-04-12",
        status: "offen",
        prioritaet: "normal",
        lieferungTyp: "Paket",
        gewichtKg: 55,
        benachrichtigung: false,
        bemerkungen: "API Test Sendung"
      };

      const result = await createSendung(neueSendung);
      console.log("POST /sendungen", result);
      alert("POST erfolgreich.");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  async function handlePut() {
    try {
      const bestehendeSendung = await fetch("http://localhost:3001/sendungen/1001").then((r) => r.json());

      const updated = {
        ...bestehendeSendung,
        status: "geliefert",
        bemerkungen: "Per PUT aktualisiert"
      };

      const result = await updateSendung(1001, updated);
      console.log("PUT /sendungen/1001", result);
      alert("PUT erfolgreich.");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  async function handleDelete() {
    try {
      const data = await getSendungen();
      const letzteSendung = data[data.length - 1];

      if (!letzteSendung) {
        alert("Keine Sendung zum Loeschen gefunden");
        return;
      }

      const result = await deleteSendung(letzteSendung.id);
      console.log(`DELETE /sendungen/${letzteSendung.id}`, result);
      alert(`DELETE erfolgreich: ${letzteSendung.id}`);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  async function handleInvalidPost() {
    try {
    const kaputteSendung = {
      kundenId: 1,
      startStrasse: "Testweg",
      startHausnummer: "1",
      startPlz: "3000",
      startOrt: "Bern",
      startLand: "CH",
      zielStrasse: "Teststrasse",
      zielHausnummer: "99",
      zielPlz: "8000",
      zielOrt: "Zuerich",
      zielLand: "CH",
      status: "falsch",
      prioritaet: "superhoch",
      lieferungTyp: "Kiste",
      gewichtKg: -5
    };

      await createSendung(kaputteSendung);
    } catch (error) {
      console.error(error);
      alert(`Erwarteter Fehler: ${error.message}`);
    }
  }

  async function handlePatch() {
  try {
    const result = await patchSendung(1001, {
      status: "zugewiesen"
    });

    console.log("PATCH erfolgreich", result);
    alert("PATCH erfolgreich");
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

async function handleFilter() {
  try {
    const result = await getSendungenFiltered({
      startOrt: "Basel",
      zielOrt: "Bern",
    });

    console.log("FILTER /sendungen?startOrt=Basel&zielOrt=Bern", result);
    alert(`Filter erfolgreich. Treffer: ${result.length}`);
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

async function handleSort() {
  try {
    const result = await getSendungenSorted("startOrt", "asc");
    console.log("SORT /sendungen?_sort=startOrt&_order=asc", result);
    alert(`Sortierung erfolgreich. Erster Wert: ${result[0]?.startOrt ?? "kein Wert"}`);
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

async function handleAdvanced() {
  try {
    const result = await getSendungenAdvanced({
      startLand: "CH",
      sortBy: "zielOrt",
      order: "asc",
    });

    console.log("ADVANCED /sendungen?startLand=CH&_sort=zielOrt&_order=asc", result);
    alert(`Advanced erfolgreich. Treffer: ${result.length}`);
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

async function handleEmptyFieldTest() {
  try {
    const kaputteSendung = {
      kundenId: 1,
      startStrasse: "",
      startHausnummer: "1",
      startPlz: "3000",
      startOrt: "Bern",
      startLand: "CH",
      zielStrasse: "Teststrasse",
      zielHausnummer: "99",
      zielPlz: "8000",
      zielOrt: "Zuerich",
      zielLand: "CH",
      status: "offen",
      prioritaet: "normal",
      lieferungTyp: "Paket",
      gewichtKg: 55,
      erfassungsdatum: "2026-04-08",
      lieferdatum: "2026-04-12"
    };

    await createSendung(kaputteSendung);
  } catch (error) {
    console.error(error);
    alert(`Erwarteter Fehler: ${error.message}`);
  }
}

async function handleNegativeWeightTest() {
  try {
    const kaputteSendung = {
      kundenId: 1,
      startStrasse: "Testweg",
      startHausnummer: "1",
      startPlz: "3000",
      startOrt: "Bern",
      startLand: "CH",
      zielStrasse: "Teststrasse",
      zielHausnummer: "99",
      zielPlz: "8000",
      zielOrt: "Zuerich",
      zielLand: "CH",
      status: "offen",
      prioritaet: "normal",
      lieferungTyp: "Paket",
      gewichtKg: -5,
      erfassungsdatum: "2026-04-08",
      lieferdatum: "2026-04-12"
    };

    await createSendung(kaputteSendung);
  } catch (error) {
    console.error(error);
    alert(`Erwarteter Fehler: ${error.message}`);
  }
}

async function handleInvalidDateTest() {
  try {
    const kaputteSendung = {
      kundenId: 1,
      startStrasse: "Testweg",
      startHausnummer: "1",
      startPlz: "3000",
      startOrt: "Bern",
      startLand: "CH",
      zielStrasse: "Teststrasse",
      zielHausnummer: "99",
      zielPlz: "8000",
      zielOrt: "Zuerich",
      zielLand: "CH",
      status: "offen",
      prioritaet: "normal",
      lieferungTyp: "Paket",
      gewichtKg: 55,
      erfassungsdatum: "2026-04-12",
      lieferdatum: "2026-04-08"
    };

    await createSendung(kaputteSendung);
  } catch (error) {
    console.error(error);
    alert(`Erwarteter Fehler: ${error.message}`);
  }
}

async function handleInvalidStatusTest() {
  try {
    const kaputteSendung = {
      kundenId: 1,
      startStrasse: "Testweg",
      startHausnummer: "1",
      startPlz: "3000",
      startOrt: "Bern",
      startLand: "CH",
      zielStrasse: "Teststrasse",
      zielHausnummer: "99",
      zielPlz: "8000",
      zielOrt: "Zuerich",
      zielLand: "CH",
      status: "falsch",
      prioritaet: "normal",
      lieferungTyp: "Paket",
      gewichtKg: 55,
      erfassungsdatum: "2026-04-08",
      lieferdatum: "2026-04-12"
    };

    await createSendung(kaputteSendung);
  } catch (error) {
    console.error(error);
    alert(`Erwarteter Fehler: ${error.message}`);
  }
}

  return (
    <div className="min-h-screen bg-slate-950 p-10 text-white">
      <h1 className="mb-8 text-4xl font-bold">API Test</h1>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleGet}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold"
        >
          GET testen
        </button>

        <button
          onClick={handlePost}
          className="rounded-xl bg-green-600 px-6 py-3 font-semibold"
        >
          POST testen
        </button>

        <button
          onClick={handlePut}
          className="rounded-xl bg-yellow-600 px-6 py-3 font-semibold text-black"
        >
          PUT testen
        </button>

        <button
          onClick={handleDelete}
          className="rounded-xl bg-red-600 px-6 py-3 font-semibold"
        >
          DELETE testen
        </button>

        <button
          onClick={handleInvalidPost}
          className="rounded-xl bg-orange-600 px-6 py-3 font-semibold"
        >
          Ungueltigen POST testen
        </button>

        <button
          onClick={handlePatch}
          className="rounded-xl bg-purple-600 px-6 py-3 font-semibold"
        >
          PATCH testen
        </button>

        <button
          onClick={handleFilter}
          className="rounded-xl bg-cyan-600 px-6 py-3 font-semibold"
        >
          FILTER testen
        </button>

        <button
        onClick={handleSort}
        className="rounded-xl bg-teal-600 px-6 py-3 font-semibold"
        >
          SORT testen
        </button>

        <button
        onClick={handleAdvanced}
        className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold"
        >
        ADVANCED testen
        </button>

        <button
        onClick={handleEmptyFieldTest}
        className="rounded-xl bg-pink-600 px-6 py-3 font-semibold"
        >
        Leere Felder testen
      </button>
      <button
      onClick={handleNegativeWeightTest}
      className="rounded-xl bg-rose-600 px-6 py-3 font-semibold"
      >
      Negatives Gewicht testen
      </button>
      <button
      onClick={handleInvalidDateTest}
      className="rounded-xl bg-fuchsia-600 px-6 py-3 font-semibold"
      >
      Falsches Datum testen
      </button>
      <button
      onClick={handleInvalidStatusTest}
      className="rounded-xl bg-red-700 px-6 py-3 font-semibold"
      >
      Ungueltigen Status testen
      </button>
      </div>

      <p className="mt-8 text-slate-300">
        Ergebnisse in der Browser-Konsole ansehen.
      </p>
    </div>
  );
}