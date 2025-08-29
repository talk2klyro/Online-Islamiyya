import { ensureDatabase, listStudents, addStudent } from "./_notion.js";

export default async function handler(req, res) {
  try {
    const dbId = await ensureDatabase();

    if (req.method === "GET") {
      const students = await listStudents(dbId);
      res.status(200).json(students);
    } else if (req.method === "POST") {
      const body = req.body || {};
      const student = await addStudent(dbId, body);
      res.status(200).json(student);
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
