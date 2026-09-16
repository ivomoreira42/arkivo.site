const METERS_PER_PIXEL = 0.5
const ORIGIN_EASTING = 351_000
const ORIGIN_NORTHING = 7_412_000

const fmtAzim = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})
const fmtDist = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})
const fmtCoord = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

function writeText(node, value) {
  if (node && node.textContent !== value) node.textContent = value
}

function buildTicks(group) {
  for (let index = 0; index < 36; index += 1) {
    const angle = (index * 10 * Math.PI) / 180
    const inner = index % 9 === 0 ? 28 : 31
    const outer = 34
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
    line.setAttribute("x1", String(50 + inner * Math.sin(angle)))
    line.setAttribute("y1", String(50 - inner * Math.cos(angle)))
    line.setAttribute("x2", String(50 + outer * Math.sin(angle)))
    line.setAttribute("y2", String(50 - outer * Math.cos(angle)))
    line.setAttribute("stroke", "currentColor")
    line.setAttribute("stroke-opacity", index % 9 === 0 ? "0.7" : "0.28")
    line.setAttribute("stroke-width", index % 9 === 0 ? "1.4" : "1")
    group.appendChild(line)
  }
}

function boot() {
  const surface = document.getElementById("surface")
  const grate = document.getElementById("grate")
  const compass = document.getElementById("compass")
  const needle = document.getElementById("needle")
  const ticks = document.getElementById("ticks")
  const azim = document.getElementById("azim")
  const dist = document.getElementById("dist")
  const east = document.getElementById("east")
  const north = document.getElementById("north")

  if (!surface || !grate || !compass || !needle || !ticks) return

  buildTicks(ticks)
  writeText(east, fmtCoord.format(ORIGIN_EASTING))
  writeText(north, fmtCoord.format(ORIGIN_NORTHING))

  let frame = 0
  let pending = null

  const tick = () => {
    frame = 0
    const point = pending
    pending = null
    if (!point) return

    const surfaceBox = surface.getBoundingClientRect()
    const compassBox = compass.getBoundingClientRect()
    const originX = compassBox.left + compassBox.width / 2
    const originY = compassBox.top + compassBox.height / 2

    // Survey bearing: 0° = screen-north, clockwise, matching field azimuth.
    const dx = point.x - originX
    const dy = originY - point.y
    const azimuth = (Math.atan2(dx, dy) * (180 / Math.PI) + 360) % 360
    const distM = Math.hypot(dx, dy) * METERS_PER_PIXEL
    const localX = (point.x - surfaceBox.left - surfaceBox.width / 2) * METERS_PER_PIXEL
    const localY = (surfaceBox.top + surfaceBox.height / 2 - point.y) * METERS_PER_PIXEL

    needle.setAttribute("transform", `rotate(${azimuth} 50 50)`)
    writeText(azim, `${fmtAzim.format(azimuth)}°`)
    writeText(dist, `${fmtDist.format(distM)} m`)
    writeText(east, fmtCoord.format(ORIGIN_EASTING + localX))
    writeText(north, fmtCoord.format(ORIGIN_NORTHING + localY))
    grate.style.backgroundPosition = `${(-dx) / 18}px ${dy / 18}px`
  }

  surface.addEventListener("pointermove", (event) => {
    pending = { x: event.clientX, y: event.clientY }
    if (!frame) frame = requestAnimationFrame(tick)
  })
}

boot()
