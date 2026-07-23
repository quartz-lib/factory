var __create = Object.create
var __defProp = Object.defineProperty
var __getOwnPropDesc = Object.getOwnPropertyDescriptor
var __getOwnPropNames = Object.getOwnPropertyNames
var __getProtoOf = Object.getPrototypeOf
var __hasOwnProp = Object.prototype.hasOwnProperty
var __commonJS = (cb, mod) =>
  function __require() {
    return (
      mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod),
      mod.exports
    )
  }
var __export = (target, all) => {
  for (var name2 in all) __defProp(target, name2, { get: all[name2], enumerable: true })
}
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === "object") || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        })
  }
  return to
}
var __toESM = (mod, isNodeMode, target) => (
  (target = mod != null ? __create(__getProtoOf(mod)) : {}),
  __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule
      ? __defProp(target, "default", { value: mod, enumerable: true })
      : target,
    mod,
  )
)

// node_modules/inline-style-parser/cjs/index.js
var require_cjs = __commonJS({
  "node_modules/inline-style-parser/cjs/index.js"(exports, module) {
    "use strict"
    var COMMENT_REGEX = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g
    var NEWLINE_REGEX = /\n/g
    var WHITESPACE_REGEX = /^\s*/
    var PROPERTY_REGEX = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/
    var COLON_REGEX = /^:\s*/
    var VALUE_REGEX = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/
    var SEMICOLON_REGEX = /^[;\s]*/
    var TRIM_REGEX = /^\s+|\s+$/g
    var NEWLINE = "\n"
    var FORWARD_SLASH = "/"
    var ASTERISK = "*"
    var EMPTY_STRING = ""
    var TYPE_COMMENT = "comment"
    var TYPE_DECLARATION = "declaration"
    function index2(style, options) {
      if (typeof style !== "string") {
        throw new TypeError("First argument must be a string")
      }
      if (!style) return []
      options = options || {}
      var lineno = 1
      var column = 1
      function updatePosition(str) {
        var lines = str.match(NEWLINE_REGEX)
        if (lines) lineno += lines.length
        var i2 = str.lastIndexOf(NEWLINE)
        column = ~i2 ? str.length - i2 : column + str.length
      }
      function position3() {
        var start2 = { line: lineno, column }
        return function (node) {
          node.position = new Position(start2)
          whitespace2()
          return node
        }
      }
      function Position(start2) {
        this.start = start2
        this.end = { line: lineno, column }
        this.source = options.source
      }
      Position.prototype.content = style
      function error(msg) {
        var err = new Error(options.source + ":" + lineno + ":" + column + ": " + msg)
        err.reason = msg
        err.filename = options.source
        err.line = lineno
        err.column = column
        err.source = style
        if (options.silent);
        else {
          throw err
        }
      }
      function match(re2) {
        var m2 = re2.exec(style)
        if (!m2) return
        var str = m2[0]
        updatePosition(str)
        style = style.slice(str.length)
        return m2
      }
      function whitespace2() {
        match(WHITESPACE_REGEX)
      }
      function comments(rules) {
        var c2
        rules = rules || []
        while ((c2 = comment())) {
          if (c2 !== false) {
            rules.push(c2)
          }
        }
        return rules
      }
      function comment() {
        var pos = position3()
        if (FORWARD_SLASH != style.charAt(0) || ASTERISK != style.charAt(1)) return
        var i2 = 2
        while (
          EMPTY_STRING != style.charAt(i2) &&
          (ASTERISK != style.charAt(i2) || FORWARD_SLASH != style.charAt(i2 + 1))
        ) {
          ++i2
        }
        i2 += 2
        if (EMPTY_STRING === style.charAt(i2 - 1)) {
          return error("End of comment missing")
        }
        var str = style.slice(2, i2 - 2)
        column += 2
        updatePosition(str)
        style = style.slice(i2)
        column += 2
        return pos({
          type: TYPE_COMMENT,
          comment: str,
        })
      }
      function declaration() {
        var pos = position3()
        var prop = match(PROPERTY_REGEX)
        if (!prop) return
        comment()
        if (!match(COLON_REGEX)) return error("property missing ':'")
        var val = match(VALUE_REGEX)
        var ret = pos({
          type: TYPE_DECLARATION,
          property: trim(prop[0].replace(COMMENT_REGEX, EMPTY_STRING)),
          value: val ? trim(val[0].replace(COMMENT_REGEX, EMPTY_STRING)) : EMPTY_STRING,
        })
        match(SEMICOLON_REGEX)
        return ret
      }
      function declarations() {
        var decls = []
        comments(decls)
        var decl
        while ((decl = declaration())) {
          if (decl !== false) {
            decls.push(decl)
            comments(decls)
          }
        }
        return decls
      }
      whitespace2()
      return declarations()
    }
    function trim(str) {
      return str ? str.replace(TRIM_REGEX, EMPTY_STRING) : EMPTY_STRING
    }
    module.exports = index2
  },
})

// node_modules/style-to-object/cjs/index.js
var require_cjs2 = __commonJS({
  "node_modules/style-to-object/cjs/index.js"(exports) {
    "use strict"
    var __importDefault =
      (exports && exports.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : { default: mod }
      }
    Object.defineProperty(exports, "__esModule", { value: true })
    exports.default = StyleToObject
    var inline_style_parser_1 = __importDefault(require_cjs())
    function StyleToObject(style, iterator) {
      let styleObject = null
      if (!style || typeof style !== "string") {
        return styleObject
      }
      const declarations = (0, inline_style_parser_1.default)(style)
      const hasIterator = typeof iterator === "function"
      declarations.forEach((declaration) => {
        if (declaration.type !== "declaration") {
          return
        }
        const { property, value } = declaration
        if (hasIterator) {
          iterator(property, value, declaration)
        } else if (value) {
          styleObject = styleObject || {}
          styleObject[property] = value
        }
      })
      return styleObject
    }
  },
})

// node_modules/style-to-js/cjs/utilities.js
var require_utilities = __commonJS({
  "node_modules/style-to-js/cjs/utilities.js"(exports) {
    "use strict"
    Object.defineProperty(exports, "__esModule", { value: true })
    exports.camelCase = void 0
    var CUSTOM_PROPERTY_REGEX = /^--[a-zA-Z0-9_-]+$/
    var HYPHEN_REGEX = /-([a-z])/g
    var NO_HYPHEN_REGEX = /^[^-]+$/
    var VENDOR_PREFIX_REGEX = /^-(webkit|moz|ms|o|khtml)-/
    var MS_VENDOR_PREFIX_REGEX = /^-(ms)-/
    var skipCamelCase = function (property) {
      return !property || NO_HYPHEN_REGEX.test(property) || CUSTOM_PROPERTY_REGEX.test(property)
    }
    var capitalize = function (match, character) {
      return character.toUpperCase()
    }
    var trimHyphen = function (match, prefix) {
      return "".concat(prefix, "-")
    }
    var camelCase = function (property, options) {
      if (options === void 0) {
        options = {}
      }
      if (skipCamelCase(property)) {
        return property
      }
      property = property.toLowerCase()
      if (options.reactCompat) {
        property = property.replace(MS_VENDOR_PREFIX_REGEX, trimHyphen)
      } else {
        property = property.replace(VENDOR_PREFIX_REGEX, trimHyphen)
      }
      return property.replace(HYPHEN_REGEX, capitalize)
    }
    exports.camelCase = camelCase
  },
})

// node_modules/style-to-js/cjs/index.js
var require_cjs3 = __commonJS({
  "node_modules/style-to-js/cjs/index.js"(exports, module) {
    "use strict"
    var __importDefault =
      (exports && exports.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : { default: mod }
      }
    var style_to_object_1 = __importDefault(require_cjs2())
    var utilities_1 = require_utilities()
    function StyleToJS(style, options) {
      var output = {}
      if (!style || typeof style !== "string") {
        return output
      }
      ;(0, style_to_object_1.default)(style, function (property, value) {
        if (property && value) {
          output[(0, utilities_1.camelCase)(property, options)] = value
        }
      })
      return output
    }
    StyleToJS.default = StyleToJS
    module.exports = StyleToJS
  },
})

// node_modules/comma-separated-tokens/index.js
function stringify(values, options) {
  const settings = options || {}
  const input = values[values.length - 1] === "" ? [...values, ""] : values
  return input
    .join((settings.padRight ? " " : "") + "," + (settings.padLeft === false ? "" : " "))
    .trim()
}

// node_modules/devlop/lib/default.js
function ok() {}

// node_modules/estree-util-is-identifier-name/lib/index.js
var nameRe = /^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u
var nameReJsx = /^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u
var emptyOptions = {}
function name(name2, options) {
  const settings = options || emptyOptions
  const re2 = settings.jsx ? nameReJsx : nameRe
  return re2.test(name2)
}

// node_modules/hast-util-whitespace/lib/index.js
var re = /[ \t\n\f\r]/g
function whitespace(thing) {
  return typeof thing === "object"
    ? thing.type === "text"
      ? empty(thing.value)
      : false
    : empty(thing)
}
function empty(value) {
  return value.replace(re, "") === ""
}

// node_modules/property-information/lib/util/schema.js
var Schema = class {
  /**
   * @param {SchemaType['property']} property
   *   Property.
   * @param {SchemaType['normal']} normal
   *   Normal.
   * @param {Space | undefined} [space]
   *   Space.
   * @returns
   *   Schema.
   */
  constructor(property, normal, space) {
    this.normal = normal
    this.property = property
    if (space) {
      this.space = space
    }
  }
}
Schema.prototype.normal = {}
Schema.prototype.property = {}
Schema.prototype.space = void 0

// node_modules/property-information/lib/util/merge.js
function merge(definitions, space) {
  const property = {}
  const normal = {}
  for (const definition of definitions) {
    Object.assign(property, definition.property)
    Object.assign(normal, definition.normal)
  }
  return new Schema(property, normal, space)
}

// node_modules/property-information/lib/normalize.js
function normalize(value) {
  return value.toLowerCase()
}

