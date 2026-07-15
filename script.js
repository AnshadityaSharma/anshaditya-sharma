const projects = [
  {
    title: "Trading Exchange Simulator",
    type: "Systems / Fintech",
    category: "systems",
    repo: "https://github.com/AnshadityaSharma/Trading-Exchange-Simulator",
    live: "https://trading-exchange-simulator-production.up.railway.app",
    summary:
      "A paper-trading exchange with a real in-memory price-time-priority matching engine, live order book streams, liquidity bots, JWT auth, Postgres persistence, and explainable fills.",
    tags: ["TypeScript", "Node.js", "WebSockets", "Postgres", "Benchmarks"],
    details: [
      "Pure matching engine with sorted price levels, intrusive FIFO queues, O(1) cancels, and integer ticks for money math.",
      "Benchmarked at 2.10M mixed ops/sec direct-path mean, with documented HTTP-path and deep-book results.",
      "Ships an API, live WebSocket feed, bots, design decisions, limitations, and a terminal-style trading UI."
    ]
  },
  {
    title: "EvoCreatures",
    type: "AI / Simulation",
    category: "ai",
    repo: "https://github.com/AnshadityaSharma/evocreatures",
    live: "https://evocreatures.vercel.app/",
    summary:
      "A genetic algorithm that evolves locomotion controllers for articulated creatures in a 2D rigid-body physics simulation, then replays the best generations in Three.js.",
    tags: ["Python", "pymunk", "NumPy", "Three.js", "Genetic algorithms"],
    details: [
      "Uses tournament selection, elitism, uniform crossover, annealed Gaussian mutation, and random immigrants.",
      "Fitness rewards efficient forward crawling while penalizing energy waste and physically implausible launch exploits.",
      "Improved best fitness from 0 to 13.9 and crawl distance from about 7m to 21m over 30 deterministic generations."
    ]
  },
  {
    title: "LectureFind",
    type: "AI / Education tooling",
    category: "ai",
    repo: "https://github.com/AnshadityaSharma/video_summariser",
    summary:
      "A YouTube lecture navigator that searches transcripts for concepts, clusters matching timestamps, and opens the exact clip from a website or Chrome extension.",
    tags: ["FastAPI", "React", "NLTK", "Chrome Extension", "WordNet"],
    details: [
      "Expands concepts with WordNet synonyms and uses Wu-Palmer similarity for fallback topic suggestions.",
      "Merges transcript matches inside a 45-second window into coherent lecture segments.",
      "Includes a Manifest V3 extension that can jump the active YouTube player to the chosen timestamp."
    ]
  },
  {
    title: "Semi-Autonomous VLM Rover",
    type: "Robotics / Vision",
    category: "ai",
    summary:
      "An ESP32-CAM rover with a pan-tilt camera mount and N20 gear motors, controllable manually or through natural-language commands over Wi-Fi.",
    tags: ["ESP32-CAM", "Arduino C++", "Gemini Vision API", "Robotics", "Control loops"],
    details: [
      "Uses a vision-language model to interpret live frames and generate real-time driving decisions.",
      "Designed around obstacle avoidance, target navigation, manual override, and a documented evaluation methodology.",
      "Built as a formal research-oriented final-year project on VLM integration for mobile robot control."
    ]
  },
  {
    title: "Zero-Knowledge Task Verification",
    type: "Security / Cryptography",
    category: "security",
    repo: "https://github.com/AnshadityaSharma/zero_knowledge_proof",
    summary:
      "An interactive full-stack simulation showing how an observer can prove task completion without revealing a secret map or path.",
    tags: ["React", "Node.js", "SHA-256", "HMAC", "Challenge response"],
    details: [
      "Demonstrates commit, challenge, response, and verification phases with animated network state.",
      "Uses SHA-256 commitments, CSPRNG nonces, HMAC proofs, and replay-log validation concepts.",
      "Built for applied cryptography and network security presentation work."
    ]
  },
  {
    title: "Cafe Finder",
    type: "Product / Maps",
    category: "product",
    repo: "https://github.com/AnshadityaSharma/cafe-finder",
    summary:
      "A responsive place-discovery app for cafes, restaurants, bars, hotels, parks, and tourist spots using free OpenStreetMap APIs.",
    tags: ["React", "Leaflet", "OpenStreetMap", "Overpass", "Framer Motion"],
    details: [
      "Includes location autocomplete through Nominatim and place queries through Overpass API.",
      "Supports radius selection, category filters, geolocation, rating filters, and mobile drawer interaction.",
      "Keeps setup friendly by avoiding paid API keys."
    ]
  },
  {
    title: "Gridspace Whiteboard",
    type: "Realtime / Collaboration",
    category: "product",
    repo: "https://github.com/AnshadityaSharma/Gridspace",
    summary:
      "A collaborative digital canvas with live cursors, drawing tools, host approvals, permissions, pan, zoom, and Firebase-backed sessions.",
    tags: ["React", "Firebase", "Firestore", "Realtime", "Canvas UX"],
    details: [
      "Supports select, move, resize, pen, line, rectangle, circle, text, and erase workflows.",
      "Uses session codes, anonymous auth, host controls, and watch-only or draw permissions.",
      "Designed around infinite-canvas navigation with pan and zoom."
    ]
  },
  {
    title: "Robo-Advisor",
    type: "Finance / Data app",
    category: "product",
    repo: "https://github.com/AnshadityaSharma/Robo-Advisor",
    summary:
      "A Streamlit portfolio optimization tool for Indian stocks with risk tolerance, allocation charts, Sharpe ratio, volatility, returns, and export.",
    tags: ["Python", "Streamlit", "Pandas", "SciPy", "PyPortfolioOpt"],
    details: [
      "Uses mean-variance optimization and Sharpe ratio maximization.",
      "Includes pie charts, return-risk scatter plots, sector breakdowns, and CSV export.",
      "Designed for beginner-friendly financial decision support with clear term tooltips."
    ]
  }
];

