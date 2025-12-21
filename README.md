# 📱 PWA Shell - Dashboard PKM Ciwandan

PWA (Progressive Web App) wrapper untuk Dashboard Kunjungan Rumah Puskesmas Ciwandan.

## 📁 Struktur File

```
Dashboard_app/
├── index.html          # PWA loader (host di GitHub Pages)
├── manifest.json       # PWA manifest
├── sw.js              # Service Worker
├── offline.html       # Halaman offline fallback
├── icons/             # App icons (PERLU DIBUAT)
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   ├── icon-512x512.png
│   ├── icon-maskable-192x192.png
│   ├── icon-maskable-512x512.png
│   ├── apple-touch-icon.png
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   └── safari-pinned-tab.svg
├── splash/            # iOS splash screens (OPSIONAL)
│   ├── splash-640x1136.png
│   ├── splash-750x1334.png
│   └── ... (various sizes)
└── screenshots/       # PWA screenshots (OPSIONAL)
    ├── desktop-dashboard.png
    └── mobile-dashboard.png
```

## 🚀 Cara Setup

### 1. Konfigurasi URL Google Apps Script

Edit `index.html`, ganti placeholder dengan URL Apps Script:

```javascript
// Baris ~250
const CONFIG = {
  GAS_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
  // ...
};

// Baris ~290
<iframe 
  src="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
  // ...
>
```

### 2. Buat Icons

**Opsi A: Generator Online (Recommended)**
1. Kunjungi https://www.pwabuilder.com/imageGenerator
2. Upload logo PKM Ciwandan (minimal 512x512px)
3. Download semua sizes
4. Extract ke folder `icons/`

**Opsi B: Manual dengan Tool**
- Gunakan Figma, Canva, atau Photoshop
- Export ke semua size yang diperlukan

**Opsi C: Placeholder (Sementara)**
```bash
# Buat placeholder dengan warna solid
# atau gunakan tool seperti:
# https://realfavicongenerator.net/
```

### 3. Deploy ke GitHub Pages

```bash
# 1. Buat repository baru di GitHub
# Contoh: pkm-ciwandan-app

# 2. Clone dan copy files
git clone https://github.com/USERNAME/pkm-ciwandan-app.git
cd pkm-ciwandan-app
cp -r /path/to/Dashboard_app/* .

# 3. Commit dan push
git add .
git commit -m "Initial PWA setup"
git push origin main

# 4. Enable GitHub Pages
# Settings > Pages > Source: Deploy from branch (main)
```

### 4. Akses PWA

URL PWA: `https://USERNAME.github.io/pkm-ciwandan-app/`

## 🔧 Konfigurasi

### manifest.json

| Field | Deskripsi |
|-------|-----------|
| `name` | Nama lengkap app |
| `short_name` | Nama pendek (maks 12 karakter) |
| `theme_color` | Warna theme browser |
| `background_color` | Warna background splash |
| `display` | `standalone` untuk mode app |
| `icons` | Array icon berbagai ukuran |

### Service Worker (sw.js)

| Strategy | Digunakan Untuk |
|----------|-----------------|
| Cache-first | Static assets (CSS, JS, images) |
| Network-first | API calls (Google Apps Script) |
| Stale-while-revalidate | CDN resources |

## 📊 Fitur PWA

- ✅ **Installable** - Bisa di-install ke home screen
- ✅ **Offline Support** - Halaman offline saat tidak ada koneksi
- ✅ **Cached Assets** - Load cepat dengan caching
- ✅ **Update Notification** - Notifikasi saat ada versi baru
- ✅ **Responsive** - Optimal di semua device
- ✅ **Dark/Light Mode** - Mengikuti system preference

## 🛠 Troubleshooting

### PWA tidak bisa di-install?

1. Pastikan di-serve via HTTPS (GitHub Pages sudah HTTPS)
2. Pastikan manifest.json valid (test di Chrome DevTools > Application)
3. Pastikan minimal 1 icon 192x192 dan 1 icon 512x512 ada

### Service Worker error?

1. Buka Chrome DevTools > Application > Service Workers
2. Klik "Unregister" lalu refresh
3. Check Console untuk error messages

### Offline page tidak muncul?

1. Pastikan `offline.html` ada di folder root
2. Pastikan service worker sudah ter-cache
3. Clear cache dan refresh

## 📝 Update Version

Untuk update versi PWA:

1. Edit `sw.js` line 12:
   ```javascript
   const CACHE_VERSION = 'v1.0.1'; // Increment version
   ```

2. Users akan melihat "Update tersedia" banner

## 🔗 Links

- [PWA Builder](https://www.pwabuilder.com/)
- [Lighthouse PWA Audit](https://developers.google.com/web/tools/lighthouse)
- [Web.dev PWA Checklist](https://web.dev/pwa-checklist/)

---

**Dibuat untuk**: Puskesmas Ciwandan, Kota Cilegon  
**Versi**: 1.0.0  
**Tanggal**: Desember 2024

