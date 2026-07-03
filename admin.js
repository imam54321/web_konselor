// =====================================
// CONFIG
// =====================================
const API_URL =
  "https://script.google.com/macros/s/AKfycbzoVVTRMc59hlucR1M5DOGR9pPdz6cOtL8etbGkfNXy-xa71phA5Wv5zz-7HKLu2fkm3g/exec";
const USERNAME = "admin";
const PASSWORD = "admin123";

// =====================================
// CEK LOGIN
// =====================================
if (
  window.location.pathname.includes("dashboard.html") &&
  sessionStorage.getItem("login") !== "true"
) {
  window.location.href = "login.html";
}

// =====================================
// LOGIN
// =====================================
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const pesan = document.getElementById("pesan");

  if (username === USERNAME && password === PASSWORD) {
    sessionStorage.setItem("login", "true");
    window.location.href = "dashboard.html";
  } else {
    pesan.style.color = "red";
    pesan.innerText = "Username atau Password salah.";
  }
}

// =====================================
// LOGOUT
// =====================================
function logout() {
  sessionStorage.clear();
  window.location.href = "login.html";
}

// =====================================
// UPLOAD MATERI
// =====================================
async function uploadMateri() {
  const judul = document.getElementById("judul").value.trim();
  const kategori = document.getElementById("kategori").value;
  const file = document.getElementById("pdf").files[0];

  const status = document.getElementById("statusUpload");
  const btn = document.getElementById("btnUpload");

  // Validasi
  if (!judul || !kategori || !file) {
    status.style.color = "red";
    status.innerText = "Lengkapi semua data.";
    return;
  }

  if (file.type !== "application/pdf") {
    status.style.color = "red";
    status.innerText = "File harus PDF.";
    return;
  }

  const MAX_SIZE = 10 * 1024 * 1024;

  if (file.size > MAX_SIZE) {
    status.style.color = "red";
    status.innerText = "Ukuran file maksimal 10 MB.";
    return;
  }

  btn.disabled = true;
  btn.innerText = "Uploading...";
  status.style.color = "#2563eb";
  status.innerText = "Sedang mengupload...";

  const reader = new FileReader();

  reader.onload = async () => {
    const base64 = reader.result.split(",")[1];

    const formData = new FormData();

    formData.append("judul", judul);
    formData.append("kategori", kategori);
    formData.append("fileName", file.name);
    formData.append("file", base64);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Server tidak merespon.");
      }

      const result = await response.json();

      if (result.success) {
        status.style.color = "green";
        status.innerText = "✅ Materi berhasil diupload.";

        document.getElementById("uploadForm").reset();
      } else {
        status.style.color = "red";
        status.innerText = result.message;
      }
    } catch (err) {
      console.error(err);

      status.style.color = "red";
      status.innerText = "❌ Upload gagal.";
    }

    btn.disabled = false;
    btn.innerText = "Upload Materi";
  };

  reader.readAsDataURL(file);
}
