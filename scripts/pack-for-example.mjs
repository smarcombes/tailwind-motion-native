#!/usr/bin/env node
/**
 * Builds the package, packs it, and installs the tarball into the example app.
 *
 * Installing the tarball (rather than linking `file:../..`) is deliberate: the
 * example then consumes exactly what `npm publish` would upload, so a missing
 * file in `files` or a bad `exports` entry shows up here instead of in someone
 * else's app.
 */
import { execFileSync } from "node:child_process";
import { readdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const example = join(root, "examples", "expo-nativewind");

const run = (command, args, cwd) => {
  console.log(`\n$ ${command} ${args.join(" ")}  (${cwd})`);
  execFileSync(command, args, { cwd, stdio: "inherit" });
};

readdirSync(root)
  .filter((file) => file.startsWith("tailwind-motion-native-") && file.endsWith(".tgz"))
  .forEach((file) => rmSync(join(root, file)));

run("npm", ["run", "build"], root);
run("npm", ["pack"], root);

const tarball = readdirSync(root).find(
  (file) => file.startsWith("tailwind-motion-native-") && file.endsWith(".tgz")
);

if (!tarball) throw new Error("npm pack did not produce a tarball");

run("npm", ["install", join(root, tarball), "--no-save"], example);
console.log(`\nInstalled ${tarball} into examples/expo-nativewind`);
