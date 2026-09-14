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
  function layer(y, start, end, offset = 6) {
    const g = new THREE.Group();
    g.position.y = y;
    g.userData = { y, start, end, offset };
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
  const bottom = layer(-.14, .75, .92, 3),
    battery = layer(-.02, .55, .75, 4),
    board = layer(.08, .36, .55, 5),
    cooling = layer(.17, .22, .36, 6),
    deck = layer(.26, .08, .22, 6),
    display = layer(.31, 0, 0, 0);
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
  let turn = 0;
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
    camera.fov = mobile ? 32 : 36;
    camera.updateProjectionMatrix();
    idleFrames = 0;
  };
  let anchors = [];
  const measure = () => {
    anchors = ["home","about","work","approach","background","contact"].map(id =>
      document.getElementById(id).getBoundingClientRect().top + scrollY);
  };
  const onScroll = () => {
    if (!anchors.length) measure();
    const y = scrollY + innerHeight * .18;
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
    if ((still || goal < .98) && Math.abs(p-goal)<.0002 && (still || smooth.distanceTo(pointer)<.002) && lastLamp === night && idleFrames > 5) return;
    renderer.toneMappingExposure = night ? .72 : 1.15;
    edge.emissive.set(night ? "#5872b5" : "#000000");
    edge.emissiveIntensity = night ? .18 : 0;
    p = still ? goal : p + (goal - p) * 0.085;
    smooth.lerp(still ? new THREE.Vector2() : pointer, 0.04);
    clock += Math.min(step, 0.05 * 1000) / 1000;
    const launching = THREE.MathUtils.smoothstep(p, .9, 1);
    const active = workItems.findIndex(el => {const r=el.getBoundingClientRect(); return r.top < innerHeight*.65 && r.bottom > innerHeight*.35;});
    const stage = launching > .8 ? 9 : active >= 0 ? active + 1 : 0;
    if (stage !== reportedStage) {
      reportedStage = stage;

      const sctx = screenCanvas.getContext("2d");
      sctx.drawImage(screenSnapshot, 0, 0);
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
    let assembled = 0;
    layers.forEach((g, i) => {
      const { start, end, y, offset, materials } = g.userData;
      const t = end === 0 ? 1 : THREE.MathUtils.clamp((p-start)/(end-start), 0, 1);
      const arrival = still ? (t > 0 ? 1 : 0) : 1 - Math.pow(1-t, 3);
      const fade = THREE.MathUtils.smoothstep(t, 0, .28);
      g.visible = arrival > 0;
      g.position.set((i % 2 ? -.45 : .45) * (1-arrival), y-offset*(1-arrival), .3*(1-arrival));
      g.rotation.set((i % 2 ? -.22 : .22)*(1-arrival), 0, .06*(1-arrival));
      for (const m of materials) {
        m.opacity = m.userData.restOpacity * (end === 0 || still ? 1 : fade);
        const transparent = m.userData.restTransparent || m.opacity < 1;
        if (transparent !== m.transparent) { m.transparent = transparent; m.needsUpdate = true; }
        m.depthWrite = m.opacity > .98 && m.userData.restDepthWrite;
      }
      if (t >= .999) assembled++;
    });
    if (!still && p > .98) turn += Math.min(step,50) / 1000 * .065;
    if (p < .9) turn = 0;
    hinge.rotation.x = -.14;
    root.rotation.set(.04, -.3 + p*.18 + turn*launching + (still ? 0 : smooth.x*.13), -.035);
    root.position.set(0, -.1, 0);
    root.scale.setScalar(1);
    camera.position.set((mobile ? 2.4 : 3.8)-p*1.8, (mobile ? 3.2 : 4.2)-p*.8 + (still ? 0 : smooth.y*.18), (mobile ? 8.2 : 10.2) + p*1.3);
    camera.lookAt(0, .8, 0);
    shadow.position.x = 0;
    shadow.material.opacity = THREE.MathUtils.smoothstep(p,.75,.94)*.65;
    renderer.domElement.dataset.progress = p.toFixed(3);
    renderer.domElement.dataset.layers = assembled;
    renderer.domElement.dataset.stage = stage;
    renderer.domElement.dataset.turn = turn.toFixed(3);
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
  };
}
