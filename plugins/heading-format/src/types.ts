export type HeadingStyle = "accent" | "minimal" | "gradient" | "card"

export interface HeadingFormatOptions {
  /** 标题样式预设 */
  style?: HeadingStyle
}

export const HEADING_CLASS = {
  h2: "hf-h2",
  h3: "hf-h3",
  h4: "hf-h4",
} as const