// node_modules/property-information/lib/util/info.js
var Info = class {
  /**
   * @param {string} property
   *   Property.
   * @param {string} attribute
   *   Attribute.
   * @returns
   *   Info.
   */
  constructor(property, attribute) {
    this.attribute = attribute
    this.property = property
  }
}
Info.prototype.attribute = ""
Info.prototype.booleanish = false
Info.prototype.boolean = false
Info.prototype.commaOrSpaceSeparated = false
Info.prototype.commaSeparated = false
Info.prototype.defined = false
Info.prototype.mustUseProperty = false
Info.prototype.number = false
Info.prototype.overloadedBoolean = false
Info.prototype.property = ""
Info.prototype.spaceSeparated = false
Info.prototype.space = void 0

// node_modules/property-information/lib/util/types.js
var types_exports = {}
__export(types_exports, {
  boolean: () => boolean,
  booleanish: () => booleanish,
  commaOrSpaceSeparated: () => commaOrSpaceSeparated,
  commaSeparated: () => commaSeparated,
  number: () => number,
  overloadedBoolean: () => overloadedBoolean,
  spaceSeparated: () => spaceSeparated,
})
var powers = 0
var boolean = increment()
var booleanish = increment()
var overloadedBoolean = increment()
var number = increment()
var spaceSeparated = increment()
var commaSeparated = increment()
var commaOrSpaceSeparated = increment()
function increment() {
  return 2 ** ++powers
}

// node_modules/property-information/lib/util/defined-info.js
var checks =
  /** @type {ReadonlyArray<keyof typeof types>} */
  Object.keys(types_exports)
var DefinedInfo = class extends Info {
  /**
   * @constructor
   * @param {string} property
   *   Property.
   * @param {string} attribute
   *   Attribute.
   * @param {number | null | undefined} [mask]
   *   Mask.
   * @param {Space | undefined} [space]
   *   Space.
   * @returns
   *   Info.
   */
  constructor(property, attribute, mask, space) {
    let index2 = -1
    super(property, attribute)
    mark(this, "space", space)
    if (typeof mask === "number") {
      while (++index2 < checks.length) {
        const check = checks[index2]
        mark(this, checks[index2], (mask & types_exports[check]) === types_exports[check])
      }
    }
  }
}
DefinedInfo.prototype.defined = true
function mark(values, key, value) {
  if (value) {
    values[key] = value
  }
}

// node_modules/property-information/lib/util/create.js
function create(definition) {
  const properties = {}
  const normals = {}
  for (const [property, value] of Object.entries(definition.properties)) {
    const info = new DefinedInfo(
      property,
      definition.transform(definition.attributes || {}, property),
      value,
      definition.space,
    )
    if (definition.mustUseProperty && definition.mustUseProperty.includes(property)) {
      info.mustUseProperty = true
    }
    properties[property] = info
    normals[normalize(property)] = property
    normals[normalize(info.attribute)] = property
  }
  return new Schema(properties, normals, definition.space)
}

// node_modules/property-information/lib/aria.js
var aria = create({
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: booleanish,
    ariaAutoComplete: null,
    ariaBusy: booleanish,
    ariaChecked: booleanish,
    ariaColCount: number,
    ariaColIndex: number,
    ariaColSpan: number,
    ariaControls: spaceSeparated,
    ariaCurrent: null,
    ariaDescribedBy: spaceSeparated,
    ariaDetails: null,
    ariaDisabled: booleanish,
    ariaDropEffect: spaceSeparated,
    ariaErrorMessage: null,
    ariaExpanded: booleanish,
    ariaFlowTo: spaceSeparated,
    ariaGrabbed: booleanish,
    ariaHasPopup: null,
    ariaHidden: booleanish,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: spaceSeparated,
    ariaLevel: number,
    ariaLive: null,
    ariaModal: booleanish,
    ariaMultiLine: booleanish,
    ariaMultiSelectable: booleanish,
    ariaOrientation: null,
    ariaOwns: spaceSeparated,
    ariaPlaceholder: null,
    ariaPosInSet: number,
    ariaPressed: booleanish,
    ariaReadOnly: booleanish,
    ariaRelevant: null,
    ariaRequired: booleanish,
    ariaRoleDescription: spaceSeparated,
    ariaRowCount: number,
    ariaRowIndex: number,
    ariaRowSpan: number,
    ariaSelected: booleanish,
    ariaSetSize: number,
    ariaSort: null,
    ariaValueMax: number,
    ariaValueMin: number,
    ariaValueNow: number,
    ariaValueText: null,
    role: null,
  },
  transform(_2, property) {
    return property === "role" ? property : "aria-" + property.slice(4).toLowerCase()
  },
})

// node_modules/property-information/lib/util/case-sensitive-transform.js
function caseSensitiveTransform(attributes, attribute) {
  return attribute in attributes ? attributes[attribute] : attribute
}

// node_modules/property-information/lib/util/case-insensitive-transform.js
function caseInsensitiveTransform(attributes, property) {
  return caseSensitiveTransform(attributes, property.toLowerCase())
}

// node_modules/property-information/lib/html.js
var html = create({
  attributes: {
    acceptcharset: "accept-charset",
    classname: "class",
    htmlfor: "for",
    httpequiv: "http-equiv",
  },
  mustUseProperty: ["checked", "multiple", "muted", "selected"],
  properties: {
    // Standard Properties.
    abbr: null,
    accept: commaSeparated,
    acceptCharset: spaceSeparated,
    accessKey: spaceSeparated,
    action: null,
    allow: null,
    allowFullScreen: boolean,
    allowPaymentRequest: boolean,
    allowUserMedia: boolean,
    alpha: boolean,
    alt: null,
    as: null,
    async: boolean,
    autoCapitalize: null,
    autoComplete: spaceSeparated,
    autoFocus: boolean,
    autoPlay: boolean,
    blocking: spaceSeparated,
    capture: null,
    charSet: null,
    checked: boolean,
    cite: null,
    className: spaceSeparated,
    closedBy: null,
    colorSpace: null,
    cols: number,
    colSpan: number,
    command: null,
    commandFor: null,
    content: null,
    contentEditable: booleanish,
    controls: boolean,
    controlsList: spaceSeparated,
    coords: number | commaSeparated,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: boolean,
    defer: boolean,
    dir: null,
    dirName: null,
    disabled: boolean,
    download: overloadedBoolean,
    draggable: booleanish,
    encType: null,
    enterKeyHint: null,
    fetchPriority: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: boolean,
    formTarget: null,
    headers: spaceSeparated,
    height: number,
    hidden: overloadedBoolean,
    high: number,
    href: null,
    hrefLang: null,
    htmlFor: spaceSeparated,
    httpEquiv: spaceSeparated,
    id: null,
    imageSizes: null,
    imageSrcSet: null,
    inert: boolean,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: boolean,
    itemId: null,
    itemProp: spaceSeparated,
    itemRef: spaceSeparated,
    itemScope: boolean,
    itemType: spaceSeparated,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: boolean,
    low: number,
    manifest: null,
    max: null,
    maxLength: number,
    media: null,
    method: null,
    min: null,
    minLength: number,
    multiple: boolean,
    muted: boolean,
    name: null,
    nonce: null,
    noModule: boolean,
    noValidate: boolean,
    onAbort: null,
    onAfterPrint: null,
    onAuxClick: null,
    onBeforeMatch: null,
    onBeforePrint: null,
    onBeforeToggle: null,
    onBeforeUnload: null,
    onBlur: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onContextLost: null,
    onContextMenu: null,
    onContextRestored: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFormData: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLanguageChange: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadEnd: null,
    onLoadStart: null,
    onMessage: null,
    onMessageError: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRejectionHandled: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onScrollEnd: null,
    onSecurityPolicyViolation: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onSlotChange: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnhandledRejection: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onWheel: null,
    open: boolean,
    optimum: number,
    pattern: null,
    ping: spaceSeparated,
    placeholder: null,
    playsInline: boolean,
    popover: null,
    popoverTarget: null,
    popoverTargetAction: null,
    poster: null,
    preload: null,
    readOnly: boolean,
    referrerPolicy: null,
    rel: spaceSeparated,
    required: boolean,
    reversed: boolean,
    rows: number,
    rowSpan: number,
    sandbox: spaceSeparated,
    scope: null,
    scoped: boolean,
    seamless: boolean,
    selected: boolean,
    shadowRootClonable: boolean,
    shadowRootCustomElementRegistry: boolean,
    shadowRootDelegatesFocus: boolean,
    shadowRootMode: null,
    shadowRootSerializable: boolean,
    shape: null,
    size: number,
    sizes: null,
    slot: null,
    span: number,
    spellCheck: booleanish,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: null,
    start: number,
    step: null,
    style: null,
    tabIndex: number,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: boolean,
    useMap: null,
    value: booleanish,
    width: number,
    wrap: null,
    writingSuggestions: null,
    // Legacy.
    // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
    align: null,
    // Several. Use CSS `text-align` instead,
    aLink: null,
    // `<body>`. Use CSS `a:active {color}` instead
    archive: spaceSeparated,
    // `<object>`. List of URIs to archives
    axis: null,
    // `<td>` and `<th>`. Use `scope` on `<th>`
    background: null,
    // `<body>`. Use CSS `background-image` instead
    bgColor: null,
    // `<body>` and table elements. Use CSS `background-color` instead
    border: number,
    // `<table>`. Use CSS `border-width` instead,
    borderColor: null,
    // `<table>`. Use CSS `border-color` instead,
    bottomMargin: number,
    // `<body>`
    cellPadding: null,
    // `<table>`
    cellSpacing: null,
    // `<table>`
    char: null,
    // Several table elements. When `align=char`, sets the character to align on
    charOff: null,
    // Several table elements. When `char`, offsets the alignment
    classId: null,
    // `<object>`
    clear: null,
    // `<br>`. Use CSS `clear` instead
    code: null,
    // `<object>`
    codeBase: null,
    // `<object>`
    codeType: null,
    // `<object>`
    color: null,
    // `<font>` and `<hr>`. Use CSS instead
    compact: boolean,
    // Lists. Use CSS to reduce space between items instead
    declare: boolean,
    // `<object>`
    event: null,
    // `<script>`
    face: null,
    // `<font>`. Use CSS instead
    frame: null,
    // `<table>`
    frameBorder: null,
    // `<iframe>`. Use CSS `border` instead
    hSpace: number,
    // `<img>` and `<object>`
    leftMargin: number,
    // `<body>`
    link: null,
    // `<body>`. Use CSS `a:link {color: *}` instead
    longDesc: null,
    // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
    lowSrc: null,
    // `<img>`. Use a `<picture>`
    marginHeight: number,
    // `<body>`
    marginWidth: number,
    // `<body>`
    noResize: boolean,
    // `<frame>`
    noHref: boolean,
    // `<area>`. Use no href instead of an explicit `nohref`
    noShade: boolean,
    // `<hr>`. Use background-color and height instead of borders
    noWrap: boolean,
    // `<td>` and `<th>`
    object: null,
    // `<applet>`
    profile: null,
    // `<head>`
    prompt: null,
    // `<isindex>`
    rev: null,
    // `<link>`
    rightMargin: number,
    // `<body>`
    rules: null,
    // `<table>`
    scheme: null,
    // `<meta>`
    scrolling: booleanish,
    // `<frame>`. Use overflow in the child context
    standby: null,
    // `<object>`
    summary: null,
    // `<table>`
    text: null,
    // `<body>`. Use CSS `color` instead
    topMargin: number,
    // `<body>`
    valueType: null,
    // `<param>`
    version: null,
    // `<html>`. Use a doctype.
    vAlign: null,
    // Several. Use CSS `vertical-align` instead
    vLink: null,
    // `<body>`. Use CSS `a:visited {color}` instead
    vSpace: number,
    // `<img>` and `<object>`
    // Non-standard Properties.
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    credentialless: boolean,
    disablePictureInPicture: boolean,
    disableRemotePlayback: boolean,
    exportParts: commaSeparated,
    part: spaceSeparated,
    prefix: null,
    property: null,
    results: number,
    security: null,
    unselectable: null,
  },
  space: "html",
  transform: caseInsensitiveTransform,
})

