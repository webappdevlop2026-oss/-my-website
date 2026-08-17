(function () {
  const form = document.getElementById("projectForm");
  const steps = [...document.querySelectorAll(".form-section")];
  const stepDots = [...document.querySelectorAll("[data-step-dot]")];
  const backBtn = document.getElementById("backBtn");
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");
  const attachments = document.getElementById("attachments");
  const fileList = document.getElementById("fileList");
  const successPanel = document.getElementById("successPanel");
  const formCard = document.getElementById("formCard");
  const toastWrap = document.getElementById("toastWrap");
  let currentStep = 1;
  let currentRequestId = "";

  document.querySelectorAll("[data-agency-name]").forEach(el => {
    el.textContent = window.APP_CONFIG?.agencyName || "Digital Agency";
  });
  document.querySelectorAll("[data-agency-tagline]").forEach(el => {
    el.textContent = window.APP_CONFIG?.agencyTagline || "";
  });
  document.title = `${window.APP_CONFIG?.agencyName || "Digital Agency"} — Project Requirement`;

  function toast(message, type = "") {
    const item = document.createElement("div");
    item.className = `toast ${type}`;
    item.textContent = message;
    toastWrap.appendChild(item);
    setTimeout(() => item.remove(), 3600);
  }

  function checkedValues(name) {
    return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(el => el.value);
  }

  function renderStep() {
    steps.forEach(section => {
      section.classList.toggle("active", Number(section.dataset.step) === currentStep);
    });
    stepDots.forEach(dot => {
      const num = Number(dot.dataset.stepDot);
      dot.classList.toggle("active", num === currentStep);
      dot.classList.toggle("done", num < currentStep);
    });

    backBtn.disabled = currentStep === 1;
    nextBtn.classList.toggle("hidden", currentStep === steps.length);
    submitBtn.classList.toggle("hidden", currentStep !== steps.length);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function validateCurrentStep() {
    const section = steps[currentStep - 1];
    const requiredFields = [...section.querySelectorAll("[required]")];

    for (const field of requiredFields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        field.focus();
        return false;
      }
    }

    const requiredGroups = [...section.querySelectorAll("[data-required-group]")];
    for (const group of requiredGroups) {
      const name = group.dataset.requiredGroup;
      if (!group.querySelector(`input[name="${name}"]:checked`)) {
        toast("Please select at least one project type.", "error");
        group.scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
      }
    }
    return true;
  }

  function renderFiles() {
    const files = [...attachments.files];
    fileList.innerHTML = "";

    if (files.length > 3) {
      attachments.value = "";
      toast("You can upload a maximum of 3 files.", "error");
      return;
    }

    for (const file of files) {
      if (file.size > 2 * 1024 * 1024) {
        attachments.value = "";
        fileList.innerHTML = "";
        toast(`${file.name} is larger than 2 MB.`, "error");
        return;
      }

      const row = document.createElement("div");
      row.className = "file-item";
      row.innerHTML = `<span>${escapeHtml(file.name)}</span><strong>${formatBytes(file.size)}</strong>`;
      fileList.appendChild(row);
    }
  }

  function formatBytes(bytes) {
    if (!bytes) return "0 KB";
    const units = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${units[i]}`;
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[char]);
  }

  function collectPayload() {
    const data = new FormData(form);
    return {
      clientName: String(data.get("clientName") || "").trim(),
      company: String(data.get("company") || "").trim(),
      mobile: String(data.get("mobile") || "").trim(),
      whatsapp: String(data.get("whatsapp") || data.get("mobile") || "").trim(),
      email: String(data.get("email") || "").trim(),
      city: String(data.get("city") || "").trim(),
      preferredContact: String(data.get("preferredContact") || "WhatsApp"),
      projectTypes: checkedValues("projectTypes"),
      projectName: String(data.get("projectName") || "").trim(),
      platforms: checkedValues("platforms"),
      description: String(data.get("description") || "").trim(),
      features: checkedValues("features"),
      languages: checkedValues("languages"),
      referenceLinks: String(data.get("referenceLinks") || "").trim(),
      budget: String(data.get("budget") || "").trim(),
      timeline: String(data.get("timeline") || "").trim(),
      additionalNotes: String(data.get("additionalNotes") || "").trim(),
      consent: Boolean(data.get("consent")),
      source: "Project Requirement Portal",
      userAgent: navigator.userAgent
    };
  }

  async function submitForm(event) {
    event.preventDefault();
    if (!validateCurrentStep()) return;

    submitBtn.disabled = true;
    submitBtn.querySelector("span").textContent = "Submitting...";

    try {
      const request = await DataService.createRequest(collectPayload(), attachments.files);
      currentRequestId = request.id;
      form.classList.add("hidden");
      formCard.querySelector(".form-card-head").classList.add("hidden");
      successPanel.classList.remove("hidden");
      document.getElementById("successRequestId").textContent = request.id;
      toast("Project requirement submitted successfully.", "success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);
      toast(error.message || "Unable to submit. Please try again.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector("span").textContent = "Submit Requirement";
    }
  }

  nextBtn.addEventListener("click", () => {
    if (!validateCurrentStep()) return;
    currentStep += 1;
    renderStep();
  });

  backBtn.addEventListener("click", () => {
    currentStep = Math.max(1, currentStep - 1);
    renderStep();
  });

  attachments.addEventListener("change", renderFiles);
  form.addEventListener("submit", submitForm);

  document.getElementById("copyRequestId").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(currentRequestId);
      toast("Request ID copied.", "success");
    } catch {
      toast("Please copy the Request ID manually.", "error");
    }
  });

  document.getElementById("newRequestBtn").addEventListener("click", () => {
    form.reset();
    attachments.value = "";
    fileList.innerHTML = "";
    currentStep = 1;
    currentRequestId = "";
    successPanel.classList.add("hidden");
    formCard.querySelector(".form-card-head").classList.remove("hidden");
    form.classList.remove("hidden");
    renderStep();
  });

  document.getElementById("mobileHelpBtn").addEventListener("click", () => {
    const phone = window.APP_CONFIG?.supportPhone;
    const whatsapp = window.APP_CONFIG?.supportWhatsApp;
    const email = window.APP_CONFIG?.supportEmail;
    const details = [phone && `Phone: ${phone}`, whatsapp && `WhatsApp: ${whatsapp}`, email && `Email: ${email}`].filter(Boolean);
    toast(details.length ? details.join(" • ") : "Fill the form and submit. We will contact you.", "");
  });

  DataService.init()
    .then(({ liveMode }) => {
      if (!liveMode) {
        console.info("Client portal running in demo mode.");
      }
    })
    .catch(error => {
      console.error(error);
      toast(error.message, "error");
    });
})();
