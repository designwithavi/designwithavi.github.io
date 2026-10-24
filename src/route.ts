import { useCallback, useEffect, useState } from "react"
import { categories, projects, type Category, type Project } from "@/content"

/**
 * Where the visitor is inside the work: a folder (category) page, and maybe a
 * project on top of it. Kept in the URL hash — #/work/<folder>/<project> — so
 * every folder and project has its own link and the browser's back button
 * works. Plain anchors like #about are left alone.
 */

export const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

export type Route = { category: Category | null; project: Project | null }

function parse(hash: string): Route {
  const m = hash.match(/^#\/work\/([^/]+)(?:\/([^/]+))?/)
  if (!m) return { category: null, project: null }
  const category = categories.find((c) => slug(c.name) === m[1]) ?? null
  const project =
    (category && m[2] && projects.find((p) => p.category === category.name && slug(p.title) === m[2])) || null
  return { category, project }
}

export const hrefOf = (c: Category, p?: Project) => `#/work/${slug(c.name)}${p ? `/${slug(p.title)}` : ""}`

export function useRoute() {
  const [route, setRoute] = useState<Route>(() => parse(location.hash))

  useEffect(() => {
    const sync = () => setRoute(parse(location.hash))
    window.addEventListener("popstate", sync)
    window.addEventListener("hashchange", sync)
    return () => {
      window.removeEventListener("popstate", sync)
      window.removeEventListener("hashchange", sync)
    }
  }, [])

  const go = useCallback((c: Category, p?: Project) => {
    history.pushState({ app: true }, "", hrefOf(c, p))
    setRoute({ category: c, project: p ?? null })
  }, [])

  /** One level up: project → folder → the page. Uses the back button's history when it's ours. */
  const up = useCallback(() => {
    if (history.state?.app) {
      history.back()
      return
    }
    // arrived straight on a shared link: there's no history of ours to go back through
    const r = parse(location.hash)
    const next = r.project && r.category ? hrefOf(r.category) : location.pathname + location.search
    history.replaceState(null, "", next)
    setRoute(parse(location.hash))
  }, [])

  return { route, go, up }
}