// node_modules/property-information/lib/svg.js
var svg = create({
  attributes: {
    accentHeight: "accent-height",
    alignmentBaseline: "alignment-baseline",
    arabicForm: "arabic-form",
    baselineShift: "baseline-shift",
    capHeight: "cap-height",
    className: "class",
    clipPath: "clip-path",
    clipRule: "clip-rule",
    colorInterpolation: "color-interpolation",
    colorInterpolationFilters: "color-interpolation-filters",
    colorProfile: "color-profile",
    colorRendering: "color-rendering",
    crossOrigin: "crossorigin",
    dataType: "datatype",
    dominantBaseline: "dominant-baseline",
    enableBackground: "enable-background",
    fillOpacity: "fill-opacity",
    fillRule: "fill-rule",
    floodColor: "flood-color",
    floodOpacity: "flood-opacity",
    fontFamily: "font-family",
    fontSize: "font-size",
    fontSizeAdjust: "font-size-adjust",
    fontStretch: "font-stretch",
    fontStyle: "font-style",
    fontVariant: "font-variant",
    fontWeight: "font-weight",
    glyphName: "glyph-name",
    glyphOrientationHorizontal: "glyph-orientation-horizontal",
    glyphOrientationVertical: "glyph-orientation-vertical",
    hrefLang: "hreflang",
    horizAdvX: "horiz-adv-x",
    horizOriginX: "horiz-origin-x",
    horizOriginY: "horiz-origin-y",
    imageRendering: "image-rendering",
    letterSpacing: "letter-spacing",
    lightingColor: "lighting-color",
    markerEnd: "marker-end",
    markerMid: "marker-mid",
    markerStart: "marker-start",
    maskType: "mask-type",
    navDown: "nav-down",
    navDownLeft: "nav-down-left",
    navDownRight: "nav-down-right",
    navLeft: "nav-left",
    navNext: "nav-next",
    navPrev: "nav-prev",
    navRight: "nav-right",
    navUp: "nav-up",
    navUpLeft: "nav-up-left",
    navUpRight: "nav-up-right",
    onAbort: "onabort",
    onActivate: "onactivate",
    onAfterPrint: "onafterprint",
    onBeforePrint: "onbeforeprint",
    onBegin: "onbegin",
    onCancel: "oncancel",
    onCanPlay: "oncanplay",
    onCanPlayThrough: "oncanplaythrough",
    onChange: "onchange",
    onClick: "onclick",
    onClose: "onclose",
    onCopy: "oncopy",
    onCueChange: "oncuechange",
    onCut: "oncut",
    onDblClick: "ondblclick",
    onDrag: "ondrag",
    onDragEnd: "ondragend",
    onDragEnter: "ondragenter",
    onDragExit: "ondragexit",
    onDragLeave: "ondragleave",
    onDragOver: "ondragover",
    onDragStart: "ondragstart",
    onDrop: "ondrop",
    onDurationChange: "ondurationchange",
    onEmptied: "onemptied",
    onEnd: "onend",
    onEnded: "onended",
    onError: "onerror",
    onFocus: "onfocus",
    onFocusIn: "onfocusin",
    onFocusOut: "onfocusout",
    onHashChange: "onhashchange",
    onInput: "oninput",
    onInvalid: "oninvalid",
    onKeyDown: "onkeydown",
    onKeyPress: "onkeypress",
    onKeyUp: "onkeyup",
    onLoad: "onload",
    onLoadedData: "onloadeddata",
    onLoadedMetadata: "onloadedmetadata",
    onLoadStart: "onloadstart",
    onMessage: "onmessage",
    onMouseDown: "onmousedown",
    onMouseEnter: "onmouseenter",
    onMouseLeave: "onmouseleave",
    onMouseMove: "onmousemove",
    onMouseOut: "onmouseout",
    onMouseOver: "onmouseover",
    onMouseUp: "onmouseup",
    onMouseWheel: "onmousewheel",
    onOffline: "onoffline",
    onOnline: "ononline",
    onPageHide: "onpagehide",
    onPageShow: "onpageshow",
    onPaste: "onpaste",
    onPause: "onpause",
    onPlay: "onplay",
    onPlaying: "onplaying",
    onPopState: "onpopstate",
    onProgress: "onprogress",
    onRateChange: "onratechange",
    onRepeat: "onrepeat",
    onReset: "onreset",
    onResize: "onresize",
    onScroll: "onscroll",
    onSeeked: "onseeked",
    onSeeking: "onseeking",
    onSelect: "onselect",
    onShow: "onshow",
    onStalled: "onstalled",
    onStorage: "onstorage",
    onSubmit: "onsubmit",
    onSuspend: "onsuspend",
    onTimeUpdate: "ontimeupdate",
    onToggle: "ontoggle",
    onUnload: "onunload",
    onVolumeChange: "onvolumechange",
    onWaiting: "onwaiting",
    onZoom: "onzoom",
    overlinePosition: "overline-position",
    overlineThickness: "overline-thickness",
    paintOrder: "paint-order",
    panose1: "panose-1",
    pointerEvents: "pointer-events",
    referrerPolicy: "referrerpolicy",
    renderingIntent: "rendering-intent",
    shapeRendering: "shape-rendering",
    stopColor: "stop-color",
    stopOpacity: "stop-opacity",
    strikethroughPosition: "strikethrough-position",
    strikethroughThickness: "strikethrough-thickness",
    strokeDashArray: "stroke-dasharray",
    strokeDashOffset: "stroke-dashoffset",
    strokeLineCap: "stroke-linecap",
    strokeLineJoin: "stroke-linejoin",
    strokeMiterLimit: "stroke-miterlimit",
    strokeOpacity: "stroke-opacity",
    strokeWidth: "stroke-width",
    tabIndex: "tabindex",
    textAnchor: "text-anchor",
    textDecoration: "text-decoration",
    textRendering: "text-rendering",
    transformOrigin: "transform-origin",
    typeOf: "typeof",
    underlinePosition: "underline-position",
    underlineThickness: "underline-thickness",
    unicodeBidi: "unicode-bidi",
    unicodeRange: "unicode-range",
    unitsPerEm: "units-per-em",
    vAlphabetic: "v-alphabetic",
    vHanging: "v-hanging",
    vIdeographic: "v-ideographic",
    vMathematical: "v-mathematical",
    vectorEffect: "vector-effect",
    vertAdvY: "vert-adv-y",
    vertOriginX: "vert-origin-x",
    vertOriginY: "vert-origin-y",
    wordSpacing: "word-spacing",
    writingMode: "writing-mode",
    xHeight: "x-height",
    // These were camelcased in Tiny. Now lowercased in SVG 2
    playbackOrder: "playbackorder",
    timelineBegin: "timelinebegin",
  },
  properties: {
    about: commaOrSpaceSeparated,
    accentHeight: number,
    accumulate: null,
    additive: null,
    alignmentBaseline: null,
    alphabetic: number,
    amplitude: number,
    arabicForm: null,
    ascent: number,
    attributeName: null,
    attributeType: null,
    azimuth: number,
    bandwidth: null,
    baselineShift: null,
    baseFrequency: null,
    baseProfile: null,
    bbox: null,
    begin: null,
    bias: number,
    by: null,
    calcMode: null,
    capHeight: number,
    className: spaceSeparated,
    clip: null,
    clipPath: null,
    clipPathUnits: null,
    clipRule: null,
    color: null,
    colorInterpolation: null,
    colorInterpolationFilters: null,
    colorProfile: null,
    colorRendering: null,
    content: null,
    contentScriptType: null,
    contentStyleType: null,
    crossOrigin: null,
    cursor: null,
    cx: null,
    cy: null,
    d: null,
    dataType: null,
    defaultAction: null,
    descent: number,
    diffuseConstant: number,
    direction: null,
    display: null,
    dur: null,
    divisor: number,
    dominantBaseline: null,
    download: boolean,
    dx: null,
    dy: null,
    edgeMode: null,
    editable: null,
    elevation: number,
    enableBackground: null,
    end: null,
    event: null,
    exponent: number,
    externalResourcesRequired: null,
    fill: null,
    fillOpacity: number,
    fillRule: null,
    filter: null,
    filterRes: null,
    filterUnits: null,
    floodColor: null,
    floodOpacity: null,
    focusable: null,
    focusHighlight: null,
    fontFamily: null,
    fontSize: null,
    fontSizeAdjust: null,
    fontStretch: null,
    fontStyle: null,
    fontVariant: null,
    fontWeight: null,
    format: null,
    fr: null,
    from: null,
    fx: null,
    fy: null,
    g1: commaSeparated,
    g2: commaSeparated,
    glyphName: commaSeparated,
    glyphOrientationHorizontal: null,
    glyphOrientationVertical: null,
    glyphRef: null,
    gradientTransform: null,
    gradientUnits: null,
    handler: null,
    hanging: number,
    hatchContentUnits: null,
    hatchUnits: null,
    height: null,
    href: null,
    hrefLang: null,
    horizAdvX: number,
    horizOriginX: number,
    horizOriginY: number,
    id: null,
    ideographic: number,
    imageRendering: null,
    initialVisibility: null,
    in: null,
    in2: null,
    intercept: number,
    k: number,
    k1: number,
    k2: number,
    k3: number,
    k4: number,
    kernelMatrix: commaOrSpaceSeparated,
    kernelUnitLength: null,
    keyPoints: null,
    // SEMI_COLON_SEPARATED
    keySplines: null,
    // SEMI_COLON_SEPARATED
    keyTimes: null,
    // SEMI_COLON_SEPARATED
    kerning: null,
    lang: null,
    lengthAdjust: null,
    letterSpacing: null,
    lightingColor: null,
    limitingConeAngle: number,
    local: null,
    markerEnd: null,
    markerMid: null,
    markerStart: null,
    markerHeight: null,
    markerUnits: null,
    markerWidth: null,
    mask: null,
    maskContentUnits: null,
    maskType: null,
    maskUnits: null,
    mathematical: null,
    max: null,
    media: null,
    mediaCharacterEncoding: null,
    mediaContentEncodings: null,
    mediaSize: number,
    mediaTime: null,
    method: null,
    min: null,
    mode: null,
    name: null,
    navDown: null,
    navDownLeft: null,
    navDownRight: null,
    navLeft: null,
    navNext: null,
    navPrev: null,
    navRight: null,
    navUp: null,
    navUpLeft: null,
    navUpRight: null,
    numOctaves: null,
    observer: null,
    offset: null,
    onAbort: null,
    onActivate: null,
    onAfterPrint: null,
    onBeforePrint: null,
    onBegin: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnd: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFocusIn: null,
    onFocusOut: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadStart: null,
    onMessage: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onMouseWheel: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRepeat: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onShow: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onZoom: null,
    opacity: null,
    operator: null,
    order: null,
    orient: null,
    orientation: null,
    origin: null,
    overflow: null,
    overlay: null,
    overlinePosition: number,
    overlineThickness: number,
    paintOrder: null,
    panose1: null,
    path: null,
    pathLength: number,
    patternContentUnits: null,
    patternTransform: null,
    patternUnits: null,
    phase: null,
    ping: spaceSeparated,
    pitch: null,
    playbackOrder: null,
    pointerEvents: null,
    points: null,
    pointsAtX: number,
    pointsAtY: number,
    pointsAtZ: number,
    preserveAlpha: null,
    preserveAspectRatio: null,
    primitiveUnits: null,
    propagate: null,
    property: commaOrSpaceSeparated,
    r: null,
    radius: null,
    referrerPolicy: null,
    refX: null,
    refY: null,
    rel: commaOrSpaceSeparated,
    rev: commaOrSpaceSeparated,
    renderingIntent: null,
    repeatCount: null,
    repeatDur: null,
    requiredExtensions: commaOrSpaceSeparated,
    requiredFeatures: commaOrSpaceSeparated,
    requiredFonts: commaOrSpaceSeparated,
    requiredFormats: commaOrSpaceSeparated,
    resource: null,
    restart: null,
    result: null,
    rotate: null,
    rx: null,
    ry: null,
    scale: null,
    seed: null,
    shapeRendering: null,
    side: null,
    slope: null,
    snapshotTime: null,
    specularConstant: number,
    specularExponent: number,
    spreadMethod: null,
    spacing: null,
    startOffset: null,
    stdDeviation: null,
    stemh: null,
    stemv: null,
    stitchTiles: null,
    stopColor: null,
    stopOpacity: null,
    strikethroughPosition: number,
    strikethroughThickness: number,
    string: null,
    stroke: null,
    strokeDashArray: commaOrSpaceSeparated,
    strokeDashOffset: null,
    strokeLineCap: null,
    strokeLineJoin: null,
    strokeMiterLimit: number,
    strokeOpacity: number,
    strokeWidth: null,
    style: null,
    surfaceScale: number,
    syncBehavior: null,
    syncBehaviorDefault: null,
    syncMaster: null,
    syncTolerance: null,
    syncToleranceDefault: null,
    systemLanguage: commaOrSpaceSeparated,
    tabIndex: number,
    tableValues: null,
    target: null,
    targetX: number,
    targetY: number,
    textAnchor: null,
    textDecoration: null,
    textRendering: null,
    textLength: null,
    timelineBegin: null,
    title: null,
    transformBehavior: null,
    type: null,
    typeOf: commaOrSpaceSeparated,
    to: null,
    transform: null,
    transformOrigin: null,
    u1: null,
    u2: null,
    underlinePosition: number,
    underlineThickness: number,
    unicode: null,
    unicodeBidi: null,
    unicodeRange: null,
    unitsPerEm: number,
    values: null,
    vAlphabetic: number,
    vMathematical: number,
    vectorEffect: null,
    vHanging: number,
    vIdeographic: number,
    version: null,
    vertAdvY: number,
    vertOriginX: number,
    vertOriginY: number,
    viewBox: null,
    viewTarget: null,
    visibility: null,
    width: null,
    widths: null,
    wordSpacing: null,
    writingMode: null,
    x: null,
    x1: null,
    x2: null,
    xChannelSelector: null,
    xHeight: number,
    y: null,
    y1: null,
    y2: null,
    yChannelSelector: null,
    z: null,
    zoomAndPan: null,
  },
  space: "svg",
  transform: caseSensitiveTransform,
})

