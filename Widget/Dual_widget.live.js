/*! Dual_widget.live.js — Minimal, click-guaranteed buttons (no modals)
 *  Start: The Village at Southgate only. Add more hosts later.
 *  Version: 0.0.1 (2025-10-16)
 */
(function () {
  "use strict";
  var d = document;

  // Map hostnames -> URLs (for now, Village only)
  var MAP = {
    "thevillageatsouthgate.prospectportal.com": {
      guided: "https://www.myshowing.com/Midwest_Property_Management/The_Village_at_Southgate_(Southgate)/scheduletourwidget/a0F0H00000d3iAPUAY/",
      self:   "https://prop.peek.us/66350d32f4dbddfd2b1863d7/self-guided-tour/"
    }
  };

  var host = (location.hostname || "").toLowerCase();
  var cfg = MAP[host];
  if (!cfg) return; // not this site (safe no-op)

  // Styles (scoped) — matches your phase-2 working look
  if (!d.getElementById("mwm-lite-style")) {
    var css = d.createElement("style");
    css.id = "mwm-lite-style";
    css.textContent =
      ".mwm-float{position:fixed;right:20px;background:linear-gradient(135deg,#eaaa00,#d4940a);color:#fff;padding:14px 18px;border-radius:50px;box-shadow:0 4px 12px rgba(0,0,0,.15);font:600 14px/1.1 Poppins,system-ui,Segoe UI,Roboto,Arial,sans-serif;z-index:2147483000;text-decoration:none;display:inline-flex;gap:8px}" +
      ".mwm-float:hover{filter:brightness(1.1)}";
    d.head.appendChild(css);
  }

  // Build plain anchor buttons (guaranteed to click)
  function a(href, text, bottom) {
    var el = d.createElement("a");
    el.className = "mwm-float";
    el.href = href;
    el.target = "_blank";
    el.rel = "noopener";
    el.textContent = text;
    el.style.bottom = bottom;
    return el;
  }

  var btnGuided = a(cfg.guided, "Book a Showing", "140px");
  var btnSelf   = a(cfg.self,   "Self-Guided Viewing", "80px");

  d.addEventListener("DOMContentLoaded", function () {
    d.body.appendChild(btnGuided);
    d.body.appendChild(btnSelf);
  });
})();
