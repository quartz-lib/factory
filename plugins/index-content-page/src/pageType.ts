import type {
  FullSlug,
  PageMatcher,
  QuartzPageTypePlugin,
  VirtualPage,
} from "@quartz-community/types"
import ContentBody from "./ContentBody"

export interface IndexContentPageOptions {}

const indexMatcher: PageMatcher = ({ slug }) => slug.endsWith("/index")

function dirname(p: string): string {
  const idx = p.lastIndexOf("/")
  return idx === -1 ? "." : p.slice(0, idx) || "."
}

function getFolders(slug: string): string[] {
  let folderName = dirname(slug ?? "")
  const parentFolderNames = [folderName]
  while (folderName !== ".") {
    folderName = dirname(folderName)
    parentFolderNames.push(folderName)
  }
  return parentFolderNames
}

export const IndexContentPage: QuartzPageTypePlugin<IndexContentPageOptions> = () => ({
  name: "IndexContentPage",
  priority: 11,
  match: indexMatcher,
  generate({ content }) {
    const allFiles = content
      .map((c) => c[1].data)
      .filter((d) => (d as { unlisted?: unknown } | undefined)?.unlisted !== true)

    const folders = new Set<string>()
    const folderDisplayNames = new Map<string, string>()
    for (const file of allFiles) {
      const slug = (file as { slug?: string } | undefined)?.slug
      if (!slug) continue

      for (const f of getFolders(slug).filter((folder) => folder !== "." && folder !== "tags")) {
        folders.add(f)
      }

      const relativePath = (file as { relativePath?: string } | undefined)?.relativePath
      if (!relativePath) continue

      const slugParts = dirname(slug).split("/").filter((s) => s !== ".")
      const pathParts = dirname(relativePath).split("/").filter((s) => s !== ".")
      for (let i = 0; i < slugParts.length && i < pathParts.length; i++) {
        const slugPart = slugParts[i]
        const pathPart = pathParts[i]
        if (slugPart && pathPart && !folderDisplayNames.has(slugPart)) {
          folderDisplayNames.set(slugPart, pathPart)
        }
      }
    }

    const foldersWithIndex = new Set<string>()
    for (const [, file] of content) {
      const data = file.data as { slug?: string; unlisted?: unknown } | undefined
      if (data?.unlisted === true) continue
      const slug = data?.slug
      if (slug?.endsWith("/index")) {
        foldersWithIndex.add(slug.slice(0, -"/index".length))
      }
    }

    // Prefer folder display names over a bare "index" title for existing index.md pages.
    for (const [, file] of content) {
      const slug = (file.data as { slug?: string } | undefined)?.slug
      if (!slug?.endsWith("/index")) continue

      const frontmatter = (file.data as { frontmatter?: { title?: string } }).frontmatter
      if (!frontmatter || (frontmatter.title && frontmatter.title !== "index")) continue

      const folder = slug.slice(0, -"/index".length)
      const slugSegment = folder.split("/").pop() ?? folder
      frontmatter.title = folderDisplayNames.get(slugSegment) ?? slugSegment
    }

    const virtualPages: VirtualPage[] = []
    for (const folder of folders) {
      if (foldersWithIndex.has(folder)) continue

      const slugSegment = folder.split("/").pop() ?? folder
      const folderName = folderDisplayNames.get(slugSegment) ?? slugSegment
      virtualPages.push({
        slug: `${folder}/index` as FullSlug,
        title: folderName,
        data: {},
      })
    }

    return virtualPages
  },
  layout: "content",
  body: ContentBody,
})
