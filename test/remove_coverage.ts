try {
  Deno.removeSync("coverage", { recursive: true });
} catch (_error) {
  console.error("No coverage direcory found. Continuing...");
}
