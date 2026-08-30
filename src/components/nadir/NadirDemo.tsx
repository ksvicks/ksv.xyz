"use client"

import "leaflet/dist/leaflet.css"
import { useCallback, useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import type * as LT from "leaflet"
import {
  DEFAULT_K,
  loadIndex,
  ndviColour,
  search,
  type NadirIndex,
  type SearchResult,
} from "@/lib/nadir"

/** Two spots that return an obviously sensible answer, so the first thing a
    visitor sees is a real result rather than an empty map and an instruction. */
const EXAMPLES = [
  { label: "Open dry land", lon: 77.638, lat: 8.8496 },
  { label: "Forest edge", lon: 77.462, lat: 8.596 },
]

/**
 * The site is monochrome on purpose, but a map is not chrome — the query has
 * to be tellable from its matches at a glance, over a green-and-tan raster,
 * in either theme. So exactly one hue enters: vermillion for the chip you
 * picked. The matches stay ink, flipped with the theme so they hold contrast
 * against a light or a dark basemap.
 */
const QUERY = "#dc4a1e"

type Theme = "dark" | "light"

/** `fill` draws the square and its rank badge; `ink` is what stays readable
    on top of `fill`. Paired here so the two can never drift apart. */
const MATCH: Record<Theme, { fill: string; ink: string }> = {
  dark: { fill: "#f2ede4", ink: "#1b1714" },
  light: { fill: "#1b1714", ink: "#f2ede4" },
}

/*
 * OpenStreetMap's own tiles rather than CARTO's light/dark pair, which now
 * stamp "API KEY REQUIRED" across every tile. One URL for both themes: the
 * dark treatment is a CSS filter over the tile pane in globals.css, so it
 * costs no second tile source and cannot fall out of step with the palette.
 */
const BASEMAP = "https://tile.openstreetmap.org/{z}/{x}/{y}.png"

const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
  "contributors &middot; Imagery: Copernicus Sentinel-2"

type Phase = "loading" | "ready" | "error"

export default function NadirDemo() {
  const hostRef = useRef<HTMLDivElement>(null)
  const leafRef = useRef<typeof import("leaflet") | null>(null)
  const mapRef = useRef<LT.Map | null>(null)
  const rasterRef = useRef<LT.ImageOverlay | null>(null)
  const resultsRef = useRef<LT.LayerGroup | null>(null)
  const gridRef = useRef<LT.LayerGroup | null>(null)
  const shapesRef = useRef<LT.Polygon[]>([])
  const indexRef = useRef<NadirIndex | null>(null)

  const [phase, setPhase] = useState<Phase>("loading")
  const [progress, setProgress] = useState(0)
  const [problem, setProblem] = useState("")
  const [index, setIndex] = useState<NadirIndex | null>(null)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [lit, setLit] = useState<number | null>(null)
  const [grid, setGrid] = useState(false)
  const [raster, setRaster] = useState(true)

  const { resolvedTheme } = useTheme()
  const theme: Theme = resolvedTheme === "dark" ? "dark" : "light"
  const themeRef = useRef<Theme>(theme)
  themeRef.current = theme

  /** Rank badge. Inline styles rather than classes: this HTML is handed to
      Leaflet as a string, so it never passes under Tailwind's scanner. */
  const badge = (rank: number, fill: string, ink: string) => `
      <div style="
        display:flex;align-items:center;justify-content:center;
        width:18px;height:18px;
        font:600 10px/1 ui-monospace,SFMono-Regular,Menlo,monospace;
        color:${ink};
        background:${fill};
      ">${rank}</div>`

  /** Draw one search: the query square, then the matches under it. */
  const paint = useCallback(
    (found: SearchResult) => {
      const L = leafRef.current
      const group = resultsRef.current
      if (!L || !group) return

      group.clearLayers()
      shapesRef.current = []
      const { fill, ink } = MATCH[themeRef.current]

      L.polygon(
        found.query.poly.map(([lon, lat]) => [lat, lon] as LT.LatLngTuple),
        { pane: "nadir-hits", color: QUERY, weight: 3, fillOpacity: 0.18 },
      ).addTo(group)

      found.hits.forEach((hit, i) => {
        const shape = L.polygon(
          hit.chip.poly.map(([lon, lat]) => [lat, lon] as LT.LatLngTuple),
          { pane: "nadir-hits", color: fill, weight: 2, fillOpacity: 0.1 },
        ).addTo(group)

        L.marker([hit.chip.lat, hit.chip.lon], {
          pane: "nadir-hits",
          interactive: false,
          keyboard: false,
          icon: L.divIcon({
            html: badge(i + 1, fill, ink),
            className: "",
            iconSize: [18, 18],
            iconAnchor: [9, 9],
          }),
        }).addTo(group)

        shape.on("mouseover", () => setLit(i))
        shape.on("mouseout", () => setLit(null))
        shapesRef.current.push(shape)
      })
    },
    [],
  )

  const run = useCallback(
    (lon: number, lat: number) => {
      const loaded = indexRef.current
      if (!loaded) return
      const found = search(loaded, lon, lat, DEFAULT_K)
      setResult(found)
      setLit(null)
      paint(found)
    },
    [paint],
  )

  /* Build the map once, load the index, and answer with a worked example so
     the panel is never sitting there empty waiting to be clicked. */
  useEffect(() => {
    let dead = false

    ;(async () => {
      const L = (await import("leaflet")).default
      if (dead || !hostRef.current) return
      leafRef.current = L

      const map = L.map(hostRef.current, { zoomControl: false, minZoom: 9 })
      mapRef.current = map
      L.control.zoom({ position: "bottomright" }).addTo(map)

      L.tileLayer(BASEMAP, { maxZoom: 18, attribution: ATTRIBUTION }).addTo(map)

      // overlayPane is 400 and the NDVI raster sits there. The chip grid goes
      // just above it and the results above that, so a match is never buried
      // under the context drawn to explain it.
      map.createPane("nadir-grid").style.zIndex = "410"
      map.createPane("nadir-hits").style.zIndex = "420"
      resultsRef.current = L.layerGroup().addTo(map)

      try {
        const loaded = await loadIndex("/nadir", (f) => {
          if (!dead) setProgress(f)
        })
        if (dead) return

        indexRef.current = loaded
        setIndex(loaded)

        rasterRef.current = L.imageOverlay(
          "/nadir/ndvi.webp",
          loaded.meta.bounds,
          { opacity: 0.82, className: "nadir-raster" },
        ).addTo(map)
        map.fitBounds(loaded.meta.bounds)

        // interactive:false so a click falls through the grid to the map and
        // still searches, instead of being swallowed by the square on top.
        const renderer = L.canvas({ pane: "nadir-grid", padding: 0.2 })
        gridRef.current = L.layerGroup(
          loaded.chips.map((chip) =>
            L.polygon(
              chip.poly.map(([lon, lat]) => [lat, lon] as LT.LatLngTuple),
              {
                renderer,
                interactive: false,
                color: "#000000",
                weight: 0.6,
                opacity: 0.35,
                fillColor: ndviColour(chip.ndvi),
                fillOpacity: 0.55,
              },
            ),
          ),
        )

        map.on("click", (e: LT.LeafletMouseEvent) =>
          run(e.latlng.lng, e.latlng.lat),
        )

        setPhase("ready")
        run(EXAMPLES[0].lon, EXAMPLES[0].lat)
        map.invalidateSize()
      } catch (err) {
        if (dead) return
        setProblem(err instanceof Error ? err.message : String(err))
        setPhase("error")
      }
    })()

    return () => {
      dead = true
      mapRef.current?.remove()
      mapRef.current = null
      indexRef.current = null
    }
  }, [run])

  /* The match colour follows the site theme; the basemap is handled in CSS.
     Repainting the last search is cheaper and simpler than reaching into each
     shape to restyle it. */
  useEffect(() => {
    if (result) paint(result)
    // `result` is read, not tracked: a new search repaints itself already, and
    // listing it here would repaint every result twice.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, paint])

  useEffect(() => {
    rasterRef.current?.setOpacity(raster ? 0.82 : 0)
  }, [raster])

  useEffect(() => {
    const map = mapRef.current
    const layer = gridRef.current
    if (!map || !layer) return
    if (grid) layer.addTo(map)
    else map.removeLayer(layer)
  }, [grid])

  /* Hovering a row lifts its square, and the reverse is wired in `paint`. */
  useEffect(() => {
    shapesRef.current.forEach((shape, i) =>
      shape.setStyle(
        i === lit
          ? { weight: 4, fillOpacity: 0.32 }
          : { weight: 2, fillOpacity: 0.1 },
      ),
    )
  }, [lit])

  const focus = (lat: number, lon: number) =>
    mapRef.current?.panTo([lat, lon], { animate: true })

  return (
    <div className="flex flex-col border border-border lg:h-[72vh] lg:min-h-[560px] lg:flex-row">
      {/* Narrow screens put the map first: it is the thing to touch, and the
          paragraph above the panel has already said what to do with it. On
          wide screens the reading order goes back to left-then-right. */}
      <aside className="order-2 flex flex-col lg:order-1 lg:w-[21rem] lg:shrink-0 lg:border-r lg:border-border">
        <div className="border-b border-border p-5">
          <p className="label text-muted-foreground">Similarity search</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Click any square kilometre around Tirunelveli. The ten closest
            matches are ranked here, in your browser — nothing is asked of a
            server.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {EXAMPLES.map((eg) => (
              <button
                key={eg.label}
                type="button"
                disabled={phase !== "ready"}
                onClick={() => run(eg.lon, eg.lat)}
                className="label border border-border px-3 py-1.5 transition-colors hover:border-foreground disabled:opacity-40"
              >
                {eg.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-b border-border px-5 py-4">
          {phase === "loading" && (
            <>
              <p className="label text-muted-foreground">
                Loading index · {Math.round(progress * 100)}%
              </p>
              <div className="mt-2 h-px w-full bg-border">
                <div
                  className="h-px bg-foreground transition-[width] duration-150"
                  style={{ width: `${Math.max(2, progress * 100)}%` }}
                />
              </div>
            </>
          )}

          {phase === "error" && (
            <p className="label text-destructive">
              Index failed to load — {problem}
            </p>
          )}

          {phase === "ready" && index && (
            <p className="label text-muted-foreground">
              {index.meta.count} chips · {index.meta.model}
              {result && ` · ranked in ${result.ms.toFixed(1)} ms`}
            </p>
          )}
        </div>

        {result && (
          <div className="flex items-center gap-4 border-b border-border px-5 py-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/nadir/chips/${result.query.id}.webp`}
              alt=""
              width={56}
              height={56}
              className="size-14 shrink-0 [image-rendering:pixelated]"
              style={{ outline: `2px solid ${QUERY}`, outlineOffset: "-2px" }}
            />
            <div className="min-w-0">
              <p className="label text-muted-foreground">You picked</p>
              <p className="mt-1 truncate font-mono text-xs">
                {result.query.lat.toFixed(4)}, {result.query.lon.toFixed(4)}
              </p>
              <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                NDVI {result.query.ndvi.toFixed(2)} ·{" "}
                {(index!.meta.chipMetres / 1000).toFixed(2)} km square
              </p>
            </div>
          </div>
        )}

        <ol className="min-h-0 flex-1 overflow-y-auto">
          {result?.hits.map((hit, i) => (
            <li key={hit.chip.id}>
              <button
                type="button"
                onMouseEnter={() => setLit(i)}
                onMouseLeave={() => setLit(null)}
                onFocus={() => setLit(i)}
                onBlur={() => setLit(null)}
                onClick={() => focus(hit.chip.lat, hit.chip.lon)}
                className={`flex w-full items-center gap-3 border-b border-border px-5 py-3 text-left transition-colors ${
                  lit === i ? "bg-accent" : "hover:bg-accent"
                }`}
              >
                <span className="label w-4 shrink-0 text-muted-foreground">
                  {i + 1}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/nadir/chips/${hit.chip.id}.webp`}
                  alt=""
                  width={44}
                  height={44}
                  loading="lazy"
                  className="size-11 shrink-0 border border-border [image-rendering:pixelated]"
                />
                <span className="min-w-0">
                  <span className="block truncate font-mono text-xs">
                    {hit.chip.lat.toFixed(3)}, {hit.chip.lon.toFixed(3)}
                  </span>
                  <span className="mt-0.5 block font-mono text-xs text-muted-foreground">
                    NDVI {hit.chip.ndvi.toFixed(2)} · match{" "}
                    {hit.score.toFixed(3)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </aside>

      <div className="relative order-1 h-[58vh] min-h-[360px] border-b border-border lg:order-2 lg:h-auto lg:flex-1 lg:border-b-0">
        <div ref={hostRef} className="absolute inset-0 bg-muted" />

        <div className="pointer-events-none absolute top-3 right-3 z-[500] border border-border bg-background/90 p-3 backdrop-blur-sm">
          <label className="pointer-events-auto flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={raster}
              onChange={(e) => setRaster(e.target.checked)}
              className="accent-foreground"
            />
            <span className="label">NDVI, March</span>
          </label>
          <label className="pointer-events-auto mt-2 flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={grid}
              disabled={phase !== "ready"}
              onChange={(e) => setGrid(e.target.checked)}
              className="accent-foreground"
            />
            <span className="label">Chip grid</span>
          </label>

          {/* On a phone the map is small and this ramp covers a third of it.
              The toggles above stay; the reference material waits for room. */}
          <div className="mt-3 hidden h-1.5 w-32 sm:flex">
            {["#beae82", "#ded58c", "#96be64", "#46963c", "#145a23"].map((c) => (
              <i key={c} style={{ background: c }} className="flex-1" />
            ))}
          </div>
          <div className="mt-1 hidden w-32 justify-between font-mono text-[10px] text-muted-foreground sm:flex">
            <span>0.0</span>
            <span>0.4</span>
            <span>1.0</span>
          </div>
          <p className="mt-1 hidden w-32 text-[10px] leading-tight text-muted-foreground sm:block">
            Bare soil to dense canopy. Below zero is water, drawn blue.
          </p>
        </div>
      </div>
    </div>
  )
}
