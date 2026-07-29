(function () {
  const REQUESTS_KEY = "dac_client_requests_google_demo_v1";
  const MAX_FILES = 3;
  const MAX_FILE_BYTES = 2 * 1024 * 1024;
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

  function createProjectId() {
    const year = String(new Date().getFullYear()).slice(-2);
    const random = Math.floor(100000 + Math.random() * 900000);
    return `PRJ-${year}-${random}`;
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result || "");
        resolve(result.includes(",") ? result.split(",")[1] : result);
      };
      reader.onerror = () => reject(new Error(`Unable to read ${file.name}.`));
      reader.readAsDataURL(file);
    });
  }

  async function prepareFiles(fileList) {
    const files = Array.from(fileList || []);
    if (files.length > MAX_FILES) throw new Error(`Maximum ${MAX_FILES} files are allowed.`);

    const allowed = new Set([
      "image/png", "image/jpeg", "image/webp", "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/zip", "application/x-zip-compressed"
    ]);

    const prepared = [];
    for (const file of files) {
      if (file.size > MAX_FILE_BYTES) throw new Error(`${file.name} is larger than 2 MB.`);
      if (file.type && !allowed.has(file.type)) throw new Error(`${file.name} is not an allowed file type.`);
      prepared.push({
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        base64: await fileToBase64(file)
      });
    }
    return prepared;
  }

  async function proxyPost(action, payload, adminKey = "") {
    const response = await fetch(PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "post",
        webAppUrl,
        action,
        payload,
        adminKey
      })
    });

    const data = await response.json().catch(() => ({
      success: false,
      error: "Invalid response from website backend."
    }));

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Unable to save request to Google Sheet.");
    }
    return data;
  }

  async function createRequest(payload, fileList) {
    const id = createProjectId();
    const createdAt = new Date().toISOString();
    const files = await prepareFiles(fileList);

    const request = {
      ...payload,
      id,
      files,
      status: "New Request",
      adminNote: "",
      finalPrice: "",
      advancePaid: "",
      dueAmount: "",
      createdAt,
      updatedAt: createdAt
    };

    if (liveMode) {
      await proxyPost("create", request);
    } else {
      const items = readLocalRequests();
      items.unshift({
        ...request,
        files: files.map(file => ({
          name: file.name, type: file.type, size: file.size, url: "", demoOnly: true
        }))
      });
      writeLocalRequests(items);
      await delay(200);
    }
    return request;
  }

  window.DataService = {
    init,
    createRequest,
    get liveMode() { return liveMode; }
  };
})();
