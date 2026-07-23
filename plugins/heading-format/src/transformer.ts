import type { PluggableList } from "unified"
import type { QuartzTransformerPlugin } from "@quartz-community/types"
import type { HeadingFormatOptions, HeadingStyle } from "./types"
import { rehypeHeadingFormat } from "./rehype-heading-format"
import { getStyleCss } from "./styles"

const VALID_STYLES: HeadingStyle[] = ["accent", "minimal", "gradient", "card"]

const defaultOptions: Required<HeadingFormatOptions> = {
  style: "accent",
}

export const HeadingFormat: QuartzTransformerPlugin<Partial<HeadingFormatOptions>> = (
  userOptions?: Partial<HeadingFormatOptions>,
) => {
  const options = { ...defaultOptions, ...userOptions }
  const style = VALID_STYLES.includes(options.style) ? options.style : defaultOptions.style

  return {
    name: "HeadingFormat",
    htmlPlugins(): PluggableList {
      return [rehypeHeadingFormat]
    },
    externalResources() {
      return {
        css: [
          {
            content: getStyleCss(style),
            inline: true,
          },
        ],
      }
    },
  }
}
