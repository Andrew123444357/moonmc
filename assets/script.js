/* Global config injected via assets/config.js as CONFIG */
(function(){
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const cfg = window.CONFIG || {};
  const now = new Date();
  $("#year").textContent = now.getFullYear();

  // Set basics from config
  const serverName = cfg.serverName || "Blocksmith SMP";
  const tagline = cfg.tagline || "Survive. Build. Thrive.";
  const ip = cfg.ip || "play.blocksmith.gg";
  const version = cfg.version || "1.20+";
  const region = cfg.region || "EU";
  const gamemode = cfg.gamemode || "Survival";

  document.title = serverName;
  $("#serverName").textContent = serverName;
  $("#serverNameInline").textContent = serverName;
  $("#footerName").textContent = serverName;
  $("#brandText").textContent = serverName;
  $("#serverTagline").textContent = tagline;
  $("#serverIP").textContent = ip;
  $("#aboutIP").textContent = ip;
  $("#aboutVersion").textContent = version;
  $("#aboutRegion").textContent = region;
  $("#aboutMode").textContent = gamemode;
  document.querySelector('meta[name="theme-color"]').setAttribute('content', cfg.themeColor || '#23d18b');

  // Links
  const discord = cfg.discord || "#";
  const map = cfg.map || "#";
  const store = cfg.store || "#";
  $("#discordLink").href = discord;
  $("#mapLink").href = map;
  $("#storeLink").href = store;
  $("#qDiscord").href = discord;
  $("#qMap").href = map;
  $("#qStore").href = store;
  $("#footerDiscord").href = discord;
  $("#footerMap").href = map;
  $("#footerStore").href = store;
  $("#storeCta").href = store;

  // Vote links
  const voteList = $("#voteList");
  voteList.innerHTML = "";
  (cfg.votes || []).forEach(v => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = v.url; a.target = "_blank"; a.rel = "noopener";
    a.textContent = v.label;
    li.appendChild(a); voteList.appendChild(li);
  });
  if ((cfg.votes || []).length === 0) {
    voteList.innerHTML = "<li>No vote sites configured yet.</li>";
  }

  // Feature cards
  const features = cfg.features || [
    {title:"Claims & Protections", desc:"Protect your builds with easy land claims. Zero grief.", icon:"🛡️"},
    {title:"Economy & Shops", desc:"Trade with players, buy/sell, auction rare finds.", icon:"💰"},
    {title:"Events & Quests", desc:"Weekly events and server‑wide goals.", icon:"🎯"},
    {title:"Lag‑free Performance", desc:"Optimized paper/purpur stack with view‑distance tuning.", icon:"⚡"},
    {title:"Friendly Community", desc:"Helpful staff, active Discord, chill vibes.", icon:"🤝"},
    {title:"Backups & Safety", desc:"Frequent backups and rollback tools.", icon:"🧱"}
  ];
  const featureGrid = $("#featureGrid");
  featureGrid.innerHTML = features.map(f=>`
    <div class="card glass">
      <div class="mb-1" style="font-size:1.8rem">${f.icon || "✨"}</div>
      <h3 class="mb-1">${f.title}</h3>
      <p>${f.desc}</p>
    </div>
  `).join("");

  // Ranks
  const ranks = cfg.ranks || [
    {name:"Adventurer", price:"$5", perks:["/sethome x2","/hat","Colored chat"]},
    {name:"Builder", price:"$10", perks:["/sethome x5","/nick","/back"]},
    {name:"Champion", price:"$20", perks:["/fly in claims","Particle trails","Priority queue"]}
  ];
  const rankGrid = $("#rankGrid");
  rankGrid.innerHTML = ranks.map(r=>`
    <div class="card glass price-card">
      <h3>${r.name}</h3>
      <div class="price">${r.price}</div>
      <ul class="perks">${(r.perks||[]).map(p=>`<li>${p}</li>`).join("")}</ul>
    </div>
  `).join("");

  // Copy IP button
  $("#copyIP").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(ip);
      const toast = $("#copyToast");
      toast.classList.add("show");
      setTimeout(()=>toast.classList.remove("show"), 1200);
    } catch(e){
      alert("Copied IP: " + ip);
    }
  });

  // Theme toggle
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("theme");
  if(savedTheme){ root.setAttribute("data-theme", savedTheme); }
  $("#themeToggle").addEventListener("click", () => {
    const next = root.getAttribute("data-theme")==="light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });

  // Status fetch (mcsrvstat.us) - can be turned off in config
  async function fetchStatus() {
    if(cfg.enableStatus === false) {
      $("#statOnline").textContent = "Disabled";
      $("#statPlayers").textContent = "—";
      $("#statVersion").textContent = version;
      $("#statMotd").textContent = "—";
      return;
    }
    try {
      const res = await fetch(`https://api.mcsrvstat.us/2/${ip}`);
      const data = await res.json();
      const online = !!data.online;
      const players = data.players?.online ?? 0;
      const max = data.players?.max ?? 0;
      const ver = data.version || version;
      const motd = Array.isArray(data.motd?.clean) ? data.motd.clean.join(" ") : (data.motd?.clean || "");

      const statChip = $("#statOnline");
      statChip.textContent = online ? "Online" : "Offline";
      statChip.classList.toggle("chip--ok", online);
      statChip.classList.toggle("chip--down", !online);
      $("#statPlayers").textContent = online ? `${players} / ${max}` : "—";
      $("#statVersion").textContent = ver;
      $("#statMotd").textContent = motd || "—";
    } catch (err) {
      $("#statOnline").textContent = "Error";
      $("#statPlayers").textContent = "—";
      $("#statVersion").textContent = version;
      $("#statMotd").textContent = "—";
    }
  }
  fetchStatus();
  $("#refreshStatus").addEventListener("click", fetchStatus);

  // Background canvas animation: voxel confetti
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");
  let W, H, particles = [];
  const COLORS = (cfg.bgColors || ["#1aba77","#23d18b","#9bfab2","#d2ffd8","#2e8b57","#3a5f0b"]);

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize); resize();

  function spawn(){
    const size = Math.random() * 8 + 6;
    particles.push({
      x: Math.random()*W,
      y: -size,
      z: Math.random()*1,
      s: size,
      v: 0.5 + Math.random()*1.2,
      a: (Math.random()-.5)*0.3,
      c: COLORS[Math.floor(Math.random()*COLORS.length)]
    });
    if(particles.length > 180) particles.shift();
  }

  function step(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(p => {
      p.y += p.v;
      p.x += p.a;
      // draw isometric-ish cube
      const s = p.s;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = 0.75;
      ctx.fillRect(-s/2, -s/2, s, s);
      ctx.globalAlpha = 1;
      ctx.restore();
    });
    if(Math.random() < .7) spawn();
    requestAnimationFrame(step);
  }
  step();
})();
