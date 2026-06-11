/**
 * One-off migration: imports the local Markdown blog posts in
 * src/content/blog/*.md into Sanity as `post` documents.
 *
 * Usage:
 *   1. Fill .env with PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET and a
 *      SANITY_WRITE_TOKEN (Editor token from sanity.io/manage).
 *   2. node scripts/migrate-to-sanity.mjs
 *
 * Idempotent: re-running replaces existing docs (deterministic _id per slug).
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";
import { JSDOM } from "jsdom";
import { createClient } from "@sanity/client";
import { htmlToBlocks } from "@sanity/block-tools";
import { Schema } from "@sanity/schema";

// --- Load .env (no dependency on dotenv) ---------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnv() {
  const envPath = join(root, ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[2].trim().replace(/^["']|["']$/g, "");
    if (!(m[1] in process.env)) process.env[m[1]] = val;
  }
}
loadEnv();

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN in .env — aborting."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

// --- Compile a minimal schema so block-tools knows how to map HTML --------
const defaultSchema = Schema.compile({
  name: "default",
  types: [
    {
      name: "post",
      type: "document",
      fields: [
        {
          name: "body",
          type: "array",
          of: [{ type: "block" }, { type: "image" }],
        },
      ],
    },
  ],
});
const blockContentType = defaultSchema
  .get("post")
  .fields.find((f) => f.name === "body").type;

// --- Helpers --------------------------------------------------------------
function toISODate(input) {
  // Accepts "M.D.YYYY" (e.g. "6.4.2026") or already-ISO strings.
  if (!input) return undefined;
  const dotted = String(input).match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (dotted) {
    const [, mo, d, y] = dotted;
    return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  const dt = new Date(input);
  return isNaN(dt) ? undefined : dt.toISOString().slice(0, 10);
}

async function uploadImage(imgPath) {
  if (!imgPath) return undefined;
  const filePath = join(root, "public", imgPath.replace(/^\//, ""));
  if (!existsSync(filePath)) {
    console.warn(`  ! image not found, skipping: ${imgPath}`);
    return undefined;
  }
  const asset = await client.assets.upload("image", readFileSync(filePath), {
    filename: basename(filePath),
  });
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };
}

function markdownToBlocks(md) {
  const html = marked.parse(md, { async: false });
  return htmlToBlocks(html, blockContentType, {
    parseHtml: (h) => new JSDOM(h).window.document,
  });
}

// --- Run ------------------------------------------------------------------
const blogDir = join(root, "src", "content", "blog");
const files = readdirSync(blogDir).filter((f) => extname(f) === ".md");

console.log(`Migrating ${files.length} posts to project ${projectId}/${dataset}…\n`);

for (const file of files) {
  const slug = basename(file, ".md");
  const raw = readFileSync(join(blogDir, file), "utf8");
  const { data, content } = matter(raw);

  process.stdout.write(`• ${slug} … `);

  const mainImage = await uploadImage(data.image);
  const body = markdownToBlocks(content);

  const doc = {
    _id: `post-${slug}`,
    _type: "post",
    title: data.title,
    slug: { _type: "slug", current: slug },
    date: toISODate(data.date),
    author: data.author,
    category: data.category,
    excerpt: data.excerpt,
    ...(mainImage ? { mainImage } : {}),
    body,
  };

  await client.createOrReplace(doc);
  console.log("done");
}

console.log("\n✓ Migration complete.");
