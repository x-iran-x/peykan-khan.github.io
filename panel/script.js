// --- سیستم احراز هویت ساده ---
const SECRET_KEY = "26qp26"; // 🔑 دادا رمز دلخواهت رو اینجا بذار!

const loginOverlay = document.getElementById("loginOverlay");
const mainPanel = document.getElementById("postForm"); // یا آی‌دی کانتینر اصلی پنل
const loginBtn = document.getElementById("loginBtn");
const adminPassword = document.getElementById("adminPassword");
const loginError = document.getElementById("loginError");

// بررسی اینکه آیا کاربر قبلاً وارد شده یا نه
if (sessionStorage.getItem("isLoggedIn") === "true") {
  loginOverlay.style.display = "none";
  mainPanel.style.display = "block";
} else {
  mainPanel.style.display = "none";
}

function handleLogin() {
  const enteredPass = adminPassword.value.trim();
  if (enteredPass === SECRET_KEY) {
    sessionStorage.setItem("isLoggedIn", "true");
    loginOverlay.style.display = "none";
    mainPanel.style.display = "block";
    loginError.style.display = "none";
  } else {
    loginError.style.display = "block";
    adminPassword.value = "";
  }
}

loginBtn.addEventListener("click", handleLogin);
adminPassword.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleLogin();
});
// -----------------------------
// تابع کمکی برای تبدیل لینک مشاهده گوگل درایو به لینک دانلود مستقیم
function formatDriveDownloadLink(url) {
  if (!url) return "#";
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return url;
}

// نمایش/مخفی کردن فیلدها متناسب با نوع پست انتخابی
const postTypeSelect = document.getElementById("postType");
const typeFields = {
  book: document.getElementById("bookFields"),
  movie: document.getElementById("movieFields"),
  mod: document.getElementById("modFields"),
  article: document.getElementById("articleFields")
};

postTypeSelect.addEventListener("change", (e) => {
  const selectedType = e.target.value;
  Object.keys(typeFields).forEach((type) => {
    if (typeFields[type]) {
      typeFields[type].style.display = type === selectedType ? "block" : "none";
    }
  });
});

// مدیریت ثبت و ارسال فرم به بک‌اند Vercel
const postForm = document.getElementById("postForm");
const statusMessage = document.getElementById("statusMessage");
const submitBtn = document.getElementById("submitBtn");

postForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  submitBtn.disabled = true;
  submitBtn.textContent = "⏳ در حال انتشار...";
  statusMessage.textContent = "";
  statusMessage.className = "status-box";

  const type = postTypeSelect.value;
  const title = document.getElementById("title").value.trim();
  const date = document.getElementById("date").value.trim();
  const description = document.getElementById("description").value.trim();

  let category = "";
  let content = "";

  // قالب‌بندی اختصاصی و فوق‌العاده شیک با HTML
  if (type === "book") {
    category = document.getElementById("bookCategory").value;
    const author = document.getElementById("bookAuthor").value.trim() || "نامشخص";
    const translator = document.getElementById("bookTranslator").value.trim();
    const password = document.getElementById("bookPassword").value.trim() || "ندارد";
    const rawDriveLink = document.getElementById("bookDriveLink").value.trim();
    const downloadLink = formatDriveDownloadLink(rawDriveLink);
    const about = document.getElementById("bookAbout").value.trim() || description;

    content = `
      <h3>📖 درباره کتاب</h3>
      <p>${about}</p>
      <h3>📋 مشخصات</h3>
      <ul>
        <li><strong>نویسنده:</strong> ${author}</li>
        ${translator ? `<li><strong>مترجم:</strong> ${translator}</li>` : `<li><strong>زبان:</strong> انگلیسی (نسخه اصلی)</li>`}
        <li><strong>فرمت:</strong> PDF</li>
        <li><strong>رمز فایل:</strong> ${password}</li>
      </ul>
      <a href="${downloadLink}" class="download-btn" target="_blank" rel="noopener">📥 دانلود کتاب</a>
    `.trim();

  } else if (type === "movie") {
    category = document.getElementById("movieCategory").value;
    const director = document.getElementById("movieDirector").value.trim() || "نامشخص";
    const year = document.getElementById("movieYear").value.trim();
    const quality = document.getElementById("movieQuality").value.trim() || "1080p";
    const age = document.getElementById("movieAge").value.trim() || "+13";
    const embedCode = document.getElementById("movieEmbed").value.trim();
    const downloadLink = document.getElementById("movieDownloadLink").value.trim();

    content = `
      <h3>🎬 معرفی و داستان</h3>
      <p>${description}</p>
      <h3>📋 مشخصات فیلم</h3>
      <ul>
        <li><strong>کارگردان:</strong> ${director}</li>
        ${year ? `<li><strong>سال تولید:</strong> ${year}</li>` : ""}
        <li><strong>کیفیت:</strong> ${quality}</li>
        <li><strong>رده سنی:</strong> ${age}</li>
      </ul>
      ${embedCode ? `<h3>🎥 تماشای آنلاین / تریلر</h3><div class="video-container">${embedCode}</div>` : ""}
      ${downloadLink ? `<a href="${downloadLink}" class="download-btn" target="_blank" rel="noopener">📥 دانلود فیلم</a>` : ""}
    `.trim();

  } else if (type === "mod") {
    category = document.getElementById("modCategory").value;
    const game = document.getElementById("modGame").value.trim() || "نامشخص";
    const version = document.getElementById("modVersion").value.trim() || "آخرین نسخه";
    const size = document.getElementById("modSize").value.trim() || "نامشخص";
    const rawDriveLink = document.getElementById("modDriveLink").value.trim();
    const downloadLink = formatDriveDownloadLink(rawDriveLink);
    const notes = document.getElementById("modNotes").value.trim();

    content = `
      <h3>🎮 درباره مود</h3>
      <p>${description}</p>
      <h3>📋 مشخصات فایل</h3>
      <ul>
        <li><strong>نام بازی:</strong> ${game}</li>
        <li><strong>سازگار با نسخه:</strong> ${version}</li>
        <li><strong>حجم فایل:</strong> ${size}</li>
      </ul>
      ${notes ? `<h3>⚠️ راهنمای نصب و نکات</h3><p>${notes}</p>` : ""}
      <a href="${downloadLink}" class="download-btn" target="_blank" rel="noopener">📥 دانلود مود</a>
    `.trim();

  } else if (type === "article") {
    category = document.getElementById("articleCategory").value;
    const author = document.getElementById("articleAuthor").value.trim() || "پیکان‌خان";
    const readTime = document.getElementById("articleReadTime").value.trim() || "۵ دقیقه";
    const tags = document.getElementById("articleTags").value.trim();
    const htmlContent = document.getElementById("articleHtmlContent").value.trim();

    content = `
      <div class="article-meta">
        <span>✍️ نویسنده: ${author}</span> | <span>⏱️ زمان مطالعه: ${readTime}</span>
      </div>
      <div class="article-body">
        ${htmlContent || `<p>${description}</p>`}
      </div>
      ${tags ? `<div class="article-tags">🏷️ برچسب‌ها: ${tags}</div>` : ""}
    `.trim();
  }

  const postData = {
    id: Date.now(),
    type: type,
    category: category,
    title: title,
    date: date,
    description: description,
    content: content
  };

  try {
    const response = await fetch("/api/update-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postData)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      statusMessage.textContent = "✅ پست با موفقیت و استایل کامل منتشر شد!";
      statusMessage.classList.add("success");
      postForm.reset();
    } else {
      throw new Error(result.message || "خطا در ارسال پست");
    }
  } catch (error) {
    statusMessage.textContent = `❌ خطا: ${error.message}`;
    statusMessage.classList.add("error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "🚀 انتشار پست در سایت";
  }
});
