/**
 * PouOne — © 2026 Farrokhzad Parvareh. All rights reserved.
 *
 * تنظیمات قابل ویرایش سایت PouOne
 * ---------------------------------------------------------------
 * فقط همین فایل را برای قرار دادن لینک‌های دانلود ویرایش کنید.
 *
 * - android / windows : لینک دانلود (باید با https:// شروع شود یا نام فایلی کنار index.html باشد).
 *                       مقدار خالی ("") یعنی دکمه «به‌زودی» می‌ماند.
 * - version           : (اختیاری) شماره نسخه، مثل "1.0.0".
 * - sha256            : (اختیاری) هش SHA-256 هر فایل (۶۴ کاراکتر). اگر پر شود، در صفحه‌ی محصول
 *                       همراه دکمه‌ی «کپی» نمایش داده می‌شود تا کاربر درستی فایل را بررسی کند.
 */
window.POUONE_CONFIG = {
  downloads: {
    sharepou:   { android: "", windows: "", version: "", sha256: { android: "", windows: "" } },
    routepou:   { android: "", windows: "", version: "", sha256: { android: "", windows: "" } },
    printpou:   { android: "", windows: "", version: "", sha256: { android: "", windows: "" } },
    connectpou: { android: "", windows: "", version: "", sha256: { android: "", windows: "" } }
  }
};
