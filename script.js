// ============================
// Konfigurasi
// ============================
const API_URL =
  "https://script.google.com/macros/s/AKfycbxmPaRvYb8YTg39jBAwGm4SWNnbBvfEeJtsZL4DDBanIRm8XRzdIMNL9WYrkkf41jB0CA/exec";
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector("nav ul");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
}

// ============================
// Back To Top
// ============================
const topBtn = document.getElementById("topBtn");

if (topBtn) {
  window.addEventListener("scroll", () => {
    topBtn.style.display = window.scrollY > 300 ? "flex" : "none";
  });

  topBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ============================
// Active Navbar
// ============================
const links = document.querySelectorAll("nav ul li a");

links.forEach((link) => {
  link.addEventListener("click", () => {
    links.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

// ============================
// Fade In Animation
// ============================
const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.2,
  },
);

cards.forEach((card) => {
  card.classList.add("hidden");
  observer.observe(card);
});

// ============================
// FAQ Accordion
// ============================
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");

  if (question) {
    question.addEventListener("click", () => {
      item.classList.toggle("open");
    });
  }
});

// ============================
// Load Materi
// ============================
async function loadMateri() {
  const container = document.getElementById("materiContainer");

  if (!container) return;

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    container.innerHTML = "";

    data.forEach((item) => {
      container.innerHTML += `
                <a href="${item.link}" target="_blank" style="text-decoration:none;color:inherit;">
                    <div class="card">
                        <h3>${item.judul}</h3>
                        <p>${item.deskripsi}</p>
                    </div>
                </a>
            `;
    });
  } catch (error) {
    console.error("Gagal mengambil materi:", error);
  }
}

// ============================
// Upload Materi
// ============================
async function uploadMateri() {
  const judul = document.getElementById("judul");
  const deskripsi = document.getElementById("deskripsi");
  const pdf = document.getElementById("pdf");

  if (!judul || !deskripsi || !pdf) return;

  if (!judul.value || !deskripsi.value || !pdf.files.length) {
    alert("Lengkapi semua data.");
    return;
  }

  const reader = new FileReader();

  reader.onload = async () => {
    const base64 = reader.result.split(",")[1];

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          judul: judul.value,
          kategori: document.getElementById("kategori").value,
          fileName: pdf.files[0].name,
          file: base64,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Materi berhasil diupload");
        window.location.reload();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert("Upload gagal.");
    }
  };

  reader.readAsDataURL(pdf.files[0]);
}

// ============================
// Jalankan saat halaman selesai dimuat
// ============================
document.addEventListener("DOMContentLoaded", () => {
  loadMateri();
});
