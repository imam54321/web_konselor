const API_URL =
  "https://script.google.com/macros/s/AKfycbwTEgSvwt4JGEtHI8jzCUvU4z2ngq1H0wdAYtkazaoNeGMl8sxAHcbdMaM-ja2MmkpsBw/exec";

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "login",
        username: username,
        password: password,
      }),
    });

    const result = await response.json();

    if (result.success) {
      sessionStorage.setItem("login", "true");

      window.location.href = "dashboard.html";
    } else {
      document.getElementById("pesan").innerText =
        "Username atau Password salah.";
    }
  } catch (err) {
    console.error(err);

    document.getElementById("pesan").innerText =
      "Tidak dapat terhubung ke server.";
  }
}

if (window.location.pathname.includes("dashboard.html")) {
  if (sessionStorage.getItem("login") !== "true") {
    window.location.href = "login.html";
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
      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          judul,
          kategori,
          fileName: file.name,
          file: base64,
        }),
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
