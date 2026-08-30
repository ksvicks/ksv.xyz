/**
 * Nadir — the similarity search, running in the visitor's browser.
 *
 * The original demo asks a Python server for matches: it holds 1050 chip
 * embeddings of 1024 dimensions and answers each click with one matrix
 * multiply. That is about a million multiply-adds, which finishes faster than
 * the network round trip that carries the question. So the server is not
 * earning its place, and this module does the same multiply here instead.
 *
 * What that buys is a demo with nothing behind it — no process to keep alive,
 * no cold start, no bill. What it costs is a 2.15 MB download before the first
 * search works, which is why `loadIndex` reports progress.
 *
 * It stops being the right trade somewhere around a hundred thousand chips,
 * when the download outgrows the round trip it saves.
 */

export interface Chip {
  id: string
  lon: number
  lat: number
  /** Mean NDVI over the chip: bare soil near 0, dense canopy near 1. */
  ndvi: number
  /** Four corners, [lon, lat], in the order scripts/chip.py emits them. */
  poly: [number, number][]
}

export interface NadirMeta {
  model: string
  dim: number
  count: number
  /** [[south, west], [north, east]] — Leaflet's order, not GeoJSON's. */
  bounds: [[number, number], [number, number]]
  chipMetres: number
  quantised: string
}

export interface NadirIndex {
  meta: NadirMeta
  chips: Chip[]
  /** Row-major, count x dim. */
  vectors: Int16Array
  /** Per-row multiplier that turns a row back into its unit-length float32. */
  scales: Float32Array
}

export interface Hit {
  chip: Chip
  /** Cosine similarity against the query chip, 0 to 1. */
  score: number
}

export interface SearchResult {
  query: Chip
  hits: Hit[]
  /** Wall-clock for the multiply, so the page can show what it cost. */
  ms: number
}

/** "NDR2" — bumped from NDR1 when the vectors went from int8 to int16. */
const MAGIC = "NDR2"
const HEADER = 12
export const DEFAULT_K = 10

/**
 * Streamed fetch, so a 2.15 MB file can drive a progress bar.
 *
 * Falls back to a plain buffered read when the response has no length to
 * measure against — a proxy that strips Content-Length should cost the
 * visitor a stuck progress bar, not a failed load.
 */
