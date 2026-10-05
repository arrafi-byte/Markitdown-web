const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const statusBox = document.getElementById("status");
const resultBox = document.getElementById("resultBox");
const resultText = document.getElementById("resultText");
const resultFilename = document.getElementById("resultFilename");
const downloadBtn = document.getElementById("downloadBtn");
const copyBtn = document.getElementById("copyBtn");
const resetBtn = document.getElementById("resetBtn");

let currentMarkdown = "";
let currentFilename = "hasil.md";

function showStatus(message, type) {
  statusBox.textContent = message;
  statusBox.className = "status" + (type ? " " + type : "");
  statusBox.classList.remove("hidden");
}

function hideStatus() {
  statusBox.classList.add("hidden");
}

function showResult(filename, markdown) {
  currentMarkdown = markdown;
  currentFilename = filename;
  resultFilename.textContent = filename;
  resultText.textContent = markdown;
  resultBox.classList.remove("hidden");
  dropzone.classList.add("hidden");
}

function resetUI() {
  resultBox.classList.add("hidden");
  dropzone.classList.remove("hidden");
  hideStatus();
  fileInput.value = "";
}

async function uploadFile(file) {
  hideStatus();
  resultBox.classList.add("hidden");
  showStatus(`Mengonversi "${file.name}" ...`, "loading");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("/convert", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (!res.ok || data.error) {
      showStatus(data.error || "Terjadi kesalahan saat konversi.", "error");
      return;
    }

    hideStatus();
    showResult(data.filename, data.markdown);
  } catch (err) {
    showStatus("Tidak bisa terhubung ke server: " + err.message, "error");
  }
}

// Klik dropzone -> buka file picker
dropzone.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    uploadFile(fileInput.files[0]);
  }
});

// Drag & drop events
["dragenter", "dragover"].forEach((evt) => {
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropzone.classList.add("dragover");
  });
});

["dragleave", "drop"].forEach((evt) => {
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropzone.classList.remove("dragover");
  });
});

dropzone.addEventListener("drop", (e) => {
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    uploadFile(files[0]);
  }
});

// Download hasil sebagai file .md
downloadBtn.addEventListener("click", () => {
  const blob = new Blob([currentMarkdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = currentFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// Copy ke clipboard
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(currentMarkdown);
    copyBtn.textContent = "Tersalin ✓";
    setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
  } catch (err) {
    alert("Gagal menyalin: " + err.message);
  }
});

resetBtn.addEventListener("click", resetUI);
