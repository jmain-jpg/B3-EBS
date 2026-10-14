import { readdir, readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const partsDirectory = new URL("./seed-parts/", import.meta.url);
const wrangler = fileURLToPath(new URL("../node_modules/wrangler/bin/wrangler.js", import.meta.url));
const files = (await readdir(partsDirectory)).filter((name) => name.endsWith(".sql")).sort();

for (let index = 0; index < files.length; index += 1) {
  const sql = await readFile(new URL(files[index], partsDirectory), "utf8");
  console.log(`Uploading ${index + 1}/${files.length}`);
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [wrangler, "d1", "execute", "b3-floral-ebs", "--remote", `--command=${sql}`], {
      stdio: ["ignore", "ignore", "inherit"],
      env: process.env,
    });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolve() : reject(new Error(`Wrangler exited with code ${code}`)));
  });
}

console.log("All data parts uploaded.");
