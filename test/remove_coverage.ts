try {
  Deno.removeSync("coverage", { recursive: true });
} catch (_error) {
  // There was no coverage directory, nothing to do.
}
