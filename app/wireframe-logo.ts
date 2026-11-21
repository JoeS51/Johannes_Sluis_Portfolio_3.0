type Vec = [number, number, number];
type Edge = { points: Vec[]; normals: Vec[] };

const add = (a: Vec, b: Vec): Vec => a.map((n, i) => n + b[i]) as Vec;
const scale = (a: Vec, s: number): Vec => a.map((n) => n * s) as Vec;
const unit = (a: Vec) => scale(a, 1 / Math.hypot(...a));

function makeHexagonalPrism() {
  const ring = (z: number): Vec[] => Array.from({ length: 6 }, (_, i) => {
    const angle = Math.PI / 2 + i * Math.PI / 3;
    return [Math.cos(angle) * 0.86, Math.sin(angle) * 0.86, z];
  });
  const front = ring(0.4);
  const back = ring(-0.4);
  const panels: Vec[][] = [front, back];
  for (let i = 0; i < 6; i++) {
    const next = (i + 1) % 6;
    panels.push([front[i], front[next], back[next], back[i]]);
  }
  const edges = new Map<string, Edge>();
  const key = (point: Vec) => point.map((n) => n.toFixed(6)).join(",");
  for (const points of panels) {
    const normal = unit(points.reduce(add, [0, 0, 0]));
    points.forEach((a, i) => {
      const b = points[(i + 1) % points.length];
      const id = [key(a), key(b)].sort().join("|");
      const existing = edges.get(id);
      if (existing) existing.normals.push(normal);
      else edges.set(id, { points: [a, b], normals: [normal] });
    });
  }
  return [...edges.values()];
}

const geometry = makeHexagonalPrism();

export function drawWireframeLogo(canvas: HTMLCanvasElement, orientation: DOMMatrix) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const size = 40;
  const ratio = (window.devicePixelRatio || 1) * (46 / size);
  if (canvas.width !== Math.round(size * ratio)) {
    canvas.width = Math.round(size * ratio);
    canvas.height = canvas.width;
  }
  ctx.setTransform(canvas.width / size, 0, 0, canvas.height / size, 0, 0);
  ctx.clearRect(0, 0, size, size);
  const transform = ([x, y, z]: Vec): Vec => {
    const p = orientation.transformPoint(new DOMPoint(x, y, z));
    return [p.x, p.y, p.z];
  };
  const edges = geometry.map((edge) => ({
    points: edge.points.map(transform),
    front: edge.normals.some((normal) => transform(normal)[2] > 0),
  })).filter((edge) => edge.front);

  ctx.strokeStyle = getComputedStyle(canvas).color;
  ctx.lineWidth = 0.75;
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.95;
  for (const { points } of edges) {
    ctx.beginPath();
    points.forEach(([x, y], i) => {
      if (i === 0) ctx.moveTo(20 + x * 19, 20 - y * 19);
      else ctx.lineTo(20 + x * 19, 20 - y * 19);
    });
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}
