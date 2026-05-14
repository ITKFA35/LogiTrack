import express from "express";
import cors from "cors";
import pool from "./db.js";
import { validateSendung, validateStatusChange } from "../src/services/validation.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("LogiTrack API läuft");
});

app.get("/api/fahrer", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM fahrer");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ fehler: error.message });
  }
});

app.get("/api/kunden", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM kunden");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ fehler: error.message });
  }
});

app.get("/api/fahrzeuge", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM fahrzeuge");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ fehler: error.message });
  }
});

app.get("/api/sendungen", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM sendungen");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ fehler: error.message });
  }
});

app.post("/api/sendungen", async (req, res) => {
  try {
    const data = req.body;

    data.status = data.status || "offen";
    const validation = validateSendung(data, {
      requireId: false,
      isCreate: true,
    });

    if (!validation.valid) {
      return res.status(400).json({
        fehler: "Validierungsfehler",
        details: validation.errors
      });
    }

    const sql = `
      INSERT INTO sendungen (
        kundenId, fahrerId, fahrzeugId,
        startStrasse, startHausnummer, startPlz, startOrt, startLand,
        zielStrasse, zielHausnummer, zielPlz, zielOrt, zielLand,
        erfassungsdatum, lieferdatum, status, prioritaet, lieferungTyp,
        gewichtKg, benachrichtigung, bemerkungen
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.kundenId,
      data.fahrerId,
      data.fahrzeugId,
      data.startStrasse,
      data.startHausnummer,
      data.startPlz,
      data.startOrt,
      data.startLand || "CH",
      data.zielStrasse,
      data.zielHausnummer,
      data.zielPlz,
      data.zielOrt,
      data.zielLand || "CH",
      data.erfassungsdatum,
      data.lieferdatum,
      data.status,
      data.prioritaet,
      data.lieferungTyp,
      data.gewichtKg,
      data.benachrichtigung ? 1 : 0,
      data.bemerkungen || ""
    ];

    const [result] = await pool.query(sql, values);

    res.status(201).json({
      id: result.insertId,
      ...data
    });
  } catch (error) {
    res.status(500).json({ fehler: error.message });
  }
});

app.get("/api/sendungen/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM sendungen WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ fehler: "Nicht gefunden" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ fehler: error.message });
  }
});

app.put("/api/sendungen/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const validation = validateSendung(
      { ...data, id },
      { requireId: true }
    );

    if (!validation.valid) {
      return res.status(400).json({
        fehler: "Validierungsfehler",
        details: validation.errors
      });
    }

    const [result] = await pool.query(
      `UPDATE sendungen SET
      kundenId=?,
      fahrerId=?,
      fahrzeugId=?,
      startStrasse=?,
      startHausnummer=?,
      startPlz=?,
      startOrt=?,
      startLand=?,
      zielStrasse=?,
      zielHausnummer=?,
      zielPlz=?,
      zielOrt=?,
      zielLand=?,
      erfassungsdatum=?,
      lieferdatum=?,
      status=?,
      prioritaet=?,
      lieferungTyp=?,
      gewichtKg=?,
      benachrichtigung=?,
      bemerkungen=?
      WHERE id=?`,
      [
        data.kundenId,
        data.fahrerId,
        data.fahrzeugId,
        data.startStrasse,
        data.startHausnummer,
        data.startPlz,
        data.startOrt,
        data.startLand,
        data.zielStrasse,
        data.zielHausnummer,
        data.zielPlz,
        data.zielOrt,
        data.zielLand,
        data.erfassungsdatum,
        data.lieferdatum,
        data.status,
        data.prioritaet,
        data.lieferungTyp,
        data.gewichtKg,
        data.benachrichtigung,
        data.bemerkungen,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        fehler: "Nicht gefunden"
      });
    }

    res.json({ message: "Aktualisiert" });
  } catch (error) {
    res.status(500).json({ fehler: error.message });
  }
});

app.delete("/api/sendungen/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM sendungen WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ fehler: "Nicht gefunden" });
    }

    res.json({ message: "Geloescht" });
  } catch (error) {
    res.status(500).json({ fehler: error.message });
  }
});

app.patch("/api/sendungen/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM sendungen WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ fehler: "Nicht gefunden" });
    }

    const oldStatus = rows[0].status;

    const validation = validateStatusChange(oldStatus, status);

    if (!validation.valid) {
      return res.status(400).json({
        fehler: "Ungueltiger Statuswechsel",
        details: validation.error
      });
    }

    await pool.query(
      "UPDATE sendungen SET status=? WHERE id=?",
      [status, id]
    );

    res.json({ message: "Status geaendert" });
  } catch (error) {
    res.status(500).json({ fehler: error.message });
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});