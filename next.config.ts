import type { NextConfig } from "next";

// Podcast episodes: map old Tilda slug (with postId prefix) -> clean slug.
const PODCAST_REDIRECTS: Array<[string, string]> = [
  ["ayz5zzj661-1-iskusstvo-zakaznoi-razrabotki", "iskusstvo-zakaznoi-razrabotki"],
  ["ndpfff4ll1-2-kak-ustroen-internet", "kak-ustroen-internet"],
  ["4rgihsday1-3-kak-python-razrabotchik-prevraschaetsy", "kak-python-razrabotchik-prevraschaetsy"],
  ["lubrbml771-4-pochemu-gospodryadi-peredayut-druzyam", "pochemu-gospodryadi-peredayut-druzyam"],
  ["tzvjfmakz1-5-snachala-distributsiya-zatem-produkt", "snachala-distributsiya-zatem-produkt"],
  ["p33fpx4f71-6-kak-vibirayut-yazik-programmirovaniya", "kak-vibirayut-yazik-programmirovaniya"],
];

const VACANCY_REDIRECTS: Array<[string, string]> = [
  ["9pyckxd3n1-flutter-razrabotchik", "flutter-razrabotchik"],
  ["yo0iei17a1-middle-php-laravel-web-razrabotchik", "middle-php-laravel-web-razrabotchik"],
  ["g1vvl19a91-menedzher-po-b2b-prodazham", "menedzher-po-b2b-prodazham"],
  ["ji623k2n61-middle-project-manager", "middle-project-manager"],
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "static.tildacdn.com" },
      { protocol: "https", hostname: "thb.tildacdn.com" },
    ],
  },
  async redirects() {
    return [
      // Legacy language variants -> /
      { source: "/ru", destination: "/", permanent: true },
      { source: "/ru/:path*", destination: "/", permanent: true },
      { source: "/buro", destination: "/", permanent: true },
      { source: "/bureau_en", destination: "/", permanent: true },
      { source: "/oldpage", destination: "/", permanent: true },

      // Old /tpost/... podcasts -> /podcast/<clean-slug>
      ...PODCAST_REDIRECTS.map(([oldSlug, newSlug]) => ({
        source: `/tpost/${oldSlug}`,
        destination: `/podcast/${newSlug}`,
        permanent: true,
      })),

      // Old /tpost/... vacancies -> /career/<clean-slug>
      ...VACANCY_REDIRECTS.map(([oldSlug, newSlug]) => ({
        source: `/tpost/${oldSlug}`,
        destination: `/career/${newSlug}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
