(function () {
  // --- CSS ---
  const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
  .floating-scheduler-mini {
    position: fixed;
    right: 20px;
    background: linear-gradient(135deg,#eaaa00,#d4940a);
    color: #fff;
    padding: 14px 18px;
    border-radius: 50px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    cursor: pointer;
    z-index: 9999;
    animation: pulse 2s infinite;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    transition: transform 0.2s ease;
    font-family: 'Poppins', sans-serif;
  }
  .floating-scheduler-mini:hover {
    filter: brightness(1.1);
    transform: translateY(-2px);
  }
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(234,170,0,0.6); }
    70% { box-shadow: 0 0 0 12px rgba(234,170,0,0); }
    100% { box-shadow: 0 0 0 0 rgba(234,170,0,0); }
  }
  @keyframes svgPulse {
    0%,100% { transform: scale(1); }
    50% { transform: scale(1.15); }
  }
  .floating-scheduler-mini svg {
    width: 20px; height: 20px; fill: #fff;
    animation: svgPulse 2s infinite ease-in-out;
  }
  #openSelfGuided { bottom: 80px; }
  #openGuided { bottom: 140px; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // --- HTML Buttons ---
  const guidedBtn = document.createElement('div');
  guidedBtn.id = 'openGuided';
  guidedBtn.className = 'floating-scheduler-mini';
  guidedBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 12c2.67 0 8 1.34 8 4v3H4v-3c0-2.66 5.33-4 8-4zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg> Book a Showing`;

  const selfBtn = document.createElement('div');
  selfBtn.id = 'openSelfGuided';
  selfBtn.className = 'floating-scheduler-mini';
  selfBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-6V9a6 6 0 1 0-12 0v2H5v10h14V11h-1zm-8 0V9a4 4 0 1 1 8 0v2h-8z"/></svg> Self-Guided Viewing`;

  document.body.appendChild(guidedBtn);
  document.body.appendChild(selfBtn);

  // --- Property Map ---
  const map = {
    "ascotarms.prospectportal.com": {
      g: "https://www.myshowing.com/Midwest_Property_Management/Ascot_Arms_(Empire_Park)/scheduletourwidget/a0F0H00000d3i9sUAA/",
      s: "https://prop.peek.us/659c209ccdaa2af31fe90c5e/self-guided-tour/"
    },
    "empirepark.prospectportal.com": {
      g: "https://www.myshowing.com/Midwest_Property_Management/Empire_Park_(Empire_Park)/scheduletourwidget/a0F0H00000d3iA6UAI/",
      s: "https://prop.peek.us/659c20d06dc4272dc1c6fe18/self-guided-tour/"
    },
    "thevillageatsouthgate.prospectportal.com": {
      g: "https://www.myshowing.com/Midwest_Property_Management/The_Village_at_Southgate_(Southgate)/scheduletourwidget/a0F0H00000d3iAPUAY/",
      s: "https://prop.peek.us/66350d32f4dbddfd2b1863d7/self-guided-tour/"
    },
    "rivervalleymidwest.prospectportal.com": {
      g: "https://www.myshowing.com/Midwest_Property_Management/Rivervalley_Townhomes_(Gold_Bar)/scheduletourwidget/a0F0H00000d3iAKUAY/",
      s: "https://prop.peek.us/66350d825cb18b6935f276b2/self-guided-tour/"
    },
    "sirjohnfranklin.prospectportal.com": {
      g: "https://www.myshowing.com/Midwest_Property_Management/Sir_John_Franklin_(Old_Strathcona)/scheduletourwidget/a0F0H00000d3iAMUAY/",
      s: "https://prop.peek.us/66350e28f4dbddfd2b19646a/self-guided-tour/"
    },
    "pleasantviewtownhomes.prospectportal.com": {
      g: "https://www.myshowing.com/Midwest_Property_Management/Pleasantview_Townhomes_(Empire_Park)/scheduletourwidget/a0F0H00000d3iAIUAY/",
      s: "https://prop.peek.us/668c75b7bbe11732e731384f/self-guided-tour/"
    },
    "elmwoodtownhomes.prospectportal.com": {
      g: "https://www.myshowing.com/Midwest_Property_Management/Elmwood_Townhomes_(Elmwood)/scheduletourwidget/a0F0H00000d3iA5UAI/",
      s: "https://prop.peek.us/668c766ffa52e0189568d9a9/self-guided-tour/"
    },
    "cricketcourt.prospectportal.com": {
      g: "https://www.myshowing.com/Midwest_Property_Management/Cricket_Court_Townhomes_(Aldergrove)/scheduletourwidget/a0F0H00000d3iA1UAI/",
      s: "https://prop.peek.us/668c76b1edee275669b4508d/self-guided-tour/"
    },
    "cambriancourt.prospectportal.com": {
      g: "https://www.myshowing.com/Midwest_Property_Management/Cambrian_Court_(Cambrian_Heights)/scheduletourwidget/a0F0H00000d3i9vUAA/",
      s: "https://prop.peek.us/66aaaa33f7d05462a7f4be8e/self-guided-tour/"
    },
    "secondstreetfundcommercial.prospectportal.com": { // test
      g: "https://www.myshowing.com/Midwest_Property_Management/The_Village_at_Southgate_(Southgate)/scheduletourwidget/a0F0H00000d3iAPUAY/",
      s: "https://prop.peek.us/66350d32f4dbddfd2b1863d7/self-guided-tour/"
    }
  };

  const host = (location.hostname || "").toLowerCase();
  const urls = map[host] || map["secondstreetfundcommercial.prospectportal.com"];

  guidedBtn.addEventListener("click", () => window.open(urls.g, "_blank"));
  selfBtn.addEventListener("click", () => window.open(urls.s, "_blank"));
})();