// node_modules/property-information/lib/xlink.js
var xlink = create({
  properties: {
    xLinkActuate: null,
    xLinkArcRole: null,
    xLinkHref: null,
    xLinkRole: null,
    xLinkShow: null,
    xLinkTitle: null,
    xLinkType: null,
  },
  space: "xlink",
  transform(_2, property) {
    return "xlink:" + property.slice(5).toLowerCase()
  },
})

// node_modules/property-information/lib/xmlns.js
var xmlns = create({
  attributes: { xmlnsxlink: "xmlns:xlink" },
  properties: { xmlnsXLink: null, xmlns: null },
  space: "xmlns",
  transform: caseInsensitiveTransform,
})

// node_modules/property-information/lib/xml.js
var xml = create({
  properties: { xmlBase: null, xmlLang: null, xmlSpace: null },
  space: "xml",
  transform(_2, property) {
    return "xml:" + property.slice(3).toLowerCase()
  },
})

// node_modules/property-information/lib/hast-to-react.js
var hastToReact = {
  classId: "classID",
  dataType: "datatype",
  itemId: "itemID",
  strokeDashArray: "strokeDasharray",
  strokeDashOffset: "strokeDashoffset",
  strokeLineCap: "strokeLinecap",
  strokeLineJoin: "strokeLinejoin",
  strokeMiterLimit: "strokeMiterlimit",
  typeOf: "typeof",
  xLinkActuate: "xlinkActuate",
  xLinkArcRole: "xlinkArcrole",
  xLinkHref: "xlinkHref",
  xLinkRole: "xlinkRole",
  xLinkShow: "xlinkShow",
  xLinkTitle: "xlinkTitle",
  xLinkType: "xlinkType",
  xmlnsXLink: "xmlnsXlink",
}

// node_modules/property-information/lib/find.js
var cap = /[A-Z]/g
var dash = /-[a-z]/g
var valid = /^data[-\w.:]+$/i
function find(schema, value) {
  const normal = normalize(value)
  let property = value
  let Type = Info
  if (normal in schema.normal) {
    return schema.property[schema.normal[normal]]
  }
  if (normal.length > 4 && normal.slice(0, 4) === "data" && valid.test(value)) {
    if (value.charAt(4) === "-") {
      const rest = value.slice(5).replace(dash, camelcase)
      property = "data" + rest.charAt(0).toUpperCase() + rest.slice(1)
    } else {
      const rest = value.slice(4)
      if (!dash.test(rest)) {
        let dashes = rest.replace(cap, kebab)
        if (dashes.charAt(0) !== "-") {
          dashes = "-" + dashes
        }
        value = "data" + dashes
      }
    }
    Type = DefinedInfo
  }
  return new Type(property, value)
}
function kebab($0) {
  return "-" + $0.toLowerCase()
}
function camelcase($0) {
  return $0.charAt(1).toUpperCase()
}

// node_modules/property-information/index.js
var html2 = merge([aria, html, xlink, xmlns, xml], "html")
var svg2 = merge([aria, svg, xlink, xmlns, xml], "svg")

// node_modules/space-separated-tokens/index.js
function stringify2(values) {
  return values.join(" ").trim()
}

// node_modules/hast-util-to-jsx-runtime/lib/index.js
var import_style_to_js = __toESM(require_cjs3(), 1)

// node_modules/unist-util-position/lib/index.js
var pointEnd = point("end")
var pointStart = point("start")
function point(type) {
  return point3
  function point3(node) {
    const point4 = (node && node.position && node.position[type]) || {}
    if (
      typeof point4.line === "number" &&
      point4.line > 0 &&
      typeof point4.column === "number" &&
      point4.column > 0
    ) {
      return {
        line: point4.line,
        column: point4.column,
        offset: typeof point4.offset === "number" && point4.offset > -1 ? point4.offset : void 0,
      }
    }
  }
}

// node_modules/unist-util-stringify-position/lib/index.js
function stringifyPosition(value) {
  if (!value || typeof value !== "object") {
    return ""
  }
  if ("position" in value || "type" in value) {
    return position2(value.position)
  }
  if ("start" in value || "end" in value) {
    return position2(value)
  }
  if ("line" in value || "column" in value) {
    return point2(value)
  }
  return ""
}
function point2(point3) {
  return index(point3 && point3.line) + ":" + index(point3 && point3.column)
}
function position2(pos) {
  return point2(pos && pos.start) + "-" + point2(pos && pos.end)
}
function index(value) {
  return value && typeof value === "number" ? value : 1
}