const grid = document.querySelector("#projectGrid");
const dialog = document.querySelector("#projectDialog");
const dialogContent = document.querySelector("#dialogContent");

function renderProjects(filter = "all") {
  grid.innerHTML = "";
  projects
    .filter((project) => filter === "all" || project.category === filter)
    .forEach((project, index) => {
      const card = document.createElement("article");
      card.className = "project-card tilt-card";
      card.tabIndex = 0;
      card.innerHTML = `
        <div>
          <div class="project-top">
            <span class="project-index">${String(index + 1).padStart(2, "0")}</span>
            <span class="project-type">${project.type}</span>
          </div>
          <h3>${project.title}</h3>
          <p>${project.summary}</p>
          <div class="project-tags">${project.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
        </div>
        <div class="project-links">
          ${project.repo ? `<a href="${project.repo}" target="_blank" rel="noreferrer">Repository</a>` : ""}
          ${project.live ? `<a href="${project.live}" target="_blank" rel="noreferrer">Live demo</a>` : ""}
          <button type="button">Details</button>
        </div>
      `;

      const open = () => openDialog(project);
      card.addEventListener("click", (event) => {
        if (event.target.closest("a")) return;
        open();
      });
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      });
      grid.appendChild(card);
    });

  attachTilt();
}

function openDialog(project) {
  dialogContent.innerHTML = `
    <div class="dialog-body">
      <p class="eyebrow">${project.type}</p>
      <h2>${project.title}</h2>
      <p>${project.summary}</p>
      <ul>${project.details.map((item) => `<li>${item}</li>`).join("")}</ul>
      <div class="project-tags">${project.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
      <div class="project-links">
        ${project.repo ? `<a href="${project.repo}" target="_blank" rel="noreferrer">Open repository</a>` : ""}
        ${project.live ? `<a href="${project.live}" target="_blank" rel="noreferrer">Open live demo</a>` : ""}
      </div>
    </div>
  `;
  dialog.showModal();
}

document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderProjects(button.dataset.filter);
  });
});

