/**
 * URL bản đồ mô phỏng (không cần API key).
 * Ưu tiên static image để tránh trường hợp iframe bị chặn trong một số môi trường.
 */
const VIETNAM_POINTS = [
  { lat: 21.0285, lng: 105.8542 },
  { lat: 10.8231, lng: 106.6297 },
  { lat: 16.0544, lng: 108.2022 },
  { lat: 10.0452, lng: 105.7469 },
  { lat: 20.8449, lng: 106.6881 },
  { lat: 12.2388, lng: 109.1967 },
]

/**
 * @param {number|string} [seed=0] — seed ổn định theo order id
 * @returns {string}
 */
export function buildSimulatedVietnamMapEmbedUrl(seed = 0) {
  const idx = Math.abs(Number(seed) || Math.floor(Math.random() * 1000)) % VIETNAM_POINTS.length
  const p = VIETNAM_POINTS[idx]
  const pad = 0.06
  const bbox = `${p.lng - pad},${p.lat - pad},${p.lng + pad},${p.lat + pad}`
  const params = new URLSearchParams({
    bbox,
    layer: 'mapnik',
    marker: `${p.lat}/${p.lng}`,
  })
  return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`
}

/**
 * URL ảnh static map OSM mô phỏng để hiển thị ổn định.
 * @param {number|string} [seed=0] — seed ổn định theo order id
 * @returns {string}
 */
export function buildSimulatedVietnamStaticMapUrl(seed = 0) {
  const idx = Math.abs(Number(seed) || Math.floor(Math.random() * 1000)) % VIETNAM_POINTS.length
  const p = VIETNAM_POINTS[idx]
  const params = new URLSearchParams({
    center: `${p.lat},${p.lng}`,
    zoom: '12',
    size: '640x320',
    maptype: 'mapnik',
    markers: `${p.lat},${p.lng},red-pushpin`,
  })
  return `https://staticmap.openstreetmap.de/staticmap.php?${params.toString()}`
}

/**
 * URL tile map OSM để fallback ổn định khi staticmap host lỗi DNS.
 * @param {number|string} [seed=0] — seed ổn định theo order id
 * @returns {string}
 */
export function buildSimulatedVietnamTileMapUrl(seed = 0) {
  const idx = Math.abs(Number(seed) || Math.floor(Math.random() * 1000)) % VIETNAM_POINTS.length
  const p = VIETNAM_POINTS[idx]
  const zoom = 12
  const x = Math.floor(((p.lng + 180) / 360) * Math.pow(2, zoom))
  const y = Math.floor(
    ((1 - Math.log(Math.tan((p.lat * Math.PI) / 180) + 1 / Math.cos((p.lat * Math.PI) / 180)) / Math.PI) / 2)
      * Math.pow(2, zoom)
  )
  return `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`
}
