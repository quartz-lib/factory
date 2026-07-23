import { createRequire } from "module"

createRequire(import.meta.url)

// node_modules/unist-util-is/lib/index.js
var convert =
  // Note: overloads in JSDoc can’t yet use different `@template`s.
  /**
   * @type {(
   *   (<Condition extends string>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & {type: Condition}) &
   *   (<Condition extends Props>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Condition) &
   *   (<Condition extends TestFunction>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Predicate<Condition, Node>) &
   *   ((test?: null | undefined) => (node?: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node) &
   *   ((test?: Test) => Check)
   * )}
   */
  /**
   * @param {Test} [test]
   * @returns {Check}
   */
  function (test) {
    if (test === null || test === void 0) {
      return ok
    }
    if (typeof test === "function") {
      return castFactory(test)
    }
    if (typeof test === "object") {
      return Array.isArray(test)
        ? anyFactory(test)
        : // Cast because `ReadonlyArray` goes into the above but `isArray`
          // narrows to `Array`.
          propertiesFactory(
            /** @type {Props} */
            test,
          )
    }
    if (typeof test === "string") {
      return typeFactory(test)
    }
    throw new Error("Expected function, string, or object as test")
  }
function anyFactory(tests) {
  const checks = []
  let index = -1
  while (++index < tests.length) {
    checks[index] = convert(tests[index])
  }
  return castFactory(any)
  function any(...parameters) {
    let index2 = -1
    while (++index2 < checks.length) {
      if (checks[index2].apply(this, parameters)) return true
    }
    return false
  }
}
function propertiesFactory(check) {
  const checkAsRecord =
    /** @type {Record<string, unknown>} */
    check
  return castFactory(all)
  function all(node) {
    const nodeAsRecord =
      /** @type {Record<string, unknown>} */
      /** @type {unknown} */
      node
    let key
    for (key in check) {
      if (nodeAsRecord[key] !== checkAsRecord[key]) return false
    }
    return true
  }
}
function typeFactory(check) {
  return castFactory(type)
  function type(node) {
    return node && node.type === check
  }
}
function castFactory(testFunction) {
  return check
  function check(value, index, parent) {
    return Boolean(
      looksLikeANode(value) &&
      testFunction.call(this, value, typeof index === "number" ? index : void 0, parent || void 0),
    )
  }
}
function ok() {
  return true
}
function looksLikeANode(value) {
  return value !== null && typeof value === "object" && "type" in value
}

// node_modules/unist-util-visit-parents/lib/color.node.js
function color(d) {
  return "\x1B[33m" + d + "\x1B[39m"
}

// node_modules/unist-util-visit-parents/lib/index.js
var empty = []
var CONTINUE = true
var EXIT = false
var SKIP = "skip"
function visitParents(tree, test, visitor, reverse) {
  let check
  if (typeof test === "function" && typeof visitor !== "function") {
    reverse = visitor
    visitor = test
  } else {
    check = test
  }
  const is2 = convert(check)
  const step = reverse ? -1 : 1
  factory(tree, void 0, [])()
  function factory(node, index, parents) {
    const value =
      /** @type {Record<string, unknown>} */
      node && typeof node === "object" ? node : {}
    if (typeof value.type === "string") {
      const name =
        // `hast`
        typeof value.tagName === "string"
          ? value.tagName
          : // `xast`
            typeof value.name === "string"
            ? value.name
            : void 0
      Object.defineProperty(visit2, "name", {
        value: "node (" + color(node.type + (name ? "<" + name + ">" : "")) + ")",
      })
    }
    return visit2
    function visit2() {
      let result = empty
      let subresult
      let offset
      let grandparents
      if (!test || is2(node, index, parents[parents.length - 1] || void 0)) {
        result = toResult(visitor(node, parents))
        if (result[0] === EXIT) {
          return result
        }
      }
      if ("children" in node && node.children) {
        const nodeAsParent =
          /** @type {UnistParent} */
          node
        if (nodeAsParent.children && result[0] !== SKIP) {
          offset = (reverse ? nodeAsParent.children.length : -1) + step
          grandparents = parents.concat(nodeAsParent)
          while (offset > -1 && offset < nodeAsParent.children.length) {
            const child = nodeAsParent.children[offset]
            subresult = factory(child, offset, grandparents)()
            if (subresult[0] === EXIT) {
              return subresult
            }
            offset = typeof subresult[1] === "number" ? subresult[1] : offset + step
          }
        }
      }
      return result
    }
  }
}
function toResult(value) {
  if (Array.isArray(value)) {
    return value
  }
  if (typeof value === "number") {
    return [CONTINUE, value]
  }
  return value === null || value === void 0 ? empty : [value]
}

