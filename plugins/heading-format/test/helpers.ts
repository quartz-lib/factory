import type { BuildCtx } from "@quartz-community/types"

export const createCtx = (): BuildCtx =>
  ({
    argv: {},
    cfg: { configuration: {}, plugins: {} },
    allSlugs: [],
  }) as BuildCtx
