// JSON-LD helper. Serializes structured data as <script type="application/ld+json">.
// Payload is built server-side from typed data (never user input), and < is escaped
// to \u003c per Next.js JSON-LD guide: https://nextjs.org/docs/app/guides/json-ld

type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

export function JsonLd({ data }: { data: JsonLdData }) {
  const safe = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