async function fetchBytes(
  url: string,
  onProgress?: (fraction: number) => void,
): Promise<Uint8Array> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} — ${res.status}`)

  const total = Number(res.headers.get("content-length"))
  if (!res.body || !total) return new Uint8Array(await res.arrayBuffer())

  const reader = res.body.getReader()
  const parts: Uint8Array[] = []
  let seen = 0

  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    parts.push(value)
    seen += value.length
    onProgress?.(Math.min(1, seen / total))
  }

  const out = new Uint8Array(seen)
  let at = 0
  for (const part of parts) {
    out.set(part, at)
    at += part.length
  }
  return out
}

/**
 * magic | uint32 count | uint32 dim | float32 scales | int16 rows.
 *
 * Little-endian, which is what every browser this will run in uses and what
 * DataView is explicitly told to expect below. The header is 12 bytes so the
 * float32 block starts 4-byte aligned, and 12 + 4 * count is even for any
 * count, so the int16 block is aligned too — both can be typed-array views
 * straight onto the buffer with no copy.
 */
function parseVectors(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const magic = String.fromCharCode(...bytes.subarray(0, 4))
  if (magic !== MAGIC) {
    throw new Error(`vectors.bin is not ${MAGIC} (found "${magic}")`)
  }

  const count = view.getUint32(4, true)
  const dim = view.getUint32(8, true)
  const scalesAt = bytes.byteOffset + HEADER
  const rowsAt = scalesAt + 4 * count

  const expected = HEADER + 4 * count + 2 * count * dim
  if (bytes.byteLength !== expected) {
    throw new Error(
      `vectors.bin is ${bytes.byteLength} bytes, expected ${expected} ` +
        `for ${count} x ${dim}`,
    )
  }

  return {
    count,
    dim,
    scales: new Float32Array(bytes.buffer, scalesAt, count),
    vectors: new Int16Array(bytes.buffer, rowsAt, count * dim),
  }
}

/** Fetch and assemble the index. The two small JSON files go in parallel with
    each other but before the big one, so a 404 fails fast and cheaply. */
export async function loadIndex(
  base = "/nadir",
  onProgress?: (fraction: number) => void,
): Promise<NadirIndex> {
  const read = async <T,>(name: string): Promise<T> => {
    const res = await fetch(`${base}/${name}`)
    if (!res.ok) throw new Error(`${base}/${name} — ${res.status}`)
    return res.json() as Promise<T>
  }

  const [meta, chips] = await Promise.all([
    read<NadirMeta>("meta.json"),
    read<Chip[]>("chips.json"),
  ])

  const parsed = parseVectors(await fetchBytes(`${base}/vectors.bin`, onProgress))

  if (parsed.count !== chips.length || parsed.dim !== meta.dim) {
    throw new Error(
      `vectors.bin holds ${parsed.count} x ${parsed.dim} but chips.json has ` +
        `${chips.length} rows and meta.json says ${meta.dim} dimensions`,
    )
  }

  return { meta, chips, vectors: parsed.vectors, scales: parsed.scales }
}

/**
 * The chip a click landed in, or the closest one to it.
 *
 * Plain squared degrees, matching serve.py's `nearest`. It is not a real
 * distance — a degree of longitude is shorter than one of latitude — but over
 * a 50 km region at 8.7 degrees north the error is under half a percent, far
 * too small to pick a different 1.28 km square.
 */
export function nearestChip(index: NadirIndex, lon: number, lat: number): number {
  let best = 0
  let bestDistance = Infinity

  for (let i = 0; i < index.chips.length; i++) {
    const chip = index.chips[i]
    const dx = chip.lon - lon
    const dy = chip.lat - lat
    const distance = dx * dx + dy * dy
    if (distance < bestDistance) {
      bestDistance = distance
      best = i
    }
  }
  return best
}

/**
 * Cosine similarity against every chip, then the best k.
 *
 * The stored rows are int16, so the dot product is a sum of at most 1024
 * integer products below 2^30. That tops out around 1.1e12, well inside the
 * 2^53 a JavaScript number holds exactly, so the accumulator never loses a bit
 * before the two scales turn it back into a cosine.
 */
export function similar(
  index: NadirIndex,
  row: number,
  k = DEFAULT_K,
): Hit[] {
  const { vectors, scales, chips } = index
  const { count, dim } = index.meta

  const queryAt = row * dim
  const queryScale = scales[row]
  const scores = new Float32Array(count)

  for (let j = 0; j < count; j++) {
    const at = j * dim
    let dot = 0
    for (let d = 0; d < dim; d++) dot += vectors[queryAt + d] * vectors[at + d]
    scores[j] = dot * queryScale * scales[j]
  }

  // A chip is never its own match. Ranking 1049 numbers is a rounding error
  // next to the multiply above, so a full sort is not worth avoiding.
  const order: number[] = []
  for (let j = 0; j < count; j++) if (j !== row) order.push(j)
  order.sort((a, b) => scores[b] - scores[a])

  return order.slice(0, k).map((j) => ({ chip: chips[j], score: scores[j] }))
}

/** Click to answer: find the chip, rank the rest, and time the ranking. */
export function search(
  index: NadirIndex,
  lon: number,
  lat: number,
  k = DEFAULT_K,
): SearchResult {
  const row = nearestChip(index, lon, lat)
  const started = performance.now()
  const hits = similar(index, row, k)
  return { query: index.chips[row], hits, ms: performance.now() - started }
}

/**
 * The colour ramp scripts/chip.py paints the NDVI raster with — linear between
 * stops, clamped outside them, floored the way its uint8 cast is. Kept
 * identical so a grid square and the raster beneath it come out the same
 * colour rather than nearly the same.
 */
const STOPS = [-1, 0, 0.2, 0.4, 0.6, 1]
const RAMP = [
  [69, 117, 180],
  [190, 174, 130],
  [222, 213, 140],
  [150, 190, 100],
  [70, 150, 60],
  [20, 90, 35],
]

export function ndviColour(value: number): string {
  let i = 1
  while (i < STOPS.length - 1 && value > STOPS[i]) i++
  const span = STOPS[i] - STOPS[i - 1]
  const t = Math.min(1, Math.max(0, (value - STOPS[i - 1]) / span))

  const hex = [0, 1, 2]
    .map((c) =>
      Math.floor(RAMP[i - 1][c] + t * (RAMP[i][c] - RAMP[i - 1][c]))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")
  return `#${hex}`
}
