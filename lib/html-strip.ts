/**
 * Strip HTML tags from clinical content while preserving:
 *   - paragraph and list structure (newlines)
 *   - bullet markers
 *   - bold cues using markdown-style asterisks (so callers can choose to render or strip)
 *
 * Designed for the ~1,300 generics rows that contain WordPress-style markup
 * (e.g. <div class="ac-body">…<ul><li><strong>…</strong>…</li></ul></div>).
 *
 * This is intentionally NOT a real HTML parser — it's a regex pipeline tuned
 * for the specific patterns in the BD medicine scraper output.
 */

const HTML_ENTITIES: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&mdash;": "—",
  "&ndash;": "–",
  "&hellip;": "…",
  "&deg;": "°",
};

function decodeEntities(str: string): string {
  let out = str;
  for (const [entity, replacement] of Object.entries(HTML_ENTITIES)) {
    out = out.split(entity).join(replacement);
  }
  // Numeric entities &#123; → char
  out = out.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
  return out;
}

/**
 * Returns a clean plain-text string. List items get "•" prefixes,
 * paragraph and br tags become newlines.
 */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";

  let text = String(html);

  // Convert structural tags to newlines/markers BEFORE stripping
  text = text.replace(/<\s*li[^>]*>/gi, "\n• ");
  text = text.replace(/<\s*\/\s*li[^>]*>/gi, "");
  text = text.replace(/<\s*br\s*\/?>/gi, "\n");
  text = text.replace(/<\s*\/\s*p\s*>/gi, "\n\n");
  text = text.replace(/<\s*p[^>]*>/gi, "");
  text = text.replace(/<\s*\/\s*(div|ul|ol|tr|h[1-6])\s*>/gi, "\n");
  text = text.replace(/<\s*(div|ul|ol|tr|h[1-6])[^>]*>/gi, "");
  text = text.replace(/<\s*\/?\s*td[^>]*>/gi, " ");

  // Remove all remaining tags (including <strong>, <em>, <span>, etc.)
  text = text.replace(/<[^>]+>/g, "");

  // Decode entities
  text = decodeEntities(text);

  // Collapse 3+ newlines into 2
  text = text.replace(/\n{3,}/g, "\n\n");
  // Trim each line, drop empties
  text = text
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .filter((line) => line.length > 0)
    .join("\n");

  return text.trim();
}

/**
 * Splits stripped output into structured blocks for richer rendering.
 * Each block is either { type: "bullet"; text } or { type: "para"; text }.
 */
export interface ContentBlock {
  type: "bullet" | "para";
  text: string;
}

export function toBlocks(html: string | null | undefined): ContentBlock[] {
  const clean = stripHtml(html);
  if (!clean) return [];
  return clean.split("\n").map((line) => {
    if (line.startsWith("• ")) return { type: "bullet", text: line.slice(2).trim() };
    return { type: "para", text: line };
  });
}
