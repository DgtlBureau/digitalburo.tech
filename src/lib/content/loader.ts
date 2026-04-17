import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import type { ContentDocument } from "./types";

export const CONTENT_ROOT = path.join(process.cwd(), "content");

function readMdx<T>(filePath: string, schema: z.ZodType<T>): ContentDocument<T> {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = schema.parse(data);
  return {
    frontmatter,
    body: content,
    sourcePath: path.relative(process.cwd(), filePath),
  };
}

export function loadSingle<T>(
  relativePath: string,
  schema: z.ZodType<T>,
): ContentDocument<T> {
  return readMdx(path.join(CONTENT_ROOT, relativePath), schema);
}

export function loadDir<T>(
  dirName: string,
  schema: z.ZodType<T>,
  options: { indexFile?: string } = {},
): ContentDocument<T>[] {
  const dir = path.join(CONTENT_ROOT, dirName);
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const docs: ContentDocument<T>[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const indexPath = path.join(
        dir,
        entry.name,
        options.indexFile ?? "index.mdx",
      );
      if (fs.existsSync(indexPath)) {
        docs.push(readMdx(indexPath, schema));
      }
    } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      docs.push(readMdx(path.join(dir, entry.name), schema));
    }
  }

  return docs;
}
