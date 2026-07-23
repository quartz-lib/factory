import { describe, expect, it } from "vitest"
import type { Root as HastRoot } from "hast"
import { VFile } from "vfile"
import { HeadingFormat } from "../src/transformer"
import { createCtx } from "./helpers"

describe("HeadingFormat", () => {
  it("adds classes to h2, h3, and h4 elements", () => {
    const tree: HastRoot = {
      type: "root",
      children: [
        { type: "element", tagName: "h2", properties: {}, children: [] },
        { type: "element", tagName: "h3", properties: {}, children: [] },
        { type: "element", tagName: "h4", properties: {}, children: [] },
        { type: "element", tagName: "p", properties: {}, children: [] },
      ],
    }

    const transformer = HeadingFormat()
    const plugins = transformer.htmlPlugins?.(createCtx()) ?? []
    const rehypePlugin = plugins[0] as () => (tree: HastRoot, file: VFile) => void
    rehypePlugin()(tree, new VFile(""))

    expect(
      tree.children[0]?.type === "element" && tree.children[0].properties?.className,
    ).toContain("hf-h2")
    expect(
      tree.children[1]?.type === "element" && tree.children[1].properties?.className,
    ).toContain("hf-h3")
    expect(
      tree.children[2]?.type === "element" && tree.children[2].properties?.className,
    ).toContain("hf-h4")
    expect(
      tree.children[3]?.type === "element" && tree.children[3].properties?.className,
    ).toBeUndefined()
  })

  it("injects CSS for the selected style preset", () => {
    const transformer = HeadingFormat({ style: "gradient" })
    const resources = transformer.externalResources?.(createCtx())

    expect(resources?.css?.[0]?.content).toContain("article h2.hf-h2")
    expect(resources?.css?.[0]?.content).toContain("border-image")
    expect(resources?.css?.[0]?.inline).toBe(true)
  })

  it("falls back to accent for invalid style values", () => {
    const transformer = HeadingFormat({ style: "invalid" as "accent" })
    const resources = transformer.externalResources?.(createCtx())

    expect(resources?.css?.[0]?.content).toContain("border-left: 4px solid var(--secondary)")
  })
})
