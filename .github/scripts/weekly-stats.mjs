// Fetches last week's numbers from GoatCounter and writes them as a short
// Markdown report: stats/README.md (always the latest) and stats/<date>.md.
// Runs in GitHub Actions (see .github/workflows/weekly-stats.yml).
import fs from "node:fs"

const SITE = process.env.GOATCOUNTER_SITE || "https://designwithavi.goatcounter.com"
const token = process.env.GOATCOUNTER_TOKEN
if (!token) {
  console.error("No GOATCOUNTER_TOKEN secret yet — add it in the repo's Settings → Secrets → Actions.")
  process.exit(1)
}

const day = (d) => d.toISOString().slice(0, 10)
const end = new Date()
const start = new Date(end.getTime() - 7 * 864e5)
const range = `start=${day(start)}&end=${day(end)}`

async function get(path) {
  const r = await fetch(`${SITE}/api/v0/${path}`, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } })
  if (!r.ok) throw new Error(`${path}: ${r.status} ${await r.text()}`)
  return r.json()
}

const total = await get(`stats/total?${range}`)
const hits = await get(`stats/hits?${range}&limit=15`)
const list = async (page) => (await get(`stats/${page}?${range}&limit=8`).catch(() => ({ stats: [] }))).stats ?? []
const [refs, locations, systems] = await Promise.all([list("toprefs"), list("locations"), list("systems")])

// "/work/photography-and-videography/shorona-character-shoot" → "Shorona: Character Shoot" (the page title the site sends)
const label = (h) => h.title || h.path
const rows = (items, name) => items.length ? items.map((s) => `| ${name(s) || "(direct / unknown)"} | ${s.count} |`).join("\n") : "| — | 0 |"

const md = `# Portfolio stats · ${day(start)} → ${day(end)}

**${total.total ?? 0} page views** in the last 7 days.

## Most viewed pages
| Page | Views |
|---|---|
${rows(hits.hits ?? [], label)}

## Where visitors came from
| Source | Visits |
|---|---|
${rows(refs, (s) => s.name)}

## Countries
| Country | Visits |
|---|---|
${rows(locations, (s) => s.name)}

## Devices
| System | Visits |
|---|---|
${rows(systems, (s) => s.name)}

_Full dashboard: ${SITE} · updated automatically every Monday._
`

fs.mkdirSync("stats", { recursive: true })
fs.writeFileSync("stats/README.md", md)
fs.writeFileSync(`stats/${day(end)}.md`, md)
console.log(md)
