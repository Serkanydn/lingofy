import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Log environment variables for debugging
console.log('R2 Config:', {
  accountId: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_ACCOUNT_ID,
  bucketName: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_NAME,
  hasAccessKey: !!process.env.NEXT_PUBLIC_CLOUDFLARE_R2_ACCESS_KEY_ID,
  hasSecretKey: !!process.env.NEXT_PUBLIC_CLOUDFLARE_R2_SECRET_ACCESS_KEY,
});

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.NEXT_PUBLIC_CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
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
  if (Buffer.isBuffer(file)) {
    buffer = file;
  } else {
    const arrayBuffer = await (file as File).arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  }

  // Upload to R2
  const command = new PutObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000", // Cache for 1 year
  });

  await r2Client.send(command);

  // Construct public URL
  const url = `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL}/${key}`;

  return { url, key };
}

/**
 * Delete audio file from Cloudflare R2
 */
export async function deleteAudioFromR2(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_NAME!,
    Key: key,
  });

  await r2Client.send(command);
}

/**
 * Extract R2 key from full URL
 */
export function extractR2KeyFromUrl(url: string): string | null {
  try {
    const publicUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL!;
    if (url.startsWith(publicUrl)) {
      return url.replace(`${publicUrl}/`, "");
    }
    return null;
  } catch {
    return null;
  }
}
