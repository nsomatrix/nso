# NSO Mods Cloudflare Worker (R2 API)

This Cloudflare Worker connects your Cloudflare R2 bucket directly to the NSO Mods page.

## Features
- **Dynamic File Listing**: Automatically discovers all `.jar` and `.zip` files in your R2 bucket.
- **Direct Streaming Downloads**: Streams files directly from R2 via `/download/:filename` with attachment headers.
- **Edge Caching**: Lists and downloads are cached at Cloudflare's 300+ global data centers (5-10 min for lists, 24h for files) for near-instant response times and minimal R2 reads.
- **Zero Bandwidth Costs**: Cloudflare R2 has $0 egress fees.
- **CORS Enabled**: Works seamlessly across domains and GitHub Pages.

---

## 2-Step Deployment

### Step 1: Set your Bucket Name
Open [`wrangler.jsonc`](./wrangler.jsonc) and replace `YOUR_R2_BUCKET_NAME` with your actual R2 bucket name:
```jsonc
"r2_buckets": [
  {
    "binding": "MODS_BUCKET",
    "bucket_name": "your-bucket-name"
  }
]
```

### Step 2: Deploy to Cloudflare
From this `worker/` directory (or from project root), run:
```bash
npx wrangler deploy
```

*(If you are not logged in yet, Wrangler will open your browser for a 1-click login).*

Once deployed, Wrangler will output your Worker URL, for example:
```
https://nso-mods-api.<your-subdomain>.workers.dev
```

---

## Connect to Next.js

1. Create a `.env.local` file in the project root:
   ```env
   NEXT_PUBLIC_MODS_API_URL=https://nso-mods-api.<your-subdomain>.workers.dev
   ```
2. When deploying via GitHub Actions, add `NEXT_PUBLIC_MODS_API_URL` to your GitHub Repository Secrets or Variables.
