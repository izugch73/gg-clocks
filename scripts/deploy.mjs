/**
 * Upload ./dist to the web server over FTPS.
 *
 *   npm run deploy            # build, then upload
 *   npm run deploy:only       # upload the existing dist/ without rebuilding
 *   node scripts/deploy.mjs --dry-run   # list what would be uploaded
 *
 * Connection settings come from ./.env (git-ignored; see README.md):
 *   FTP_HOST        required
 *   FTP_USER        required
 *   FTP_PASSWORD    required
 *   FTP_REMOTE_DIR  required, e.g. /public_html or /clocks.thegg.jp/public_html
 *   FTP_PORT        optional, default 21
 *   FTP_SECURE      optional: "true" (explicit FTPS, default) | "implicit" | "false" (plain FTP)
 */
import { existsSync, statSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "basic-ftp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const envFile = path.join(root, ".env");
const dryRun = process.argv.includes("--dry-run");

if (existsSync(envFile)) process.loadEnvFile(envFile);

function required(name) {
  const v = process.env[name]?.trim();
  if (!v) {
    console.error(`[deploy] ${name} が未設定です。README.md の「デプロイ」を参考に .env を作成してください。`);
    process.exit(1);
  }
  return v;
}

const host = required("FTP_HOST");
const user = required("FTP_USER");
const password = required("FTP_PASSWORD");
const remoteDir = required("FTP_REMOTE_DIR");
const port = Number(process.env.FTP_PORT || 21);
const secureRaw = (process.env.FTP_SECURE || "true").toLowerCase();
const secure = secureRaw === "implicit" ? "implicit" : secureRaw !== "false";

if (!existsSync(distDir) || !statSync(distDir).isDirectory()) {
  console.error("[deploy] dist/ がありません。先に npm run build を実行してください。");
  process.exit(1);
}

async function listFiles(dir, base = dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === ".DS_Store") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await listFiles(full, base)));
    else out.push(path.relative(base, full));
  }
  return out.sort();
}

const files = await listFiles(distDir);
console.log(`[deploy] ${files.length} files in dist/ -> ${secure === false ? "ftp" : "ftps"}://${host}:${port}${remoteDir}`);

if (dryRun) {
  for (const f of files) console.log("  " + f);
  console.log("[deploy] dry-run なので何もアップロードしていません。");
  process.exit(0);
}

const client = new Client(30_000);
client.ftp.verbose = process.env.FTP_VERBOSE === "1";

try {
  await client.access({ host, port, user, password, secure });
  await client.ensureDir(remoteDir);
  // basic-ftp's uploadFromDir ignores .DS_Store-like junk only if we filter it;
  // it uploads everything, so we upload file by file to keep the list explicit.
  let done = 0;
  for (const rel of files) {
    const remotePath = path.posix.join(remoteDir, rel.split(path.sep).join("/"));
    await client.ensureDir(path.posix.dirname(remotePath));
    await client.uploadFrom(path.join(distDir, rel), remotePath);
    done += 1;
    process.stdout.write(`\r[deploy] ${done}/${files.length} ${rel}${" ".repeat(20)}`);
  }
  process.stdout.write("\n");
  console.log(`[deploy] 完了: ${done} files uploaded to ${host}${remoteDir}`);
} catch (err) {
  process.stdout.write("\n");
  console.error("[deploy] 失敗:", err?.message ?? err);
  process.exitCode = 1;
} finally {
  client.close();
}