// node_modules/unist-util-visit/lib/index.js
function visit(tree, testOrVisitor, visitorOrReverse, maybeReverse) {
  let reverse
  let test
  let visitor
  {
    test = testOrVisitor
    visitor = visitorOrReverse
    reverse = maybeReverse
  }
  visitParents(tree, test, overload, reverse)
  function overload(node, parents) {
    const parent = parents[parents.length - 1]
    const index = parent ? parent.children.indexOf(node) : void 0
    return visitor(node, index, parent)
  }
}

// src/types.ts
var HEADING_CLASS = {
  h2: "hf-h2",
  h3: "hf-h3",
  h4: "hf-h4",
}

// src/rehype-heading-format.ts
var TAG_CLASS_MAP = {
  h2: HEADING_CLASS.h2,
  h3: HEADING_CLASS.h3,
  h4: HEADING_CLASS.h4,
}
function appendClass(node, className) {
  const existing = node.properties?.className
  const classes = Array.isArray(existing)
    ? existing.filter((value) => typeof value === "string")
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
var rehypeHeadingFormat = () => (tree, _file) => {
  visit(tree, "element", (node) => {
    const className = TAG_CLASS_MAP[node.tagName]
    if (!className) return
    appendClass(node, className)
  })
}

// src/styles.ts
var accent = `
article h2.hf-h2 {
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--dark);
  margin: 2.2rem 0 0.8rem;
  padding: 0.5rem 0 0.5rem 1rem;
  border-left: 4px solid var(--secondary);
  background: color-mix(in srgb, var(--secondary) 8%, transparent);
  border-radius: 0 4px 4px 0;
}
article h3.hf-h3 {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--gray);
  margin: 1.5rem 0 0.6rem;
  padding: 0.2rem 0 0.2rem 0.75rem;
  border-left: 2px solid var(--tertiary);
}
article h4.hf-h4 {
  font-size: 1rem;
  font-weight: 500;
  color: color-mix(in srgb, var(--gray) 85%, transparent);
  margin: 1.1rem 0 0.4rem;
  padding: 0.1rem 0 0.1rem 1.25rem;
  border-left: 1px dotted var(--tertiary);
}
`
var minimal = `
article h2.hf-h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--secondary);
  margin: 2rem 0 0.7rem;
}
article h3.hf-h3 {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--gray);
  margin: 1.2rem 0 0.5rem;
  padding-left: 0.75em;
}
article h4.hf-h4 {
  font-size: 1rem;
  font-weight: 400;
  color: color-mix(in srgb, var(--gray) 80%, transparent);
  margin: 1rem 0 0.4rem;
  padding-left: 1.5em;
  font-style: italic;
}
`
var gradient = `
article h2.hf-h2 {
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--dark);
  margin: 2.2rem 0 0.6rem;
  padding-bottom: 0.45rem;
  border-bottom: 3px solid transparent;
  border-image: linear-gradient(to right, var(--secondary), var(--tertiary) 60%, transparent) 1;
}
article h3.hf-h3 {
  font-size: 1.12rem;
  font-weight: 600;
  color: var(--secondary);
  margin: 1.5rem 0 0.5rem;
  padding-bottom: 0.2rem;
  border-bottom: 1px solid var(--tertiary);
  display: inline-block;
}
article h4.hf-h4 {
  font-size: 1rem;
  font-weight: 500;
  color: var(--gray);
  margin: 1rem 0 0.4rem;
  text-decoration: underline dotted var(--tertiary);
  text-underline-offset: 4px;
}
`
var card = `
article h2.hf-h2 {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--dark);
  margin: 2rem 0 0.8rem;
  padding: 0.6rem 1rem;
  background: var(--light);
  border: 1px solid var(--lightgray);
  border-radius: 8px;
  box-shadow: 0 2px 8px color-mix(in srgb, var(--secondary) 12%, transparent);
}
article h3.hf-h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--secondary);
  margin: 1.4rem 0 0.5rem;
  padding: 0.35rem 0.75rem;
  border-left: 3px solid var(--secondary);
  background: color-mix(in srgb, var(--lightgray) 60%, transparent);
  border-radius: 0 6px 6px 0;
}
article h4.hf-h4 {
  font-size: 1rem;
  font-weight: 500;
  color: var(--gray);
  margin: 1rem 0 0.4rem;
  padding: 0.25rem 0.5rem 0.25rem 1rem;
  border-left: 1px solid var(--tertiary);
  background: color-mix(in srgb, var(--lightgray) 30%, transparent);
}
`
var STYLES = {
  accent,
  minimal,
  gradient,
  card,
}
function getStyleCss(style) {
  return STYLES[style]
}

// src/transformer.ts
var VALID_STYLES = ["accent", "minimal", "gradient", "card"]
var defaultOptions = {
  style: "accent",
}
var HeadingFormat = (userOptions) => {
  const options = { ...defaultOptions, ...userOptions }
  const style = VALID_STYLES.includes(options.style) ? options.style : defaultOptions.style
  return {
    name: "HeadingFormat",
    htmlPlugins() {
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

export { HeadingFormat }
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
