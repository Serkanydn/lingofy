# Quick Testing Guide - Cloudflare R2 Audio Integration

## 🚀 Before You Start

### 1. Verify Environment Variables
Make sure `.env.local` contains:
```env
CLOUDFLARE_R2_ACCOUNT_ID=your_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET_NAME=learn-quiz-audio
CLOUDFLARE_R2_PUBLIC_URL=https://pub-xxx.r2.dev
```

### 2. Restart Development Server
```powershell
# Stop current server (Ctrl+C)
# Then start again:
npm run dev
```

---

## 📝 Test Scenarios

### Test 1: Create Reading with Audio
1. Navigate to Admin Panel → Reading Content
2. Click "Add Reading"
3. Fill in all required fields:
   - Title: "Test Audio Reading"
   - Level: Select any level
   - Content: Add some text
4. **Upload audio file** (use MP3, WAV, or OGG)
5. Click "Create Reading"
6. **Expected**: Button shows "Uploading Audio..." then "Creating..."
7. **Verify**: New reading appears in list

### Test 2: Verify Audio in R2 Dashboard
1. Go to Cloudflare Dashboard → R2
2. Click your bucket name
3. Navigate to `audio/` folder
4. **Expected**: File appears with timestamp prefix (e.g., `1703847293847-test-audio.mp3`)

### Test 3: Play Audio on Reading Page
1. Go to main app → Reading section
2. Find your test reading
3. Click on it to open
4. **Expected**: Audio player appears and works
5. Click play button
6. **Expected**: Audio plays successfully

### Test 4: Edit Reading with New Audio
1. Go to Admin Panel → Reading Content
2. Click "Edit" on your test reading
3. **Expected**: Shows current audio filename
4. Upload a different audio file
5. Click "Update Reading"
6. **Expected**: Shows "Uploading Audio..." then "Updating..."
7. **Verify in R2**: Old file deleted, new file present

### Test 5: Edit Without Changing Audio
1. Edit same reading again
2. Change only the title
3. **Don't upload new audio**
4. Click "Update Reading"
5. **Expected**: Updates immediately (no upload state)
6. **Verify**: Audio still works

### Test 6: Create Listening with Audio
1. Navigate to Admin Panel → Listening Content
2. Click "Add Listening"
3. Fill in required fields + upload audio
4. **Expected**: Same upload flow as reading

### Test 7: File Validation
Test these should **fail** with errors:

**File Too Large:**
- Upload file > 10MB
- **Expected**: Error message "File too large. Maximum size is 10MB."

**Invalid File Type:**
- Upload non-audio file (e.g., .jpg, .pdf)
- **Expected**: Error message "Invalid file type. Only audio files allowed."

---

## ✅ Success Indicators

- [ ] Upload button shows progress states
- [ ] Files appear in R2 bucket with correct naming
- [ ] Audio URLs saved in database
- [ ] Audio plays on reading/listening pages
- [ ] Old files deleted when replaced
- [ ] File validation works (size, type)
- [ ] No console errors

---

## 🐛 Common Issues & Fixes

### Issue: "Unauthorized" error
**Fix**: Make sure you're logged in as admin

### Issue: "Failed to upload audio"
**Fix**: 
1. Check environment variables are set
2. Restart dev server
3. Verify R2 credentials in Cloudflare dashboard

### Issue: Audio file shows but doesn't play
**Fix**:
1. Check bucket is public (or custom domain configured)
2. Verify CORS settings on R2 bucket
3. Check browser console for CORS errors

### Issue: TypeScript errors after implementation
**Fix**: Restart VS Code TypeScript server
- Press `Ctrl+Shift+P`
- Type "Restart TS Server"
- Press Enter

---

## 📊 File Size Reference

Typical audio file sizes:
- **MP3 (128kbps)**: ~1MB per minute
- **MP3 (320kbps)**: ~2.5MB per minute  
- **WAV**: ~10MB per minute (often too large!)
- **OGG**: ~0.5-1MB per minute

**Recommendation**: Use MP3 at 128-192kbps for good quality and reasonable size.

---

## 🔧 Dev Tools to Monitor

### Browser Console
Check for:
- Upload progress logs
- Error messages
- CORS warnings

### Network Tab
Monitor:
- `/api/audio/upload` POST requests
- File upload size
- Response time
- Response status (should be 200)

### Cloudflare R2 Dashboard
Check:
- Files being created
- File sizes
- Storage usage

---

## 📞 Need Help?

If something doesn't work:

1. **Check console errors** (both browser and terminal)
2. **Verify environment variables** are loaded
3. **Check R2 credentials** in Cloudflare dashboard
4. **Test API route directly** using Postman/Thunder Client
5. **Review** `CLOUDFLARE_IMPLEMENTATION_SUMMARY.md`

---

**Happy Testing! 🎉**
