const SENDUNG_STATUS = ["offen", "zugewiesen", "wartet", "unterwegs", "geliefert"];
const PRIORITAETEN = ["niedrig", "normal", "hoch"];
const LIEFERUNG_TYPEN = ["Paket", "Palette"];

export function validateSendung(sendung, options = {}) {
  const { requireId = true } = options;
  const errors = [];

  if (requireId && !sendung.id) errors.push("id fehlt");
  if (!sendung.kundenId) errors.push("kundenId fehlt");
  if (!sendung.startadresse) errors.push("startadresse fehlt");
  if (!sendung.zieladresse) errors.push("zieladresse fehlt");
  if (!sendung.erfassungsdatum) errors.push("erfassungsdatum fehlt");
  if (!sendung.lieferdatum) errors.push("lieferdatum fehlt");
  if (!sendung.status) errors.push("status fehlt");
  if (!sendung.prioritaet) errors.push("prioritaet fehlt");
  if (!sendung.lieferungTyp) errors.push("lieferungTyp fehlt");

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

  return {
    valid: errors.length === 0,
    errors,
  };
}