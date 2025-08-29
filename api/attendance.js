import { ensureDatabase, updateAttendance } from "./_notion.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const dbId = await ensureDatabase();
    const body = req.body || {};
    const updated = await updateAttendance(dbId, body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
