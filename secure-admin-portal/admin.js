(function () {
  const STATUS_OPTIONS = [
    "New Request",
    "Contacted",
    "Requirement Confirmed",
    "Quotation Sent",
    "Advance Pending",
    "Advance Paid",
    "Development Started",
    "Testing",
    "Completed",
    "Rejected"
  ];

  const loginOverlay = document.getElementById("loginOverlay");
  const loginForm = document.getElementById("loginForm");
  const loginBtn = document.getElementById("loginBtn");
  const requestTableBody = document.getElementById("requestTableBody");
  const mobileRequestList = document.getElementById("mobileRequestList");
  const emptyState = document.getElementById("emptyState");
  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const typeFilter = document.getElementById("typeFilter");
  const detailBackdrop = document.getElementById("detailBackdrop");
  const detailBody = document.getElementById("detailBody");
  const toastWrap = document.getElementById("toastWrap");

  let requests = [];
  let activeRequest = null;

  document.querySelectorAll("[data-agency-name]").forEach(el => {
    el.textContent = window.APP_CONFIG?.agencyName || "Digital Agency";
  });
  document.title = `${window.APP_CONFIG?.agencyName || "Digital Agency"} — Admin Panel`;

  document.getElementById("todayLabel").textContent = new Intl.DateTimeFormat("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  }).format(new Date());

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[char]);
  }

  function toast(message, type = "") {
    const item = document.createElement("div");
    item.className = `toast ${type}`;
    item.textContent = message;
    toastWrap.appendChild(item);
    setTimeout(() => item.remove(), 3400);
  }

  function statusClass(status) {
    const map = {
      "New Request": "badge-new",
      "Contacted": "badge-contacted",
      "Requirement Confirmed": "badge-confirmed",
      "Quotation Sent": "badge-quotation",
      "Advance Pending": "badge-pending",
      "Advance Paid": "badge-paid",
      "Development Started": "badge-started",
      "Testing": "badge-testing",
      "Completed": "badge-completed",
      "Rejected": "badge-rejected"
    };
    return map[status] || "badge-new";
  }

  function formatDate(value, withTime = false) {
    if (!value) return "—";
    const options = withTime
      ? { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }
      : { day: "2-digit", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-IN", options).format(new Date(value));
  }

  function moneyOrDash(value) {
    return value ? escapeHtml(value) : "—";
  }

  function currentFilteredRequests() {
    const query = searchInput.value.trim().toLowerCase();
    const status = statusFilter.value;
    const type = typeFilter.value;

    return requests.filter(item => {
      const haystack = [
        item.id, item.clientName, item.mobile, item.whatsapp, item.email,
        item.projectName, item.company, item.description, ...(item.projectTypes || [])
      ].join(" ").toLowerCase();

      const matchesQuery = !query || haystack.includes(query);
      const matchesStatus = !status || item.status === status;
      const matchesType = !type || (item.projectTypes || []).includes(type);
      return matchesQuery && matchesStatus && matchesType;
    });
  }

  function renderStats() {
    document.getElementById("totalCount").textContent = requests.length;
    document.getElementById("newCount").textContent = requests.filter(r => r.status === "New Request").length;
    document.getElementById("activeCount").textContent = requests.filter(r => ["Development Started", "Testing"].includes(r.status)).length;
    document.getElementById("completedCount").textContent = requests.filter(r => r.status === "Completed").length;
  }

  function renderRequests() {
    const filtered = currentFilteredRequests();
    requestTableBody.innerHTML = "";
    mobileRequestList.innerHTML = "";
    emptyState.classList.toggle("hidden", filtered.length > 0);

    for (const item of filtered) {
      const projectTypes = (item.projectTypes || []).join(", ") || "Not specified";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${escapeHtml(item.id)}</strong></td>
        <td class="client-cell">
          <strong>${escapeHtml(item.clientName)}</strong>
          <small>${escapeHtml(item.mobile)}${item.city ? ` • ${escapeHtml(item.city)}` : ""}</small>
        </td>
        <td class="project-cell">
          <strong>${escapeHtml(item.projectName || projectTypes)}</strong>
          <small>${escapeHtml(projectTypes)}</small>
        </td>
        <td>${moneyOrDash(item.budget)}</td>
        <td><span class="badge ${statusClass(item.status)}">${escapeHtml(item.status)}</span></td>
        <td>${formatDate(item.createdAt)}</td>
        <td>
          <div class="row-actions">
            <button class="btn btn-icon btn-soft" data-view-id="${escapeHtml(item.id)}" title="View">
              <svg class="icon"><use href="#icon-eye"></use></svg>
            </button>
            <a class="btn btn-icon btn-secondary" href="tel:${escapeHtml(item.mobile)}" title="Call">
              <svg class="icon"><use href="#icon-phone"></use></svg>
            </a>
          </div>
        </td>
      `;
      requestTableBody.appendChild(tr);

      const card = document.createElement("article");
      card.className = "request-card";
      card.innerHTML = `
        <div class="request-card-top">
          <div>
            <h3>${escapeHtml(item.clientName)}</h3>
            <p>${escapeHtml(item.projectName || projectTypes)}<br>${escapeHtml(item.id)}</p>
          </div>
          <span class="badge ${statusClass(item.status)}">${escapeHtml(item.status)}</span>
        </div>
        <div class="request-card-meta">
          <span>Mobile<strong>${escapeHtml(item.mobile)}</strong></span>
          <span>Budget<strong>${moneyOrDash(item.budget)}</strong></span>
          <span>Received<strong>${formatDate(item.createdAt)}</strong></span>
          <span>Type<strong>${escapeHtml(projectTypes)}</strong></span>
        </div>
        <div class="request-card-actions">
          <button class="btn btn-soft" data-view-id="${escapeHtml(item.id)}">
            <svg class="icon"><use href="#icon-eye"></use></svg>
            View Details
          </button>
          <a class="btn btn-secondary" href="tel:${escapeHtml(item.mobile)}">
            <svg class="icon"><use href="#icon-phone"></use></svg>
            Call
          </a>
        </div>
      `;
      mobileRequestList.appendChild(card);
    }

    document.querySelectorAll("[data-view-id]").forEach(btn => {
      btn.addEventListener("click", () => openDetails(btn.dataset.viewId));
    });
  }

  function infoItem(label, value) {
    return `<div class="info-item"><small>${escapeHtml(label)}</small><span>${value || "—"}</span></div>`;
  }

  function chips(values) {
    if (!values?.length) return "—";
    return values.map(value => `<span class="badge badge-new">${escapeHtml(value)}</span>`).join(" ");
  }

  function contactButtons(item) {
    const whatsapp = String(item.whatsapp || item.mobile || "").replace(/\D/g, "");
    return `
      <div class="contact-row">
        <a class="btn btn-secondary" href="tel:${escapeHtml(item.mobile)}">Call</a>
        ${whatsapp ? `<a class="btn btn-soft" target="_blank" href="https://wa.me/91${escapeHtml(whatsapp.replace(/^91/, ""))}?text=${encodeURIComponent(`Hello ${item.clientName}, regarding project request ${item.id}.`)}">WhatsApp</a>` : ""}
        ${item.email ? `<a class="btn btn-secondary" href="mailto:${escapeHtml(item.email)}?subject=${encodeURIComponent(`Project Request ${item.id}`)}">Email</a>` : ""}
      </div>
    `;
  }

  function openDetails(id) {
    activeRequest = requests.find(item => item.id === id);
    if (!activeRequest) return;

    document.getElementById("detailTitle").textContent = activeRequest.clientName || "Request Details";
    document.getElementById("detailId").textContent = `${activeRequest.id} • Received ${formatDate(activeRequest.createdAt, true)}`;

    const files = (activeRequest.files || []).length
      ? activeRequest.files.map(file => file.url
          ? `<a class="btn btn-secondary" target="_blank" href="${escapeHtml(file.url)}">${escapeHtml(file.name)}</a>`
          : `<span class="badge badge-new">${escapeHtml(file.name)} (demo)</span>`
        ).join(" ")
      : "No files uploaded";

    const statusOptions = STATUS_OPTIONS.map(status =>
      `<option ${status === activeRequest.status ? "selected" : ""}>${escapeHtml(status)}</option>`
    ).join("");

    detailBody.innerHTML = `
      <div class="detail-grid">
        <div>
          <section class="detail-section">
            <h4>Client Information</h4>
            <div class="info-grid">
              ${infoItem("Full name", escapeHtml(activeRequest.clientName))}
              ${infoItem("Business", escapeHtml(activeRequest.company))}
              ${infoItem("Mobile", escapeHtml(activeRequest.mobile))}
              ${infoItem("WhatsApp", escapeHtml(activeRequest.whatsapp))}
              ${infoItem("Email", escapeHtml(activeRequest.email))}
              ${infoItem("City", escapeHtml(activeRequest.city))}
              ${infoItem("Preferred contact", escapeHtml(activeRequest.preferredContact))}
              ${infoItem("Request source", escapeHtml(activeRequest.source))}
            </div>
            <div style="margin-top:14px">${contactButtons(activeRequest)}</div>
          </section>

          <section class="detail-section">
            <h4>Project Requirement</h4>
            <div class="info-grid">
              ${infoItem("Project name", escapeHtml(activeRequest.projectName))}
              ${infoItem("Timeline", escapeHtml(activeRequest.timeline))}
              ${infoItem("Budget", escapeHtml(activeRequest.budget))}
              ${infoItem("Platforms", chips(activeRequest.platforms))}
              ${infoItem("Project types", chips(activeRequest.projectTypes))}
              ${infoItem("Languages", chips(activeRequest.languages))}
            </div>
            <div class="info-item" style="margin-top:14px">
              <small>Description</small>
              <span>${escapeHtml(activeRequest.description).replace(/\n/g, "<br>") || "—"}</span>
            </div>
            <div class="info-item" style="margin-top:14px">
              <small>Features</small>
              <span>${chips(activeRequest.features)}</span>
            </div>
            <div class="info-item" style="margin-top:14px">
              <small>Reference links</small>
              <span>${linkify(activeRequest.referenceLinks)}</span>
            </div>
            <div class="info-item" style="margin-top:14px">
              <small>Additional notes</small>
              <span>${escapeHtml(activeRequest.additionalNotes).replace(/\n/g, "<br>") || "—"}</span>
            </div>
            <div class="info-item" style="margin-top:14px">
              <small>Uploaded files</small>
              <span style="display:flex;gap:8px;flex-wrap:wrap">${files}</span>
            </div>
          </section>
        </div>

        <aside>
          <section class="detail-section">
            <h4>Project Management</h4>
            <div class="admin-edit-grid">
              <div class="field">
                <label for="editStatus">Status</label>
                <select id="editStatus">${statusOptions}</select>
              </div>
              <div class="field">
                <label for="editFinalPrice">Final price</label>
                <input id="editFinalPrice" placeholder="e.g. ₹45,000" value="${escapeHtml(activeRequest.finalPrice)}">
              </div>
              <div class="field">
                <label for="editAdvance">Advance paid</label>
                <input id="editAdvance" placeholder="e.g. ₹10,000" value="${escapeHtml(activeRequest.advancePaid)}">
              </div>
              <div class="field">
                <label for="editDue">Due amount</label>
                <input id="editDue" placeholder="e.g. ₹35,000" value="${escapeHtml(activeRequest.dueAmount)}">
              </div>
              <div class="field">
                <label for="editNote">Private admin note</label>
                <textarea id="editNote" placeholder="Only visible in admin panel">${escapeHtml(activeRequest.adminNote)}</textarea>
              </div>
            </div>
          </section>

          <section class="detail-section">
            <h4>Danger Zone</h4>
            <p class="helper">Deleting a request cannot be undone.</p>
            <button class="btn btn-danger" id="deleteRequestBtn">
              <svg class="icon"><use href="#icon-trash"></use></svg>
              Delete Request
            </button>
          </section>
        </aside>
      </div>
    `;

    detailBackdrop.classList.add("open");
    document.body.style.overflow = "hidden";

    document.getElementById("deleteRequestBtn").addEventListener("click", deleteActiveRequest);
  }

  function linkify(value) {
    if (!value) return "—";
    return escapeHtml(value).replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" target="_blank" style="color:var(--primary);text-decoration:underline">$1</a>'
    ).replace(/\n/g, "<br>");
  }

  function closeDetails() {
    detailBackdrop.classList.remove("open");
    document.body.style.overflow = "";
    activeRequest = null;
  }

  async function saveActiveRequest() {
    if (!activeRequest) return;
    const patch = {
      status: document.getElementById("editStatus").value,
      finalPrice: document.getElementById("editFinalPrice").value.trim(),
      advancePaid: document.getElementById("editAdvance").value.trim(),
      dueAmount: document.getElementById("editDue").value.trim(),
      adminNote: document.getElementById("editNote").value.trim()
    };

    try {
      await DataService.updateRequest(activeRequest.id, patch);
      toast("Request updated successfully.", "success");
      closeDetails();
      await loadRequests();
    } catch (error) {
      toast(error.message || "Unable to update request.", "error");
    }
  }

  async function deleteActiveRequest() {
    if (!activeRequest) return;
    const confirmed = confirm(`Delete request ${activeRequest.id}? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await DataService.deleteRequest(activeRequest.id);
      toast("Request deleted.", "success");
      closeDetails();
      await loadRequests();
    } catch (error) {
      toast(error.message || "Unable to delete request.", "error");
    }
  }

  async function loadRequests() {
    setLoading(true);
    try {
      requests = await DataService.getRequests();
      renderStats();
      renderRequests();
    } catch (error) {
      toast(error.message || "Unable to load requests.", "error");
    } finally {
      setLoading(false);
    }
  }

  function setLoading(isLoading) {
    document.getElementById("refreshBtn").disabled = isLoading;
    document.getElementById("mobileRefreshBtn").disabled = isLoading;
  }

  function exportCsv() {
    const rows = currentFilteredRequests();
    if (!rows.length) {
      toast("No requests to export.", "error");
      return;
    }

    const headers = [
      "Request ID", "Created At", "Client Name", "Business", "Mobile", "WhatsApp", "Email",
      "City", "Project Name", "Project Types", "Platforms", "Features", "Languages",
      "Budget", "Timeline", "Status", "Final Price", "Advance Paid", "Due Amount", "Admin Note"
    ];

    const data = rows.map(item => [
      item.id, item.createdAt, item.clientName, item.company, item.mobile, item.whatsapp, item.email,
      item.city, item.projectName, (item.projectTypes || []).join(" | "), (item.platforms || []).join(" | "),
      (item.features || []).join(" | "), (item.languages || []).join(" | "), item.budget, item.timeline,
      item.status, item.finalPrice, item.advancePaid, item.dueAmount, item.adminNote
    ]);

    const csv = [headers, ...data]
      .map(row => row.map(value => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `client-requests-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function logout() {
    await DataService.logout();
    loginOverlay.classList.remove("hidden");
    document.getElementById("adminPassword").value = "";
  }

  loginForm.addEventListener("submit", async event => {
    event.preventDefault();
    loginBtn.disabled = true;
    loginBtn.textContent = "Signing in...";

    try {
      const email = document.getElementById("adminEmail").value.trim();
      const password = document.getElementById("adminPassword").value;
      const user = await DataService.login(email, password);
      document.getElementById("profileEmail").textContent = user.email;
      loginOverlay.classList.add("hidden");
      await loadRequests();
    } catch (error) {
      toast(error.message || "Login failed.", "error");
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = "Sign In";
    }
  });

  [searchInput, statusFilter, typeFilter].forEach(el => {
    el.addEventListener(el.tagName === "INPUT" ? "input" : "change", renderRequests);
  });

  document.getElementById("refreshBtn").addEventListener("click", loadRequests);
  document.getElementById("mobileRefreshBtn").addEventListener("click", loadRequests);
  document.getElementById("exportBtn").addEventListener("click", exportCsv);
  document.getElementById("closeDetailBtn").addEventListener("click", closeDetails);
  document.getElementById("saveDetailBtn").addEventListener("click", saveActiveRequest);
  document.getElementById("printBtn").addEventListener("click", () => window.print());
  document.getElementById("desktopLogoutBtn").addEventListener("click", logout);
  document.getElementById("mobileLogoutBtn").addEventListener("click", logout);

  detailBackdrop.addEventListener("click", event => {
    if (event.target === detailBackdrop) closeDetails();
  });

  document.querySelectorAll("[data-mobile-nav]").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-mobile-nav]").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      document.getElementById(button.dataset.mobileNav).scrollIntoView({ behavior: "smooth" });
    });
  });

  async function boot() {
    try {
      const { liveMode } = await DataService.init();
      const modeNote = document.getElementById("modeNote");
      const demoCredential = document.getElementById("demoCredential");

      if (liveMode) {
        modeNote.textContent = "Live mode: Client requests are connected to Google Sheet and uploaded files are saved in Google Drive.";
        demoCredential.classList.add("hidden");
      } else {
        modeNote.textContent = "Demo mode: Data is stored only in this browser. Connect the Google Apps Script URL before giving the form to real clients.";
        document.getElementById("demoEmail").textContent = window.APP_CONFIG.demoAdmin.email;
        document.getElementById("demoPassword").textContent = window.APP_CONFIG.demoAdmin.password;
        document.getElementById("adminEmail").value = window.APP_CONFIG.demoAdmin.email;
      }

      const user = await DataService.getCurrentUser();
      if (user) {
        document.getElementById("profileEmail").textContent = user.email;
        loginOverlay.classList.add("hidden");
        await loadRequests();
      }
    } catch (error) {
      toast(error.message, "error");
    }
  }

  boot();
})();
