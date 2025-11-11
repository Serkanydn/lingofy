# Cloudflare R2 Audio Integration Guide

This guide explains how to integrate Cloudflare R2 (object storage) for hosting audio files in your English learning application.

## 📋 Table of Contents

- [Why Cloudflare R2?](#why-cloudflare-r2)
- [Prerequisites](#prerequisites)
- [Step 1: Create Cloudflare Account](#step-1-create-cloudflare-account)
- [Step 2: Set Up R2 Bucket](#step-2-set-up-r2-bucket)
- [Step 3: Configure R2 Access](#step-3-configure-r2-access)
- [Step 4: Install Dependencies](#step-4-install-dependencies)
- [Step 5: Environment Variables](#step-5-environment-variables)
- [Step 6: Create Upload Utility](#step-6-create-upload-utility)
- [Step 7: Create Upload API Route](#step-7-create-upload-api-route)
- [Step 8: Update Admin Components](#step-8-update-admin-components)
- [Step 9: Testing](#step-9-testing)
- [Troubleshooting](#troubleshooting)

---

## Why Cloudflare R2?

- ✅ **No egress fees** - Free data transfer out
- ✅ **S3-compatible** - Works with existing S3 tools
- ✅ **Global CDN** - Fast delivery worldwide
- ✅ **Cost-effective** - 10GB free storage, then $0.015/GB
- ✅ **Simple integration** - Easy to set up

---

## Prerequisites

- Active Cloudflare account
- Node.js 18+ installed
- Next.js project (already set up)
- Admin access to your application

---

## Step 1: Create Cloudflare Account

1. Go to [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
2. Sign up with your email
3. Verify your email address
4. Complete the setup wizard

---

## Step 2: Set Up R2 Bucket

### 2.1 Enable R2

1. Log in to Cloudflare Dashboard: [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. Click **R2** in the left sidebar
3. Click **Purchase R2 Plan** (free tier available)
4. Accept the terms

### 2.2 Create Bucket

1. Click **Create bucket**
2. **Bucket name**: `lingofy-audio` (must be unique globally)
3. **Location**: Choose closest to your users (e.g., `WEUR` for Western Europe, `ENAM` for Eastern North America)
4. Click **Create bucket**

### 2.3 Configure Public Access

1. Go to your bucket settings
2. Click **Settings** tab
3. Under **Public access**, click **Allow Access**
4. Enable **Public bucket** (required for audio playback)
5. Note the **Bucket URL** (e.g., `https://pub-xxxxx.r2.dev`)

---

## Step 3: Configure R2 Access

### 3.1 Create API Token

1. In R2 dashboard, click **Manage R2 API Tokens**
2. Click **Create API token**
3. **Token name**: `lingofy-upload-token`
4. **Permissions**: 
   - ✅ Object Read & Write
5. **TTL**: Never expire (or set custom expiration)
6. **Bucket restrictions**: Select `lingofy-audio` only
7. Click **Create API Token**

### 3.2 Save Credentials

⚠️ **Important**: Copy these values immediately (they won't be shown again):

```
Access Key ID: xxxxxxxxxxxxxxxxxxxxx
Secret Access Key: yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
Token ID: zzzzzzzzzzzzzzzzzzzzzz
```

Also note:
- **Account ID**: Found in R2 dashboard URL or Overview page
- **Bucket Name**: `lingofy-audio`
- **Public URL**: `https://pub-xxxxx.r2.dev`

---

## Step 4: Install Dependencies

Open your terminal and install required packages:

```powershell
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

**What these do**:
- `@aws-sdk/client-s3`: S3-compatible client for R2
- `@aws-sdk/s3-request-presigner`: Generate signed URLs for uploads

---

## Step 5: Environment Variables

### 5.1 Update `.env.local`

Add these variables to your `.env.local` file:

```env
# Cloudflare R2 Configuration
CLOUDFLARE_R2_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id_here
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key_here
CLOUDFLARE_R2_BUCKET_NAME=lingofy-audio
CLOUDFLARE_R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

### 5.2 Update `.env.example`

Add template for other developers:

```env
# Cloudflare R2 Configuration
CLOUDFLARE_R2_ACCOUNT_ID=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET_NAME=
CLOUDFLARE_R2_PUBLIC_URL=
```

### 5.3 Security Check

Verify `.env.local` is in `.gitignore`:

```gitignore
# Environment files
.env*.local
.env
```

---

## Step 6: Create Upload Utility

### 6.1 Create R2 Client

Create `src/shared/services/cloudflareService.ts`:

```typescript
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

export interface UploadAudioParams {
  file: File | Buffer;
  fileName: string;
  contentType: string;
}

export interface UploadAudioResult {
  url: string;
  key: string;
}

/**
 * Upload audio file to Cloudflare R2
 */
export async function uploadAudioToR2(
  params: UploadAudioParams
): Promise<UploadAudioResult> {
  const { file, fileName, contentType } = params;
  
  // Generate unique filename with timestamp
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const key = `audio/${timestamp}-${sanitizedFileName}`;

  // Convert File to Buffer if needed
  let buffer: Buffer;
  if (file instanceof Buffer) {
    buffer = file;
  } else {
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  }

  // Upload to R2
  const command = new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000", // Cache for 1 year
  });

  await r2Client.send(command);

  // Construct public URL
  const url = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;

  return { url, key };
}

/**
 * Delete audio file from Cloudflare R2
 */
export async function deleteAudioFromR2(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
    Key: key,
  });

  await r2Client.send(command);
}

/**
 * Extract R2 key from full URL
 */
export function extractR2KeyFromUrl(url: string): string | null {
  try {
    const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL!;
    if (url.startsWith(publicUrl)) {
      return url.replace(`${publicUrl}/`, "");
    }
    return null;
  } catch {
    return null;
  }
}
```

---

## Step 7: Create Upload API Route

### 7.1 Create Upload Endpoint

Create `src/app/api/audio/upload/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { uploadAudioToR2 } from "@/shared/lib/cloudflare-r2";
import { createClient } from "@/shared/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin (optional, add your own logic)
    // const { data: profile } = await supabase
    //   .from("profiles")
    //   .select("is_admin")
    //   .eq("id", user.id)
    //   .single();
    // if (!profile?.is_admin) {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    // Get file from form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only audio files allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // Upload to R2
    const result = await uploadAudioToR2({
      file,
      fileName: file.name,
      contentType: file.type,
    });

    return NextResponse.json({
      success: true,
      url: result.url,
      key: result.key,
    });
  } catch (error) {
    console.error("Audio upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload audio" },
      { status: 500 }
    );
  }
}
```

### 7.2 Create Delete Endpoint

Create `src/app/api/audio/delete/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { deleteAudioFromR2, extractR2KeyFromUrl } from "@/shared/lib/cloudflare-r2";
import { createClient } from "@/shared/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "No URL provided" },
        { status: 400 }
      );
    }

    // Extract R2 key from URL
    const key = extractR2KeyFromUrl(url);
    if (!key) {
      return NextResponse.json(
        { error: "Invalid R2 URL" },
        { status: 400 }
      );
    }

    // Delete from R2
    await deleteAudioFromR2(key);

    return NextResponse.json({
      success: true,
      message: "Audio deleted successfully",
    });
  } catch (error) {
    console.error("Audio delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete audio" },
      { status: 500 }
    );
  }
}
```

---

## Step 8: Update Admin Components

### 8.1 Add Upload to Reading Dialog

Update `src/features/admin/components/AddReadingDialog.tsx`:

Add state for file upload:

```typescript
const [audioFile, setAudioFile] = useState<File | null>(null);
const [isUploading, setIsUploading] = useState(false);
```

Add file input (replace the Audio URL input):

```typescript
<div className="space-y-2">
  <Label htmlFor="audioFile" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
    Audio File (optional)
  </Label>
  <div className="flex gap-2">
    <Input
      id="audioFile"
      type="file"
      accept="audio/*"
      onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
      className="rounded-2xl border-2 border-gray-200 dark:border-gray-700"
    />
    {audioUrl && (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setAudioUrl("")}
        className="rounded-xl"
      >
        Clear
      </Button>
    )}
  </div>
  {audioUrl && (
    <p className="text-xs text-gray-500">Current: {audioUrl}</p>
  )}
</div>
```

Update submit handler:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsUploading(true);

  try {
    let uploadedAudioUrl = audioUrl;

    // Upload audio file if provided
    if (audioFile) {
      const formData = new FormData();
      formData.append("file", audioFile);

      const response = await fetch("/api/audio/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload audio");
      }

      const { url } = await response.json();
      uploadedAudioUrl = url;
    }

    await createReading.mutateAsync({
      title,
      level: level as Level,
      content,
      audio_url: uploadedAudioUrl || null,
      order_index: parseInt(orderIndex),
      is_premium: isPremium,
    });

    // Reset form
    setTitle("");
    setLevel("B1");
    setContent("");
    setAudioUrl("");
    setAudioFile(null);
    setOrderIndex("1");
    setIsPremium(false);
    onClose();
  } catch (error) {
    console.error("Error creating reading:", error);
    alert("Failed to create reading. Please try again.");
  } finally {
    setIsUploading(false);
  }
};
```

### 8.2 Update Submit Button

```typescript
<Button
  type="submit"
  className="flex-1 rounded-2xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300"
  disabled={createReading.isPending || isUploading}
>
  {isUploading ? "Uploading..." : createReading.isPending ? "Creating..." : "Create Reading"}
</Button>
```

### 8.3 Apply Same Changes to Listening Dialogs

Repeat steps 8.1-8.2 for:
- `AddListeningDialog.tsx`
- `EditReadingDialog.tsx`
- `EditListeningDialog.tsx`

---

## Step 9: Testing

### 9.1 Test Upload

1. Go to admin panel: `http://localhost:3000/admin/reading`
2. Click **Add Reading**
3. Fill in required fields
4. Select an audio file (MP3 recommended)
5. Click **Create Reading**
6. Check if audio URL is saved correctly

### 9.2 Test Playback

1. Go to reading page
2. Click on a reading with audio
3. Verify audio player appears
4. Test play/pause functionality
5. Check audio loads quickly (CDN working)

### 9.3 Test Delete

1. Edit a reading with audio
2. Change or remove audio file
3. Verify old file is handled correctly

### 9.4 Verify in R2 Dashboard

1. Go to Cloudflare R2 dashboard
2. Open your bucket
3. Check `audio/` folder
4. Verify uploaded files are present

---

## Troubleshooting

### Issue: "Unauthorized" error

**Solution**: Check environment variables:
```powershell
# View current env vars (PowerShell)
Get-Content .env.local | Select-String "CLOUDFLARE"

# Restart dev server
npm run dev
```

### Issue: CORS errors in browser

**Solution**: Configure CORS in R2 bucket:

1. Go to bucket settings
2. Add CORS rule:
```json
[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

### Issue: Files not uploading

**Solution**: Check logs:
```powershell
# Check Next.js logs in terminal
# Look for error messages starting with "Audio upload error:"
```

Common causes:
- Invalid API token
- Wrong account ID
- Bucket not public
- File size too large

### Issue: Audio not playing

**Solution**: 
1. Check browser console for errors
2. Verify file format is supported (MP3 is safest)
3. Test URL directly in browser
4. Check public access is enabled

### Issue: Slow uploads

**Solution**:
- Use MP3 format with reasonable bitrate (128kbps recommended)
- Compress audio before upload
- Check internet connection
- Consider enabling resumable uploads for large files

---

## Production Deployment

### Environment Variables on Vercel/Netlify

1. Go to project settings
2. Add all `CLOUDFLARE_R2_*` variables
3. Redeploy application

### Custom Domain for R2

1. In R2 bucket settings, click **Custom Domains**
2. Add domain: `audio.yourdomain.com`
3. Add CNAME record in Cloudflare DNS:
   - Name: `audio`
   - Target: Your R2 bucket URL
4. Update `CLOUDFLARE_R2_PUBLIC_URL` to `https://audio.yourdomain.com`

---

## Cost Estimation

### Free Tier (Monthly)
- Storage: 10 GB
- Class A operations: 1 million (PUT, COPY, POST, LIST)
- Class B operations: 10 million (GET, HEAD)
- Egress: **Unlimited** (free)

### Paid Tier (if exceeded)
- Storage: $0.015/GB
- Class A operations: $4.50 per million
- Class B operations: $0.36 per million
- Egress: **Still free**

**Example**: 1000 audio files (avg 2MB each) = 2GB storage = **$0.03/month**

---

## Next Steps

After integration:
- [ ] Test upload/download thoroughly
- [ ] Add file size validation in UI
- [ ] Implement audio compression
- [ ] Add progress indicator for uploads
- [ ] Create bulk upload tool
- [ ] Set up monitoring/alerts
- [ ] Document for other developers

---

## Support Resources

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [R2 Pricing](https://developers.cloudflare.com/r2/pricing/)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [Next.js File Upload Guide](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#formdata)

---

**Need help?** Check the troubleshooting section or open an issue in the project repository.
