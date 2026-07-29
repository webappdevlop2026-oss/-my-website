/**
 * Vercel same-origin proxy for Google Apps Script.
 * This avoids browser cross-domain / redirect problems.
 */
module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed." });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const webAppUrl = String(body.webAppUrl || "").trim();
    const mode = String(body.mode || "").toLowerCase();

    if (!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec(?:\?.*)?$/i.test(webAppUrl)) {
      return res.status(400).json({ success: false, error: "Invalid Google Apps Script URL." });
    }

    if (mode === "get") {
      const target = new URL(webAppUrl);
      target.searchParams.set("route", String(body.route || ""));
      target.searchParams.set("adminKey", String(body.adminKey || ""));
      target.searchParams.set("callback", "vercelProxyCallback");
      target.searchParams.set("_", String(Date.now()));

      const response = await fetch(target.toString(), {
        method: "GET",
        redirect: "follow",
        headers: { "User-Agent": "Digital-Agency-Portal/1.0" }
      });

      const text = await response.text();
      if (!response.ok) {
        throw new Error(`Google backend returned HTTP ${response.status}.`);
      }

      const match = text.match(/^\s*vercelProxyCallback\(([\s\S]*)\);?\s*$/);
      if (!match) {
        throw new Error("Unexpected response from Google backend.");
      }

      const data = JSON.parse(match[1]);
      return res.status(200).json(data);
    }

    if (mode === "post") {
      const form = new URLSearchParams();
      form.set("action", String(body.action || ""));
      form.set("payload", JSON.stringify(body.payload || {}));
      form.set("adminKey", String(body.adminKey || ""));

      const response = await fetch(webAppUrl, {
        method: "POST",
        redirect: "follow",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "User-Agent": "Digital-Agency-Portal/1.0"
        },
        body: form.toString()
      });

      const text = await response.text();
      if (!response.ok) {
        throw new Error(`Google backend returned HTTP ${response.status}.`);
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Unexpected response from Google backend.");
      }

      return res.status(200).json(data);
    }

    return res.status(400).json({ success: false, error: "Invalid proxy mode." });
  } catch (error) {
    console.error("Google Sheet proxy error:", error);
    return res.status(502).json({
      success: false,
      error: error && error.message ? error.message : "Unable to reach Google Sheet backend."
    });
  }
};
