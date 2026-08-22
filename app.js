/* =======================================
   پیکان‌خان - مدیریت پست‌ها
======================================= */

let posts = [];

/* ---------- دسته‌بندی‌ها ---------- */

const categories = {
    movies: [
        {
            id: "education",
            title: "فیلم آموزشی",
            icon: "🎓",
            description: "آموزش‌های ویدیویی"
        },
        {
            id: "cinema",
            title: "فیلم سینمایی",
            icon: "🍿",
            description: "فیلم‌های سینمایی"
        },
        {
            id: "short-series",
            title: "سریال کوتاه",
            icon: "📺",
            description: "به‌زودی",
            comingSoon: true
        }
    ],

    books: [
        {
            id: "history",
            title: "تاریخی",
            icon: "🏛️",
            description: "کتاب‌های تاریخی"
        },
        {
            id: "story",
            title: "داستان",
            icon: "📖",
            description: "رمان و داستان"
        },
        {
            id: "children",
            title: "کودک",
            icon: "🧸",
            description: "کتاب‌های کودک"
        }
    ],

    mods: [
        {
            id: "gta-v",
            title: "GTA V",
            icon: "🚗",
            description: "مودهای جی‌تی‌ای‌وی"
        },
        {
            id: "bomb-squad",
            title: "Bomb Squad",
            icon: "💣",
            description: "مودهای بمب اسکواد"
        }
    ],

    articles: [
        {
            id: "tutorial",
            title: "آموزشی",
            icon: "🎓",
            description: "مقاله‌های آموزشی"
        },
        {
            id: "other",
            title: "متفرقه",
            icon: "📝",
            description: "مطالب متفرقه"
        }
    ]
};

/* ---------- توابع کمکی ---------- */

function toast(message) {
    const element = document.getElementById("toast");

    if (!element) return;

    element.textContent = message;
    element.classList.add("show");

    setTimeout(function () {
        element.classList.remove("show");
    }, 3000);
}

