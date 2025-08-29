document.adocument.addEventListener("DOMContentLoaded", async () => {
  // Branding
  if (document.getElementById("school-name"))
    document.getElementById("school-name").textContent = window.CLIENT_CONFIG.name;
  if (document.getElementById("motto"))
    document.getElementById("motto").textContent = window.CLIENT_CONFIG.motto;
  if (document.getElementById("school-logo") && window.CLIENT_CONFIG.theme.logo) {
    document.getElementById("school-logo").src = window.CLIENT_CONFIG.theme.logo;
  }

  // Navbar highlight
  const nav = document.getElementById("navbar");
  if (nav) {
    nav.querySelectorAll("a").forEach(link => {
      if (link.href === window.location.href) link.classList.add("active");
    });
  }

  // Student List (index.html)
  if (document.getElementById("student-table")) {
    const el = document.getElementById("student-table");
    try {
      el.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";
      const students = await getStudents();
      if (!students.length) {
        el.innerHTML = "<tr><td colspan='3'>No students found</td></tr>";
      } else {
        el.innerHTML = students.map(s => `
          <tr>
            <td>${s.SN || ""}</td>
            <td>${s.Name}</td>
            <td>${s.Phone}</td>
          </tr>
        `).join("");
      }
    } catch (err) {
      el.innerHTML = `<tr><td colspan='3' style="color:red;">Error: ${err.message}</td></tr>`;
    }
  }

  // Add Student (add-student.html)
  if (document.getElementById("add-student-form")) {
    const form = document.getElementById("add-student-form");
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const sn = document.getElementById("sn").value;
      const name = document.getElementById("name").value;
      const phone = document.getElementById("phone").value;
      const status = document.getElementById("form-status");
      try {
        status.textContent = "Saving...";
        await addStudent({ sn, name, phone });
        status.textContent = "✅ Student added!";
        form.reset();
      } catch (err) {
        status.textContent = "❌ " + err.message;
      }
    });
  }

  // Attendance (attendance.html)
  if (document.getElementById("attendance-table")) {
    const table = document.getElementById("attendance-table");
    try {
      table.innerHTML = "<tr><td colspan='15'>Loading...</td></tr>";
      const students = await getStudents();
      table.innerHTML = students.map(s => `
        <tr>
          <td>${s.SN || ""}</td>
          <td>${s.Name}</td>
          <td>${s.Phone}</td>
          ${Array.from({length:12},(_,i)=>`
            <td>
              <input type="checkbox" ${s[`Week${i+1}`] ? "checked":""}
                onchange="toggleAttendance('${s.pageId}',${i+1},this.checked)">
            </td>
          `).join("")}
        </tr>
      `).join("");
    } catch (err) {
      table.innerHTML = `<tr><td colspan='15' style="color:red;">Error: ${err.message}</td></tr>`;
    }
  }

  // Export (export.html)
  if (document.getElementById("export-csv")) {
    document.getElementById("export-csv").addEventListener("click", async () => {
      const students = await getStudents();
      const csv = toCSV(students);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${window.CLIENT_CONFIG.name.replace(/\s+/g,"_")}_attendance.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }
  if (document.getElementById("export-preview")) {
    document.getElementById("export-preview").addEventListener("click", async () => {
      const students = await getStudents();
      const csv = toCSV(students);
      document.getElementById("export-preview-text").textContent = csv;
      document.getElementById("export-preview-area").style.display = "block";
    });
  }
});

// global fn
async function toggleAttendance(pageId, week, present) {
  try { await updateAttendance({ pageId, week, present }); }
  catch (err) { alert("Update failed: " + err.message); }
}
