/*! Midwest PM — The Village at Southgate: Simplified Dual Tour Widget
 *  File: village_widget.live.js
 *  Version: 0.1.0 (2025-10-16)
 *  Purpose: Minimal, self-contained script for one property to validate behavior
 *  Labels: Guided → “Book a Showing”; Self-guided → “Self-Guided Viewing”
 */
(function(){"use strict";
  var d=document,w=window;

  // ---- CONFIG (The Village at Southgate only) ----
  var GUIDED_URL = "https://www.myshowing.com/Midwest_Property_Management/The_Village_at_Southgate_(Southgate)/scheduletourwidget/a0F0H00000d3iAPUAY/";
  var SELF_URL   = "https://prop.peek.us/66350d32f4dbddfd2b1863d7/self-guided-tour/";

  // Optional per-page override/flags
  function readOverrides(){
    var ctn = d.querySelector('#mwm-tour-widget');
    return {
      guided: ctn && ctn.getAttribute('data-guided') || GUIDED_URL,
      self:   ctn && ctn.getAttribute('data-selfguided') || SELF_URL,
      forceNewTab: !!(ctn && (ctn.getAttribute('data-forcenewtab')==='1' || ctn.getAttribute('data-forcenewtab')==='true')),
      debug: /[?&]mwm_debug=1/.test((w.location&&w.location.search)||'')
    };
  }

  function log(){ if(state.debug && w.console){ try{ console.log.apply(console,arguments);}catch(_){} } }

  // ---- STYLES (scoped) ----
  function injectCSS(){
    if(d.getElementById('vlg-style')) return;
    var s=d.createElement('style'); s.id='vlg-style';
    s.textContent = "@keyframes vlgPulse{0%{box-shadow:0 0 0 0 rgba(234,170,0,.6)}70%{box-shadow:0 0 0 12px rgba(234,170,0,0)}100%{box-shadow:0 0 0 0 rgba(234,170,0,0)}}"+
    ".vlg-btn{position:fixed;right:20px;padding:14px 18px;border:0;border-radius:50px;background:linear-gradient(135deg,#eaaa00,#d4940a);color:#fff;box-shadow:0 4px 12px rgba(0,0,0,.15);font:600 14px/1.1 Poppins,system-ui,Segoe UI,Roboto,Arial,sans-serif;cursor:pointer;z-index:2147483000;display:inline-flex;align-items:center;gap:8px;animation:vlgPulse 2s infinite;pointer-events:auto;}")+ ".vlg-btn:hover{filter:brightness(1.1)}"+
    ".vlg-modal{position:fixed;bottom:20px;right:20px;background:#fff;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.2);width:360px;max-height:80vh;overflow:hidden;display:none;flex-direction:column;z-index:2147483001;animation:vlgSlideIn .4s ease}"+
    "@keyframes vlgSlideIn{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}"+
    ".vlg-head{background:linear-gradient(135deg,#eaaa00,#d4940a);color:#fff;padding:12px;font-weight:600;text-align:center;position:relative}"+
    ".vlg-close{position:absolute;top:8px;right:12px;background:none;border:0;color:#fff;font-size:24px;cursor:pointer;line-height:1}"+
    ".vlg-copy{padding:12px;text-align:center;font-size:14px;color:#333}"+
    ".vlg-iframe{border:0;width:100%;height:380px}";
    d.head.appendChild(s);
  }

  function el(tag, cls, html){ var e=d.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; }
  function svgPerson(){return '<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" width=\"20\" height=\"20\"><path fill=\"currentColor\" d=\"M12 12c2.67 0 8 1.34 8 4v3H4v-3c0-2.66 5.33-4 8-4zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z\"/></svg>';}
  function svgLock(){return '<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" width=\"20\" height=\"20\"><path fill=\"currentColor\" d=\"M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-6V9a6 6 0 1 0-12 0v2H5v10h14V11h-1zm-8 0V9a4 4 0 1 1 8 0v2h-8z\"/></svg>';}

  var state = readOverrides();

  function build(){
    injectCSS();

    var openSelf = el('button','vlg-btn', svgLock()+" Self-Guided Viewing");
    openSelf.id='openSelfGuided'; openSelf.style.bottom='80px'; openSelf.setAttribute('aria-haspopup','dialog');

    var openGuided = el('button','vlg-btn', svgPerson()+" Book a Showing");
    openGuided.id='openGuided'; openGuided.style.bottom='140px'; openGuided.setAttribute('aria-haspopup','dialog');

    // Self-guided modal
    var sg = el('div','vlg-modal'); sg.id='vlg-self';
    var sgHead = el('div','vlg-head','Schedule Your Self-Guided Tour'); var sgX=el('button','vlg-close','\u00D7'); sgHead.appendChild(sgX);
    var sgCopy = el('div','vlg-copy','<div>Tour on your schedule, even after hours.</div><div>Step 1: Choose Date 📅</div><div>Step 2: Confirm ✨</div>');
    var sgIfr = el('iframe','vlg-iframe');

    // Guided modal
    var gd = el('div','vlg-modal'); gd.id='vlg-guided';
    var gdHead = el('div','vlg-head','Schedule Your Guided Tour'); var gdX=el('button','vlg-close','\u00D7'); gdHead.appendChild(gdX);
    var gdCopy = el('div','vlg-copy','<div>Meet our leasing team for a personalized tour.</div><div>Step 1: Choose Date 📅</div><div>Step 2: Confirm ✨</div>');
    var gdIfr = el('iframe','vlg-iframe');

    sg.appendChild(sgHead); sg.appendChild(sgCopy); sg.appendChild(sgIfr);
    gd.appendChild(gdHead); gd.appendChild(gdCopy); gd.appendChild(gdIfr);

    d.body.appendChild(openSelf); d.body.appendChild(openGuided); d.body.appendChild(sg); d.body.appendChild(gd);

    function closeAll(){ sg.style.display='none'; gd.style.display='none'; }
    function show(modal){ closeAll(); modal.style.display='flex'; }

    function openWithFallback(modal, iframeEl, url){
      if(state.forceNewTab){ w.open(url,'_blank','noopener'); return; }
      try{
        iframeEl.src = url; show(modal);
        var timer = setTimeout(function(){
          // If iframe fails due to XFO/CSP, open new tab
          try{ var href = iframeEl.contentWindow.location.href; /* may throw */ }
          catch(e){ w.open(url,'_blank','noopener'); modal.style.display='none'; }
        }, 800);
        iframeEl.onload = function(){ clearTimeout(timer); };
      }catch(e){ w.open(url,'_blank','noopener'); }
    }

    function bindOpen(btn, modal, iframeEl, url){
      function h(e){ e.preventDefault(); e.stopPropagation(); openWithFallback(modal, iframeEl, url); }
      ['pointerdown','click','touchend'].forEach(function(evt){ btn.addEventListener(evt,h,{capture:true,passive:false}); });
      btn.onclick = h;
      btn.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ h(e); } }, {capture:true});
    }

    bindOpen(openSelf, sg, sgIfr, state.self);
    bindOpen(openGuided, gd, gdIfr, state.guided);

    sgX.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); sg.style.display='none'; }, {capture:true});
    gdX.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); gd.style.display='none'; }, {capture:true});
    d.addEventListener('keydown', function(e){ if(e.key==='Escape') closeAll(); });
    d.addEventListener('click', function(e){ [sg,gd].forEach(function(m){ if(m.style.display==='flex' && !m.contains(e.target) && e.target!==openSelf && e.target!==openGuided){ m.style.display='none'; } }); });
  }

  function init(){ build(); }
  if(d.readyState==='loading') d.addEventListener('DOMContentLoaded', init); else init();
})();
