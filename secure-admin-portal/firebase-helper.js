(function () {
  const REQUESTS_KEY = "dac_client_requests_google_demo_v1";
  const SESSION_KEY = "dac_google_admin_session_v1";
  const PROXY_URL = "/api/google-sheet";

  let liveMode = false;
  let webAppUrl = "";

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  function validWebAppUrl(value) {
    return /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec(?:\?.*)?$/i.test(String(value || "").trim());
  }

  function readLocalRequests() {
    try {
      return JSON.parse(localStorage.getItem(REQUESTS_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function writeLocalRequests(items) {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(items));
  }

  function makeDemoData() {
    if (readLocalRequests().length) return;
    const now = new Date();
    writeLocalRequests([{
      id: "PRJ-" + String(now.getFullYear()).slice(-2) + "-1001",
      createdAt: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
      status: "New Request",
      clientName: "Demo Client",
      mobile: "9876543210",
      whatsapp: "9876543210",
      email: "client@example.com",
      company: "Demo Business",
      city: "Dumka",
      projectTypes: ["Android App", "Admin Panel"],
      projectName: "Local Service App",
      description: "A mobile-first app where customers can book services.",
      features: ["Login / OTP", "Booking System", "Notifications"],
      platforms: ["Android", "Web Admin"],
      languages: ["English", "Hindi", "Bengali"],
      referenceLinks: "",
      budget: "₹30,000 – ₹50,000",
      timeline: "1–2 months",
      preferredContact: "WhatsApp",
      files: [],
      consent: true,
      adminNote: "",
      finalPrice: "",
      advancePaid: "",
      dueAmount: ""
    }]);
  }

  async function init() {
    webAppUrl = String(window.APP_CONFIG?.googleSheets?.webAppUrl || "").trim();
    liveMode = validWebAppUrl(webAppUrl);
    if (!liveMode) makeDemoData();
    return { liveMode };
  }

  function getSession() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
    } catch {
      return null;
    }
  }

  function setSession(session) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  async function callProxy(payload) {
    const response = await fetch(PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ webAppUrl, ...payload })
    });

    const data = await response.json().catch(() => ({
      success: false,
      error: "Invalid response from website backend."
    }));

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Unable to connect to Google Sheet backend.");
    }
    return data;
  }

  async function login(email, password) {
    if (!liveMode) {
      const demo = window.APP_CONFIG?.demoAdmin || {};
      if (email === demo.email && password === demo.password) {
        const session = { email, adminKey: password, demo: true, loggedAt: new Date().toISOString() };
        setSession(session);
        return session;
      }
      throw new Error("Incorrect demo email or password.");
    }

    const allowedEmail = String(window.APP_CONFIG?.adminEmail || "").trim().toLowerCase();
    if (allowedEmail && allowedEmail !== "your_admin_email@gmail.com" && email.toLowerCase() !== allowedEmail) {
      throw new Error("This email is not allowed.");
    }

    await callProxy({
      mode: "get",
      route: "ping",
      adminKey: password
    });

    const session = { email, adminKey: password, demo: false, loggedAt: new Date().toISOString() };
    setSession(session);
    return session;
  }

  async function logout() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  async function getCurrentUser() {
    return getSession();
  }

  async function getRequests() {
    if (!liveMode) {
      await delay(120);
      return readLocalRequests().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const session = getSession();
    if (!session?.adminKey) throw new Error("Please sign in again.");

    const result = await callProxy({
      mode: "get",
      route: "list",
      adminKey: session.adminKey
    });

    return Array.isArray(result.requests) ? result.requests : [];
  }

  async function updateRequest(id, patch) {
    if (!liveMode) {
      const items = readLocalRequests();
      const index = items.findIndex(item => item.id === id);
      if (index < 0) throw new Error("Request not found.");
      items[index] = { ...items[index], ...patch, updatedAt: new Date().toISOString() };
      writeLocalRequests(items);
      return items[index];
    }

    const session = getSession();
    if (!session?.adminKey) throw new Error("Please sign in again.");

    await callProxy({
      mode: "post",
      action: "update",
      payload: { id, patch },
      adminKey: session.adminKey
    });

    return { id, ...patch };
  }

  async function deleteRequest(id) {
    if (!liveMode) {
      writeLocalRequests(readLocalRequests().filter(item => item.id !== id));
      return;
    }

    const session = getSession();
    if (!session?.adminKey) throw new Error("Please sign in again.");

    await callProxy({
      mode: "post",
      action: "delete",
      payload: { id },
      adminKey: session.adminKey
    });
  }

  window.DataService = {
    init,
    login,
    logout,
    getCurrentUser,
    getRequests,
    updateRequest,
    deleteRequest,
    get liveMode() { return liveMode; }
  };
})();
