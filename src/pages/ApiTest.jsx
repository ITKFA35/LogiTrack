import {
  getSendungen,
  createSendung,
  updateSendung,
  deleteSendung,
} from "../services/api";

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
        startadresse: "Bern, Testweg 1",
        zieladresse: "Zuerich, Teststrasse 99",
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
      </div>

      <p className="mt-8 text-slate-300">
        Ergebnisse in der Browser-Konsole ansehen.
      </p>
    </div>
  );
}