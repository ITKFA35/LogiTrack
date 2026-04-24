const SENDUNG_STATUS = ["offen", "zugewiesen", "wartet", "unterwegs", "geliefert"];
const PRIORITAETEN = ["niedrig", "normal", "hoch"];
const LIEFERUNG_TYPEN = ["Paket", "Palette"];
const STATUS_FLOW = {
  offen: ["zugewiesen"],
  zugewiesen: ["unterwegs"],
  unterwegs: ["geliefert"],
  geliefert: []
};

function isValidPostalCode(plz, land) {
  const value = String(plz).trim().toUpperCase();
  const country = String(land).trim().toUpperCase();

  const patterns = {
    CH: /^\d{4}$/,
    DE: /^\d{5}$/,
    AT: /^\d{4}$/,
    FR: /^\d{5}$/,
    IT: /^\d{5}$/,
  };

  const pattern = patterns[country];

  // Wenn Land nicht definiert ist, keine Formatpruefung hier
  if (!pattern) {
    return true;
  }

  return pattern.test(value);
}

export function validateSendung(sendung, options = {}) {
  const { requireId = true } = options;
  const errors = [];

  if (requireId && !sendung.id) errors.push("id fehlt");
  if (!sendung.kundenId) errors.push("kundenId fehlt");
  if (!sendung.startStrasse || !sendung.startStrasse.trim()) errors.push("startStrasse fehlt");
  if (!sendung.startHausnummer || !sendung.startHausnummer.trim()) errors.push("startHausnummer fehlt");
  if (!sendung.startPlz || !sendung.startPlz.trim()) errors.push("startPlz fehlt");
  if (!sendung.startOrt || !sendung.startOrt.trim()) errors.push("startOrt fehlt");
  if (!sendung.startLand || !sendung.startLand.trim()) errors.push("startLand fehlt");
  if (!sendung.zielStrasse || !sendung.zielStrasse.trim()) errors.push("zielStrasse fehlt");
  if (!sendung.zielHausnummer || !sendung.zielHausnummer.trim()) errors.push("zielHausnummer fehlt");
  if (!sendung.zielPlz || !sendung.zielPlz.trim()) errors.push("zielPlz fehlt");
  if (!sendung.zielOrt || !sendung.zielOrt.trim()) errors.push("zielOrt fehlt");
  if (!sendung.zielLand || !sendung.zielLand.trim()) errors.push("zielLand fehlt");
  if (sendung.startLand && sendung.startLand.trim().length !== 2) {
    errors.push("startLand ungueltig");
  }
  if (sendung.zielLand && sendung.zielLand.trim().length !== 2) {
    errors.push("zielLand ungueltig");
  }
  if (!sendung.erfassungsdatum) errors.push("erfassungsdatum fehlt");
  if (!sendung.lieferdatum) errors.push("lieferdatum fehlt");
  if (!sendung.status || !sendung.status.trim()) errors.push("status fehlt");
  if (!sendung.prioritaet || !sendung.prioritaet.trim()) errors.push("prioritaet fehlt");
  if (!sendung.lieferungTyp || !sendung.lieferungTyp.trim()) errors.push("lieferungTyp fehlt");

  if (sendung.gewichtKg === undefined || sendung.gewichtKg === null) {
    errors.push("gewichtKg fehlt");
  } else if (typeof sendung.gewichtKg !== "number" || sendung.gewichtKg <= 0) {
    errors.push("gewichtKg muss eine positive Zahl sein");
  }

  if (sendung.status && !SENDUNG_STATUS.includes(sendung.status)) {
    errors.push(`ungueltiger status: ${sendung.status}`);
  }

  if (sendung.prioritaet && !PRIORITAETEN.includes(sendung.prioritaet)) {
    errors.push(`ungueltige prioritaet: ${sendung.prioritaet}`);
  }

  if (sendung.lieferungTyp && !LIEFERUNG_TYPEN.includes(sendung.lieferungTyp)) {
    errors.push(`ungueltiger lieferungTyp: ${sendung.lieferungTyp}`);
  }

  if (
    sendung.erfassungsdatum &&
    sendung.lieferdatum &&
    new Date(sendung.lieferdatum) < new Date(sendung.erfassungsdatum)
  ) {
    errors.push("lieferdatum darf nicht vor erfassungsdatum liegen");
  }

  if (sendung.startPlz && sendung.startLand && !isValidPostalCode(sendung.startPlz, sendung.startLand)) {
    errors.push("startPlz ungueltig");
  }

  if (sendung.zielPlz && sendung.zielLand && !isValidPostalCode(sendung.zielPlz, sendung.zielLand)) {
    errors.push("zielPlz ungueltig");
  }

  if (sendung.startHausnummer && sendung.startHausnummer.length > 10) {
    errors.push("startHausnummer zu lang");
  }

  if (sendung.zielHausnummer && sendung.zielHausnummer.length > 10) {
    errors.push("zielHausnummer zu lang");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateStatusChange(oldStatus, newStatus) {
  if (!STATUS_FLOW[oldStatus]) {
    return {
      valid: false,
      error: `Unbekannter Status: ${oldStatus}`
    };
  }

  if (!STATUS_FLOW[oldStatus].includes(newStatus)) {
    return {
      valid: false,
      error: `Ungueltiger Statuswechsel: ${oldStatus} -> ${newStatus}`
    };
  }

  return { valid: true };
}

