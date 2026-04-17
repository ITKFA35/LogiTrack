import { validateSendung } from "./validation";
import { validateStatusChange } from "./validation";
const BASE_URL = "http://localhost:3001";

function addParam(params, key, value) {
  if (value && value.trim()) {
    params.append(key, value.trim());
  }
}

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

export async function patchSendung(id, partialData) {
  // aktuelle Sendung holen
  const current = await fetch(`${BASE_URL}/sendungen/${id}`).then(r => r.json());

  // nur wenn status geändert wird → prüfen
  if (partialData.status && partialData.status !== current.status) {
    const check = validateStatusChange(current.status, partialData.status);

    if (!check.valid) {
      throw new Error(check.error);
    }
  }

  const response = await fetch(`${BASE_URL}/sendungen/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(partialData),
  });

  if (!response.ok) {
    throw new Error(`API Fehler beim Patch: ${response.status}`);
  }

  return response.json();
}

export async function getSendungenFiltered(filters = {}) {
  const params = new URLSearchParams();

  addParam(params, "status", filters.status);
  addParam(params, "prioritaet", filters.prioritaet);

  if (filters.kundenId) {
    params.append("kundenId", String(filters.kundenId));
  }

  addParam(params, "startStrasse", filters.startStrasse);
  addParam(params, "startHausnummer", filters.startHausnummer);
  addParam(params, "startPlz", filters.startPlz);
  addParam(params, "startOrt", filters.startOrt);
  addParam(params, "startLand", filters.startLand);

  addParam(params, "zielStrasse", filters.zielStrasse);
  addParam(params, "zielHausnummer", filters.zielHausnummer);
  addParam(params, "zielPlz", filters.zielPlz);
  addParam(params, "zielOrt", filters.zielOrt);
  addParam(params, "zielLand", filters.zielLand);

  const queryString = params.toString();
  const url = queryString
    ? `${BASE_URL}/sendungen?${queryString}`
    : `${BASE_URL}/sendungen`;

  return fetchJson(url);
}

export async function getSendungenSorted(sortBy, order = "asc") {
  const allowedSortFields = [
  "lieferdatum",
  "erfassungsdatum",
  "gewichtKg",
  "status",
  "prioritaet",
  "startStrasse",
  "startPlz",
  "startOrt",
  "startLand",
  "zielStrasse",
  "zielPlz",
  "zielOrt",
  "startHausnummer",
  "zielHausnummer",
  "zielLand"
];

  if (!allowedSortFields.includes(sortBy)) {
    throw new Error(`Ungueltiges Sortierfeld: ${sortBy}`);
  }

  const allowedOrders = ["asc", "desc"];
  if (!allowedOrders.includes(order)) {
    throw new Error(`Ungueltige Sortierreihenfolge: ${order}`);
  }

  return fetchJson(`${BASE_URL}/sendungen?_sort=${sortBy}&_order=${order}`);
}

export async function getSendungenAdvanced(options = {}) {
  const params = new URLSearchParams();

  addParam(params, "status", options.status);
  addParam(params, "prioritaet", options.prioritaet);

  if (options.kundenId) {
    params.append("kundenId", String(options.kundenId));
  }

  addParam(params, "startStrasse", options.startStrasse);
  addParam(params, "startHausnummer", options.startHausnummer);
  addParam(params, "startPlz", options.startPlz);
  addParam(params, "startOrt", options.startOrt);
  addParam(params, "startLand", options.startLand);

  addParam(params, "zielStrasse", options.zielStrasse);
  addParam(params, "zielHausnummer", options.zielHausnummer);
  addParam(params, "zielPlz", options.zielPlz);
  addParam(params, "zielOrt", options.zielOrt);
  addParam(params, "zielLand", options.zielLand);

  const allowedSortFields = [
    "lieferdatum",
    "erfassungsdatum",
    "gewichtKg",
    "status",
    "prioritaet",
    "startStrasse",
    "startPlz",
    "startOrt",
    "startLand",
    "zielStrasse",
    "zielPlz",
    "zielOrt",
    "startHausnummer",
    "zielHausnummer",
    "zielLand"
  ];

  if (options.sortBy) {
    if (!allowedSortFields.includes(options.sortBy)) {
      throw new Error(`Ungueltiges Sortierfeld: ${options.sortBy}`);
    }

    params.append("_sort", options.sortBy);
  }

  const allowedOrders = ["asc", "desc"];
  if (options.order) {
    if (!allowedOrders.includes(options.order)) {
      throw new Error(`Ungueltige Sortierreihenfolge: ${options.order}`);
    }

    params.append("_order", options.order);
  }

  const query = params.toString();
  const url = query ? `${BASE_URL}/sendungen?${query}` : `${BASE_URL}/sendungen`;

  return fetchJson(url);
}