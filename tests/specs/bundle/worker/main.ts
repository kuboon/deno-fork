// deno-lint-ignore-file no-console
if (typeof WorkerGlobalScope === "undefined") {
  console.log("Main: creating worker");
  const worker = new Worker(import.meta.url, { type: "module" });
  worker.onmessage = (e) => {
    console.log("Main: received message:", e.data);
    Deno.exit(0);
  };
  worker.onerror = (e) => {
    console.error("Main: worker error:", e.message);
    Deno.exit(1);
  };
  setTimeout(() => {
    console.error("Main: timeout waiting for worker");
    Deno.exit(1);
  }, 30000);
} else {
  console.log("Worker: bundling module");
  await Deno.writeTextFile(
    "./test_module.ts",
    'export function hello() { return "Hello from module"; }',
  );

  const result = await Deno.bundle({
    entrypoints: ["./test_module.ts"],
    write: false,
  });

  console.log("Worker: bundle succeeded:", result.success);
  console.log("Worker: output files:", result.outputFiles?.length);
  postMessage("done");
}