// node_modules/vfile-message/lib/index.js
var VFileMessage = class extends Error {
  /**
   * Create a message for `reason`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {Options | null | undefined} [options]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | Options | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns
   *   Instance of `VFileMessage`.
   */
  // eslint-disable-next-line complexity
  constructor(causeOrReason, optionsOrParentOrPlace, origin) {
    super()
    if (typeof optionsOrParentOrPlace === "string") {
      origin = optionsOrParentOrPlace
      optionsOrParentOrPlace = void 0
    }
    let reason = ""
    let options = {}
    let legacyCause = false
    if (optionsOrParentOrPlace) {
      if ("line" in optionsOrParentOrPlace && "column" in optionsOrParentOrPlace) {
        options = { place: optionsOrParentOrPlace }
      } else if ("start" in optionsOrParentOrPlace && "end" in optionsOrParentOrPlace) {
        options = { place: optionsOrParentOrPlace }
      } else if ("type" in optionsOrParentOrPlace) {
        options = {
          ancestors: [optionsOrParentOrPlace],
          place: optionsOrParentOrPlace.position,
        }
      } else {
        options = { ...optionsOrParentOrPlace }
      }
    }
    if (typeof causeOrReason === "string") {
      reason = causeOrReason
    } else if (!options.cause && causeOrReason) {
      legacyCause = true
      reason = causeOrReason.message
      options.cause = causeOrReason
    }
    if (!options.ruleId && !options.source && typeof origin === "string") {
      const index2 = origin.indexOf(":")
      if (index2 === -1) {
        options.ruleId = origin
      } else {
        options.source = origin.slice(0, index2)
        options.ruleId = origin.slice(index2 + 1)
      }
    }
    if (!options.place && options.ancestors && options.ancestors) {
      const parent = options.ancestors[options.ancestors.length - 1]
      if (parent) {
        options.place = parent.position
      }
    }
    const start2 = options.place && "start" in options.place ? options.place.start : options.place
    this.ancestors = options.ancestors || void 0
    this.cause = options.cause || void 0
    this.column = start2 ? start2.column : void 0
    this.fatal = void 0
    this.file = ""
    this.message = reason
    this.line = start2 ? start2.line : void 0
    this.name = stringifyPosition(options.place) || "1:1"
    this.place = options.place || void 0
    this.reason = this.message
    this.ruleId = options.ruleId || void 0
    this.source = options.source || void 0
    this.stack =
      legacyCause && options.cause && typeof options.cause.stack === "string"
        ? options.cause.stack
        : ""
    this.actual = void 0
    this.expected = void 0
    this.note = void 0
    this.url = void 0
  }
}
VFileMessage.prototype.file = ""
VFileMessage.prototype.name = ""
VFileMessage.prototype.reason = ""
VFileMessage.prototype.message = ""
VFileMessage.prototype.stack = ""
VFileMessage.prototype.column = void 0
VFileMessage.prototype.line = void 0
VFileMessage.prototype.ancestors = void 0
VFileMessage.prototype.cause = void 0
VFileMessage.prototype.fatal = void 0
VFileMessage.prototype.place = void 0
VFileMessage.prototype.ruleId = void 0
VFileMessage.prototype.source = void 0

// node_modules/hast-util-to-jsx-runtime/lib/index.js
var own = {}.hasOwnProperty
var emptyMap = /* @__PURE__ */ new Map()
var cap2 = /[A-Z]/g
var tableElements = /* @__PURE__ */ new Set(["table", "tbody", "thead", "tfoot", "tr"])
var tableCellElement = /* @__PURE__ */ new Set(["td", "th"])
var docs = "https://github.com/syntax-tree/hast-util-to-jsx-runtime"
function toJsxRuntime(tree, options) {
  if (!options || options.Fragment === void 0) {
    throw new TypeError("Expected `Fragment` in options")
  }
  const filePath = options.filePath || void 0
  let create2
  if (options.development) {
    if (typeof options.jsxDEV !== "function") {
      throw new TypeError("Expected `jsxDEV` in options when `development: true`")
    }
    create2 = developmentCreate(filePath, options.jsxDEV)
  } else {
    if (typeof options.jsx !== "function") {
      throw new TypeError("Expected `jsx` in production options")
    }
    if (typeof options.jsxs !== "function") {
      throw new TypeError("Expected `jsxs` in production options")
    }
    create2 = productionCreate(filePath, options.jsx, options.jsxs)
  }
  const state = {
    Fragment: options.Fragment,
    ancestors: [],
    components: options.components || {},
    create: create2,
    elementAttributeNameCase: options.elementAttributeNameCase || "react",
    evaluater: options.createEvaluater ? options.createEvaluater() : void 0,
    filePath,
    ignoreInvalidStyle: options.ignoreInvalidStyle || false,
    passKeys: options.passKeys !== false,
    passNode: options.passNode || false,
    schema: options.space === "svg" ? svg2 : html2,
    stylePropertyNameCase: options.stylePropertyNameCase || "dom",
    tableCellAlignToStyle: options.tableCellAlignToStyle !== false,
  }
  const result = one(state, tree, void 0)
  if (result && typeof result !== "string") {
    return result
  }
  return state.create(tree, state.Fragment, { children: result || void 0 }, void 0)
}
function one(state, node, key) {
  if (node.type === "element") {
    return element(state, node, key)
  }
  if (node.type === "mdxFlowExpression" || node.type === "mdxTextExpression") {
    return mdxExpression(state, node)
  }
  if (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") {
    return mdxJsxElement(state, node, key)
  }
  if (node.type === "mdxjsEsm") {
    return mdxEsm(state, node)
  }
  if (node.type === "root") {
    return root(state, node, key)
  }
  if (node.type === "text") {
    return text(state, node)
  }
}
function element(state, node, key) {
  const parentSchema = state.schema
  let schema = parentSchema
  if (node.tagName.toLowerCase() === "svg" && parentSchema.space === "html") {
    schema = svg2
    state.schema = schema
  }
  state.ancestors.push(node)
  const type = findComponentFromName(state, node.tagName, false)
  const props = createElementProps(state, node)
  let children = createChildren(state, node)
  if (tableElements.has(node.tagName)) {
    children = children.filter(function (child) {
      return typeof child === "string" ? !whitespace(child) : true
    })
  }
  addNode(state, props, type, node)
  addChildren(props, children)
  state.ancestors.pop()
  state.schema = parentSchema
  return state.create(node, type, props, key)
}
function mdxExpression(state, node) {
  if (node.data && node.data.estree && state.evaluater) {
    const program = node.data.estree
    const expression = program.body[0]
    ok(expression.type === "ExpressionStatement")
    return (
      /** @type {Child | undefined} */
      state.evaluater.evaluateExpression(expression.expression)
    )
  }
  crashEstree(state, node.position)
}
function mdxEsm(state, node) {
  if (node.data && node.data.estree && state.evaluater) {
    return (
      /** @type {Child | undefined} */
      state.evaluater.evaluateProgram(node.data.estree)
    )
  }
  crashEstree(state, node.position)
}
function mdxJsxElement(state, node, key) {
  const parentSchema = state.schema
  let schema = parentSchema
  if (node.name === "svg" && parentSchema.space === "html") {
    schema = svg2
    state.schema = schema
  }
  state.ancestors.push(node)
  const type = node.name === null ? state.Fragment : findComponentFromName(state, node.name, true)
  const props = createJsxElementProps(state, node)
  const children = createChildren(state, node)
  addNode(state, props, type, node)
  addChildren(props, children)
  state.ancestors.pop()
  state.schema = parentSchema
  return state.create(node, type, props, key)
}
function root(state, node, key) {
  const props = {}
  addChildren(props, createChildren(state, node))
  return state.create(node, state.Fragment, props, key)
}
function text(_2, node) {
  return node.value
}
function addNode(state, props, type, node) {
  if (typeof type !== "string" && type !== state.Fragment && state.passNode) {
    props.node = node
  }
}
function addChildren(props, children) {
  if (children.length > 0) {
    const value = children.length > 1 ? children : children[0]
    if (value) {
      props.children = value
    }
  }
}
function productionCreate(_2, jsx, jsxs) {
  return create2
  function create2(_3, type, props, key) {
    const isStaticChildren = Array.isArray(props.children)
    const fn = isStaticChildren ? jsxs : jsx
    return key ? fn(type, props, key) : fn(type, props)
  }
}
function developmentCreate(filePath, jsxDEV) {
  return create2
  function create2(node, type, props, key) {
    const isStaticChildren = Array.isArray(props.children)
    const point3 = pointStart(node)
    return jsxDEV(
      type,
      props,
      key,
      isStaticChildren,
      {
        columnNumber: point3 ? point3.column - 1 : void 0,
        fileName: filePath,
        lineNumber: point3 ? point3.line : void 0,
      },
      void 0,
    )
  }
}
function createElementProps(state, node) {
  const props = {}
  let alignValue
  let prop
  for (prop in node.properties) {
    if (prop !== "children" && own.call(node.properties, prop)) {
      const result = createProperty(state, prop, node.properties[prop])
      if (result) {
        const [key, value] = result
        if (
          state.tableCellAlignToStyle &&
          key === "align" &&
          typeof value === "string" &&
          tableCellElement.has(node.tagName)
        ) {
          alignValue = value
        } else {
          props[key] = value
        }
      }
    }
  }
  if (alignValue) {
    const style =
      /** @type {Style} */
      props.style || (props.style = {})
    style[state.stylePropertyNameCase === "css" ? "text-align" : "textAlign"] = alignValue
  }
  return props
}
function createJsxElementProps(state, node) {
  const props = {}
  for (const attribute of node.attributes) {
    if (attribute.type === "mdxJsxExpressionAttribute") {
      if (attribute.data && attribute.data.estree && state.evaluater) {
        const program = attribute.data.estree
        const expression = program.body[0]
        ok(expression.type === "ExpressionStatement")
        const objectExpression = expression.expression
        ok(objectExpression.type === "ObjectExpression")
        const property = objectExpression.properties[0]
        ok(property.type === "SpreadElement")
        Object.assign(props, state.evaluater.evaluateExpression(property.argument))
      } else {
        crashEstree(state, node.position)
      }
    } else {
      const name2 = attribute.name
      let value
      if (attribute.value && typeof attribute.value === "object") {
        if (attribute.value.data && attribute.value.data.estree && state.evaluater) {
          const program = attribute.value.data.estree
          const expression = program.body[0]
          ok(expression.type === "ExpressionStatement")
          value = state.evaluater.evaluateExpression(expression.expression)
        } else {
          crashEstree(state, node.position)
        }
      } else {
        value = attribute.value === null ? true : attribute.value
      }
      props[name2] = /** @type {Props[keyof Props]} */ value
    }
  }
  return props
}
function createChildren(state, node) {
  const children = []
  let index2 = -1
  const countsByName = state.passKeys ? /* @__PURE__ */ new Map() : emptyMap
  while (++index2 < node.children.length) {
    const child = node.children[index2]
    let key
    if (state.passKeys) {
      const name2 =
        child.type === "element"
          ? child.tagName
          : child.type === "mdxJsxFlowElement" || child.type === "mdxJsxTextElement"
            ? child.name
            : void 0
      if (name2) {
        const count = countsByName.get(name2) || 0
        key = name2 + "-" + count
        countsByName.set(name2, count + 1)
      }
    }
    const result = one(state, child, key)
    if (result !== void 0) children.push(result)
  }
  return children
}
function createProperty(state, prop, value) {
  const info = find(state.schema, prop)
  if (value === null || value === void 0 || (typeof value === "number" && Number.isNaN(value))) {
    return
  }
  if (Array.isArray(value)) {
    value = info.commaSeparated ? stringify(value) : stringify2(value)
  }
  if (info.property === "style") {
    let styleObject = typeof value === "object" ? value : parseStyle(state, String(value))
    if (state.stylePropertyNameCase === "css") {
      styleObject = transformStylesToCssCasing(styleObject)
    }
    return ["style", styleObject]
  }
  return [
    state.elementAttributeNameCase === "react" && info.space
      ? hastToReact[info.property] || info.property
      : info.attribute,
    value,
  ]
}
function parseStyle(state, value) {
  try {
    return (0, import_style_to_js.default)(value, { reactCompat: true })
  } catch (error) {
    if (state.ignoreInvalidStyle) {
      return {}
    }
    const cause =
      /** @type {Error} */
      error
    const message = new VFileMessage("Cannot parse `style` attribute", {
      ancestors: state.ancestors,
      cause,
      ruleId: "style",
      source: "hast-util-to-jsx-runtime",
    })
    message.file = state.filePath || void 0
    message.url = docs + "#cannot-parse-style-attribute"
    throw message
  }
}
function findComponentFromName(state, name2, allowExpression) {
  let result
  if (!allowExpression) {
    result = { type: "Literal", value: name2 }
  } else if (name2.includes(".")) {
    const identifiers = name2.split(".")
    let index2 = -1
    let node
    while (++index2 < identifiers.length) {
      const prop = name(identifiers[index2])
        ? { type: "Identifier", name: identifiers[index2] }
        : { type: "Literal", value: identifiers[index2] }
      node = node
        ? {
            type: "MemberExpression",
            object: node,
            property: prop,
            computed: Boolean(index2 && prop.type === "Literal"),
            optional: false,
          }
        : prop
    }
    ok(node, "always a result")
    result = node
  } else {
    result =
      name(name2) && !/^[a-z]/.test(name2)
        ? { type: "Identifier", name: name2 }
        : { type: "Literal", value: name2 }
  }
  if (result.type === "Literal") {
    const name3 =
      /** @type {string | number} */
      result.value
    return own.call(state.components, name3) ? state.components[name3] : name3
  }
  if (state.evaluater) {
    return state.evaluater.evaluateExpression(result)
  }
  crashEstree(state)
}
function crashEstree(state, place) {
  const message = new VFileMessage("Cannot handle MDX estrees without `createEvaluater`", {
    ancestors: state.ancestors,
    place,
    ruleId: "mdx-estree",
    source: "hast-util-to-jsx-runtime",
  })
  message.file = state.filePath || void 0
  message.url = docs + "#cannot-handle-mdx-estrees-without-createevaluater"
  throw message
}
function transformStylesToCssCasing(domCasing) {
  const cssCasing = {}
  let from
  for (from in domCasing) {
    if (own.call(domCasing, from)) {
      cssCasing[transformStyleToCssCasing(from)] = domCasing[from]
    }
  }
  return cssCasing
}
function transformStyleToCssCasing(from) {
  let to = from.replace(cap2, toDash)
  if (to.slice(0, 3) === "ms-") to = "-" + to
  return to
}
function toDash($0) {
  return "-" + $0.toLowerCase()
}

