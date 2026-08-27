#!/usr/bin/env node
/**
 * Re-vendors the tailwindcss-motion plugin source.
 *
 *   npm run vendor:upstream -- 1.2.0
 *
 * The upstream files are copied verbatim apart from their `tailwindcss` imports,
 * which are re-pointed at our mock plugin API, so diffing against upstream stays
 * easy. Run `npm test` afterwards: the class coverage test lists any new
 * utilities that still need a native mapping.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const version = process.argv[2];
if (!version) {
  console.error("Usage: npm run vendor:upstream -- <version>");
  process.exit(1);
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const destination = join(root, "src", "core", "plugin");
const FILES = [
  "defaults.ts",
  "keyframes.ts",
  "baseAnimations.ts",
  "modifiers.ts",
  "presets.ts",
];

const HEADER = (v) =>
  `/* Vendored from tailwindcss-motion v${v} (MIT) - see ./README.md */\n`;

const PATCHES = [
  [
    'import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette.js";\nimport type { Config, PluginAPI } from "tailwindcss/types/config.js";',
    'import type { PluginAPI } from "./api.js";\nimport { flattenColorPalette } from "../tailwindTheme.js";',
  ],
  [
    'import type { CSSRuleObject, PluginAPI } from "tailwindcss/types/config.js";',
    'import type { CSSRuleObject, PluginAPI } from "./api.js";',
  ],
  [
    'import type { PluginAPI } from "tailwindcss/types/config.js";',
    'import type { PluginAPI } from "./api.js";',
  ],
  ['export const baseAnimationsTheme: Config["theme"] = {', "export const baseAnimationsTheme = {"],
];

const workDir = mkdtempSync(join(tmpdir(), "tailwindcss-motion-"));

try {
  execFileSync("npm", ["pack", `tailwindcss-motion@${version}`], {
    cwd: workDir,
    stdio: "inherit",
  });

  const tarball = readdirSync(workDir).find((file) => file.endsWith(".tgz"));
  execFileSync("tar", ["xzf", tarball], { cwd: workDir, stdio: "inherit" });

  const source = join(workDir, "package", "src");

  FILES.forEach((file) => {
    let contents = readFileSync(join(source, file), "utf8");
    const before = contents;

    PATCHES.forEach(([from, to]) => {
      contents = contents.replace(from, to);
    });

    if (contents === before) {
      console.warn(
        `! ${file}: no import patch applied — upstream imports may have changed`
      );
    }

    writeFileSync(join(destination, file), HEADER(version) + contents);
    console.log(`  vendored ${file}`);
  });

  ["LICENSE"].forEach((file) => {
    writeFileSync(
      join(destination, file),
      readFileSync(join(workDir, "package", file), "utf8")
    );
  });

  const indexPath = join(destination, "index.ts");
  writeFileSync(
    indexPath,
    readFileSync(indexPath, "utf8").replace(
      /export const UPSTREAM_VERSION = "[^"]+";/,
      `export const UPSTREAM_VERSION = "${version}";`
    )
  );

  const readmePath = join(destination, "README.md");
  writeFileSync(
    readmePath,
    readFileSync(readmePath, "utf8").replace(/v\d+\.\d+\.\d+/g, `v${version}`)
  );

  console.log(`\nVendored tailwindcss-motion v${version}. Now run: npm test`);
} finally {
  rmSync(workDir, { recursive: true, force: true });
}
