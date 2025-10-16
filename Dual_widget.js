/*! Midwest Property Management — Dual Tour Widgets Loader (Guided + Self-Guided)
 *  File: mwm-tour-widgets.min.js
 *  Version: 1.1.0 (2025-10-16)
 *  Notes:
 *   - Labels: Guided → “Book a Showing”, Self-Guided → “Self-Guided Viewing”
 *   - Floating pill buttons with pulse + hover brighten
 *   - Exact button offsets: #openGuided {bottom:140px} #openSelfGuided {bottom:80px}
 *   - Opens URLs in an in-page card modal with iframe (matching The Village sample pattern)
 *   - Auto host mapping for 9 properties + per-page override supported via <div id="mwm-tour-widget" ...>
 */
(function(){"use strict";
  var d=document,w=window;

  // ---- Mapping (9 properties) ----
  var SITE_MAP={
    "ascotarms.prospectportal.com":{guided:"https://www.myshowing.com/Midwest_Property_Management/Ascot_Arms_(Empire_Park)/scheduletourwidget/a0F0H00000d3i9sUAA/",selfGuided:"https://prop.peek.us/659c209ccdaa2af31fe90c5e/self-guided-tour/"},
    "empirepark.prospectportal.com":{guided:"https://www.myshowing.com/Midwest_Property_Management/Empire_Park_(Empire_Park)/scheduletourwidget/a0F0H00000d3iA6UAI/",selfGuided:"https://prop.peek.us/659c20d06dc4272dc1c6fe18/self-guided-tour/"},
    "thevillageatsouthgate.prospectportal.com":{guided:"https://www.myshowing.com/Midwest_Property_Management/The_Village_at_Southgate_(Southgate)/scheduletourwidget/a0F0H00000d3iAPUAY/",selfGuided:"https://prop.peek.us/66350d32f4dbddfd2b1863d7/self-guided-tour/"},
    "rivervalleytownhomes.prospectportal.com":{guided:"https://www.myshowing.com/Midwest_Property_Management/Rivervalley_Townhomes_(Gold_Bar)/scheduletourwidget/a0F0H00000d3iAKUAY/",selfGuided:"https://prop.peek.us/66350d825cb18b6935f276b2/self-guided-tour/"},
    "sirjohnfranklin.prospectportal.com":{guided:"https://www.myshowing.com/Midwest_Property_Management/Sir_John_Franklin_(Old_Strathcona)/scheduletourwidget/a0F0H00000d3iAMUAY/",selfGuided:"https://prop.peek.us/66350e28f4dbddfd2b19646a/self-guided-tour/"},
    "pleasantviewtownhomes.prospectportal.com":{guided:"https://www.myshowing.com/Midwest_Property_Management/Pleasantview_Townhomes_(Empire_Park)/scheduletourwidget/a0F0H00000d3iAIUAY/",selfGuided:"https://prop.peek.us/668c75b7bbe11732e731384f/self-guided-tour/"},
    "elmwoodtownhomes.prospectportal.com":{guided:"https://www.myshowing.com/Midwest_Property_Management/Elmwood_Townhomes_(Elmwood)/scheduletourwidget/a0F0H00000d3iA5UAI/",selfGuided:"https://prop.peek.us/668c766ffa52e0189568d9a9/self-guided-tour/"},
    "cricketcourt.prospectportal.com":{guided:"https://www.myshowing.com/Midwest_Property_Management/Cricket_Court_Townhomes_(Aldergrove)/scheduletourwidget/a0F0H00000d3iA1UAI/",selfGuided:"https://prop.peek.us/668c76b1edee275669b4508d/self-guided-tour/"},
    "cambriancourt.prospectportal.com":{guided:"https://www.myshowing.com/Midwest_Property_Management/Cambrian_Court_(Cambrian_Heights)/scheduletourwidget/a0F0H00000d3i9vUAA/",selfGuided:"https://prop.peek.us/66aaaa33f7d05462a7f4be8e/self-guided-tour/"}
  };

  // ---- Defaults / theme ----
  var DEFAULTS={
    labels:{guided:"Book a Showing", selfGuided:"Self-Guided Viewing"},
    zIndex:10000,
    theme:{ gradient:"linear-gradient(135deg,#eaaa00,#d4940a)", textColor:"#fff", font:"Poppins,system-ui,Segoe UI,Roboto,Arial,sans-serif", radius:"50px", shadow:"0 4px 12px rgba(0,0,0,.15)" }
  };

  // ---- Utilities ----
  function $(s,r){return (r||d).querySelector(s);} function create(t,c){var e=d.createElement(t); if(c) e.className=c; return e;}
  function css(e,o){for(var k in o) e.style[k]=o[k]; return e;}
  function merge(a,b){var o={},k; for(k in a)o[k]=a[k]; for(k in b)o[k]=b[k]; return o;}
  function url(u){return typeof u==='string' && /^https?:\/\//i.test(u);} 

  // ---- Styles (namespaced to avoid collisions) ----
  function injectStyles(theme,zIndex){
    if(d.getElementById('mwm-style')) return;
    var s=create('style'); s.id='mwm-style';
    s.textContent = "@keyframes mwmPulse{0%{box-shadow:0 0 0 0 rgba(234,170,0,.6)}70%{box-shadow:0 0 0 12px rgba(234,170,0,0)}100%{box-shadow:0 0 0 0 rgba(234,170,0,0)}}"+
    ".mwm-btn{position:fixed;right:20px;padding:14px 18px;border:0;border-radius:"+theme.radius+";background:"+theme.gradient+";color:"+theme.textColor+";box-shadow:"+theme.shadow+";font-family:"+theme.font+";font-weight:600;cursor:pointer;z-index:"+zIndex+";display:inline-flex;align-items:center;gap:8px;animation:mwmPulse 2s infinite;transition:filter .2s ease}"+
    ".mwm-btn:hover{filter:brightness(1.1)}"+
    ".mwm-modal{position:fixed;bottom:20px;right:20px;background:#fff;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.2);width:360px;max-height:80vh;overflow:hidden;display:none;flex-direction:column;z-index:"+(zIndex+1)+";animation:mwmSlideIn .4s ease}"+
    "@keyframes mwmSlideIn{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}"+
    ".mwm-head{background:"+theme.gradient+";color:#fff;padding:12px;font-weight:600;text-align:center;position:relative;font-family:"+theme.font+"}"+
    ".mwm-close{position:absolute;top:8px;right:12px;background:none;border:0;color:#fff;font-size:24px;cursor:pointer;line-height:1}"+
    ".mwm-copy{padding:12px;text-align:center;font-size:14px;color:#333;font-family:"+theme.font+"}"+
    ".mwm-iframe{border:0;width:100%;height:380px}";
    d.head.appendChild(s);
  }

  // ---- Modal builder ----
  function buildModal(title,url,modalId){
    var m=create('div','mwm-modal'); m.setAttribute('role','dialog'); m.setAttribute('aria-modal','true'); m.id=modalId;
    var head=create('div','mwm-head'); head.textContent=title; var x=create('button','mwm-close'); x.setAttribute('aria-label','Close'); x.textContent='\u00D7'; head.appendChild(x);
    var copy=create('div','mwm-copy');
    copy.innerHTML='<div style="margin-bottom:6px">'+(title.indexOf('Self-Guided')>-1?'Tour on your schedule, even after hours.':'Meet our leasing team for a personalized tour.')+'</div><div>Step 1: Choose Date 📅</div><div>Step 2: Confirm ✨</div>';
    var ifr=create('iframe','mwm-iframe'); if(url(url)) ifr.src=url; m.appendChild(head); m.appendChild(copy); m.appendChild(ifr);
    x.addEventListener('click',function(){m.style.display='none';});
    return m;
  }

  function openModal(m){ m.style.display='flex'; }

  // ---- Button + modal wiring ----
  function mountUI(cfg){
    injectStyles(cfg.theme,cfg.zIndex);
    var gBtn=create('button','mwm-btn'); gBtn.id='openGuided'; gBtn.textContent=cfg.labels.guided; css(gBtn,{bottom:'140px'});
    var sBtn=create('button','mwm-btn'); sBtn.id='openSelfGuided'; sBtn.textContent=cfg.labels.selfGuided; css(sBtn,{bottom:'80px'});
    d.body.appendChild(gBtn); d.body.appendChild(sBtn);

    var gModal=buildModal(cfg.labels.guided,cfg.guided,'mwm-guided');
    var sModal=buildModal(cfg.labels.selfGuided,cfg.selfGuided,'mwm-self');
    d.body.appendChild(gModal); d.body.appendChild(sModal);

    function closeAll(){ gModal.style.display='none'; sModal.style.display='none'; }

    gBtn.addEventListener('click',function(){ closeAll(); openModal(gModal); });
    sBtn.addEventListener('click',function(){ closeAll(); openModal(sModal); });

    d.addEventListener('keydown',function(e){ if(e.key==='Escape') closeAll(); });
    d.addEventListener('click',function(e){ [gModal,sModal].forEach(function(m){ if(m.style.display==='flex' && !m.contains(e.target) && e.target!==gBtn && e.target!==sBtn){ m.style.display='none'; }}); });
  }

  // ---- Config (per-page override supported) ----
  function getConfig(){
    var host=(location.hostname||'').toLowerCase();
    var mapped=SITE_MAP[host]||{};
    var ctn=$('#mwm-tour-widget');
    var guided=ctn && ctn.getAttribute('data-guided') || mapped.guided;
    var selfGuided=ctn && ctn.getAttribute('data-selfguided') || mapped.selfGuided;
    return merge(DEFAULTS,{guided:guided,selfGuided:selfGuided});
  }

  function init(){
    var cfg=getConfig();
    if(!url(cfg.guided) && !url(cfg.selfGuided)) { console.warn('[MWM] Missing tour URLs.'); return; }
    mountUI(cfg);
  }

  if(d.readyState==='loading') d.addEventListener('DOMContentLoaded',init); else init();
})();