// node_modules/preact/dist/preact.mjs
var n
var l
var u
var t
var i
var r
var o
var e
var f
var c
var a
var s
var h
var p
var v
var y
var d = {}
var w = []
var _ = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i
var g = Array.isArray
function m(n2, l2) {
  for (var u3 in l2) n2[u3] = l2[u3]
  return n2
}
function b(n2) {
  n2 && n2.parentNode && n2.parentNode.removeChild(n2)
}
function k(l2, u3, t2) {
  var i2,
    r2,
    o2,
    e2 = {}
  for (o2 in u3) "key" == o2 ? (i2 = u3[o2]) : "ref" == o2 ? (r2 = u3[o2]) : (e2[o2] = u3[o2])
  if (
    (arguments.length > 2 && (e2.children = arguments.length > 3 ? n.call(arguments, 2) : t2),
    "function" == typeof l2 && null != l2.defaultProps)
  )
    for (o2 in l2.defaultProps) void 0 === e2[o2] && (e2[o2] = l2.defaultProps[o2])
  return x(l2, e2, i2, r2, null)
}
function x(n2, t2, i2, r2, o2) {
  var e2 = {
    type: n2,
    props: t2,
    key: i2,
    ref: r2,
    __k: null,
    __: null,
    __b: 0,
    __e: null,
    __c: null,
    constructor: void 0,
    __v: null == o2 ? ++u : o2,
    __i: -1,
    __u: 0,
  }
  return (null == o2 && null != l.vnode && l.vnode(e2), e2)
}
function S(n2) {
  return n2.children
}
function C(n2, l2) {
  ;((this.props = n2), (this.context = l2))
}
function $(n2, l2) {
  if (null == l2) return n2.__ ? $(n2.__, n2.__i + 1) : null
  for (var u3; l2 < n2.__k.length; l2++)
    if (null != (u3 = n2.__k[l2]) && null != u3.__e) return u3.__e
  return "function" == typeof n2.type ? $(n2) : null
}
function I(n2) {
  if (n2.__P && n2.__d) {
    var u3 = n2.__v,
      t2 = u3.__e,
      i2 = [],
      r2 = [],
      o2 = m({}, u3)
    ;((o2.__v = u3.__v + 1),
      l.vnode && l.vnode(o2),
      q(
        n2.__P,
        o2,
        u3,
        n2.__n,
        n2.__P.namespaceURI,
        32 & u3.__u ? [t2] : null,
        i2,
        null == t2 ? $(u3) : t2,
        !!(32 & u3.__u),
        r2,
      ),
      (o2.__v = u3.__v),
      (o2.__.__k[o2.__i] = o2),
      D(i2, o2, r2),
      (u3.__e = u3.__ = null),
      o2.__e != t2 && P(o2))
  }
}
function P(n2) {
  if (null != (n2 = n2.__) && null != n2.__c)
    return (
      (n2.__e = n2.__c.base = null),
      n2.__k.some(function (l2) {
        if (null != l2 && null != l2.__e) return (n2.__e = n2.__c.base = l2.__e)
      }),
      P(n2)
    )
}
function A(n2) {
  ;((!n2.__d && (n2.__d = true) && i.push(n2) && !H.__r++) || r != l.debounceRendering) &&
    ((r = l.debounceRendering) || o)(H)
}
function H() {
  try {
    for (var n2, l2 = 1; i.length; )
      (i.length > l2 && i.sort(e), (n2 = i.shift()), (l2 = i.length), I(n2))
  } finally {
    i.length = H.__r = 0
  }
}
function L(n2, l2, u3, t2, i2, r2, o2, e2, f3, c2, a2) {
  var s2,
    h2,
    p2,
    v2,
    y2,
    _2,
    g2,
    m2 = (t2 && t2.__k) || w,
    b2 = l2.length
  for (f3 = T(u3, l2, m2, f3, b2), s2 = 0; s2 < b2; s2++)
    null != (p2 = u3.__k[s2]) &&
      ((h2 = (-1 != p2.__i && m2[p2.__i]) || d),
      (p2.__i = s2),
      (_2 = q(n2, p2, h2, i2, r2, o2, e2, f3, c2, a2)),
      (v2 = p2.__e),
      p2.ref &&
        h2.ref != p2.ref &&
        (h2.ref && J(h2.ref, null, p2), a2.push(p2.ref, p2.__c || v2, p2)),
      null == y2 && null != v2 && (y2 = v2),
      (g2 = !!(4 & p2.__u)) || h2.__k === p2.__k
        ? ((f3 = j(p2, f3, n2, g2)), g2 && h2.__e && (h2.__e = null))
        : "function" == typeof p2.type && void 0 !== _2
          ? (f3 = _2)
          : v2 && (f3 = v2.nextSibling),
      (p2.__u &= -7))
  return ((u3.__e = y2), f3)
}
function T(n2, l2, u3, t2, i2) {
  var r2,
    o2,
    e2,
    f3,
    c2,
    a2 = u3.length,
    s2 = a2,
    h2 = 0
  for (n2.__k = new Array(i2), r2 = 0; r2 < i2; r2++)
    null != (o2 = l2[r2]) && "boolean" != typeof o2 && "function" != typeof o2
      ? ("string" == typeof o2 ||
        "number" == typeof o2 ||
        "bigint" == typeof o2 ||
        o2.constructor == String
          ? (o2 = n2.__k[r2] = x(null, o2, null, null, null))
          : g(o2)
            ? (o2 = n2.__k[r2] = x(S, { children: o2 }, null, null, null))
            : void 0 === o2.constructor && o2.__b > 0
              ? (o2 = n2.__k[r2] = x(o2.type, o2.props, o2.key, o2.ref ? o2.ref : null, o2.__v))
              : (n2.__k[r2] = o2),
        (f3 = r2 + h2),
        (o2.__ = n2),
        (o2.__b = n2.__b + 1),
        (e2 = null),
        -1 != (c2 = o2.__i = O(o2, u3, f3, s2)) && (s2--, (e2 = u3[c2]) && (e2.__u |= 2)),
        null == e2 || null == e2.__v
          ? (-1 == c2 && (i2 > a2 ? h2-- : i2 < a2 && h2++),
            "function" != typeof o2.type && (o2.__u |= 4))
          : c2 != f3 &&
            (c2 == f3 - 1 ? h2-- : c2 == f3 + 1 ? h2++ : (c2 > f3 ? h2-- : h2++, (o2.__u |= 4))))
      : (n2.__k[r2] = null)
  if (s2)
    for (r2 = 0; r2 < a2; r2++)
      null != (e2 = u3[r2]) && 0 == (2 & e2.__u) && (e2.__e == t2 && (t2 = $(e2)), K(e2, e2))
  return t2
}
function j(n2, l2, u3, t2) {
  var i2, r2
  if ("function" == typeof n2.type) {
    for (i2 = n2.__k, r2 = 0; i2 && r2 < i2.length; r2++)
      i2[r2] && ((i2[r2].__ = n2), (l2 = j(i2[r2], l2, u3, t2)))
    return l2
  }
  n2.__e != l2 &&
    (t2 && (l2 && n2.type && !l2.parentNode && (l2 = $(n2)), u3.insertBefore(n2.__e, l2 || null)),
    (l2 = n2.__e))
  do {
    l2 = l2 && l2.nextSibling
  } while (null != l2 && 8 == l2.nodeType)
  return l2
}
function O(n2, l2, u3, t2) {
  var i2,
    r2,
    o2,
    e2 = n2.key,
    f3 = n2.type,
    c2 = l2[u3],
    a2 = null != c2 && 0 == (2 & c2.__u)
  if ((null === c2 && null == e2) || (a2 && e2 == c2.key && f3 == c2.type)) return u3
  if (t2 > (a2 ? 1 : 0)) {
    for (i2 = u3 - 1, r2 = u3 + 1; i2 >= 0 || r2 < l2.length; )
      if (
        null != (c2 = l2[(o2 = i2 >= 0 ? i2-- : r2++)]) &&
        0 == (2 & c2.__u) &&
        e2 == c2.key &&
        f3 == c2.type
      )
        return o2
  }
  return -1
}
function z(n2, l2, u3) {
  "-" == l2[0]
    ? n2.setProperty(l2, null == u3 ? "" : u3)
    : (n2[l2] = null == u3 ? "" : "number" != typeof u3 || _.test(l2) ? u3 : u3 + "px")
}
function N(n2, l2, u3, t2, i2) {
  var r2, o2
  n: if ("style" == l2)
    if ("string" == typeof u3) n2.style.cssText = u3
    else {
      if (("string" == typeof t2 && (n2.style.cssText = t2 = ""), t2))
        for (l2 in t2) (u3 && l2 in u3) || z(n2.style, l2, "")
      if (u3) for (l2 in u3) (t2 && u3[l2] == t2[l2]) || z(n2.style, l2, u3[l2])
    }
  else if ("o" == l2[0] && "n" == l2[1])
    ((r2 = l2 != (l2 = l2.replace(s, "$1"))),
      (o2 = l2.toLowerCase()),
      (l2 = o2 in n2 || "onFocusOut" == l2 || "onFocusIn" == l2 ? o2.slice(2) : l2.slice(2)),
      n2.l || (n2.l = {}),
      (n2.l[l2 + r2] = u3),
      u3
        ? t2
          ? (u3[a] = t2[a])
          : ((u3[a] = h), n2.addEventListener(l2, r2 ? v : p, r2))
        : n2.removeEventListener(l2, r2 ? v : p, r2))
  else {
    if ("http://www.w3.org/2000/svg" == i2)
      l2 = l2.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s")
    else if (
      "width" != l2 &&
      "height" != l2 &&
      "href" != l2 &&
      "list" != l2 &&
      "form" != l2 &&
      "tabIndex" != l2 &&
      "download" != l2 &&
      "rowSpan" != l2 &&
      "colSpan" != l2 &&
      "role" != l2 &&
      "popover" != l2 &&
      l2 in n2
    )
      try {
        n2[l2] = null == u3 ? "" : u3
        break n
      } catch (n3) {}
    "function" == typeof u3 ||
      (null == u3 || (false === u3 && "-" != l2[4])
        ? n2.removeAttribute(l2)
        : n2.setAttribute(l2, "popover" == l2 && 1 == u3 ? "" : u3))
  }
}
function V(n2) {
  return function (u3) {
    if (this.l) {
      var t2 = this.l[u3.type + n2]
      if (null == u3[c]) u3[c] = h++
      else if (u3[c] < t2[a]) return
      return t2(l.event ? l.event(u3) : u3)
    }
  }
}
function q(n2, u3, t2, i2, r2, o2, e2, f3, c2, a2) {
  var s2,
    h2,
    p2,
    v2,
    y2,
    d2,
    _2,
    k2,
    x2,
    M,
    $2,
    I2,
    P2,
    A2,
    H2,
    T2 = u3.type
  if (void 0 !== u3.constructor) return null
  ;(128 & t2.__u && ((c2 = !!(32 & t2.__u)), (o2 = [(f3 = u3.__e = t2.__e)])),
    (s2 = l.__b) && s2(u3))
  n: if ("function" == typeof T2)
    try {
      if (
        ((k2 = u3.props),
        (x2 = T2.prototype && T2.prototype.render),
        (M = (s2 = T2.contextType) && i2[s2.__c]),
        ($2 = s2 ? (M ? M.props.value : s2.__) : i2),
        t2.__c
          ? (_2 = (h2 = u3.__c = t2.__c).__ = h2.__E)
          : (x2
              ? (u3.__c = h2 = new T2(k2, $2))
              : ((u3.__c = h2 = new C(k2, $2)), (h2.constructor = T2), (h2.render = Q)),
            M && M.sub(h2),
            h2.state || (h2.state = {}),
            (h2.__n = i2),
            (p2 = h2.__d = true),
            (h2.__h = []),
            (h2._sb = [])),
        x2 && null == h2.__s && (h2.__s = h2.state),
        x2 &&
          null != T2.getDerivedStateFromProps &&
          (h2.__s == h2.state && (h2.__s = m({}, h2.__s)),
          m(h2.__s, T2.getDerivedStateFromProps(k2, h2.__s))),
        (v2 = h2.props),
        (y2 = h2.state),
        (h2.__v = u3),
        p2)
      )
        (x2 &&
          null == T2.getDerivedStateFromProps &&
          null != h2.componentWillMount &&
          h2.componentWillMount(),
          x2 && null != h2.componentDidMount && h2.__h.push(h2.componentDidMount))
      else {
        if (
          (x2 &&
            null == T2.getDerivedStateFromProps &&
            k2 !== v2 &&
            null != h2.componentWillReceiveProps &&
            h2.componentWillReceiveProps(k2, $2),
          u3.__v == t2.__v ||
            (!h2.__e &&
              null != h2.shouldComponentUpdate &&
              false === h2.shouldComponentUpdate(k2, h2.__s, $2)))
        ) {
          ;(u3.__v != t2.__v && ((h2.props = k2), (h2.state = h2.__s), (h2.__d = false)),
            (u3.__e = t2.__e),
            (u3.__k = t2.__k),
            u3.__k.some(function (n3) {
              n3 && (n3.__ = u3)
            }),
            w.push.apply(h2.__h, h2._sb),
            (h2._sb = []),
            h2.__h.length && e2.push(h2))
          break n
        }
        ;(null != h2.componentWillUpdate && h2.componentWillUpdate(k2, h2.__s, $2),
          x2 &&
            null != h2.componentDidUpdate &&
            h2.__h.push(function () {
              h2.componentDidUpdate(v2, y2, d2)
            }))
      }
      if (
        ((h2.context = $2),
        (h2.props = k2),
        (h2.__P = n2),
        (h2.__e = false),
        (I2 = l.__r),
        (P2 = 0),
        x2)
      )
        ((h2.state = h2.__s),
          (h2.__d = false),
          I2 && I2(u3),
          (s2 = h2.render(h2.props, h2.state, h2.context)),
          w.push.apply(h2.__h, h2._sb),
          (h2._sb = []))
      else
        do {
          ;((h2.__d = false),
            I2 && I2(u3),
            (s2 = h2.render(h2.props, h2.state, h2.context)),
            (h2.state = h2.__s))
        } while (h2.__d && ++P2 < 25)
      ;((h2.state = h2.__s),
        null != h2.getChildContext && (i2 = m(m({}, i2), h2.getChildContext())),
        x2 &&
          !p2 &&
          null != h2.getSnapshotBeforeUpdate &&
          (d2 = h2.getSnapshotBeforeUpdate(v2, y2)),
        (A2 = null != s2 && s2.type === S && null == s2.key ? E(s2.props.children) : s2),
        (f3 = L(n2, g(A2) ? A2 : [A2], u3, t2, i2, r2, o2, e2, f3, c2, a2)),
        (h2.base = u3.__e),
        (u3.__u &= -161),
        h2.__h.length && e2.push(h2),
        _2 && (h2.__E = h2.__ = null))
    } catch (n3) {
      if (((u3.__v = null), c2 || null != o2))
        if (n3.then) {
          for (u3.__u |= c2 ? 160 : 128; f3 && 8 == f3.nodeType && f3.nextSibling; )
            f3 = f3.nextSibling
          ;((o2[o2.indexOf(f3)] = null), (u3.__e = f3))
        } else {
          for (H2 = o2.length; H2--; ) b(o2[H2])
          B(u3)
        }
      else ((u3.__e = t2.__e), (u3.__k = t2.__k), n3.then || B(u3))
      l.__e(n3, u3, t2)
    }
  else
    null == o2 && u3.__v == t2.__v
      ? ((u3.__k = t2.__k), (u3.__e = t2.__e))
      : (f3 = u3.__e = G(t2.__e, u3, t2, i2, r2, o2, e2, c2, a2))
  return ((s2 = l.diffed) && s2(u3), 128 & u3.__u ? void 0 : f3)
}
function B(n2) {
  n2 && (n2.__c && (n2.__c.__e = true), n2.__k && n2.__k.some(B))
}
function D(n2, u3, t2) {
  for (var i2 = 0; i2 < t2.length; i2++) J(t2[i2], t2[++i2], t2[++i2])
  ;(l.__c && l.__c(u3, n2),
    n2.some(function (u4) {
      try {
        ;((n2 = u4.__h),
          (u4.__h = []),
          n2.some(function (n3) {
            n3.call(u4)
          }))
      } catch (n3) {
        l.__e(n3, u4.__v)
      }
    }))
}
function E(n2) {
  return "object" != typeof n2 || null == n2 || n2.__b > 0
    ? n2
    : g(n2)
      ? n2.map(E)
      : void 0 !== n2.constructor
        ? null
        : m({}, n2)
}
function G(u3, t2, i2, r2, o2, e2, f3, c2, a2) {
  var s2,
    h2,
    p2,
    v2,
    y2,
    w2,
    _2,
    m2 = i2.props || d,
    k2 = t2.props,
    x2 = t2.type
  if (
    ("svg" == x2
      ? (o2 = "http://www.w3.org/2000/svg")
      : "math" == x2
        ? (o2 = "http://www.w3.org/1998/Math/MathML")
        : o2 || (o2 = "http://www.w3.org/1999/xhtml"),
    null != e2)
  ) {
    for (s2 = 0; s2 < e2.length; s2++)
      if (
        (y2 = e2[s2]) &&
        "setAttribute" in y2 == !!x2 &&
        (x2 ? y2.localName == x2 : 3 == y2.nodeType)
      ) {
        ;((u3 = y2), (e2[s2] = null))
        break
      }
  }
  if (null == u3) {
    if (null == x2) return document.createTextNode(k2)
    ;((u3 = document.createElementNS(o2, x2, k2.is && k2)),
      c2 && (l.__m && l.__m(t2, e2), (c2 = false)),
      (e2 = null))
  }
  if (null == x2) m2 === k2 || (c2 && u3.data == k2) || (u3.data = k2)
  else {
    if (
      ((e2 = "textarea" == x2 && null != k2.defaultValue ? null : e2 && n.call(u3.childNodes)),
      !c2 && null != e2)
    )
      for (m2 = {}, s2 = 0; s2 < u3.attributes.length; s2++)
        m2[(y2 = u3.attributes[s2]).name] = y2.value
    for (s2 in m2)
      ((y2 = m2[s2]),
        "dangerouslySetInnerHTML" == s2
          ? (p2 = y2)
          : "children" == s2 ||
            s2 in k2 ||
            ("value" == s2 && "defaultValue" in k2) ||
            ("checked" == s2 && "defaultChecked" in k2) ||
            N(u3, s2, null, y2, o2))
    for (s2 in k2)
      ((y2 = k2[s2]),
        "children" == s2
          ? (v2 = y2)
          : "dangerouslySetInnerHTML" == s2
            ? (h2 = y2)
            : "value" == s2
              ? (w2 = y2)
              : "checked" == s2
                ? (_2 = y2)
                : (c2 && "function" != typeof y2) || m2[s2] === y2 || N(u3, s2, y2, m2[s2], o2))
    if (h2)
      (c2 ||
        (p2 && (h2.__html == p2.__html || h2.__html == u3.innerHTML)) ||
        (u3.innerHTML = h2.__html),
        (t2.__k = []))
    else if (
      (p2 && (u3.innerHTML = ""),
      L(
        "template" == t2.type ? u3.content : u3,
        g(v2) ? v2 : [v2],
        t2,
        i2,
        r2,
        "foreignObject" == x2 ? "http://www.w3.org/1999/xhtml" : o2,
        e2,
        f3,
        e2 ? e2[0] : i2.__k && $(i2, 0),
        c2,
        a2,
      ),
      null != e2)
    )
      for (s2 = e2.length; s2--; ) b(e2[s2])
    ;(c2 && "textarea" != x2) ||
      ((s2 = "value"),
      "progress" == x2 && null == w2
        ? u3.removeAttribute("value")
        : null != w2 &&
          (w2 !== u3[s2] || ("progress" == x2 && !w2) || ("option" == x2 && w2 != m2[s2])) &&
          N(u3, s2, w2, m2[s2], o2),
      (s2 = "checked"),
      null != _2 && _2 != u3[s2] && N(u3, s2, _2, m2[s2], o2))
  }
  return u3
}
function J(n2, u3, t2) {
  try {
    if ("function" == typeof n2) {
      var i2 = "function" == typeof n2.__u
      ;(i2 && n2.__u(), (i2 && null == u3) || (n2.__u = n2(u3)))
    } else n2.current = u3
  } catch (n3) {
    l.__e(n3, t2)
  }
}
function K(n2, u3, t2) {
  var i2, r2
  if (
    (l.unmount && l.unmount(n2),
    (i2 = n2.ref) && ((i2.current && i2.current != n2.__e) || J(i2, null, u3)),
    null != (i2 = n2.__c))
  ) {
    if (i2.componentWillUnmount)
      try {
        i2.componentWillUnmount()
      } catch (n3) {
        l.__e(n3, u3)
      }
    i2.base = i2.__P = null
  }
  if ((i2 = n2.__k))
    for (r2 = 0; r2 < i2.length; r2++) i2[r2] && K(i2[r2], u3, t2 || "function" != typeof n2.type)
  ;(t2 || b(n2.__e), (n2.__c = n2.__ = n2.__e = void 0))
}
function Q(n2, l2, u3) {
  return this.constructor(n2, u3)
}
;((n = w.slice),
  (l = {
    __e: function (n2, l2, u3, t2) {
      for (var i2, r2, o2; (l2 = l2.__); )
        if ((i2 = l2.__c) && !i2.__)
          try {
            if (
              ((r2 = i2.constructor) &&
                null != r2.getDerivedStateFromError &&
                (i2.setState(r2.getDerivedStateFromError(n2)), (o2 = i2.__d)),
              null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), (o2 = i2.__d)),
              o2)
            )
              return (i2.__E = i2)
          } catch (l3) {
            n2 = l3
          }
      throw n2
    },
  }),
  (u = 0),
  (t = function (n2) {
    return null != n2 && void 0 === n2.constructor
  }),
  (C.prototype.setState = function (n2, l2) {
    var u3
    ;((u3 = null != this.__s && this.__s != this.state ? this.__s : (this.__s = m({}, this.state))),
      "function" == typeof n2 && (n2 = n2(m({}, u3), this.props)),
      n2 && m(u3, n2),
      null != n2 && this.__v && (l2 && this._sb.push(l2), A(this)))
  }),
  (C.prototype.forceUpdate = function (n2) {
    this.__v && ((this.__e = true), n2 && this.__h.push(n2), A(this))
  }),
  (C.prototype.render = S),
  (i = []),
  (o = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout),
  (e = function (n2, l2) {
    return n2.__v.__b - l2.__v.__b
  }),
  (H.__r = 0),
  (f = Math.random().toString(8)),
  (c = "__d" + f),
  (a = "__a" + f),
  (s = /(PointerCapture)$|Capture$/i),
  (h = 0),
  (p = V(false)),
  (v = V(true)),
  (y = 0))

