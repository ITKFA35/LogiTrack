import { validateSendung } from "./validation";
const BASE_URL = "http://localhost:3001";

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API Fehler: ${response.status}`);
  }

  return response.json();
}

export async function getKunden() {
  return fetchJson(`${BASE_URL}/kunden`);
}

export async function getFahrer() {
  return fetchJson(`${BASE_URL}/fahrer`);
}

export async function getFahrzeuge() {
  return fetchJson(`${BASE_URL}/fahrzeuge`);
}

export async function getSendungen() {
  return fetchJson(`${BASE_URL}/sendungen`);
}

export async function getSendungById(id) {
  return fetchJson(`${BASE_URL}/sendungen/${id}`);
}

export async function getSendungenMitDetails() {
  const [sendungen, kunden, fahrer, fahrzeuge] = await Promise.all([
    getSendungen(),
    getKunden(),
    getFahrer(),
    getFahrzeuge(),
  ]);

  return sendungen.map((sendung) => {
    const kunde = kunden.find((k) => k.id === sendung.kundenId) || null;
    const fahrerItem = fahrer.find((f) => f.id === sendung.fahrerId) || null;
    const fahrzeug = fahrzeuge.find((fz) => fz.id === sendung.fahrzeugId) || null;

    return {
      ...sendung,
      kunde,
      fahrer: fahrerItem,
      fahrzeug,
    };
  });
}

export async function getDashboardStats() {
  const [sendungen, fahrzeuge, fahrer, kunden] = await Promise.all([
    getSendungen(),
    getFahrzeuge(),
    getFahrer(),
    getKunden(),
  ]);

  const offeneSendungen = sendungen.filter((s) =>
    ["offen", "zugewiesen", "wartet", "unterwegs"].includes(s.status)
  ).length;

  const fahrzeugeUnterwegs = fahrzeuge.filter(
    (fz) => fz.status === "unterwegs"
  ).length;

  const fahrzeugeFrei = fahrzeuge.filter((fz) => fz.status === "frei").length;

  const gelieferteSendungen = sendungen.filter(
    (s) => s.status === "geliefert"
  ).length;

  return {
    anzahlSendungen: sendungen.length,
    offeneSendungen,
    gelieferteSendungen,
    anzahlFahrzeuge: fahrzeuge.length,
    fahrzeugeUnterwegs,
    fahrzeugeFrei,
    anzahlFahrer: fahrer.length,
    anzahlKunden: kunden.length,
  };
}

export async function createSendung(sendungData) {
  const validation = validateSendung(sendungData, { requireId: false });

  if (!validation.valid) {
    throw new Error(`Validierungsfehler: ${validation.errors.join(", ")}`);
  }

  const response = await fetch(`${BASE_URL}/sendungen`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sendungData),
  });

  if (!response.ok) {
    throw new Error(`API Fehler beim Erstellen: ${response.status}`);
  }

  return response.json();
}

export async function updateSendung(id, sendungData) {
  const validation = validateSendung(sendungData, { requireId: true });

  if (!validation.valid) {
    throw new Error(`Validierungsfehler: ${validation.errors.join(", ")}`);
  }

  const response = await fetch(`${BASE_URL}/sendungen/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sendungData),
  });

  if (!response.ok) {
    throw new Error(`API Fehler beim Aktualisieren: ${response.status}`);
  }

  return response.json();
}

export async function deleteSendung(id) {
  const response = await fetch(`${BASE_URL}/sendungen/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`API Fehler beim Loeschen: ${response.status}`);
  }

  return true;
}