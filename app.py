"""
MarkItDown Web UI - server lokal sederhana
Menjalankan library markitdown (https://github.com/microsoft/markitdown)
lewat antarmuka web drag & drop.
"""

import os
import tempfile
import traceback

from flask import Flask, request, jsonify, render_template

try:
    from markitdown import MarkItDown
except ImportError:
    raise SystemExit(
        "Package 'markitdown' tidak ditemukan.\n"
        "Install dulu dengan: pip install markitdown\n"
        "(atau: pip install 'markitdown[all]' untuk dukungan format lengkap)"
    )

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 100 * 1024 * 1024  # batas upload 100 MB

# Instance MarkItDown dibuat sekali saja saat server start
md_converter = MarkItDown()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/convert", methods=["POST"])
def convert():
    if "file" not in request.files:
        return jsonify({"error": "Tidak ada file yang dikirim"}), 400

    uploaded = request.files["file"]
    if uploaded.filename == "":
        return jsonify({"error": "Nama file kosong"}), 400

    original_name = uploaded.filename
    suffix = os.path.splitext(original_name)[1]

    tmp_path = None
    try:
        # Simpan sementara ke disk karena markitdown butuh path file
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            uploaded.save(tmp.name)
            tmp_path = tmp.name

        result = md_converter.convert(tmp_path)
        markdown_text = result.text_content

        out_name = os.path.splitext(original_name)[0] + ".md"

        return jsonify(
            {
                "success": True,
                "filename": out_name,
                "markdown": markdown_text,
            }
        )

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Gagal mengonversi file: {e}"}), 500

    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)


if __name__ == "__main__":
    print("=" * 50)
    print("  MarkItDown Web UI")
    print("  Buka di browser: http://localhost:5000")
    print("=" * 50)
    app.run(host="0.0.0.0", port=5000, debug=True)