// node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs
var f2 = 0
function u2(e2, t2, n2, o2, i2, u3) {
  t2 || (t2 = {})
  var a2,
    c2,
    p2 = t2
  if ("ref" in p2) for (c2 in ((p2 = {}), t2)) "ref" == c2 ? (a2 = t2[c2]) : (p2[c2] = t2[c2])
  var l2 = {
    type: e2,
    props: p2,
    key: n2,
    ref: a2,
    __k: null,
    __: null,
    __b: 0,
    __e: null,
    __c: null,
    constructor: void 0,
    __v: --f2,
    __i: -1,
    __u: 0,
    __source: i2,
    __self: u3,
  }
  if ("function" == typeof e2 && (a2 = e2.defaultProps))
    for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2])
  return (l.vnode && l.vnode(l2), l2)
}

// node_modules/@quartz-community/utils/dist/jsx.js
function childrenToString(children) {
  if (typeof children === "string") return children
  if (Array.isArray(children)) return children.map(childrenToString).join("")
  return String(children ?? "")
}
var builtinComponents = {
  table: (props) =>
    /* @__PURE__ */ u2("div", {
      class: "table-container",
      children: /* @__PURE__ */ u2("table", { ...props }),
    }),
  style: ({ children, ...rest }) =>
    k("style", { ...rest, dangerouslySetInnerHTML: { __html: childrenToString(children) } }),
  script: ({ children, ...rest }) =>
    k("script", { ...rest, dangerouslySetInnerHTML: { __html: childrenToString(children) } }),
}
function htmlToJsx(tree, components) {
  return toJsxRuntime(tree, {
    Fragment: S,
    jsx: u2,
    jsxs: u2,
    elementAttributeNameCase: "html",
    components: { ...builtinComponents, ...components },
  })
}

// src/ContentBody.tsx
var ContentBody_default = () => {
  const ContentBody = ({ fileData, tree }) => {
    const content = htmlToJsx(tree)
    const frontmatter = fileData?.frontmatter
    const classes = frontmatter?.cssclasses ?? []
    const classString = ["popover-hint", ...classes].join(" ")
    return /* @__PURE__ */ u2("article", {
      class: classString,
      children: /* @__PURE__ */ u2("div", {
        class: "markdown-preview-view markdown-rendered",
        children: content,
      }),
    })
  }
  return ContentBody
}

// src/pageType.ts
var indexMatcher = ({ slug }) => slug.endsWith("/index")
var IndexContentPage = () => ({
  name: "IndexContentPage",
  priority: 11,
  match: indexMatcher,
  layout: "content",
  body: ContentBody_default,
})
export { ContentBody_default as ContentBody, IndexContentPage }
//# sourceMappingURL=index.js.map
