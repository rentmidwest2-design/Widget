/*! Village @ Southgate — Dual Tour Widget (hybrid)
 *  Self-Guided (Peek) in modal; Book a Showing (MyShowing) in new tab
 *  Version: 0.2.0 (2025-10-16)
 */
(function () {
  "use strict";
  var d = document, w = window;

  var GUIDED_URL = "https://www.myshowing.com/Midwest_Property_Management/The_Village_at_Southgate_(Southgate)/scheduletourwidget/a0F0H00000d3iAPUAY/";
  var SELF_URL   = "https://prop.peek.us/66350d32f4dbddfd2b1863d7/self-guided-tour/";

  // Optional override
  var ctn = d.querySelector("#mwm-tour-widget");
  if (ctn) {
    GUIDED_URL = ctn.getAttribute("data-guided") || GUIDED_URL;
    SELF_URL   = ctn.getAttribute("data-selfguided") || SELF_URL;
  }

  // Styles (scoped)
  if (!d.getElementById("vlg-style")) {
    var s = d.createElement("style");
    s.id = "vlg-style";
    s.textContent =
      "@keyframes vlgPulse{0%{box-shadow:0 0 0 0 rgba(234,170,0,.6)}70%{box-shadow:0 0 0 12px rgba(234,170,0,0)}100%{box-shadow:0 0 0 0 rgba(234,170,0,0)}}" +
      ".vlg-btn{position:fixed;right:20px;padding:14px 18px;border:0;border-radius:50px;background:linear-gradient(135deg,#eaaa00,#d4940a);color:#fff;box-shadow:0 4px 12px rgba(0,0,0,.15);font:600 14px/1.1 Poppins,system-ui,Segoe UI,Roboto,Arial,sans-serif;cursor:pointer;z-index:2147483000;display:inline-flex;align-items:center;gap:8px;animation:vlgPulse 2s infinite}" +
      ".vlg-btn:hover{filter:brightness(1.1)}" +
      ".vlg-modal{position:fixed;bottom:20px;right:20px;background:#fff;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.2);width:360px;max-height:80vh;overflow:hidden;display:none;flex-direction:column;z-index:2147483001;animation:vlgIn .4s ease}" +
      "@keyframes vlgIn{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}" +
      ".vlg-head{background:linear-gradient(135deg,#eaaa00,#d4940a);color:#fff;padding:12px;font-weight:600;text-align:center;position:relative}" +
      ".vlg-x{position:absolute;top:8px;right:12px;background:none;border:0;color:#fff;font-size:24px;cursor:pointer;line-height:1}" +
      ".vlg-copy{padding:12px;text-align:center;font-size:14px;color:#333}" +
      ".vlg-iframe{border:0;width:100%;height:380px}";
    d.head.appendChild(s);
  }

  // Helpers
  function el(tag, cls, html) { var e = d.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function svgPerson(){return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 12c2.67 0 8 1.34 8 4v3H4v-3c0-2.66 5.33-4 8-4zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>'; }
  function svgLock(){return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-6V9a6 6 0 1 0-12 0v2H5v10h14V11h-1zm-8 0V9a4 4 0 1 1 8 0v2h-8z"/></svg>'; }

  // Build UI
  var btnSelf = el("button", "vlg-btn", svgLock()+" Self-Guided Viewing");
  btnSelf.id = "openSelfGuided"; btnSelf.style.bottom = "80px"; btnSelf.setAttribute("aria-haspopup","dialog");

  var btnGuided = el("button", "vlg-btn", svgPerson()+" Book a Showing");
  btnGuided.id = "openGuided"; btnGuided.style.bottom = "140px"; btnGuided.setAttribute("aria-label","Open booking in new tab");

  var modal = el("div", "vlg-modal"); modal.id = "vlg-self";
  var head  = el("div", "vlg-head", "Schedule Your Self-Guided Tour");
  var xBtn  = el("button", "vlg-x", "×");
  head.appendChild(xBtn);
  var copy  = el("div", "vlg-copy", "<div>Tour on your schedule, even after hours.</div><div>Step 1: Choose Date 📅</div><div>Step 2: Confirm ✨</div>");
  var ifr   = el("iframe", "vlg-iframe"); ifr.src = SELF_URL;

  modal.appendChild(head); modal.appendChild(copy); modal.appendChild(ifr);

  d.body.appendChild(btnSelf);
  d.body.appendChild(btnGuided);
  d.body.appendChild(modal);

  // Wiring
  function show(m){ m.style.display = "flex"; }
  function hide(){ modal.style.display = "none"; }

  // Self-guided → modal (Peek typically allows embedding)
  ["pointerdown","click","touchend"].forEach(function(evt){
    btnSelf.addEventListener(evt, function(e){ e.preventDefault(); e.stopPropagation(); show(modal); }, {capture:true, passive:false});
  });

  // Guided → new tab (MyShowing usually blocks iframes)
  ["pointerdown","click","touchend"].forEach(function(evt){
    btnGuided.addEventListener(evt, function(e){ e.preventDefault(); e.stopPropagation(); w.open(GUIDED_URL, "_blank", "noopener"); }, {capture:true, passive:false});
  });

  xBtn.addEventListener("click", function(e){ e.preventDefault(); e.stopPropagation(); hide(); }, {capture:true});
  d.addEventListener("keydown", function(e){ if(e.key === "Escape") hide(); });
  d.addEventListener("click", function(e){
    if (modal.style.display === "flex" && !modal.contains(e.target) && e.target !== btnSelf) hide();
  });

})();
