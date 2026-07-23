import { QuartzTransformerPlugin } from "@quartz-community/types"

type HeadingStyle = "accent" | "minimal" | "gradient" | "card"
interface HeadingFormatOptions {
  /** 标题样式预设 */
  style?: HeadingStyle
}

declare const HeadingFormat: QuartzTransformerPlugin<Partial<HeadingFormatOptions>>

export { HeadingFormat, type HeadingFormatOptions, type HeadingStyle }
