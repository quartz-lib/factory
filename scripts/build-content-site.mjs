#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"

const scriptDir = path.dirname(new URL(import.meta.url).pathname)
const repoRoot = path.resolve(scriptDir, "..")

const quartzFlagsWithValues = new Set([
  "--baseDir",
  "--concurrency",
  "--directory",
  "--output",
  "--port",
  "--remoteDevHost",
  "--wsPort",
  "-c",
  "-d",
  "-o",
])

function parseArgs(rawArgs) {
  const positional = []
  const quartzArgs = []

  for (let i = 0; i < rawArgs.length; i++) {
    const arg = rawArgs[i]

    if (arg === "--") {
      quartzArgs.push(...rawArgs.slice(i + 1))
      break
    }

    if (arg.startsWith("-")) {
      quartzArgs.push(arg)

      const [flagName] = arg.split("=", 1)
      if (
        quartzFlagsWithValues.has(flagName) &&
        !arg.includes("=") &&
        rawArgs[i + 1] &&
        !rawArgs[i + 1].startsWith("-")
      ) {
        quartzArgs.push(rawArgs[i + 1])
        i++
      }

      continue
    }

    positional.push(arg)
  }

  if (positional.length > 2) {
    console.error(
      "Usage: node scripts/build-content-site.mjs [content-repo] [output-dir] [quartz build flags]",
    )
    process.exit(1)
  }

  return {
    inputDir: path.resolve(positional[0] ?? path.join(repoRoot, "content")),
    outputDir: path.resolve(positional[1] ?? path.join(repoRoot, "public")),
    quartzArgs,
  }
}

const { inputDir, outputDir, quartzArgs } = parseArgs(process.argv.slice(2))

const baseConfigPath = path.join(repoRoot, "quartz.config.yaml")
const generatedConfigPath = path.join(repoRoot, ".quartz-site-config.generated.yaml")
const pluginIndexPath = path.join(repoRoot, ".quartz", "plugins", "index.ts")

function resolveContentPaths(inputDir) {
  const repoSiteConfigPath = path.join(inputDir, "site.yaml")
  const repoContentDir = path.join(inputDir, "content")

  if (fs.existsSync(repoSiteConfigPath) && fs.existsSync(repoContentDir)) {
    return {
      siteConfigPath: repoSiteConfigPath,
      contentDir: repoContentDir,
    }
  }

  const parentSiteConfigPath = path.join(path.dirname(inputDir), "site.yaml")
  if (path.basename(inputDir) === "content" && fs.existsSync(parentSiteConfigPath)) {
    return {
      siteConfigPath: parentSiteConfigPath,
      contentDir: inputDir,
    }
  }

  return {
    siteConfigPath: repoSiteConfigPath,
    contentDir: repoContentDir,
  }
}

const { siteConfigPath, contentDir } = resolveContentPaths(inputDir)

function ensurePathExists(filePath, message) {
  if (!fs.existsSync(filePath)) {
    console.error(message)
    process.exit(1)
  }
}

function ensureSiteConfigValue(siteConfig, key) {
  const value = siteConfig.configuration?.[key]
  if (typeof value !== "string" || value.trim() === "") {
    console.error(`Missing required site config: configuration.${key} in ${siteConfigPath}`)
    process.exit(1)
  }
}

function run(command, args, cwd, env = {}) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: false,
    env: {
      ...process.env,
      ...env,
    },
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

function deepMerge(base, override) {
  if (!override || typeof override !== "object" || Array.isArray(override)) return base

  for (const [key, value] of Object.entries(override)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      base[key] &&
      typeof base[key] === "object" &&
      !Array.isArray(base[key])
    ) {
      deepMerge(base[key], value)
    } else {
      base[key] = value
    }
  }

  return base
}

function pluginName(entry) {
  const source = typeof entry.source === "string" ? entry.source : entry.source?.repo
  return source?.split("#")[0].split("/").pop()
}

function applySiteConfig(baseConfig, siteConfig) {
  deepMerge(baseConfig.configuration, siteConfig.configuration)

  if (siteConfig.footerLinks) {
    const footer = baseConfig.plugins.find((entry) => pluginName(entry) === "footer")
    footer.options = footer.options ?? {}
    footer.options.links = siteConfig.footerLinks
  }

  for (const override of siteConfig.pluginOverrides ?? []) {
    const target = baseConfig.plugins.find((entry) => {
      return pluginName(entry) === override.name || entry.source === override.source
    })

    if (!target) {
      throw new Error(`Cannot find plugin to override: ${override.name ?? override.source}`)
    }

    deepMerge(target, override)
    delete target.name
  }

  return baseConfig
}

ensurePathExists(baseConfigPath, `Missing shared Quartz config: ${baseConfigPath}`)
ensurePathExists(siteConfigPath, `Missing site config: ${siteConfigPath}`)
ensurePathExists(contentDir, `Missing content directory: ${contentDir}`)

if (!fs.existsSync(path.join(repoRoot, "node_modules"))) {
  run("npm", ["ci"], repoRoot)
}

if (!fs.existsSync(pluginIndexPath)) {
  run("node", [path.join(repoRoot, "quartz/bootstrap-cli.mjs"), "plugin", "install"], repoRoot)
}

const YAML = (await import("yaml")).default
const baseConfig = YAML.parse(fs.readFileSync(baseConfigPath, "utf8"))
const siteConfig = YAML.parse(fs.readFileSync(siteConfigPath, "utf8"))

ensureSiteConfigValue(siteConfig, "pageTitle")
ensureSiteConfigValue(siteConfig, "baseUrl")

const generatedConfig = applySiteConfig(baseConfig, siteConfig)

fs.writeFileSync(
  generatedConfigPath,
  `# Generated by scripts/build-content-site.mjs. Do not edit.\n${YAML.stringify(generatedConfig)}`,
)

run(
  "node",
  [
    path.join(repoRoot, "quartz/bootstrap-cli.mjs"),
    "build",
    "-d",
    contentDir,
    "-o",
    outputDir,
    ...quartzArgs,
  ],
  repoRoot,
  { QUARTZ_CONFIG_PATH: generatedConfigPath },
)

console.log(`\nBuilt content site into ${outputDir}`)
