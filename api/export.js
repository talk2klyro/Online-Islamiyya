import { ensureDatabase, listStudents, toCSV } from "./_notion.js";

export default async function handler(req, res) {
  try {
    const dbId = await ensureDatabase();
    const students = await listStudents(dbId);
    const csv = toCSV(students);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=attendance.csv");
    res.status(200).send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