function showPage(pageId) {
    document.querySelectorAll(".page-section").forEach(function (page) {
        page.classList.remove("active-page");
    });

    const targetPage = document.getElementById(pageId);

    if (!targetPage) {
        toast("صفحه پیدا نشد.");
        return;
    }

    targetPage.classList.add("active-page");

    document.querySelectorAll(".nav-item").forEach(function (item) {
        item.classList.toggle(
            "active",
            item.dataset.page === pageId
        );
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* ---------- آماده‌سازی پست‌ها ---------- */

function preparePosts() {
    if (!Array.isArray(posts)) {
        posts = [];
        return;
    }

    posts = posts.filter(function (post) {
        return post &&
            post.title &&
            post.type &&
            post.category;
    });
}

/* ---------- ساخت کارت پست ---------- */

function createPostCard(post) {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.description || "توضیحی برای این پست ثبت نشده است."}</p>

        <div class="card-meta">
            <span>📂 ${getTypeTitle(post.type)}</span>
            <span>📅 ${post.date || ""}</span>
        </div>

        <button class="open-post" type="button">
            📄 مشاهده جزئیات
        </button>
    `;

    card.addEventListener("click", function (event) {
        if (event.target.closest("a")) return;
        openPost(post.id);
    });

    const openButton = card.querySelector(".open-post");

    if (openButton) {
        openButton.addEventListener("click", function () {
            openPost(post.id);
        });
    }

    return card;
}

function getTypeTitle(type) {
    const titles = {
        book: "کتاب",
        movie: "فیلم",
        mod: "مود",
        article: "مقاله"
    };

    return titles[type] || type;
}

/* ---------- نمایش پست‌های خانه ---------- */

function renderLatestPosts() {
    const container = document.getElementById("latestPosts");

    if (!container) return;

    container.innerHTML = "";

    if (posts.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                هنوز پستی منتشر نشده است.
            </div>
        `;
        return;
    }

    posts.forEach(function (post) {
        container.appendChild(createPostCard(post));
    });
}

/* ---------- نمایش دسته‌بندی‌ها ---------- */

function renderCategories() {
    renderCategoryCards(
        "movieCategories",
        categories.movies,
        "moviePosts",
        "movie"
    );

    renderCategoryCards(
        "bookCategories",
        categories.books,
        "bookPosts",
        "book"
    );

    renderCategoryCards(
        "modCategories",
        categories.mods,
        "modPosts",
        "mod"
    );

    renderCategoryCards(
        "articleCategories",
        categories.articles,
        "articlePosts",
        "article"
    );
}

function renderCategoryCards(
    containerId,
    categoryList,
    postsContainerId,
    postType
) {
    const container = document.getElementById(containerId);
    const postsContainer = document.getElementById(postsContainerId);

    if (!container) return;

    container.innerHTML = "";

    // هنگام ورود به بخش، هیچ پستی نمایش داده نشود
    if (postsContainer) {
        postsContainer.innerHTML = "";
    }

    categoryList.forEach(function (category) {
        const button = document.createElement("button");

        button.className = "category-card";
        button.type = "button";

        button.innerHTML = `
            <span class="category-icon">${category.icon}</span>
            <strong>${category.title}</strong>
            <small>${category.description}</small>
        `;

        button.addEventListener("click", function () {
            if (category.comingSoon) {
                toast("این بخش به‌زودی فعال می‌شود 🚧");
                return;
            }

            const filteredPosts = posts.filter(function (post) {
                return post.type === postType &&
                    post.category === category.id;
            });

            renderPostList(
                postsContainer,
                filteredPosts,
                "در این دسته هنوز پستی منتشر نشده است."
            );
        });

        container.appendChild(button);
    });
}

function renderPostList(container, postList, emptyText) {
    if (!container) return;

    container.innerHTML = "";

    if (postList.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                ${emptyText}
            </div>
        `;
        return;
    }

    postList.forEach(function (post) {
        container.appendChild(createPostCard(post));
    });
}

/* ---------- نمایش صفحه اختصاصی پست ---------- */

function openPost(postId) {
    const post = posts.find(function (item) {
        return String(item.id) === String(postId);
    });

    if (!post) {
        toast("پست پیدا نشد.");
        return;
    }

    const singlePost = document.getElementById("singlePost");

    if (!singlePost) {
        toast("بخش نمایش پست پیدا نشد.");
        return;
    }

    singlePost.innerHTML = `
        <h1>${post.title}</h1>

        <div class="post-date">
            📅 ${post.date || ""}
        </div>

        <div class="post-content">
            ${post.content || `
                <p>جزئیات این پست هنوز ثبت نشده است.</p>
            `}
        </div>
    `;

    showPage("postPage");
}

/* ---------- دکمه‌های صفحات ---------- */

function setupPageButtons() {
    document.addEventListener("click", function (event) {
        const button = event.target.closest("[data-page]");

        if (!button) return;

        showPage(button.getAttribute("data-page"));
    });
}

/* ---------- صفحه ورود ---------- */

function setupLanding() {
    const goButton = document.getElementById("goBtn");

    if (!goButton) return;

    goButton.addEventListener("click", function () {
        const landing = document.getElementById("landing");
        const siteContent = document.getElementById("siteContent");
        const bottomNav = document.getElementById("bottomNav");
        const skip = document.getElementById("skipLanding");

        if (skip && skip.checked) {
            localStorage.setItem(
                "peykanKhanSkipLanding",
                "true"
            );
        }

        if (landing) {
            landing.style.display = "none";
        }

        if (siteContent) {
            siteContent.style.display = "block";
            siteContent.style.visibility = "visible";
            siteContent.style.opacity = "1";
        }

        if (bottomNav) {
            bottomNav.style.display = "flex";
        }

        showPage("homePage");
    });

    if (
        localStorage.getItem("peykanKhanSkipLanding") === "true"
    ) {
        const landing = document.getElementById("landing");
        const siteContent = document.getElementById("siteContent");
        const bottomNav = document.getElementById("bottomNav");

        if (landing) landing.style.display = "none";
        if (siteContent) siteContent.style.display = "block";
        if (bottomNav) bottomNav.style.display = "flex";

        showPage("homePage");
    }
}

/* ---------- داشبورد ---------- */

function setupDashboard() {
    const panel = document.getElementById("dashboardPanel");
    const overlay = document.getElementById("dashboardOverlay");

    function openDashboard() {
        if (panel) panel.classList.add("open");
        if (overlay) overlay.classList.add("open");
    }

    function closeDashboard() {
        if (panel) panel.classList.remove("open");
        if (overlay) overlay.classList.remove("open");
    }

    const openButton = document.getElementById("dashboardOpenBtn");
    const closeButton = document.getElementById("dashboardCloseBtn");

    if (openButton) {
        openButton.addEventListener("click", openDashboard);
    }

    if (closeButton) {
        closeButton.addEventListener("click", closeDashboard);
    }

    if (overlay) {
        overlay.addEventListener("click", closeDashboard);
    }

    const contactButton =
        document.getElementById("dashboardContactBtn");

    if (contactButton) {
        contactButton.addEventListener("click", function () {
            closeDashboard();
            showPage("contactPage");
        });
    }

    const shareButtons = [
        document.getElementById("dashboardShareBtn"),
        document.getElementById("shareSiteBtn")
    ];

    shareButtons.forEach(function (button) {
        if (!button) return;

        button.addEventListener("click", function () {
            const shareData = {
                title: "پیکان‌خان",
                text: "به هاب سرگرمی پیکان‌خان سر بزن 🚗",
                url: location.href
            };

            if (navigator.share) {
                navigator.share(shareData).catch(function () {});
            } else if (navigator.clipboard) {
                navigator.clipboard
                    .writeText(location.href)
                    .then(function () {
                        toast("لینک سایت کپی شد 📋");
                    })
                    .catch(function () {
                        toast("کپی لینک انجام نشد.");
                    });
            }
        });
    });
}

/* ---------- تم ---------- */

function setupTheme() {
    function setTheme(theme) {
        const light = theme === "light";

        document.body.classList.toggle(
            "light-theme",
            light
        );

        localStorage.setItem(
            "peykanKhanTheme",
            light ? "light" : "dark"
        );

        toast(
            light
                ? "حالت روشن ☀️"
                : "حالت تاریک 🌙"
        );
    }

    const lightButton = document.getElementById("lightThemeBtn");
    const darkButton = document.getElementById("darkThemeBtn");
    const themeToggle = document.getElementById("themeToggle");

    if (lightButton) {
        lightButton.addEventListener("click", function () {
            setTheme("light");
        });
    }

    if (darkButton) {
        darkButton.addEventListener("click", function () {
            setTheme("dark");
        });
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            const isLight =
                document.body.classList.contains("light-theme");

            setTheme(isLight ? "light" : "dark");
        });
    }

    const themeMenuButton =
        document.getElementById("themeMenuBtn");

    const themeBackButton =
        document.getElementById("themeBackBtn");

    const dashboardMain =
        document.getElementById("dashboardMain");

    const themePanelContent =
        document.getElementById("themePanelContent");

    if (themeMenuButton) {
        themeMenuButton.addEventListener("click", function () {
            if (dashboardMain) {
                dashboardMain.classList.add("hidden");
            }

            if (themePanelContent) {
                themePanelContent.classList.add("active");
            }
        });
    }

    if (themeBackButton) {
        themeBackButton.addEventListener("click", function () {
            if (dashboardMain) {
                dashboardMain.classList.remove("hidden");
            }

            if (themePanelContent) {
                themePanelContent.classList.remove("active");
            }
        });
    }

    if (
        localStorage.getItem("peykanKhanTheme") === "light"
    ) {
        document.body.classList.add("light-theme");
    }
}

/* ---------- جست‌وجو ---------- */

function setupSearch() {
    const input = document.getElementById("searchInput");
    const button = document.getElementById("searchBtn");

    if (!input) return;

    function doSearch() {
        const message =
            document.getElementById("searchMessage");

        const results =
            document.getElementById("searchResults");

        const query =
            input.value.trim().toLowerCase();

        if (results) {
            results.innerHTML = "";
        }

        if (!query) {
            if (message) {
                message.textContent =
                    "نام چیزی را بنویس که جست‌وجو کنی.";
            }

            return;
        }

        const found = posts.filter(function (post) {
            return String(post.title || "")
                .toLowerCase()
                .includes(query) ||
                String(post.description || "")
                    .toLowerCase()
                    .includes(query);
        });

        if (found.length === 0) {
            if (message) {
                message.textContent = "پستی پیدا نشد.";
            }

            return;
        }

        if (message) {
            message.textContent =
                found.length + " نتیجه پیدا شد.";
        }

        renderPostList(
            results,
            found,
            "نتیجه‌ای پیدا نشد."
        );
    }

    if (button) {
        button.addEventListener("click", doSearch);
    }

    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            doSearch();
        }
    });
}

/* ---------- اجرای برنامه ---------- */

function init() {
    setupPageButtons();

    try {
        setupLanding();
    } catch (error) {
        console.error("خطا در صفحه ورود:", error);
    }

    try {
        setupDashboard();
    } catch (error) {
        console.error("خطا در داشبورد:", error);
    }

    try {
        setupTheme();
    } catch (error) {
        console.error("خطا در تم:", error);
    }

    try {
        setupSearch();
    } catch (error) {
        console.error("خطا در جست‌وجو:", error);
    }
}

/* ---------- بارگذاری پست‌ها ---------- */

function loadPosts() {
    fetch("./posts.json", {
        cache: "no-cache"
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error(
                    "فایل posts.json پیدا نشد"
                );
            }

            return response.json();
        })
        .then(function (data) {
            posts = Array.isArray(data) ? data : [];

            preparePosts();
            renderLatestPosts();
            renderCategories();
        })
        .catch(function (error) {
            console.error(
                "خطا در بارگذاری پست‌ها:",
                error
            );

            const containers = [
                "latestPosts",
                "bookPosts",
                "moviePosts",
                "modPosts",
                "articlePosts"
            ];

            containers.forEach(function (id) {
                const container =
                    document.getElementById(id);

                if (container) {
                    container.innerHTML = `
                        <div class="empty-message">
                            خطا در بارگذاری پست‌ها.
                            بعداً دوباره امتحان کنید.
                        </div>
                    `;
                }
            });
        });
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        function () {
            init();
            loadPosts();
        }
    );
} else {
    init();
    loadPosts();
}
