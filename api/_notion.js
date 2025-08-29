const NOTION_API = "https://apli.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

function getEnv() {
  const token = process.env.NOTION_TOKEN;
  const parentPageId = process.env.PARENT_PAGE_ID;
  const dbTitle = process.env.DB_TITLE || "School Register";
  if (!token) throw new Error("Missing NOTION_TOKEN");
  if (!parentPageId) throw new Error("Missing PARENT_PAGE_ID");
  return { token, parentPageId, dbTitle };
}

function headers(token) {
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
    "Notion-Version": NOTION_VERSION
  };
}

function dbPropertiesDefinition() {
  const weeks = {};
  for (let i = 1; i <= 12; i++) weeks[`Week${i}`] = { checkbox: {} };
  return {
    "Name": { "title": {} },
    "S/N": { "number": {} },
    "Phone": { "rich_text": {} },
    ...weeks
  };
}

function parseStudentFromPage(page) {
  function getTitle(prop) {
    return (prop?.title || []).map(x => x.plain_text || x.text?.content || "").join("").trim();
  }
  function getText(prop) {
    return (prop?.rich_text || []).map(x => x.plain_text || x.text?.content || "").join("").trim();
  }
  function getNumber(prop) {
    return typeof prop?.number === "number" ? prop.number : null;
  }
  function getCheckbox(prop) {
    return !!prop?.checkbox;
  }

  const p = page.properties || {};
  const rec = {
    pageId: page.id,
    SN: getNumber(p["S/N"]),
    Name: getTitle(p["Name"]),
    Phone: getText(p["Phone"]),
  };
  for (let i = 1; i <= 12; i++) rec[`Week${i}`] = getCheckbox(p[`Week${i}`]);
  return rec;
}

async function ensureDatabase() {
  const { token, parentPageId, dbTitle } = getEnv();

  // Search for existing databases
  const searchRes = await fetch(`${NOTION_API}/search`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ filter: { property: "object", value: "database" } })
  });
  const data = await searchRes.json();
  if (!searchRes.ok) throw new Error(`Search failed: ${data.message || searchRes.statusText}`);

  const existing = (data.results || []).find(db => {
    const t = (db.title || []).map(x => x.plain_text).join("").trim().toLowerCase();
    return db.parent?.page_id?.replace(/-/g, "") === parentPageId.replace(/-/g, "") && t === dbTitle.toLowerCase();
  });

  if (existing) return existing.id;

  // Create database if not found
  const body = {
    parent: { page_id: parentPageId },
    title: [{ type: "text", text: { content: dbTitle } }],
    properties: dbPropertiesDefinition()
  };
  const res = await fetch(`${NOTION_API}/databases`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify(body)
  });
  const created = await res.json();
  if (!res.ok) throw new Error(`Create database failed: ${created.message || res.statusText}`);
  return created.id;
}

async function listStudents(databaseId) {
  const { token } = getEnv();
  const res = await fetch(`${NOTION_API}/databases/${databaseId}/query`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({})
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Query failed: ${data.message || res.statusText}`);
  return (data.results || []).map(parseStudentFromPage);
}

async function addStudent(databaseId, { sn, name, phone }) {
  const { token } = getEnv();
  const properties = {
    "Name": { title: [{ text: { content: name } }] },
    "Phone": { rich_text: [{ text: { content: phone || "" } }] },
    "S/N": { number: Number(sn) }
  };
  for (let i = 1; i <= 12; i++) properties[`Week${i}`] = { checkbox: false };

  const res = await fetch(`${NOTION_API}/pages`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ parent: { database_id: databaseId }, properties })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Add student failed: ${data.message || res.statusText}`);
  return parseStudentFromPage(data);
}

async function updateAttendance(databaseId, { pageId, week, present }) {
  const { token } = getEnv();
  if (!(week >= 1 && week <= 12)) throw new Error("week must be 1..12");
  const res = await fetch(`${NOTION_API}/pages/${pageId}`, {
    method: "PATCH",
    headers: headers(token),
    body: JSON.stringify({ properties: { [`Week${week}`]: { checkbox: !!present } } })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Update failed: ${data.message || res.statusText}`);
  return parseStudentFromPage(data);
}

function toCSV(rows) {
  const header = ["S/N", "Name", "Phone", ...Array.from({ length: 12 }, (_, i) => `Week${i+1}`)];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push([
      r.SN ?? "",
      r.Name ?? "",
      r.Phone ?? "",
      ...Array.from({ length: 12 }, (_, i) => (r[`Week${i+1}`] ? 1 : 0))
    ].join(","));
  }
  return lines.join("\n");
}

export { ensureDatabase, listStudents, addStudent, updateAttendance, toCSV };
