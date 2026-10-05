# MarkItDown Web UI

Web UI lokal sederhana untuk [microsoft/markitdown](https://github.com/microsoft/markitdown).
Drag & drop file apa saja yang didukung markitdown (PDF, Word, PowerPoint, Excel,
gambar, audio, HTML, CSV, JSON, ZIP, dll), dan hasil konversi Markdown-nya bisa
langsung dilihat, di-copy, atau di-download.

## Cara Menjalankan

1. **Install dependency** (karena Anda sudah install `markitdown`, cukup tambahkan Flask):

   ```bash
   pip install flask
   ```

   Atau install semuanya sekaligus lewat `requirements.txt`:

   ```bash
   pip install -r requirements.txt
   ```

   > Jika `markitdown` yang terinstal versi minimal dan ada file yang gagal
   > dikonversi (misalnya PDF hasil scan atau format khusus), coba install
   > versi lengkapnya: `pip install "markitdown[all]"`

2. **Jalankan server:**

   ```bash
   python app.py
   ```

3. **Buka browser** ke:

   ```
   http://localhost:5000
   ```

4. Tarik file ke area drag & drop (atau klik untuk memilih file), tunggu
   proses konversi, lalu klik **Download .md** untuk menyimpan hasilnya,
   atau **Copy** untuk menyalin teksnya langsung.

## Struktur Project

```
markitdown-webui/
├── app.py              # Server Flask, memanggil library markitdown
├── requirements.txt
├── templates/
│   └── index.html      # Halaman UI
└── static/
    ├── style.css
    └── script.js        # Logic drag & drop + download
```

## Catatan

- Semua proses berjalan 100% lokal di komputer Anda — tidak ada file yang
  diupload ke server manapun.
- File yang di-upload disimpan sementara (temp file) saat proses konversi,
  lalu otomatis dihapus setelah selesai.
- Batas ukuran upload default: 100 MB (bisa diubah di `app.py`,
  variabel `MAX_CONTENT_LENGTH`).
- Untuk mengubah port, edit baris terakhir di `app.py`
  (`app.run(host="0.0.0.0", port=5000, ...)`).
