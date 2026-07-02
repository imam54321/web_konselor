const API_URL =
  "https://script.google.com/macros/s/AKfycbyO-5yjW9YvTJ9C-OXwhazPBCrr90ZFyfXgCPLYf_UKgEKri2HieSIxyS4jeiD6ZTZHHQ/exec";
if (
  window.location.pathname.includes("dashboard.html") &&
  sessionStorage.getItem("login") !== "true"
) {
  window.location.href = "login.html";
}
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "admin123") {
    sessionStorage.setItem("login", "true");

    window.location.href = "dashboard.html";
  } else {
    document.getElementById("pesan").innerText =
      "Username atau Password salah.";
  }
}

function logout() {
  sessionStorage.clear();

  window.location.href = "login.html";
}

async function uploadMateri() {
  const judul = document.getElementById("judul").value;
  const kategori = document.getElementById("kategori").value;
  const file = document.getElementById("pdf").files[0];
  const status = document.getElementById("statusUpload");

  if (!judul || !kategori || !file) {
    status.style.color = "red";
    status.innerText = "Lengkapi semua data.";
    return;
  }

  const reader = new FileReader();

  reader.onload = async () => {
    const base64 = reader.result.split(",")[1];

    try {
      const formData = new FormData();

      formData.append("judul", judul);
      formData.append("kategori", kategori);
      formData.append("fileName", file.name);
      formData.append("file", base64);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        status.style.color = "green";
        status.innerText = "✅ Materi berhasil diupload.";

        document.getElementById("judul").value = "";
        document.getElementById("kategori").selectedIndex = 0;
        document.getElementById("pdf").value = "";
      } else {
        status.style.color = "red";
        status.innerText = result.message;
      }
    } catch (err) {
      status.style.color = "red";
      status.innerText = "Terjadi kesalahan saat upload.";
      console.error(err);
    }
  };

  reader.readAsDataURL(file);
}
