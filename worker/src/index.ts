export interface R2Object {
  key: string;
  size: number;
  httpEtag: string;
  writeHttpMetadata: (headers: Headers) => void;
  body: ReadableStream;
}

export interface R2Objects {
  objects: Array<{
    key: string;
    size: number;
  }>;
  truncated: boolean;
  cursor?: string;
}

export interface R2Bucket {
  get: (key: string) => Promise<R2Object | null>;
  list: (options?: { limit?: number; cursor?: string; prefix?: string }) => Promise<R2Objects>;
}

export interface Env {
  MODS_BUCKET: R2Bucket;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    // 1. Direct file download endpoint: /download/:filename
    if (url.pathname.startsWith("/download/")) {
      const filename = decodeURIComponent(url.pathname.slice("/download/".length));

      if (!filename) {
        return new Response("Filename is required", { status: 400 });
      }

      const object = await env.MODS_BUCKET.get(filename);
      if (!object) {
        return new Response("File not found in R2 bucket", { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      headers.set("Access-Control-Allow-Origin", "*");
      headers.set(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(filename)}"`
      );
      // Cache binary downloads at Cloudflare Edge and in browser
      headers.set("Cache-Control", "public, max-age=86400, s-maxage=604800");

      return new Response(object.body, {
        status: 200,
        headers,
      });
    }

    // 2. Listing endpoint: / or /api/mods
    if (url.pathname === "/" || url.pathname === "/api/mods") {
      try {
        const listed = await env.MODS_BUCKET.list({ limit: 1000 });
        const publicR2Base = "https://pub-455d5544be7b421b830563d6f58aa045.r2.dev";

        const files = listed.objects
          .filter(
            (obj) =>
              Boolean(obj.key) &&
              (obj.key.endsWith(".jar") || obj.key.endsWith(".zip"))
          )
          .map((obj) => {
            const isJar = obj.key.endsWith(".jar");
            const downloadUrl = `${publicR2Base}/${encodeURIComponent(obj.key)}`;

            return {
              name: obj.key,
              size: obj.size,
              downloadUrl,
              type: isJar ? "jar" : "zip",
            };
          })
          .sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
          );

        return new Response(JSON.stringify({ files }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            // Cache list for 5 minutes in browser, 10 minutes at Cloudflare edge
            "Cache-Control": "public, max-age=300, s-maxage=600",
          },
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to list R2 bucket";
        return new Response(JSON.stringify({ error: message }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
};
