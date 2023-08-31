try {
  Deno.removeSync("coverage", { recursive: true });
} catch (error) {
  console.error(`No coverage direcory found. Continuing...\n${error}`);
}
