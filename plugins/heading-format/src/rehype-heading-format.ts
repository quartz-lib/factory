import type { Root as HastRoot, Element } from "hast"
import type { VFile } from "vfile"
import { visit } from "unist-util-visit"
import { HEADING_CLASS } from "./types"

const TAG_CLASS_MAP: Record<string, string> = {
  h2: HEADING_CLASS.h2,
  h3: HEADING_CLASS.h3,
  h4: HEADING_CLASS.h4,
}

function appendClass(node: Element, className: string) {
  const existing = node.properties?.className
  const classes: string[] = Array.isArray(existing)
    ? existing.filter((value): value is string => typeof value === "string")
    : typeof existing === "string"
      ? [existing]
      : []

  if (!classes.includes(className)) {
    classes.push(className)
  }

  node.properties = {
    ...(node.properties ?? {}),
    className: classes,
  }
}

export const rehypeHeadingFormat = () => (tree: HastRoot, _file: VFile) => {
  visit(tree, "element", (node: Element) => {
    const className = TAG_CLASS_MAP[node.tagName]
    if (!className) return
    appendClass(node, className)
  })
}
