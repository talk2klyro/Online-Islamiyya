async function getStudents() {
  const res = await fetch(`${window.CLIENT_CONFIG.apiBaseUrl}/students`);
  if (!res.ok) throw new Error("Failed to load students");
  return res.json();
}

async function addStudent({ sn, name, phone }) {
  const res = await fetch(`${window.CLIENT_CONFIG.apiBaseUrl}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sn, name, phone })
  });
  if (!res.ok) throw new Error("Failed to add student");
  return res.json();
}

async function updateAttendance({ pageId, week, present }) {
  const res = await fetch(`${window.CLIENT_CONFIG.apiBaseUrl}/attendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pageId, week, present })
  });
  if (!res.ok) throw new Error("Failed to update attendance");
  return res.json();
}

function toCSV(rows) {
  const header = ["S/N","Name","Phone",...Array.from({length:12},(_,i)=>`Week${i+1}`)];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push([
      r.SN ?? "", r.Name ?? "", r.Phone ?? "",
      ...Array.from({length:12},(_,i)=> (r[`Week${i+1}`] ? 1 : 0))
    ].join(","));
  }
  return lines.join("\n");
}
