import type { PageMatcher, QuartzPageTypePlugin } from "@quartz-community/types"
import ContentBody from "./ContentBody"

export interface IndexContentPageOptions {}

const indexMatcher: PageMatcher = ({ slug }) => slug.endsWith("/index")

export const IndexContentPage: QuartzPageTypePlugin<IndexContentPageOptions> = () => ({
  name: "IndexContentPage",
  priority: 11,
  match: indexMatcher,
  layout: "content",
  body: ContentBody,
})