function attachTilt() {
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rx = ((y / rect.height) - 0.5) * -5;
      const ry = ((x / rect.width) - 0.5) * 5;
      card.style.setProperty("--mx", `${(x / rect.width) * 100}%`);
      card.style.setProperty("--my", `${(y / rect.height) * 100}%`);
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll("[data-reveal]").forEach((item) => revealObserver.observe(item));

function bootField() {
  const canvas = document.querySelector("#field");
  const ctx = canvas.getContext("2d");
  const pointer = { x: 0, y: 0, active: false };
  let stars = [];
  let dust = [];
  let w = 0;
  let h = 0;
  let dpr = 1;
  let tick = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const starCount = Math.min(520, Math.max(180, Math.floor((w * h) / 4200)));
    const dustCount = Math.min(190, Math.max(70, Math.floor((w * h) / 13000)));
    const cx = w * 0.58;
    const cy = h * 0.44;
    const maxR = Math.max(w, h) * 0.72;

    stars = Array.from({ length: starCount }, (_, i) => {
      const arm = i % 4;
      const radius = Math.pow(Math.random(), 0.58) * maxR;
      const spin = radius * 0.006;
      const angle = arm * Math.PI * 0.5 + spin + (Math.random() - 0.5) * 0.82;
      const spread = 18 + radius * 0.095;
      return {
        baseX: cx + Math.cos(angle) * radius + (Math.random() - 0.5) * spread,
        baseY: cy + Math.sin(angle) * radius * 0.46 + (Math.random() - 0.5) * spread,
        radius,
        angle,
        size: 0.45 + Math.random() * 1.85,
        twinkle: Math.random() * Math.PI * 2,
        speed: 0.0008 + Math.random() * 0.0022,
        color: i % 5 === 0 ? "230,177,93" : i % 3 === 0 ? "126,182,242" : "218,247,239"
      };
    });

    dust = Array.from({ length: dustCount }, (_, i) => {
      const radius = Math.pow(Math.random(), 0.72) * maxR * 0.82;
      const angle = (i % 3) * ((Math.PI * 2) / 3) + radius * 0.007 + (Math.random() - 0.5) * 0.9;
      return {
        x: cx + Math.cos(angle) * radius + (Math.random() - 0.5) * 160,
        y: cy + Math.sin(angle) * radius * 0.42 + (Math.random() - 0.5) * 120,
        size: 30 + Math.random() * 95,
        alpha: 0.015 + Math.random() * 0.045,
        color: i % 2 === 0 ? "125,211,199" : "126,182,242"
      };
    });
  }

  function draw() {
    tick += 1;
    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createRadialGradient(w * 0.58, h * 0.42, 0, w * 0.58, h * 0.42, Math.max(w, h) * 0.72);
    bg.addColorStop(0, "rgba(26, 38, 41, 0.38)");
    bg.addColorStop(0.38, "rgba(8, 13, 16, 0.62)");
    bg.addColorStop(1, "rgba(2, 3, 5, 0.94)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = "screen";
    dust.forEach((cloud) => {
      const driftX = Math.sin(tick * 0.003 + cloud.size) * 8;
      const driftY = Math.cos(tick * 0.002 + cloud.size) * 5;
      const gradient = ctx.createRadialGradient(
        cloud.x + driftX,
        cloud.y + driftY,
        0,
        cloud.x + driftX,
        cloud.y + driftY,
        cloud.size
      );
      gradient.addColorStop(0, `rgba(${cloud.color}, ${cloud.alpha})`);
      gradient.addColorStop(1, `rgba(${cloud.color}, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cloud.x + driftX, cloud.y + driftY, cloud.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalCompositeOperation = "lighter";
    stars.forEach((star, i) => {
      const cx = w * 0.58;
      const cy = h * 0.44;
      const a = star.angle + tick * star.speed;
      let x = cx + Math.cos(a) * star.radius + (star.baseX - cx - Math.cos(star.angle) * star.radius);
      let y = cy + Math.sin(a) * star.radius * 0.46 + (star.baseY - cy - Math.sin(star.angle) * star.radius * 0.46);
      const pull = pointer.active ? Math.max(0, 1 - Math.hypot(pointer.x - x, pointer.y - y) / 340) : 0;
      x += (pointer.x - x) * pull * 0.035;
      y += (pointer.y - y) * pull * 0.035;
      const pulse = 0.48 + Math.sin(tick * 0.035 + star.twinkle) * 0.22 + star.size * 0.12;

      ctx.beginPath();
      ctx.fillStyle = `rgba(${star.color}, ${Math.max(0.12, pulse)})`;
      ctx.arc(x, y, star.size, 0, Math.PI * 2);
      ctx.fill();

      if (i % 17 === 0) {
        ctx.strokeStyle = `rgba(${star.color}, 0.18)`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(x - star.size * 4, y);
        ctx.lineTo(x + star.size * 4, y);
        ctx.moveTo(x, y - star.size * 4);
        ctx.lineTo(x, y + star.size * 4);
        ctx.stroke();
      }
    });
    ctx.globalCompositeOperation = "source-over";
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  });
  window.addEventListener("pointerleave", () => {
    pointer.active = false;
  });
  resize();
  draw();
}

renderProjects();
bootField();
