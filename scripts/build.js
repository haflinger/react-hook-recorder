#!/usr/bin/env node
const path = require("path");
const { build } = require("esbuild");
const { dependencies, peerDependencies } = require("../package.json");

build({
  entryPoints: [path.resolve(__dirname, "..", "src/index.ts")],
  outfile: path.resolve(__dirname, "..", "dist/index.js"),
  bundle: true,
  sourcemap: "external",
  minify: true,
  external: [
    ...Object.keys(dependencies),
    ...(peerDependencies ? Object.keys(peerDependencies) : []),
  ],
});