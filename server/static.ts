import express, { type Express } from "express";
import fs from "fs";
import path from "path";

import { renderPublicPage } from "./ssr";

const notFoundHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex, nofollow">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>404 | NormYacht</title>
</head>
<body>
  <main>
    <h1>404 - Page Not Found</h1>
    <p>The requested page could not be found.</p>
    <p><a href="/">Return to NormYacht</a></p>
  </main>
</body>
</html>`;

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath, { index: false }));

  // robots.txt must be a real text response, not the SPA shell.
  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(
      [
        "User-agent: *",
        "Allow: /",
        "Disallow: /admin",
        "Disallow: /api/",
        "",
        "Sitemap: https://normyacht.com/sitemap.xml",
        "",
      ].join("\n"),
    );
  });

  // Admin remains client-rendered and must never be indexed.
  app.get(["/admin", "/admin/*path"], (_req, res) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.sendFile(path.resolve(distPath, "index.html"));
  });

  const publicRoutePatterns = [
    /^\/$/,
    /^\/(about|hakkimizda|o-nas)\/?$/,
    /^\/(services|hizmetler|uslugi)\/?$/,
    /^\/(services|hizmetler|uslugi)\/[^/]+\/?$/,
    /^\/(projects|projeler|proekty)\/?$/,
    /^\/(projects|projeler|proekty)\/[^/]+\/?$/,
    /^\/(news|haberler|novosti)\/?$/,
    /^\/(news|haberler|novosti)\/[^/]+\/?$/,
    /^\/(contact|iletisim|kontakty)\/?$/,
  ];

  app.use("/{*path}", async (req, res, next) => {
    try {
      const pathname = new URL(
        req.originalUrl,
        "http://localhost",
      ).pathname;

      if (!publicRoutePatterns.some((pattern) => pattern.test(pathname))) {
        return res
          .status(404)
          .type("text/html")
          .send(notFoundHtml);
      }

      const rendered = await renderPublicPage(pathname);

      // Dynamic detail URL matched the route shape,
      // but the requested database record does not exist.
      if (!rendered) {
        return res
          .status(404)
          .type("text/html")
          .send(notFoundHtml);
      }

      return res
        .status(200)
        .type("text/html")
        .send(rendered.html);
    } catch (error) {
      next(error);
    }
  });
}
