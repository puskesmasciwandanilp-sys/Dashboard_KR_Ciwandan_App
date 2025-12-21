# 🚀 Panduan Setup GitHub Pages - PKM Ciwandan PWA

## Langkah 1: Buat Repository GitHub

### Via GitHub Web
1. Login ke https://github.com
2. Klik tombol **"+"** di kanan atas → **"New repository"**
3. Isi form:
   - **Repository name:** `pkm-ciwandan-app` (atau nama lain)
   - **Description:** `PWA Dashboard Kunjungan Rumah - Puskesmas Ciwandan`
   - **Public** (harus public untuk GitHub Pages gratis)
   - ✅ Add a README file (opsional, bisa skip)
4. Klik **"Create repository"**

---

## Langkah 2: Upload Files

### Opsi A: Via GitHub Web (Paling Mudah)
1. Buka repository yang baru dibuat
2. Klik **"Add file"** → **"Upload files"**
3. Drag & drop semua file dari folder `Dashboard_app`
4. Tulis commit message: `Initial PWA setup`
5. Klik **"Commit changes"**

### Opsi B: Via Git Command Line
```bash
# Clone repository
git clone https://github.com/USERNAME/pkm-ciwandan-app.git

# Masuk ke folder
cd pkm-ciwandan-app

# Copy semua file dari Dashboard_app
# (sesuaikan path)
cp -r /path/to/Dashboard_app/* .

# Add, commit, push
git add .
git commit -m "Initial PWA setup"
git push origin main
```

---

## Langkah 3: Aktifkan GitHub Pages

1. Buka repository di GitHub
2. Klik **"Settings"** (tab di atas)
3. Scroll ke **"Pages"** (sidebar kiri)
4. Di bagian **"Build and deployment"**:
   - **Source:** pilih **"GitHub Actions"**
5. Workflow akan otomatis berjalan

### Alternatif (Deploy from branch):
- **Source:** Deploy from a branch
- **Branch:** main
- **Folder:** / (root)
- Klik **Save**

---

## Langkah 4: Tunggu Deployment

1. Klik tab **"Actions"** di repository
2. Lihat workflow "Deploy PWA to GitHub Pages"
3. Tunggu sampai ✅ hijau (sekitar 1-2 menit)
4. URL PWA Anda: `https://USERNAME.github.io/pkm-ciwandan-app/`

---

## Langkah 5: Konfigurasi (PENTING!)

### Edit URL Google Apps Script

Sebelum deploy, edit file `index.html`:

```html
<!-- Cari baris ini (sekitar line 250) -->
const CONFIG = {
  GAS_URL: 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE',  <!-- GANTI INI -->
  ...
};

<!-- Dan baris ini (sekitar line 290) -->
<iframe 
  src="YOUR_GOOGLE_APPS_SCRIPT_URL_HERE"  <!-- GANTI INI -->
  ...
>
```

Ganti dengan URL deployment Google Apps Script Anda, contoh:
```
https://script.google.com/macros/s/AKfycbx...abc123.../exec
```

---

## Langkah 6: Buat Icons

### Wajib sebelum PWA bisa di-install!

1. Buka https://www.pwabuilder.com/imageGenerator
2. Upload logo PKM (minimal 512x512 pixels)
3. Klik "Generate"
4. Download ZIP
5. Extract ke folder `icons/`
6. Hapus file `PLACEHOLDER_README.txt`
7. Commit & push lagi

---

## ✅ Checklist Sebelum Go-Live

- [ ] URL Google Apps Script sudah diganti di `index.html`
- [ ] Icons sudah dibuat dan di-upload ke folder `icons/`
- [ ] Manifest.json sudah sesuai (name, short_name, etc.)
- [ ] Test di browser: bisa di-install
- [ ] Test offline: muncul halaman offline.html
- [ ] Test di mobile: responsive dan touch-friendly

---

## 🔧 Troubleshooting

### PWA tidak bisa di-install?
- Pastikan semua icons ada (minimal 192x192 dan 512x512)
- Buka DevTools → Application → Manifest → cek error

### Halaman blank / tidak load?
- Cek URL GAS sudah benar
- Cek Console untuk error
- Pastikan GAS sudah di-deploy sebagai "Anyone can access"

### Service Worker error?
- DevTools → Application → Service Workers → Unregister
- Hard refresh (Ctrl+Shift+R)

### GitHub Pages 404?
- Pastikan ada file `index.html` di root
- Tunggu beberapa menit setelah push
- Cek Settings → Pages → apakah sudah "Your site is live"

---

## 📱 Test PWA Installation

### Chrome Desktop:
1. Buka URL PWA
2. Klik icon install di address bar (atau menu → "Install app")

### Chrome Android:
1. Buka URL PWA
2. Muncul banner "Add to Home screen"
3. Atau menu → "Add to Home screen"

### Safari iOS:
1. Buka URL PWA
2. Tap Share button
3. Tap "Add to Home Screen"

---

## 🔄 Update PWA

Setiap kali update:
1. Edit file yang perlu diubah
2. Update version di `sw.js` (line 12):
   ```javascript
   const CACHE_VERSION = 'v1.0.1'; // Increment version
   ```
3. Commit & push
4. Users akan melihat "Update tersedia" banner

---

## 📞 Bantuan

Jika ada masalah:
1. Cek dokumentasi GitHub Pages: https://docs.github.com/pages
2. Cek PWA Builder: https://www.pwabuilder.com/
3. Run Lighthouse audit: DevTools → Lighthouse → PWA

---

**Selamat! PWA Anda siap digunakan! 🎉**

