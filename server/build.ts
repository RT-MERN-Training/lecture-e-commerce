import * as esbuild from "esbuild";

async function build() {
  await esbuild.build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    platform: "node",
    target: "node20",
    outfile: "dist/index.js",
    minify: true,
    minifyWhitespace: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    format: "cjs",
  });

  console.log("Build complete: dist/index.js (minimized and obfuscated)");
}

build().catch(console.error);
