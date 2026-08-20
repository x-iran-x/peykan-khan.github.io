/* =======================================
   پیکان‌خان - نسخه ایمن
======================================= */

let posts = [];

const categories = {
    movies: [
        { id: "education", title: "فیلم آموزشی", icon: "🎓", description: "آموزش‌های ویدیویی" },
        { id: "cinema", title: "فیلم سینمایی", icon: "🍿", description: "فیلم‌های سینمایی" },
        { id: "short-series", title: "سریال کوتاه", icon: "📺", description: "به‌زودی", comingSoon: true }
    ],
    books: [
        { id: "history", title: "تاریخی", icon: "🏛️", description: "کتاب‌های تاریخی" },
        { id: "story", title: "داستان", icon: "📖", description: "رمان و داستان" },
        { id: "children", title: "کودک", icon: "🧸", description: "کتاب‌های کودک" }
    ],
    mods: [
        { id: "gta-v", title: "GTA V", icon: "🚗", description: "مودهای جی‌تی‌ای‌وی" },
        { id: "bomb-squad", title: "Bomb Squad", icon: "💣", description: "مودهای بمب اسکواد" }
    ],
    articles: [
        { id: "tutorial", title: "آموزشی", icon: "🎓", description: "مقاله‌های آموزشی" },
        { id: "other", title: "متفرقه", icon: "📝", description: "مطالب متفرقه" }
    ]
};

/* ---------- توابع کمکی ---------- */

function toast(message) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = message;
    t.classList.add("show");
    setTimeout(function () {
        t.classList.remove("show");
    }, 3000);
}

