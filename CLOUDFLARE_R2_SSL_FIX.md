# Fix Cloudflare R2 Audio Access Issues

## Current Issue
SSL/HTTPS error when accessing audio files from R2 public URL.

## Solution Options

### Option 1: Verify R2 Bucket Public Access Settings

1. Go to **Cloudflare Dashboard** → **R2** → **lingofy-audio bucket**
2. Click **Settings** tab
3. Under **Public Access**, ensure it's enabled
4. If not enabled:
   - Click "Allow Access"
   - This will expose the bucket via `pub-xxxxx.r2.dev` domain

### Option 2: Use Custom Domain (Recommended)

**Why?** R2's default `.r2.dev` domains sometimes have SSL certificate issues. Custom domains work better.

**Steps:**
1. In R2 bucket settings, go to **Custom Domains**
2. Click **Connect Domain**
3. Add a subdomain like `cdn.yourdomain.com` or `audio.yourdomain.com`
4. Cloudflare will automatically configure DNS and SSL
5. Update `.env.local`:
   ```env
   NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL=https://cdn.yourdomain.com
   ```

### Option 3: Temporary HTTP Fix (Development Only)

**⚠️ Warning: Not secure for production!**

Update `.env.local`:
```env
NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL=http://pub-26f84c148e904d41b43f58170d5c6c96.r2.dev
```

Then restart your dev server:
```bash
npm run dev
```

### Option 4: Use Cloudflare Stream Instead

For better audio/video handling with built-in CDN and streaming:
1. Use Cloudflare Stream API
2. Automatic transcoding and adaptive bitrate
3. Better performance globally

## Verify Setup

After applying any fix, test the URL in browser:
```
https://pub-26f84c148e904d41b43f58170d5c6c96.r2.dev/audio/1762885266729-first_audio.mp3
```

Should load without SSL errors.

## Current Configuration

Your `.env.local` currently has:
```
NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL=https://pub-26f84c148e904d41b43f58170d5c6c96.r2.dev
```

The SSL error suggests:
- Bucket might not be properly configured for public HTTPS access
- OR the `.r2.dev` domain has certificate issues
- OR CORS settings need adjustment
