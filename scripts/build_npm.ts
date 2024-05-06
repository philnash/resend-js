import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "@philnash/resend",
    version: Deno.args[0]?.replace(/^v/, ""),
    description:
      "A JavaScript implementation of the Resend API that works in all environments",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/philnash/resend-js.git",
    },
    bugs: {
      url: "https://github.com/philnash/resend-js/issues",
    },
  },
  compilerOptions: {
    lib: ["ES2022", "DOM"],
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE.md", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
