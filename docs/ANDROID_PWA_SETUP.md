# Android PWA Icon Fix

## Problem
Android browsers (Chrome, Brave) were showing a grey "V" icon when adding the app to the home screen instead of the FuelLog icon.

## Solution Applied

### Files Created/Updated:

1. **`/public/manifest.json`** - Root manifest file (Android browsers prefer this location)
   - Points to `/icon-192.png` and `/icon-512.png`
   - Set `purpose: "any maskable"` for better compatibility

2. **Icon Files Copied to Root:**
   - `/public/icon-192.png` (192x192) - Android home screen
   - `/public/icon-512.png` (512x512) - Android splash screen
   - `/public/apple-touch-icon.png` (180x180) - iOS home screen
   - `/public/favicon.ico` - Browser tabs

3. **`app/layout.tsx`** - Updated metadata to reference root icons

### How to Test on Android:

1. **Deploy the app** or run it on a publicly accessible URL
2. **Open in Chrome/Brave** on your Android phone
3. **Clear browser cache**:
   - Chrome: Settings → Privacy → Clear browsing data → Cached images and files
   - Brave: Settings → Privacy → Clear browsing data → Cached images and files
4. **Visit the site** and tap the menu (⋮)
5. **Select "Add to Home screen"** or "Install app"
6. **Check the icon** - should now show your FuelLog icon

### Important Notes:

- **Cache clearing is critical** - Android browsers aggressively cache PWA icons
- **HTTPS required** - PWA features only work on secure connections
- **Manifest must be served** - Ensure `/manifest.json` is accessible at `https://yourdomain.com/manifest.json`

### Verification Checklist:

- [ ] Icons are in `/public/` root directory
- [ ] `manifest.json` is in `/public/` root directory
- [ ] App is deployed and accessible via HTTPS
- [ ] Browser cache has been cleared
- [ ] Tested "Add to Home Screen" on Android Chrome
- [ ] Tested "Add to Home Screen" on Android Brave

### Icon Specifications:

| Platform | Size | File | Purpose |
|----------|------|------|---------|
| Android Home Screen | 192x192 | `/icon-192.png` | Main icon |
| Android Splash | 512x512 | `/icon-512.png` | High-res |
| iOS Home Screen | 180x180 | `/apple-touch-icon.png` | Apple devices |
| Browser Tab | 32x32 | `/favicon.ico` | Desktop browsers |

### Troubleshooting:

**Still seeing grey "V"?**
1. Force-close the browser completely
2. Clear all site data (not just cache)
3. Restart your phone
4. Try in incognito/private mode first
5. Check browser console for manifest errors

**Icon looks wrong?**
- Ensure icons have transparent backgrounds or solid colors
- Check that PNG files are not corrupted
- Verify file sizes match specifications

**Manifest not loading?**
- Check Network tab in Chrome DevTools
- Verify MIME type is `application/manifest+json`
- Ensure no CORS issues

### Additional Resources:

- [Web App Manifest MDN](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [PWA Icons Guide](https://web.dev/add-manifest/)
- [Maskable Icons](https://web.dev/maskable-icon/)
