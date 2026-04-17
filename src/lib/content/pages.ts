import { loadSingle } from "./loader";
import { PageFrontmatterSchema, type Page } from "./types";

export function getPage(slug: "home" | "leadership" | "career" | "virazh" | "policy"): Page {
  return loadSingle(`pages/${slug}.mdx`, PageFrontmatterSchema);
}
