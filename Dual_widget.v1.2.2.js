/*! Midwest Property Management — Dual Tour Widgets (Demo-parity)
 *  File: Dual_widget.js
 *  Version: 1.2.2 (2025-10-16) — Demo-parity + click-capture + fuzzy-host match
 *  Purpose: Render the exact same UX as the working Village demo across all properties
 *  Labels: Guided → “Book a Showing”; Self-guided → “Self-Guided Viewing”
 */
(function(){"use strict";
  var d=document,w=window;

  // ---------- Host → URLs mapping (9 properties) ----------
  var MAP={
    "ascotarms.prospectportal.com":{
      guided:"https://www.myshowing.com/Midwest_Property_Management/Ascot_Arms_(Empire_Park)/scheduletourwidget/a0F0H00000d3i9sUAA/",
      self:"https://prop.peek.us/659c209ccdaa2af31fe90c5e/self-guided-tour/"
    },
    "empirepark.prospectportal.com":{
      guided:"https://www.myshowing.com/Midwest_Property_Management/Empire_Park_(Empire_Park)/scheduletourwidget/a0F0H00000d3iA6UAI/",
      self:"https://prop.peek.us/659c20d06dc4272dc1c6fe18/self-guided-tour/"
    },
    "thevillageatsouthgate.prospectportal.com":{
      guided:"https://www.myshowing.com/Midwest_Property_Management/The_Village_at_Southgate_(Southgate)/scheduletourwidget/a0F0H00000d3iAPUAY/",
      self:"https://prop.peek.us/66350d32f4dbddfd2b1863d7/self-guided-tour/"
    },
    "rivervalleytownhomes.prospectportal.com":{
      guided:"https://www.myshowing.com/Midwest_Property_Management/Rivervalley_Townhomes_(Gold_Bar)/scheduletourwidget/a0F0H00000d3iAKUAY/",
      self:"https://prop.peek.us/66350d825cb18b6935f276b2/self-guided-tour/"
    },
    "sirjohnfranklin.prospectportal.com":{
      guided:"https://www.myshowing.com/Midwest_Property_Management/Sir_John_Franklin_(Old_Strathcona)/scheduletourwidget/a0F0H00000d3iAMUAY/",
      self:"https://prop.peek.us/66350e28f4dbddfd2b19646a/self-guided-tour/"
    },
    "pleasantviewtownhomes.prospectportal.com":{
      guided:"https://www.myshowing.com/Midwest_Property_Management/Pleasantview_Townhomes_(Empire_Park)/scheduletourwidget/a0F0H00000d3iAIUAY/",
      self:"https://prop.peek.us/668c75b7bbe11732e731384f/self-guided-tour/"
    },
    "elmwoodtownhomes.prospectportal.com":{
      guided:"https://www.myshowing.com/Midwest_Property_Management/Elmwood_Townhomes_(Elmwood)/scheduletourwidget/a0F0H00000d3iA5UAI/",
      self:"https://prop.peek.us/668c766ffa52e0189568d9a9/self-guided-tour/"
    },
    "cricketcourt.prospectportal.com":{
      guided:"https://www.myshowing.com/Midwest_Property_Management/Cricket_Court_Townhomes_(Aldergrove)/scheduletourwidget/a0F0H00000d3iA1UAI/",
      self:"https://prop.peek.us/668c76b1edee275669b4508d/self-guided-tour/"
    },
    "cambriancourt.prospectportal.com":{
      guided:"https://www.myshowing.com/Midwest_Property_Management/Cambrian_Court_(Cambrian_Heights)/scheduletourwidget/a0F0H00000d3i9vUAA/",
      self:"https://prop.peek.us/66aaaa33f7d05462a7f4be8e/self-guided-tour/"
    }
  };

  // ---------- Demo-parity CSS (scoped) ----------
  function injectCSS(){
    if(d.getElementById('mwm-demo-style')) return;
    var s=d.createElement('style'); s.id='mwm-demo-style';
    s.textContent = "body{font-family:Poppins,system-ui,Segoe UI,Roboto,Arial,sans-serif}"+
    ".mwm-float{position:fixed;right:20px;background:linear-gradient(135deg,#eaaa00,#d4940a);color:#fff;padding:14px 18px;border-radius:50px;box-shadow:0 4px 12px rgba(0,0,0,.15);cursor:pointer;z-index:2147483000;display:flex;align-items:center;gap:8px;animation:mwmPulse 2s infinite;pointer-events:auto}"+
    ".mwm-float:hover{filter:brightness(1.1)}"+
    "@keyframes mwmPulse{0%{box-shadow:0 0 0 0 rgba(234,170,0,.6)}70%{box-shadow:0 0 0 12px rgba(234,170,0,0)}100%{box-shadow:0 0 0 0 rgba(234,170,0,0)}}"+
    ".mwm-modal{position:fixed;bottom:20px;right:20px;background:#fff;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.2);width:360px;max-height:80vh;overflow:hidden;display:none;flex-direction:column;z-index:2147483001;animation:mwmSlideIn .4s ease}"+
    "@keyframes mwmSlideIn{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}"+
    ".mwm-head{background:linear-gradient(135deg,#eaaa00,#d4940a);color:#fff;padding:12px;font-weight:600;text-align:center;position:relative}"+
    ".mwm-close{position:absolute;top:8px;right:12px;background:none;border:0;color:#fff;font-size:24px;cursor:pointer;line-height:1}"+
    ".mwm-copy{padding:12px;text-align:center;font-size:14px;color:#333}"+
    ".mwm-iframe{border:0;width:100%;height:380px}";
    d.head.appendChild(s);
  }

  // ---------- Elements ----------
  function el(tag, cls, html){ var e=d.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; }

  function svgPerson(){return '<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" width=\"20\" height=\"20\"><path fill=\"currentColor\" d=\"M12 12c2.67 0 8 1.34 8 4v3H4v-3c0-2.66 5.33-4 8-4zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z\"/></svg>';}
  function svgLock(){return '<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" width=\"20\" height=\"20\"><path fill=\"currentColor\" d=\"M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-6V9a6 6 0 1 0-12 0v2H5v10h14V11h-1zm-8 0V9a4 4 0 1 1 8 0v2h-8z\"/></svg>';}

  // ---------- Build UI like the demo ----------
  function build(guidedURL,selfURL){
    injectCSS();

    var openSelf = el('div','mwm-float', svgLock()+" Self-Guided Viewing");
    openSelf.id='openSelfGuided'; openSelf.style.bottom='80px'; openSelf.setAttribute('role','button'); openSelf.setAttribute('tabindex','0');

    var openGuided = el('div','mwm-float', svgPerson()+" Book a Showing");
    openGuided.id='openGuided'; openGuided.style.bottom='140px'; openGuided.setAttribute('role','button'); openGuided.setAttribute('tabindex','0');

    // Self-guided modal
    var sg = el('div','mwm-modal'); sg.id='mwm-self';
    var sgHead = el('div','mwm-head','Schedule Your Self-Guided Tour'); var sgX=el('button','mwm-close','×'); sgHead.appendChild(sgX);
    var sgCopy = el('div','mwm-copy','<div>Tour on your schedule, even after hours.</div><div>Step 1: Choose Date 📅</div><div>Step 2: Confirm ✨</div>');
    var sgIfr = el('iframe','mwm-iframe'); sgIfr.src=selfURL; sg.appendChild(sgHead); sg.appendChild(sgCopy); sg.appendChild(sgIfr);

    // Guided modal
    var gd = el('div','mwm-modal'); gd.id='mwm-guided';
    var gdHead = el('div','mwm-head','Schedule Your Guided Tour'); var gdX=el('button','mwm-close','×'); gdHead.appendChild(gdX);
    var gdCopy = el('div','mwm-copy','<div>Meet our leasing team for a personalized tour.</div><div>Step 1: Choose Date 📅</div><div>Step 2: Confirm ✨</div>');
    var gdIfr = el('iframe','mwm-iframe'); gdIfr.src=guidedURL; gd.appendChild(gdHead); gd.appendChild(gdCopy); gd.appendChild(gdIfr);

    // Append
    d.body.appendChild(openSelf); d.body.appendChild(openGuided); d.body.appendChild(sg); d.body.appendChild(gd);

    function closeAll(){ sg.style.display='none'; gd.style.display='none'; }

    function open(modal){ closeAll(); modal.style.display='flex'; }

    // Click + keyboard support (use capture + multiple events, and stopImmediatePropagation)
    function bindOpen(el, modal){
      function handler(e){ e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation) e.stopImmediatePropagation(); open(modal); }
      ['pointerdown','click','touchstart','touchend'].forEach(function(evt){ el.addEventListener(evt, handler, {capture:true, passive:false}); });
      el.onclick = handler; // inline backup
      el.addEventListener('keydown', function(e){ if(e.key==='Enter' || e.key===' '){ handler(e); } }, {capture:true});
      el.style.pointerEvents='auto';
    }
    bindOpen(openSelf, sg);
    bindOpen(openGuided, gd);

    sgX.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); sg.style.display='none'; }, {capture:true});
    gdX.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); gd.style.display='none'; }, {capture:true});
    d.addEventListener('keydown', function(e){ if(e.key==='Escape') closeAll(); }); open(gd);} });
    sgX.addEventListener('click', function(){ sg.style.display='none'; });
    gdX.addEventListener('click', function(){ gd.style.display='none'; });
    d.addEventListener('keydown', function(e){ if(e.key==='Escape') closeAll(); });
    d.addEventListener('click', function(e){ [sg,gd].forEach(function(m){ if(m.style.display==='flex' && !m.contains(e.target) && e.target!==openSelf && e.target!==openGuided){ m.style.display='none'; } }); });
  }

  // ---------- Init ----------
  function pickMap(host){
    // Exact match first
    if(MAP[host]) return MAP[host];
    // Fuzzy contains match on host
    var k, key, best=null;
    for(k in MAP){ key = k.replace(/[-_.]/g,''); if(host.replace(/[-_.]/g,'').indexOf(key)>=0){ best = MAP[k]; break; } }
    // Try title-based hint
    if(!best){
      var t=(d.title||'').toLowerCase();
      for(k in MAP){ if(t.indexOf(k.split('.')[0])>=0){ best = MAP[k]; break; } }
    }
    return best||null;
  }

  function init(){
    var host=(location.hostname||'').toLowerCase();
    var cfg=pickMap(host);
    var ctn=d.querySelector('#mwm-tour-widget');
    var guided = (ctn && ctn.getAttribute('data-guided')) || (cfg && cfg.guided);
    var self   = (ctn && ctn.getAttribute('data-selfguided')) || (cfg && cfg.self);
    if(!guided && !self){ console.warn('[MWM] No URLs found for this host:', host); return; }
    build(guided||'about:blank', self||'about:blank');
  }

  if(d.readyState==='loading') d.addEventListener('DOMContentLoaded', init); else init();
})();