function showPage(pageId) {
    document.querySelectorAll(".page-section").forEach(function (p) {
        p.classList.remove("active-page");
    });
    const page = document.getElementById(pageId);
    if (!page) {
        toast("صفحه پیدا نشد.");
        return;
    }
    page.classList.add("active-page");
    document.querySelectorAll(".nav-item").forEach(function (i) {
        i.classList.toggle("active", i.dataset.page === pageId);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- دکمه‌های دارای data-page (منو پایین، فوتر، بازگشت) ---------- */
function setupPageButtons() {
    document.addEventListener("click", function (e) {
        const btn = e.target.closest("[data-page]");
        if (btn) {
            showPage(btn.getAttribute("data-page"));
        }
    });
}

/* ---------- دکمه بزن بریم ---------- */
function setupLanding() {
    const goBtn = document.getElementById("goBtn");
    if (!goBtn) return;
    goBtn.addEventListener("click", function () {
        const landing = document.getElementById("landing");
        const siteContent = document.getElementById("siteContent");
        const bottomNav = document.getElementById("bottomNav");
        const skip = document.getElementById("skipLanding");

        if (skip && skip.checked) {
            localStorage.setItem("peykanKhanSkipLanding", "true");
        }

        if (landing) landing.style.display = "none";
        if (siteContent) {
            siteContent.style.display = "block";
            siteContent.style.visibility = "visible";
            siteContent.style.opacity = "1";
        }
        if (bottomNav) bottomNav.style.display = "flex";

        showPage("homePage");
    });

    if (localStorage.getItem("peykanKhanSkipLanding") === "true") {
        const landing = document.getElementById("landing");
        const siteContent = document.getElementById("siteContent");
        const bottomNav = document.getElementById("bottomNav");
        if (landing) landing.style.display = "none";
        if (siteContent) siteContent.style.display = "block";
        if (bottomNav) bottomNav.style.display = "flex";
        showPage("homePage");
    }
}

/* ---------- داشبورد، تم و اشتراک ---------- */
function setupDashboard() {
    const panel = document.getElementById("dashboardPanel");
    const overlay = document.getElementById("dashboardOverlay");

    function openDb() {
        if (panel) panel.classList.add("open");
        if (overlay) overlay.classList.add("open");
    }
    function closeDb() {
        if (panel) panel.classList.remove("open");
        if (overlay) overlay.classList.remove("open");
    }

    const openBtn = document.getElementById("dashboardOpenBtn");
    if (openBtn) openBtn.addEventListener("click", openDb);

    const closeBtn = document.getElementById("dashboardCloseBtn");
    if (closeBtn) closeBtn.addEventListener("click", closeDb);
    if (overlay) overlay.addEventListener("click", closeDb);

    const contactBtn = document.getElementById("dashboardContactBtn");
    if (contactBtn) contactBtn.addEventListener("click", function () {
        closeDb();
        showPage("contactPage");
    });

    const shareBtn = document.getElementById("dashboardShareBtn");
    if (shareBtn) shareBtn.addEventListener("click", function () {
        const data = { title: "پیکان‌خان", text: "به هاب سرگرمی پیکان‌خان سر بزن 🚗", url: location.href };
        if (navigator.share) {
            navigator.share(data).catch(function () {});
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(location.href).then(function () {
                toast("لینک کپی شد 📋");
            }).catch(function () {});
        }
    });

    const shareSiteBtn = document.getElementById("shareSiteBtn");
    if (shareSiteBtn) shareSiteBtn.addEventListener("click", function () {
        const data = { title: "پیکان‌خان", text: "به هاب سرگرمی پیکان‌خان سر بزن 🚗", url: location.href };
        if (navigator.share) navigator.share(data).catch(function () {});
        else if (navigator.clipboard) navigator.clipboard.writeText(location.href).catch(function () {});
    });
}

/* ---------- تم ---------- */
function setupTheme() {
    function setTheme(theme) {
        const light = theme === "light";
        document.body.classList.toggle("light-theme", light);
        localStorage.setItem("peykanKhanTheme", light ? "light" : "dark");
        toast(light ? "حالت روشن ☀️" : "حالت تاریک 🌙");
    }

    const lightBtn = document.getElementById("lightThemeBtn");
    if (lightBtn) lightBtn.addEventListener("click", function () { setTheme("light"); });

    const darkBtn = document.getElementById("darkThemeBtn");
    if (darkBtn) darkBtn.addEventListener("click", function () { setTheme("dark"); });

    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) themeToggle.addEventListener("click", function () {
        const isLight = document.body.classList.contains("light-theme");
        setTheme(isLight ? "dark" : "light");
    });

    const themeMenuBtn = document.getElementById("themeMenuBtn");
    const themeBackBtn = document.getElementById("themeBackBtn");
    const dashboardMain = document.getElementById("dashboardMain");
    const themePanelContent = document.getElementById("themePanelContent");

    if (themeMenuBtn) themeMenuBtn.addEventListener("click", function () {
        if (dashboardMain) dashboardMain.classList.add("hidden");
        if (themePanelContent) themePanelContent.classList.add("active");
    });
    if (themeBackBtn) themeBackBtn.addEventListener("click", function () {
        if (dashboardMain) dashboardMain.classList.remove("hidden");
        if (themePanelContent) themePanelContent.classList.remove("active");
    });

    if (localStorage.getItem("peykanKhanTheme") === "light") {
        document.body.classList.add("light-theme");
    }
}

/* ---------- جست‌وجو ---------- */
function setupSearch() {
    const input = document.getElementById("searchInput");
    if (!input) return;

    function doSearch() {
        const message = document.getElementById("searchMessage");
        const results = document.getElementById("searchResults");
        const q = input.value.trim().toLowerCase();
        if (results) results.innerHTML = "";
        if (!q) {
            if (message) message.textContent = "نام چیزی را بنویس که جست‌وجو کنی.";
            return;
        }
        const found = posts.filter(function (p) {
            return String(p.title || "").toLowerCase().includes(q) ||
                   String(p.description || "").toLowerCase().includes(q);
        });
        if (found.length === 0) {
            if (message) message.textContent = "پستی پیدا نشد.";
            return;
        }
        if (message) message.textContent = found.length + " نتیجه پیدا شد.";
        if (results) {
            found.forEach(function (p) {
                const c = document.createElement("article");
                c.className = "card";
                c.innerHTML = "<h3>" + p.title + "</h3><p>" + (p.description || "") + "</p>";
                results.appendChild(c);
            });
        }
    }

    const btn = document.getElementById("searchBtn");
    if (btn) btn.addEventListener("click", doSearch);
    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") doSearch();
    });
}

/* ---------- دسته‌بندی‌ها ---------- */
function renderAllCategories() {
    const map = {
        movieCategories: categories.movies,
        bookCategories: categories.books,
        modCategories: categories.mods,
        articleCategories: categories.articles
    };

    Object.keys(map).forEach(function (containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        map[containerId].forEach(function (cat) {
            const b = document.createElement("button");
            b.className = "category-card";
            b.type = "button";
            b.innerHTML = '<span class="category-icon">' + cat.icon +
                '</span><strong>' + cat.title + '</strong><small>' + cat.description + '</small>';
            b.addEventListener("click", function () {
                if (cat.comingSoon) {
                    toast("این بخش به‌زودی فعال می‌شود 🚧");
                } else {
                    toast("«" + cat.title + "» هنوز پستی ندارد.");
                }
            });
            container.appendChild(b);
        });
    });
}

/* ---------- اجرای همه چیز ---------- */
function init() {
    setupPageButtons();
    try { setupLanding(); } catch (err) { console.error(err); }
    try { setupDashboard(); } catch (err) { console.error(err); }
    try { setupTheme(); } catch (err) { console.error(err); }
    try { setupSearch(); } catch (err) { console.error(err); }
    try { renderAllCategories(); } catch (err) { console.error(err); }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
