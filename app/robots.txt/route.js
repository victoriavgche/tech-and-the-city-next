export function GET() {
  return new Response(
`User-agent: *
Allow: /
Sitemap: ${process.env.SITE_URL || "https://example.com"}/sitemap.xml
`,
    { headers: { "Content-Type": "text/plain" } }
  );
}