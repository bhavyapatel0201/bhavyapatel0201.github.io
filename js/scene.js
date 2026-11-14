/**
 * Scroll-driven 3D background (plain <canvas>, no libraries).
 *
 *  - A field of data points: scrolling down flies forward through it, scrolling up flies
 *    back; fast scrolling stretches the points into streaks.
 *  - One wireframe object built from the same set of points. Each section has its own
 *    technical shape (see SHAPE_FOR) and the points morph between shapes as you scroll,
 *    so scrolling back up reverses the morph. Scrolling also turns the object.
 *  - Swiping between sections (selector.js) morphs it and spins it in the swipe direction.
 *  - Drag / swipe sideways on the hero spins it by hand.
 *
 * Reduced motion: no flying, idle spin or streaks; the shape still changes per section.
 */
window.Scene = (function () {
  // Which shape each section shows. Edit freely: any key from SHAPES works.
  const SHAPE_FOR = {
    hero: 'sphere',
    experience: 'network',
    projects: 'tesseract',
    skills: 'orbits',
    certifications: 'icosahedron',
    about: 'helix',
    resume: 'wave',
    contact: 'torus',
  };
  const LABELS = {
    sphere: 'Neural sphere', network: 'Neural network', tesseract: 'Tesseract · 4D data cube',
    orbits: 'Atomic orbits', icosahedron: 'Icosahedron', helix: 'Double helix', wave: 'Wave field', torus: 'Torus',
  };

  const canvas = document.getElementById('sceneCanvas');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return { kick() {}, drag() {}, fling() {} };

  const reduced = () => window.Motion?.reduced();
  const small = window.innerWidth < 640;
  const N = small ? 150 : 230; // points in the object
  const STARS = small ? 140 : 260;
  const rand = (a, b) => a + Math.random() * (b - a);

  // ---------- Shape builders: each returns { pts: [[x,y,z]...N], links: [[i,j]...], wave? } ----------

  // Spread N points along a set of line segments; consecutive points on a segment are linked
  function alongEdges(edges) {
    const lengths = edges.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]));
    const total = lengths.reduce((s, l) => s + l, 0);
    const pts = []; const links = [];
    edges.forEach(([a, b], e) => {
      const count = Math.max(2, Math.round((lengths[e] / total) * N));
      for (let k = 0; k < count && pts.length < N; k++) {
        const t = k / (count - 1);
        if (k > 0) links.push([pts.length - 1, pts.length]);
        pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]);
      }
    });
    while (pts.length < N) pts.push(pts[pts.length % Math.max(1, pts.length)].slice());
    return { pts, links: links.filter(([i, j]) => i < N && j < N) };
  }

  // Link each point to its k nearest neighbours
  function nearestLinks(pts, k) {
    const links = [];
    pts.forEach((p, i) => {
      pts.map((q, j) => [j, (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 + (p[2] - q[2]) ** 2])
        .filter(([j]) => j > i).sort((a, b) => a[1] - b[1]).slice(0, k)
        .forEach(([j]) => links.push([i, j]));
    });
    return links;
  }

  const SHAPES = {
    sphere() {
      const g = Math.PI * (3 - Math.sqrt(5));
      const pts = Array.from({ length: N }, (_, i) => {
        const y = 1 - (i / (N - 1)) * 2; const r = Math.sqrt(1 - y * y);
        return [Math.cos(g * i) * r, y, Math.sin(g * i) * r];
      });
      return { pts, links: nearestLinks(pts, 3) };
    },

    network() {
      // Layers of a neural net, left to right; each node feeds a few nodes in the next layer
      const sizes = [0.14, 0.22, 0.28, 0.22, 0.14].map((f) => Math.round(f * N));
      sizes[2] += N - sizes.reduce((a, b) => a + b, 0);
      const pts = []; const layers = [];
      sizes.forEach((count, L) => {
        const x = -1.3 + (L * 2.6) / (sizes.length - 1);
        const cols = Math.ceil(Math.sqrt(count));
        const idx = [];
        for (let i = 0; i < count; i++) {
          const r = Math.floor(i / cols); const c = i % cols;
          const rows = Math.ceil(count / cols);
          idx.push(pts.length);
          pts.push([x, (r / Math.max(1, rows - 1) - 0.5) * 1.6 * (count / N + 0.6), (c / Math.max(1, cols - 1) - 0.5) * 1.2]);
        }
        layers.push(idx);
      });
      const links = [];
      layers.slice(0, -1).forEach((layer, L) => {
        const next = layers[L + 1];
        layer.forEach((i) => { for (let k = 0; k < 3; k++) links.push([i, next[Math.floor(Math.random() * next.length)]]); });
      });
      return { pts, links, pulses: true };
    },

    tesseract() {
      // Outer cube, inner cube and the 8 struts joining them (a 4D hypercube's shadow)
      const cube = (s) => [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x * s, y * s, z * s])));
      const o = cube(0.95); const n = cube(0.45);
      const edges = [];
      for (let i = 0; i < 8; i++) {
        for (let j = i + 1; j < 8; j++) {
          const diff = [0, 1, 2].filter((a) => o[i][a] !== o[j][a]).length;
          if (diff === 1) { edges.push([o[i], o[j]]); edges.push([n[i], n[j]]); }
        }
        edges.push([o[i], n[i]]);
      }
      return alongEdges(edges);
    },

    orbits() {
      // Nucleus + three tilted electron orbits
      const pts = []; const links = [];
      const core = Math.round(N * 0.16);
      for (let i = 0; i < core; i++) {
        const u = rand(0, Math.PI * 2); const v = Math.acos(rand(-1, 1)); const r = rand(0.05, 0.22);
        pts.push([r * Math.sin(v) * Math.cos(u), r * Math.cos(v), r * Math.sin(v) * Math.sin(u)]);
      }
      links.push(...nearestLinks(pts, 2));
      const per = Math.floor((N - core) / 3);
      [0, Math.PI / 3, -Math.PI / 3].forEach((tilt, o) => {
        const count = o === 2 ? N - pts.length : per;
        const start = pts.length;
        for (let k = 0; k < count; k++) {
          const a = (k / count) * Math.PI * 2;
          const x = Math.cos(a) * 1.25; const y = Math.sin(a) * 0.45;
          pts.push([x, y * Math.cos(tilt), y * Math.sin(tilt) + x * Math.sin(tilt) * 0.3]);
          if (k > 0) links.push([pts.length - 2, pts.length - 1]);
        }
        links.push([pts.length - 1, start]);
      });
      return { pts, links };
    },

    icosahedron() {
      const t = (1 + Math.sqrt(5)) / 2;
      const v = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]]
        .map((p) => p.map((c) => c / Math.hypot(1, t)));
      const edges = [];
      for (let i = 0; i < 12; i++) {
        for (let j = i + 1; j < 12; j++) {
          if (Math.abs(Math.hypot(v[i][0] - v[j][0], v[i][1] - v[j][1], v[i][2] - v[j][2]) - 1.0515) < 0.05) edges.push([v[i], v[j]]);
        }
      }
      return alongEdges(edges);
    },

    helix() {
      // DNA-style double helix with rungs
      const pts = []; const links = [];
      const pairs = Math.floor(N / 2);
      for (let k = 0; k < pairs; k++) {
        const y = -1.3 + (k / (pairs - 1)) * 2.6; const a = k * 0.32;
        pts.push([Math.cos(a) * 0.55, y, Math.sin(a) * 0.55]);
        pts.push([Math.cos(a + Math.PI) * 0.55, y, Math.sin(a + Math.PI) * 0.55]);
        const i = pts.length - 2;
        if (k > 0) { links.push([i - 2, i]); links.push([i - 1, i + 1]); }
        if (k % 3 === 0) links.push([i, i + 1]);
      }
      while (pts.length < N) pts.push([0, 0, 0]);
      return { pts, links };
    },

    wave() {
      // A rippling grid, like a signal surface
      const cols = Math.ceil(Math.sqrt(N * 1.4)); const rows = Math.ceil(N / cols);
      const pts = []; const links = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols && pts.length < N; c++) {
          // Grid tilted toward the viewer (0.9 rad) so the ripples are visible, not edge-on
          const gz = (r / Math.max(1, rows - 1) - 0.5) * 2.2;
          pts.push([(c / (cols - 1) - 0.5) * 2.8, gz * Math.sin(0.9), gz * Math.cos(0.9)]);
          const i = pts.length - 1;
          if (c > 0) links.push([i - 1, i]);
          if (r > 0) links.push([i - cols, i]);
        }
      }
      return { pts, links, wave: true };
    },

    torus() {
      const ring = Math.round(Math.sqrt(N * 2.2)); const tube = Math.floor(N / ring);
      const pts = []; const links = [];
      for (let i = 0; i < ring; i++) {
        for (let j = 0; j < tube; j++) {
          const u = (i / ring) * Math.PI * 2; const v = (j / tube) * Math.PI * 2;
          pts.push([(1 + 0.38 * Math.cos(v)) * Math.cos(u), 0.38 * Math.sin(v), (1 + 0.38 * Math.cos(v)) * Math.sin(u)]);
          const idx = i * tube + j;
          links.push([idx, i * tube + ((j + 1) % tube)]);
          links.push([idx, ((i + 1) % ring) * tube + j]);
        }
      }
      while (pts.length < N) pts.push(pts[pts.length % (ring * tube)].slice());
      return { pts, links: links.filter(([a, b]) => a < N && b < N) };
    },
  };

  // Build every shape, then scale each to the same radius so none dwarfs the others
  const shapes = {};
  Object.keys(SHAPES).forEach((k) => {
    const shape = SHAPES[k]();
    const maxR = Math.max(...shape.pts.map((p) => Math.hypot(p[0], p[1], p[2]))) || 1;
    shape.pts = shape.pts.map((p) => p.map((c) => c / maxR));
    shapes[k] = shape;
  });

  // ---------- Floating wireframe solids (parallax depth layers) ----------
  const SOLIDS = {
    cube: {
      v: [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x, y, z]))).map((p) => p.map((c) => c * 0.6)),
      e: [[0, 1], [0, 2], [0, 4], [1, 3], [1, 5], [2, 3], [2, 6], [3, 7], [4, 5], [4, 6], [5, 7], [6, 7]],
    },
    octahedron: {
      v: [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]],
      e: [[0, 2], [0, 3], [0, 4], [0, 5], [1, 2], [1, 3], [1, 4], [1, 5], [2, 4], [2, 5], [3, 4], [3, 5]],
    },
    tetrahedron: {
      v: [[1, 1, 1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1]].map((p) => p.map((c) => c * 0.7)),
      e: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]],
    },
  };
  const solidKinds = Object.keys(SOLIDS);
  const FLOAT_COUNT = small ? 7 : 12;
  const Z_NEAR = 1.6; const Z_SPAN = 12; // world depth range the solids travel through
  const floaters = Array.from({ length: FLOAT_COUNT }, (_, i) => {
    const side = i % 2 ? 1 : -1; // keep them toward the edges, away from the main text column
    return {
      kind: solidKinds[i % solidKinds.length],
      x: side * rand(1.6, 4.2), y: rand(-2.4, 2.4), z0: rand(0, Z_SPAN),
      size: rand(0.22, 0.45), rx: rand(0, 6), ry: rand(0, 6), spin: rand(0.002, 0.006) * (Math.random() < 0.5 ? -1 : 1),
    };
  });

  // ---------- State ----------
  const cur = shapes.sphere.pts.map((p) => p.slice()); // live point positions
  const stars = Array.from({ length: STARS }, () => [rand(-1, 1), rand(-1, 1), Math.random()]);
  let pulses = [];
  let w = 0; let h = 0; let dpr = 1;
  let rotY = 0.5; let rotX = -0.2; let spinVel = 0; let tiltVelX = 0;
  let lastScroll = window.scrollY; let scrollVel = 0; let flight = 0;
  let px = 0; let py = 0; let tpx = 0; let tpy = 0; // pointer parallax
  let shapeA = 'sphere'; let shapeB = 'sphere'; let mix = 0; let mixShown = 0;
  let colors = {};
  let running = false; let frame = 0; let dragPrev = null; let time = 0;
  const hud = document.getElementById('sceneHud');

  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    const light = document.documentElement.getAttribute('data-theme') === 'light';
    colors = {
      node: cs.getPropertyValue('--accent-primary').trim() || '#6366f1',
      link: cs.getPropertyValue('--accent-cyan').trim() || '#22d3ee',
      star: light ? '#475569' : '#cbd5e1',
      alpha: light ? 0.45 : 0.75, // kept soft so text on top stays easy to read
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    request();
  }

  // ---------- Which shapes, and how far between them, for the current scroll position ----------
  function layoutTop(el) { let y = 0; for (let n = el; n; n = n.offsetParent) y += n.offsetTop; return y; }

  function anchors() {
    return [...document.querySelectorAll('#hero, .selectable-pane, #resume, #contact')]
      .filter((el) => el.getClientRects().length && SHAPE_FOR[el.id])
      .map((el) => ({ id: el.id, top: layoutTop(el) }));
  }

  function updateTarget() {
    const list = anchors();
    if (!list.length) return;
    const probe = window.scrollY + h * 0.55;
    let i = 0;
    while (i < list.length - 1 && list[i + 1].top <= probe) i++;
    const next = list[i + 1];
    const zone = h * 0.7; // morph across the last 70% of a viewport before the next section
    const t = next ? Math.min(1, Math.max(0, (probe - (next.top - zone)) / zone)) : 0;
    shapeA = SHAPE_FOR[list[i].id];
    shapeB = next ? SHAPE_FOR[next.id] : shapeA;
    mix = t * t * (3 - 2 * t); // smoothstep
    const active = mix > 0.5 ? shapeB : shapeA;
    if (hud) {
      const pct = Math.round((window.scrollY / Math.max(1, document.documentElement.scrollHeight - h)) * 100);
      hud.textContent = `${LABELS[active]} · ${String(pct).padStart(2, '0')}%`;
    }
  }

  // ---------- Rendering ----------
  function project(p, R, cx, cy) {
    const ay = rotY + px * 0.4; const ax = rotX + py * 0.3;
    let [x, y, z] = p;
    let c = Math.cos(ay); let s = Math.sin(ay);
    [x, z] = [x * c + z * s, -x * s + z * c];
    c = Math.cos(ax); s = Math.sin(ax);
    [y, z] = [y * c - z * s, y * s + z * c];
    const persp = 2.4 / (2.4 + z); // strong perspective: near side clearly bigger than far side
    return [cx + x * R * persp, cy + y * R * persp, z, persp];
  }

  // Camera-space projection for the floor grid and floating solids
  function world(x, y, z, cx, cy) {
    const F = h * 0.85;
    return [cx + (x * F) / z, cy + (y * F) / z];
  }

  // Perspective floor grid; it slides toward the viewer as you scroll down
  function drawFloor(cx, cy) {
    const Y = 2.3; const STEP = 1.2; const FAR = 22;
    const offset = ((flight * 9) % STEP + STEP) % STEP;
    ctx.strokeStyle = colors.link; ctx.lineWidth = 1;
    for (let z = STEP - offset + 1; z < FAR; z += STEP) { // lines across, fading with distance
      const [x1, y1] = world(-14, Y, z, cx, cy); const [x2] = world(14, Y, z, cx, cy);
      if (y1 > h + 2) continue;
      ctx.globalAlpha = 0.16 * (1 - z / FAR) * colors.alpha;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y1); ctx.stroke();
    }
    for (let x = -14; x <= 14; x += STEP) { // lines running into the distance
      for (let z = 1; z < FAR; z += 3) {
        const [ax, ay] = world(x, Y, z, cx, cy); const [bx, by] = world(x, Y, z + 3, cx, cy);
        ctx.globalAlpha = 0.12 * (1 - z / FAR) * colors.alpha;
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
      }
    }
  }

  // Floating wireframe solids; front = only those nearer than the main object
  function drawFloaters(cx, cy, front) {
    ctx.strokeStyle = colors.node;
    floaters.forEach((f) => {
      const z = Z_NEAR + (((f.z0 - flight * 7) % Z_SPAN) + Z_SPAN) % Z_SPAN;
      if ((z < 3.2) !== front) return;
      // Fade in far away, fade out just before passing the camera (no popping)
      const fog = Math.min(1, (Z_NEAR + Z_SPAN - z) / 3) * Math.min(1, (z - Z_NEAR) / 1.2);
      if (fog <= 0.01) return;
      const solid = SOLIDS[f.kind];
      const cX = Math.cos(f.rx); const sX = Math.sin(f.rx); const cY = Math.cos(f.ry); const sY = Math.sin(f.ry);
      const pts = solid.v.map(([vx, vy, vz]) => {
        let x = vx * cY + vz * sY; let zz = -vx * sY + vz * cY;
        const y = vy * cX - zz * sX; zz = vy * sX + zz * cX;
        return world(f.x + x * f.size, f.y + y * f.size, z + zz * f.size, cx, cy);
      });
      ctx.globalAlpha = 0.55 * fog * colors.alpha;
      ctx.lineWidth = Math.max(0.8, 2.4 / z * 1.6);
      ctx.beginPath();
      solid.e.forEach(([a, b]) => { ctx.moveTo(pts[a][0], pts[a][1]); ctx.lineTo(pts[b][0], pts[b][1]); });
      ctx.stroke();
    });
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2 + px * 30; const cy = h / 2 + py * 20;

    // Star field: depth flies with scroll; streak length follows scroll speed
    ctx.fillStyle = colors.star; ctx.strokeStyle = colors.star;
    const streak = reduced() ? 0 : Math.max(-0.12, Math.min(0.12, scrollVel * 0.0009));
    stars.forEach((s) => {
      const z = 0.04 + (((s[2] - flight) % 0.96) + 0.96) % 0.96;
      const sx = cx + (s[0] * w * 0.5) / (z * 2.2); const sy = cy + (s[1] * h * 0.5) / (z * 2.2);
      if (sx < -20 || sx > w + 20 || sy < -20 || sy > h + 20) return;
      const a = Math.min(1, (1 - z) * 1.1) * 0.7 * colors.alpha;
      ctx.globalAlpha = a;
      const z2 = z + streak;
      if (Math.abs(streak) > 0.004 && z2 > 0.04 && z2 < 1) {
        ctx.lineWidth = Math.max(0.6, (1 - z) * 1.8);
        ctx.beginPath(); ctx.moveTo(sx, sy);
        ctx.lineTo(cx + (s[0] * w * 0.5) / (z2 * 2.2), cy + (s[1] * h * 0.5) / (z2 * 2.2));
        ctx.stroke();
      } else {
        ctx.beginPath(); ctx.arc(sx, sy, Math.max(0.4, (1 - z) * 1.6), 0, Math.PI * 2); ctx.fill();
      }
    });

    drawFloor(cx, cy);
    drawFloaters(cx, cy, false);

    // Object
    const R = Math.min(w, h) * (w < 640 ? 0.32 : 0.28);
    const proj = cur.map((p) => project(p, R, cx, cy));
    const linkSets = [[shapes[shapeA].links, 1 - mixShown], [shapes[shapeB].links, mixShown]];
    ctx.strokeStyle = colors.link; ctx.lineWidth = 1;
    linkSets.forEach(([links, weight]) => {
      if (weight < 0.02) return;
      links.forEach(([a, b]) => {
        const pa = proj[a]; const pb = proj[b];
        ctx.globalAlpha = (0.06 + (1 - ((pa[2] + pb[2]) / 2 + 1.3) / 2.6) * 0.32) * weight * colors.alpha;
        ctx.beginPath(); ctx.moveTo(pa[0], pa[1]); ctx.lineTo(pb[0], pb[1]); ctx.stroke();
      });
    });
    // Nodes back-to-front, drawn as small lit spheres: bigger and brighter when near, fogged when far
    const order = proj.map((_, i) => i).sort((a, b) => proj[b][2] - proj[a][2]);
    order.forEach((i) => {
      const [x, y, z, persp] = proj[i];
      const near = Math.max(0, Math.min(1, 1 - (z + 1) / 2)); // 1 = front, 0 = back
      const r = 0.8 + persp * persp * 2.6;
      ctx.globalAlpha = (0.18 + near * 0.75) * colors.alpha;
      ctx.fillStyle = colors.node;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      if (near > 0.45 && r > 2) { // specular highlight on front nodes
        ctx.globalAlpha = (near - 0.3) * 0.8 * colors.alpha;
        ctx.fillStyle = colors.star;
        ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.4, 0, Math.PI * 2); ctx.fill();
      }
    });

    // Signal pulses travelling along the neural network's links
    const netWeight = (shapeA === 'network' ? 1 - mixShown : 0) + (shapeB === 'network' ? mixShown : 0);
    if (netWeight > 0.05) {
      ctx.fillStyle = colors.link;
      pulses.forEach((pl) => {
        const pa = proj[pl.a]; const pb = proj[pl.b];
        ctx.globalAlpha = netWeight * 0.9 * colors.alpha;
        ctx.beginPath(); ctx.arc(pa[0] + (pb[0] - pa[0]) * pl.t, pa[1] + (pb[1] - pa[1]) * pl.t, 2, 0, Math.PI * 2); ctx.fill();
      });
    }

    drawFloaters(cx, cy, true); // nearest solids pass in front of the object
    ctx.globalAlpha = 1;
  }

  function step() {
    frame = 0;
    time += 1;
    const calm = reduced();

    // Scroll speed (smoothed): drives flight direction, streaks and spin
    const y = window.scrollY;
    const dy = y - lastScroll; lastScroll = y;
    scrollVel += (dy - scrollVel) * 0.2;
    if (!calm) {
      flight += dy * 0.00045 + 0.00012; // scroll down = fly forward, up = fly back
      spinVel += dy * 0.00003; // scrolling turns the object
    }

    if (!calm) { // solids tumble, faster while scrolling
      floaters.forEach((f) => { f.ry += f.spin + dy * 0.0012; f.rx += f.spin * 0.6; });
    }
    rotY += spinVel + (calm ? 0 : 0.0015);
    rotX = Math.max(-1, Math.min(1, rotX + tiltVelX));
    spinVel *= 0.94; tiltVelX *= 0.9;
    px += (tpx - px) * 0.05; py += (tpy - py) * 0.05;

    updateTarget();
    mixShown += (mix - mixShown) * (calm ? 1 : 0.12);
    const A = shapes[shapeA]; const B = shapes[shapeB];
    const ease = calm ? 1 : 0.09; // points glide to their new spot (smooth even after a jump)
    for (let i = 0; i < N; i++) {
      const a = A.pts[i]; const b = B.pts[i];
      let tx = a[0] + (b[0] - a[0]) * mixShown;
      let ty = a[1] + (b[1] - a[1]) * mixShown;
      const tz = a[2] + (b[2] - a[2]) * mixShown;
      const waveW = (A.wave ? 1 - mixShown : 0) + (B.wave ? mixShown : 0);
      if (waveW) ty += Math.sin(tx * 2.4 + time * 0.03 + y * 0.004) * Math.cos(tz * 2 + time * 0.02) * 0.22 * waveW;
      cur[i][0] += (tx - cur[i][0]) * ease;
      cur[i][1] += (ty - cur[i][1]) * ease;
      cur[i][2] += (tz - cur[i][2]) * ease;
    }

    // Pulses run faster while scrolling
    if (!calm && (A.pulses || B.pulses)) {
      const links = (B.pulses ? B : A).links;
      while (pulses.length < 14) { const [a, b] = links[Math.floor(Math.random() * links.length)]; pulses.push({ a, b, t: 0 }); }
      pulses.forEach((pl) => { pl.t += 0.012 + Math.abs(scrollVel) * 0.0015; });
      pulses = pulses.filter((pl) => pl.t < 1);
    } else pulses = [];

    draw();

    const moving = !calm || Math.abs(spinVel) > 1e-5 || Math.abs(tiltVelX) > 1e-5 || Math.abs(mix - mixShown) > 1e-3 || Math.abs(tpx - px) > 1e-3;
    if (moving && !document.hidden) frame = requestAnimationFrame(step);
    else running = false;
  }

  function request() {
    if (running) return;
    running = true;
    frame = requestAnimationFrame(step);
  }

  // ---------- Wiring ----------
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('portfolio:sections-changed', request);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) request(); });
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch' || reduced()) return;
    tpx = e.clientX / w - 0.5; tpy = e.clientY / h - 0.5;
    request();
  }, { passive: true });
  new MutationObserver(() => { readColors(); request(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener?.('change', request);

  readColors();
  resize();
  request();

  return {
    // Section changed by a swipe/tab: spin the way the content moved
    kick(dir) { spinVel += (dir > 0 ? -1 : 1) * 0.05; request(); },
    // Hand-spin from the hero
    drag(dx, dy) {
      const prev = dragPrev || { dx: 0, dy: 0 };
      rotY += (dx - prev.dx) * 0.006;
      rotX = Math.max(-1, Math.min(1, rotX + (dy - prev.dy) * 0.004));
      dragPrev = { dx, dy }; spinVel = 0; tiltVelX = 0;
      request();
    },
    fling(vx, vy) {
      dragPrev = null;
      spinVel = Math.max(-0.12, Math.min(0.12, vx * 0.06));
      tiltVelX = Math.max(-0.04, Math.min(0.04, vy * 0.02));
      request();
    },
    release() { dragPrev = null; },
  };
})();
