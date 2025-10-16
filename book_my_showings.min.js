(function(){
  /* ============================================================
     MIDWEST PROPERTY MANAGEMENT — SCHEDULE BUTTON INJECTOR
     - Finds “View Details” buttons on Entrata floorplan pages
     - Only adds “Schedule a Showing” when availability is present
     - Auto-selects the correct MyShowing link per property/site
     - Supports manual override via window.MPM_COMMUNITY or ?mpm_community=
     ============================================================ */

  /* === COMMUNITY → MYSHOWING LINKS (FINAL) === */
  var LINKS = {
    ascotarms:        "https://www.myshowing.com/Midwest_Property_Management/Ascot_Arms_(Empire_Park)/scheduletourwidget/a0F0H00000d3i9sUAA/",
    pleasantview:     "https://www.myshowing.com/Midwest_Property_Management/Pleasantview_Townhomes_(Empire_Park)/scheduletourwidget/a0F0H00000d3iAIUAY/",
    rivervalley:      "https://www.myshowing.com/Midwest_Property_Management/Rivervalley_Townhomes_(Gold_Bar)/scheduletourwidget/a0F0H00000d3iAKUAY/",
    sirjohnfranklin:  "https://www.myshowing.com/Midwest_Property_Management/Sir_John_Franklin_(Old_Strathcona)/scheduletourwidget/a0F0H00000d3iAMUAY/",
    villageatsouthgate:"https://www.myshowing.com/Midwest_Property_Management/The_Village_at_Southgate_(Southgate)/scheduletourwidget/a0F0H00000d3iAPUAY/",
    empirepark:       "https://www.myshowing.com/Midwest_Property_Management/Empire_Park_(Empire_Park)/scheduletourwidget/a0F0H00000d3iA6UAI/",
    cambriancourt:    "https://www.myshowing.com/Midwest_Property_Management/Cambrian_Court_(Cambrian_Heights)/scheduletourwidget/a0F0H00000d3i9vUAA/",
    elmwood:          "https://www.myshowing.com/Midwest_Property_Management/Elmwood_Townhomes_(Elmwood)/scheduletourwidget/a0F0H00000d3iA5UAI/",
    cricketcourt:     "https://www.myshowing.com/Midwest_Property_Management/Cricket_Court_Townhomes_(Aldergrove)/scheduletourwidget/a0F0H00000d3iA1UAI/"
  };

  /* === EXACT HOSTNAME → COMMUNITY TOKEN (add custom domains if any) === */
  var HOST_TO_TOKEN = {
    "ascotarms.prospectportal.com":           "ascotarms",
    "pleasantviewtownhomes.prospectportal.com":"pleasantview",
    "rivervalleytownhomes.prospectportal.com":"rivervalley",
    "sirjohnfranklin.prospectportal.com":     "sirjohnfranklin",
    "thevillageatsouthgate.prospectportal.com":"villageatsouthgate",
    "empirepark.prospectportal.com":          "empirepark",
    "cambriancourt.prospectportal.com":       "cambriancourt",
    "elmwoodtownhomes.prospectportal.com":    "elmwood",
    "cricketcourt.prospectportal.com":        "cricketcourt"
    // Example custom domains:
    // "ascotarms.ca": "ascotarms",
    // "pleasantviewtownhomes.ca": "pleasantview",
  };

  /* === DETECTION (robust + overrides) === */
  var HOST = (location.hostname || "").toLowerCase().replace(/^www\./,"");

  // tokens we’ll search for in host/title/meta if exact host isn’t mapped
  var TOKEN_HINTS = [
    "ascot","pleasantview","river","rivervalley","sir john","sirjohn","franklin",
    "village at southgate","southgate","empire park","empirepark",
    "cambrian","cambriancourt","elmwood","cricket"
  ];

  function qs(name){
    var m = (location.search || "").match(new RegExp("[?&]"+name+"=([^&]+)"));
    return m ? decodeURIComponent(m[1].replace(/\+/g," ")) : "";
  }

  function haystack(){
    var t = (document.title || "") + " ";
    var og = document.querySelector('meta[property="og:site_name"]');
    if (og && og.content) t += og.content + " ";
    t += HOST.replace(/\./g," ");
    return t.toLowerCase();
  }

  function detectCommunity(){
    // 1) Manual override (global or query param)
    var override = (window.MPM_COMMUNITY || qs("mpm_community") || "")
                   .toLowerCase().replace(/\s+/g,"");
    if (override && LINKS[override]) return override;

    // 2) Exact hostname map
    if (HOST_TO_TOKEN[HOST]) return HOST_TO_TOKEN[HOST];

    // 3) Heuristic search in title/meta/host
    var h = haystack();
    for (var i=0;i<TOKEN_HINTS.length;i++){
      var tok = TOKEN_HINTS[i].replace(/\s+/g,"");
      if (h.indexOf(tok) !== -1){
        if (/ascot/.test(tok)) return "ascotarms";
        if (/pleasantview/.test(tok)) return "pleasantview";
        if (/river|rivervalley/.test(tok)) return "rivervalley";
        if (/sirjohn|franklin/.test(tok)) return "sirjohnfranklin";
        if (/southgate|village/.test(tok)) return "villageatsouthgate";
        if (/empire/.test(tok)) return "empirepark";
        if (/cambrian/.test(tok)) return "cambriancourt";
        if (/elmwood/.test(tok)) return "elmwood";
        if (/cricket/.test(tok)) return "cricketcourt";
      }
    }

    // 4) Fallback
    return "ascotarms";
  }

  var COMMUNITY  = detectCommunity();
  var BUTTON_URL = LINKS[COMMUNITY] || LINKS.ascotarms;

  /* === BUTTON INJECTION LOGIC ===
     - Anchor: “View Details”
     - Only when availability terms appear on the card
  */
  var BUTTON_TEXT = "Schedule a Showing";
  var OPEN_IN_NEW  = true;

  // availability signals to search for on the floorplan card
  var AVAILABILITY_WORDS =
    /\b(unit|units)\b|\bunit\s*available\b|\bavailable\s*now\b|\bnow\s*leasing\b|\bapply\s*now\b/i;

  // lightweight styling (kept tiny)
  var css = ".mpm-schedule-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 14px;margin-top:6px;border-radius:999px;border:0;background:linear-gradient(135deg,#eaaa00,#d4940a);color:#fff;font-weight:600;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,.15);text-decoration:none;cursor:pointer}.mpm-schedule-btn:hover{filter:brightness(1.05)}";
  var style = document.createElement("style");
  style.type = "text/css";
  style.appendChild(document.createTextNode(css));
  (document.head || document.documentElement).appendChild(style);

  function buildBtn(){
    var a = document.createElement("a");
    a.className = "mpm-schedule-btn";
    a.href = BUTTON_URL;
    if (OPEN_IN_NEW){ a.target = "_blank"; a.rel = "noopener"; }
    a.appendChild(document.createTextNode(BUTTON_TEXT));
    return a;
  }

  // Climb up to find the floorplan card wrapper near the “View Details” anchor
  function getFloorplanContainer(el){
    var cur = el;
    for (var i=0;i<6;i++){
      if (!cur) break;
      if (/floorplan|layout|unit/i.test(cur.className)) return cur;
      cur = cur.parentNode;
    }
    return el.parentNode || el;
  }

  function hasAvailability(container){
    if (!container) return false;
    var t = (container.innerText || "").toLowerCase();
    return AVAILABILITY_WORDS.test(t);
  }

  function injectButtons(){
    var nodes = document.querySelectorAll("a, button");
    for (var i=0;i<nodes.length;i++){
      var el  = nodes[i];
      var txt = (el.textContent || "").trim().toLowerCase();

      if (/view\s*details/.test(txt) && !el.__mpmTagged){
        var card = getFloorplanContainer(el);

        if (hasAvailability(card)){
          var btn = buildBtn();

          // Reuse Entrata’s button classes if present for a perfect visual match
          if (/\bbtn\b|\bbutton\b|\bprimary\b|\bcta\b/i.test(el.className)){
            btn.className = el.className + " mpm-schedule-btn";
          }

          if (el.parentNode) el.parentNode.insertBefore(btn, el.nextSibling);
        }

        el.__mpmTagged = true; // mark processed
      }
    }
  }

  // Debounce helper
  function debounce(fn, wait){
    var t; return function(){ clearTimeout(t); t = setTimeout(fn, wait); };
  }
  var run = debounce(injectButtons, 150);

  // Initial + on load
  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", run);
    window.addEventListener("load", run);
  } else {
    run();
  }

  // Respond to Entrata’s dynamic content loads (filters, pagination, SPA nav)
  new MutationObserver(run).observe(document.documentElement, { childList:true, subtree:true });

  // Optional debug:
  // console.log("[MPM] Community:", COMMUNITY, "→", BUTTON_URL, "| Host:", HOST);
})();
