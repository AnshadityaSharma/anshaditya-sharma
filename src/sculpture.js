import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export function createSculpture(host, settings) {
  const scene = new THREE.Scene();
  scene.background = null;
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);
  const low = (navigator.hardwareConcurrency || 8) <= 4 || innerWidth < 700;
  const renderer = new THREE.WebGLRenderer({
    antialias: !low,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, low ? 1 : 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  host.appendChild(renderer.domElement);
  const pmrem = new THREE.PMREMGenerator(renderer),
    room = new RoomEnvironment(),
    env = pmrem.fromScene(room, 0.04);
  room.dispose();
  scene.environment = env.texture;
  const material = (color, metalness = 0, roughness = 0.45) =>
    new THREE.MeshStandardMaterial({ color, metalness, roughness });
  const aluminium = material("#b8bfcd", 0.95, 0.22),
    edge = material("#e4e8f0", 0.9, 0.2),
    black = material("#11151f", 0.45, 0.32),
    graphite = material("#343a48", 0.7, 0.4),
    blue = material("#354bf5", 0.55, 0.25),
    boardMat = material("#172033", 0.55, 0.45);
  const root = new THREE.Group();
  scene.add(root);
  const layers = [];
  function layer(y, spread) {
    const g = new THREE.Group();
    g.position.y = y;
    g.userData = { y, spread };
    root.add(g);
    layers.push(g);
    return g;
  }
  function box(w, h, d, x, y, z, mat, parent, r = 0.025) {
    const mesh = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, r), mat);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }
  function cylinder(r, h, x, y, z, mat, parent, segments = 32) {
    const m = new THREE.Mesh(
      new THREE.CylinderGeometry(r, r, h, segments),
      mat,
    );
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  }
  const bottom = layer(-.14, -1.45),
    battery = layer(-.02, -.85),
    board = layer(.08, -.12),
    cooling = layer(.17, .7),
    deck = layer(.26, 1.4),
    display = layer(.31, 2.3);
  box(4.8, 0.11, 3.18, 0, 0, 0, aluminium, bottom, 0.06);
  box(4.57, 0.025, 2.97, 0, 0.06, 0, graphite, bottom, 0.04);
  for (const x of [-2.08, 2.08])
    for (const z of [-1.33, 1.33]) {
      cylinder(0.052, 0.018, x, 0.079, z, edge, bottom, 12);
      box(0.055, 0.003, 0.009, x, 0.091, z, black, bottom, 0);
    }
  for (let i = 0; i < 4; i++)
    box(0.92, 0.11, 1.35, -1.48 + i * 0.99, 0.01, 0.7, black, battery, 0.04);
  // Battery cell markings are texture detail, not floating UI labels.
  const labelCanvas = document.createElement("canvas");
  labelCanvas.width = 512;
  labelCanvas.height = 128;
  let ctx = labelCanvas.getContext("2d");
  ctx.fillStyle = "#141924";
  ctx.fillRect(0, 0, 512, 128);
  ctx.fillStyle = "#939ba9";
  ctx.font = "14px monospace";
  ctx.fillText("AS / POWER MODULE", 20, 35);
  ctx.font = "11px monospace";
  ctx.fillText("DESIGNED FOR THE LONG RUN", 20, 62);
  ctx.fillText("4-CELL   /   Li-ion   /   54 Wh", 20, 100);
  const labelTex = new THREE.CanvasTexture(labelCanvas);
  labelTex.colorSpace = THREE.SRGBColorSpace;
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(2.6, 0.65),
    new THREE.MeshBasicMaterial({ map: labelTex }),
  );
  label.rotation.x = -Math.PI / 2;
  label.position.set(0, 0.071, 0.7);
  battery.add(label);
  box(4.25, 0.075, 1.29, 0, 0, -0.73, boardMat, board, 0.04);
  box(0.62, 0.085, 0.62, -0.42, 0.08, -0.7, edge, board, 0.01);
  box(0.5, 0.02, 0.5, -0.42, 0.135, -0.7, blue, board, 0.01);
  for (let i = 0; i < 4; i++)
    box(0.3, 0.065, 0.45, 0.2 + i * 0.37, 0.064, -0.65, black, board, 0.005);
  for (let i = 0; i < 30; i++) {
    box(
      0.08,
      0.04,
      0.035,
      -1.88 + (i % 15) * 0.265,
      0.06,
      -1.18 + Math.floor(i / 15) * 0.96,
      edge,
      board,
      0.002,
    );
  }
  const traces = [];
  for (let i = 0; i < 18; i++) {
    const x = -1.95 + i * 0.22;
    traces.push(
      new THREE.Vector3(x, 0.042, -1.28),
      new THREE.Vector3(x, 0.042, -0.98),
      new THREE.Vector3(x + 0.08, 0.042, -0.87),
      new THREE.Vector3(x + 0.08, 0.042, -0.25),
    );
  }
  const traceGeo = new THREE.BufferGeometry().setFromPoints(traces);
  board.add(
    new THREE.LineSegments(
      traceGeo,
      new THREE.LineBasicMaterial({
        color: "#627493",
        transparent: true,
        opacity: 0.7,
      }),
    ),
  );
  for (const x of [-1.53, 1.53]) {
    cylinder(0.51, 0.1, x, 0.03, -0.78, graphite, cooling);
    cylinder(0.42, 0.115, x, 0.04, -0.78, black, cooling);
    cylinder(0.12, 0.125, x, 0.045, -0.78, edge, cooling);
    for (let i = 0; i < 22; i++) {
      const angle = (i / 22) * Math.PI * 2;
      const vane = box(
        0.28,
        0.035,
        0.035,
        x + Math.cos(angle) * 0.26,
        0.105,
        -0.78 + Math.sin(angle) * 0.26,
        aluminium,
        cooling,
        0.005,
      );
      vane.rotation.y = -angle + 0.6;
    }
  }
  const tubePath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.5, 0.12, -0.6),
    new THREE.Vector3(-0.75, 0.12, -0.4),
    new THREE.Vector3(0.3, 0.12, -0.4),
    new THREE.Vector3(1.5, 0.12, -0.6),
  ]);
  cooling.add(
    new THREE.Mesh(
      new THREE.TubeGeometry(tubePath, 30, 0.055, 8, false),
      aluminium,
    ),
  );
  for (let i = 0; i < 35; i++)
    box(
      0.035,
      0.16,
      0.4,
      -2.08 + i * 0.122,
      0.02,
      -1.28,
      graphite,
      cooling,
      0.002,
    );
  box(4.8, 0.1, 3.18, 0, 0, 0, aluminium, deck, 0.06);
  box(3.54, 0.015, 1.51, 0, 0.055, -0.48, black, deck, 0.04);
  const keyGeo = new RoundedBoxGeometry(0.218, 0.038, 0.19, 1, 0.025),
    keys = new THREE.InstancedMesh(keyGeo, graphite, 70),
    dummy = new THREE.Object3D();
  for (let i = 0; i < 70; i++) {
    dummy.position.set(
      ((i % 14) - 6.5) * 0.243,
      0.08,
      -1.07 + Math.floor(i / 14) * 0.257,
    );
    dummy.updateMatrix();
    keys.setMatrixAt(i, dummy.matrix);
  }
  deck.add(keys);
  box(1.18, 0.012, 0.17, 0, 0.11, 0.08, graphite, deck, 0.02);
  box(1.52, 0.007, 0.84, 0, 0.057, 0.91, edge, deck, 0.04);
  for (const x of [-2.04, 2.04])
    for (let i = 0; i < 20; i++)
      box(0.24, 0.002, 0.013, x, 0.055, -1.08 + i * 0.065, black, deck, 0.001);
  for (const x of [-2.4, 2.4]) {
    box(0.008, 0.055, 0.31, x, -0.01, -0.82, black, deck, 0.008);
    box(0.008, 0.055, 0.18, x, -0.01, -0.28, black, deck, 0.006);
  }
  const hinge = new THREE.Group();
  hinge.position.set(0, 0, -1.5);
  display.add(hinge);
  box(4.8, 3.1, 0.075, 0, 1.55, 0, aluminium, hinge, 0.06);
  box(4.66, 2.96, 0.015, 0, 1.55, 0.046, black, hinge, 0.035);
  const screenCanvas = document.createElement("canvas");
  screenCanvas.width = 1280;
  screenCanvas.height = 800;
  ctx = screenCanvas.getContext("2d");
  ctx.fillStyle = "#0b1020";
  ctx.fillRect(0, 0, 1280, 800);
  ctx.strokeStyle = "#2b354a";
  ctx.lineWidth = 1;
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * 50);
    ctx.lineTo(1280, i * 50);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(i * 70, 0);
    ctx.lineTo(i * 70, 800);
    ctx.stroke();
  }
  ctx.fillStyle = "#8e9bb4";
  ctx.font = "20px monospace";
  ctx.fillText("ANSHADITYA SHARMA / SYSTEMS IN MOTION", 55, 62);
  ctx.fillStyle = "#eef2fa";
  ctx.font = "bold 100px Arial";
  ctx.fillText("BENEATH", 52, 252);
  ctx.fillText("THE SURFACE.", 52, 365);
  ctx.font = "23px monospace";
  ctx.fillStyle = "#9aa8c3";
  ctx.fillText("A closer look at how I think.", 58, 440);
  ctx.strokeStyle = "#566fff";
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (let i = 0; i < 80; i++) {
    const x = 55 + i * 14,
      y = 610 + Math.sin(i * 0.18) * 35 + Math.cos(i * 0.4) * 15;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.stroke();
  ctx.fillStyle = "#8390aa";
  ctx.font = "18px monospace";
  ctx.fillText("ENGINEER  /  BUILDER  /  ALWAYS CURIOUS", 55, 741);
  const screenTex = new THREE.CanvasTexture(screenCanvas);
  screenTex.colorSpace = THREE.SRGBColorSpace;
  const screenSnapshot = document.createElement("canvas");
  screenSnapshot.width = screenCanvas.width;
  screenSnapshot.height = screenCanvas.height;
  screenSnapshot.getContext("2d").drawImage(screenCanvas, 0, 0);
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(4.43, 2.73),
    new THREE.MeshBasicMaterial({ map: screenTex }),
  );
  screen.position.set(0, 1.56, 0.06);
  hinge.add(screen);
  const webcam = new THREE.Mesh(new THREE.CircleGeometry(0.023, 12), black);
  webcam.position.set(0, 3.03, 0.058);
  hinge.add(webcam);
  const keysCanvas = document.createElement("canvas");
  keysCanvas.width = 1024;
  keysCanvas.height = 420;
  const keyContext = keysCanvas.getContext("2d");
  keyContext.fillStyle = "#bec8db";
  keyContext.font = "18px monospace";
  keyContext.textAlign = "center";
  [
    "1 2 3 4 5 6 7 8 9 0 - =",
    "Q W E R T Y U I O P [ ]",
    "A S D F G H J K L ;",
    "Z X C V B N M , .",
  ].forEach((row, r) =>
    row
      .split(" ")
      .forEach((letter, c) =>
        keyContext.fillText(letter, 65 + c * 70 + r * 12, 65 + r * 88),
      ),
  );
  const keysTexture = new THREE.CanvasTexture(keysCanvas);
  const keyLegends = new THREE.Mesh(
    new THREE.PlaneGeometry(3.38, 1.18),
    new THREE.MeshBasicMaterial({
      map: keysTexture,
      transparent: true,
      depthWrite: false,
    }),
  );
  keyLegends.rotation.x = -Math.PI / 2;
  keyLegends.position.set(0, 0.105, -0.58);
  deck.add(keyLegends);
  for (const x of [-1.95, 1.95])
    for (const z of [-1.2, 1.2])
      cylinder(0.13, 0.025, x, -0.07, z, black, bottom, 16);
  // Batch static parts by material inside each animated mechanical layer.
  function batchParts(parent) {
    const batches = new Map();
    [...parent.children].forEach((mesh) => {
      if (!mesh.isMesh || mesh.isInstancedMesh) return;
      if (!batches.has(mesh.material)) batches.set(mesh.material, []);
      batches.get(mesh.material).push(mesh);
    });
    batches.forEach((meshes, material) => {
      if (meshes.length < 2) return;
      const geometries = meshes.map((mesh) => {
        mesh.updateMatrix();
        const geometry = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone();
        return geometry.applyMatrix4(mesh.matrix);
      });
      const merged = mergeGeometries(geometries, false);
      geometries.forEach((g) => g.dispose());
      if (!merged) return;
      meshes.forEach((mesh) => {
        parent.remove(mesh);
        mesh.geometry.dispose();
      });
      parent.add(new THREE.Mesh(merged, material));
    });
  }
  [...layers, hinge].forEach(batchParts);
  const keyLight = new THREE.DirectionalLight("#e9f0ff", 3);
  keyLight.position.set(-3, 7, 5);
  scene.add(keyLight);
  const rim = new THREE.DirectionalLight("#9badff", 2);
  rim.position.set(5, 3, -3);
  scene.add(rim);
  scene.add(new THREE.AmbientLight("#ffffff", 0.8));
  // A soft analytic ground shadow avoids an expensive real-time shadow pass.
  const shadowCanvas = document.createElement("canvas");
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  ctx = shadowCanvas.getContext("2d");
  const gradient = ctx.createRadialGradient(64, 64, 5, 64, 64, 64);
  gradient.addColorStop(0, "rgba(20,30,55,.3)");
  gradient.addColorStop(1, "rgba(20,30,55,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  const shadowTex = new THREE.CanvasTexture(shadowCanvas);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 7),
    new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(2, -2, 0);
  scene.add(shadow);
  // Isolate fade materials so an arriving layer cannot fade an assembled one.
  const originalMaterials = new Set();
  layers.forEach(g => {
    const copies = new Map();
    g.traverse(o => {
      if (!o.isMesh) return;
      const clone = m => {
        originalMaterials.add(m);
        if (!copies.has(m)) {
          const copy = m.clone();
          copy.userData.restOpacity = m.opacity;
          copy.userData.restTransparent = m.transparent;
          copy.userData.restDepthWrite = m.depthWrite;
          copies.set(m, copy);
        }
        return copies.get(m);
      };
      o.material = Array.isArray(o.material) ? o.material.map(clone) : clone(o.material);
    });
    g.userData.materials = [...copies.values()];
  });
  const workItems = [...document.querySelectorAll(".work-grid .project")];
  const hero = document.querySelector(".hero-content");
  let heroTravel = innerHeight, revealProgress = 0;
  // Project the live HTML hero onto the four screen corners, not an approximate box.
  function screenTransform(points, width, height) {
    const [a,b,c,d] = points;
    const dx1=b.x-c.x, dx2=d.x-c.x, dx3=a.x-b.x+c.x-d.x;
    const dy1=b.y-c.y, dy2=d.y-c.y, dy3=a.y-b.y+c.y-d.y;
    const det=dx1*dy2-dx2*dy1;
    const g=Math.abs(det)>1e-8 ? (dx3*dy2-dx2*dy3)/det : 0;
    const h=Math.abs(det)>1e-8 ? (dx1*dy3-dx3*dy1)/det : 0;
    return `matrix3d(${[(b.x-a.x+g*b.x)/width,(b.y-a.y+g*b.y)/width,0,g/width,
      (d.x-a.x+h*d.x)/height,(d.y-a.y+h*d.y)/height,0,h/height,
      0,0,1,0,a.x,a.y,0,1].join(",")})`;
  }
  let mobile = false,
    visible = true,
    frame,
    last = 0,
    p = 0,
    targetP = 0,
    clock = 0,
    lastScroll = -1,
    lastLamp = null,
    idleFrames = 0,
    qualityFrames = 0,
    slowFrames = 0;
  let reportedStage = -1,
    previousFocus = "";
  const pointer = new THREE.Vector2(),
    smooth = new THREE.Vector2();
  const resize = () => {
    const r = host.getBoundingClientRect();
    mobile = innerWidth < 900;
    renderer.setSize(r.width, r.height);
    camera.aspect = r.width / r.height;
    camera.fov = mobile ? 43 : 36;
    camera.updateProjectionMatrix();
    idleFrames = 0;
  };
  let anchors = [];
  const measure = () => {
    heroTravel = Math.max(1, document.getElementById("home").offsetHeight-innerHeight);
    anchors = ["home","about","work","approach","background","contact"].map(id =>
      document.getElementById(id).getBoundingClientRect().top + scrollY);
  };
  const onScroll = () => {
    if (!anchors.length) measure();
    const y = scrollY + innerHeight * .18;
    idleFrames = 0;
    const marks = [0,.2,.38,.68,.8,1];
    let index = anchors.findIndex((top,i) => i < anchors.length-1 && y >= top && y < anchors[i+1]);
    if (y >= anchors[5]) targetP = 1;
    else if (index >= 0) targetP = THREE.MathUtils.lerp(marks[index], marks[index+1], (y-anchors[index])/(anchors[index+1]-anchors[index]));
    else targetP = 0;
  };
  window.addEventListener("resize", measure);
  document.fonts.ready.then(() => { measure(); onScroll(); });
  const onPointer = (e) => {
    pointer.set(e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5);
    idleFrames = 0;
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    idleFrames = 0;
  });
  io.observe(host);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("pointermove", onPointer, { passive: true });
  resize();
  onScroll();
  function render(now) {
    frame = requestAnimationFrame(render);
    if (!visible || document.hidden || settings.current.suspended) return;
    const step = now - last;
    if (step < (low ? 32 : 16)) return;
    last = now;
    const still = settings.current.paused;
    const goal = targetP;
    const night = settings.current.night;
    if (Math.abs(revealProgress-Math.min(1,scrollY/heroTravel))<.0002 && (still || goal < .88) && Math.abs(p-goal)<.0002 && (still || smooth.distanceTo(pointer)<.002) && lastLamp === night && idleFrames > 5) return;
    renderer.toneMappingExposure = night ? .72 : 1.15;
    edge.emissive.set(night ? "#5872b5" : "#000000");
    edge.emissiveIntensity = night ? .18 : 0;
    p = still ? goal : p + (goal - p) * 0.085;
    smooth.lerp(still ? new THREE.Vector2() : pointer, 0.04);
    if (!still) clock += Math.min(step,50)/1000;
    const separation = THREE.MathUtils.smoothstep(p,.18,.45) * (1-THREE.MathUtils.smoothstep(p,.75,.95));
    const assembled = THREE.MathUtils.smoothstep(p,.90,.97);
    const revealGoal = Math.min(1,scrollY/heroTravel);
    revealProgress = still ? revealGoal : revealProgress+(revealGoal-revealProgress)*.12;
    const reveal = THREE.MathUtils.smoothstep(revealProgress,0,1);
    const active = workItems.findIndex(el => {const r=el.getBoundingClientRect(); return r.top < innerHeight*.65 && r.bottom > innerHeight*.35;});
    const stage = assembled > .8 ? 9 : active >= 0 ? active + 1 : 0;
    if (stage !== reportedStage || lastLamp !== night) {
      reportedStage = stage;

      const sctx = screenCanvas.getContext("2d");
      sctx.fillStyle = night ? "#111318" : "#edf0f5";
      sctx.fillRect(0,0,1280,800);
      sctx.save();
      sctx.scale(1280/innerWidth,800/innerHeight);
      sctx.fillStyle = night ? "#edf0f8" : "#17191f";
      const title=document.querySelector(".hero-name");
      const nameStyle=getComputedStyle(title);
      const secondStyle=getComputedStyle(title.querySelector(".second"));
      const titleSize=parseFloat(nameStyle.fontSize);
      const secondSize=parseFloat(secondStyle.fontSize);
      const left=title.offsetLeft, top=title.offsetTop;
      sctx.font = "10px monospace";
      sctx.fillText("INDEPENDENT MIND.",left,140);
      sctx.fillText("ENGINEERING INSTINCT.",left,154);
      sctx.font = "650 "+titleSize+"px "+nameStyle.fontFamily;
      sctx.fillText("ANSHADITYA",left,top+titleSize*.88+6);
      sctx.font = "italic "+secondSize+"px "+secondStyle.fontFamily;
      sctx.fillText("SHARMA.",left,top+title.querySelector(".name-line").offsetHeight+secondSize*.83+6);
      sctx.font = "19px Arial";
      sctx.fillText("Software engineer.",innerWidth-255,innerHeight-120);
      sctx.fillText("Curious by default.",innerWidth-255,innerHeight-95);
      sctx.restore();
      if (stage > 0) {
        sctx.fillStyle = "#101522"; sctx.fillRect(0,0,1280,800);
        sctx.fillStyle = "#9aaee5"; sctx.font = "22px monospace";
        sctx.fillText(stage === 9 ? "ANSHADITYA SHARMA / SAY HELLO" : "SELECTED WORK / 0" + stage,65,90);
        sctx.fillStyle = "#f5f6fa"; sctx.font = "72px Arial";
        const lines = stage === 9 ? ["Let's make","something","together."] :
          [["Trading","Exchange."],["GroundLink.","Adaptive missions."],["Behavioral","Anomaly Detection."],["EvoCreatures.","Learning to move."]][stage-1];
        lines.forEach((line,i)=>sctx.fillText(line,65,240+i*100));
        sctx.strokeStyle="#6889f7"; sctx.lineWidth=4; sctx.beginPath();
        for(let i=0;i<100;i++){const x=65+i*11;const y=650-Math.sin(i*.12+stage)*45-i*.6; i?sctx.lineTo(x,y):sctx.moveTo(x,y);} sctx.stroke();
      }
      screenTex.needsUpdate = true;
    }
    layers.forEach(g => {
      g.visible = true;
      g.position.set(0,g.userData.y+g.userData.spread*separation,0);
      g.rotation.set(0,0,0);
      for (const m of g.userData.materials) {
        m.opacity=m.userData.restOpacity;
        if (m.emissive && m.color.equals(edge.color)) {
          m.emissive.set(night ? "#5872b5" : "#000000");
          m.emissiveIntensity=night ? .18 : 0;
        }
      }
    });
    const autoAngle = assembled*Math.sin(clock*.25)*.3;
    hinge.rotation.x = -.14;
    root.rotation.set(.06*reveal,(-.42+separation*.25+(still?0:smooth.x*.17)+autoAngle)*reveal,-.06*reveal);
    root.position.set(mobile ? 0 : 4.1*reveal, mobile ? -.3*reveal-assembled*2.2 : -.15*reveal,0);
    root.scale.setScalar(mobile ? 1-reveal*.4 : 1.15-reveal*.25-separation*.1);
    camera.position.set((mobile?3:7)*reveal,2.1+reveal*3.1+separation*2,4+reveal*(mobile?9.5:8.5)+separation*4);
    camera.lookAt(mobile?0:.8*reveal,2.1-reveal*1.45+separation*.4,0);
    shadow.position.x = mobile?0:2.5;
    shadow.material.opacity = reveal*(1-separation*.4);
    scene.updateMatrixWorld(true);
    camera.updateMatrixWorld(true);
    if (hero) {
      const w=innerWidth,h=innerHeight;
      const corners=[[-2.215,1.365],[2.215,1.365],[2.215,-1.365],[-2.215,-1.365]];
      const full=[{x:0,y:0},{x:w,y:0},{x:w,y:h},{x:0,y:h}];
      const points=corners.map(([x,y],i)=>{
        const v=screen.localToWorld(new THREE.Vector3(x,y,0)).project(camera);
        const fit=THREE.MathUtils.smoothstep(reveal,0,.78);
        return {x:THREE.MathUtils.lerp(full[i].x,(v.x+1)*w/2,fit),
          y:THREE.MathUtils.lerp(full[i].y,(1-v.y)*h/2,fit)};
      });
      hero.style.transform = still ? "none" : screenTransform(points,w,h);
      hero.style.opacity = still ? (revealGoal<.5?"1":"0") : String(1-THREE.MathUtils.smoothstep(reveal,.99,1));
      hero.style.visibility = revealGoal>=1 ? "hidden" : "visible";
      hero.inert = revealGoal>.05;
    }
    host.style.visibility = reveal<.015 ? "hidden" : "visible";
    renderer.domElement.dataset.progress=p.toFixed(3);
    renderer.domElement.dataset.reveal=reveal.toFixed(3);
    renderer.domElement.dataset.separation=separation.toFixed(3);
    renderer.domElement.dataset.stage=stage;
    renderer.domElement.dataset.turn=autoAngle.toFixed(3);
    renderer.render(scene, camera);
    if (renderer.domElement.dataset.ready !== "true") {
      renderer.domElement.dataset.ready = "true";
      settings.current.onReady?.();
    }
    lastScroll = goal;
    lastLamp = night;
    previousFocus = settings.current.focus;
    idleFrames++;
    // Lower resolution once if the first rendered frames consistently miss budget.
    if (qualityFrames < 90) {
      qualityFrames++;
      if (step > 38) slowFrames++;
      if (qualityFrames === 90 && slowFrames > 45) {
        renderer.setPixelRatio(1);
        resize();
      }
    }
  }
  frame = requestAnimationFrame(render);
  return () => {
    cancelAnimationFrame(frame);
    ro.disconnect();
    io.disconnect();
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", measure);
    window.removeEventListener("pointermove", onPointer);
    const geos = new Set(),
      mats = new Set();
    scene.traverse((o) => {
      if (o.geometry) geos.add(o.geometry);
      if (o.material) mats.add(o.material);
    });
    geos.forEach((g) => g.dispose());
    mats.forEach((m) => Array.isArray(m) ? m.forEach(x => x.dispose()) : m.dispose());
    originalMaterials.forEach(m => m.dispose());
    [labelTex, screenTex, shadowTex, keysTexture].forEach((t) => t.dispose());
    env.dispose();
    pmrem.dispose();
    renderer.dispose();
    renderer.domElement.remove();
    if (hero) { hero.style.transform=""; hero.style.opacity=""; hero.style.visibility=""; hero.inert=false; }
  };
}
