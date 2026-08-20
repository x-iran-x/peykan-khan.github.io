/* =====================================================
   پست‌های سایت
===================================================== */

const posts = [
    /*
    نمونه پست:

    {
        id: 1,
        title: "نام پست",
        type: "movie",
        category: "cinema",
        date: "۲۹ مرداد ۱۴۰۵",
        description: "توضیح کوتاه پست",
        content: "متن کامل پست"
    }
    */
];


/* =====================================================
   دسته‌بندی‌ها
===================================================== */

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
            description: "این بخش به‌زودی فعال می‌شود",
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


/* =====================================================
   تنظیمات بخش‌ها
===================================================== */

const sectionSettings = {
    moviesPage: {
        categoryKey: "movies",
        postsType: "movie",
        categoryContainer: "movieCategories",
        postsContainer: "moviePosts"
    },

    booksPage: {
        categoryKey: "books",
        postsType: "book",
        categoryContainer: "bookCategories",
        postsContainer: "bookPosts"
    },

    modsPage: {
        categoryKey: "mods",
        postsType: "mod",
        categoryContainer: "modCategories",
        postsContainer: "modPosts"
    },

    articlesPage: {
        categoryKey: "articles",
        postsType: "article",
        categoryContainer: "articleCategories",
        postsContainer: "articlePosts"
    }
};


/* =====================================================
   عناصر اصلی صفحه
===================================================== */

const landing = document.getElementById("landing");
const siteContent = document.getElementById("siteContent");
const bottomNav = document.getElementById("bottomNav");
const goBtn = document.getElementById("goBtn");
const toast = document.getElementById("toast");
const skipLandingCheckbox =
    document.getElementById("skipLanding");


/* =====================================================
   صفحه خوش‌آمدگویی و ورود به سایت
===================================================== */

const skipLanding =
    localStorage.getItem("peykanKhanSkipLanding") === "true";


function enterSite() {
    if (landing) {
        landing.classList.add("hidden");
    }

    setTimeout(function () {
        if (landing) {
            landing.style.display = "none";
        }

        if (siteContent) {
            siteContent.classList.add("visible");
        }

        if (bottomNav) {
            bottomNav.classList.add("show");
        }

        showPage("homePage");
    }, 600);
}


/* ورود مستقیم اگر کاربر قبلاً انتخاب کرده باشد */

if (skipLanding) {
    if (landing) {
        landing.style.display = "none";
    }

    if (siteContent) {
        siteContent.classList.add("visible");
    }

    if (bottomNav) {
        bottomNav.classList.add("show");
    }

    showPage("homePage");
}


/* ورود با دکمه */

if (goBtn) {
    goBtn.addEventListener("click", function () {
        if (
            skipLandingCheckbox &&
            skipLandingCheckbox.checked
        ) {
            localStorage.setItem(
                "peykanKhanSkipLanding",
                "true"
            );
        }

        enterSite();
    });
}


/* =====================================================
   ساخت کارت پست
===================================================== */

function createPostCard(post) {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
        <h3>${post.title || "بدون عنوان"}</h3>

        <p>
            ${post.description || "توضیحی برای این پست ثبت نشده است."}
        </p>

        <div class="card-meta">
            <span>🗓 ${post.date || "بدون تاریخ"}</span>
            <span>🏷 ${post.categoryName || "بدون دسته‌بندی"}</span>
        </div>

        <span class="open-post" data-post-id="${post.id}">
            مشاهده‌ی کامل پست ←
        </span>
    `;

    const openButton = card.querySelector(".open-post");

    if (openButton) {
        openButton.addEventListener("click", function () {
            openPost(post.id);
        });
    }

    return card;
}


/* =====================================================
   نمایش پست‌های تازه در خانه
===================================================== */

function renderLatestPosts() {
    const container = document.getElementById("latestPosts");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const latestPosts = [...posts]
        .sort(function (a, b) {
            return Number(b.id) - Number(a.id);
        })
        .slice(0, 10);

    if (latestPosts.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                هنوز پست جدیدی منتشر نشده است.<br>
                به‌زودی مطالب جذاب پیکان‌خان اینجا قرار می‌گیرند 🚀
            </div>
        `;

        return;
    }

    latestPosts.forEach(function (post) {
        container.appendChild(createPostCard(post));
    });
}


/* =====================================================
   نمایش دسته‌بندی‌ها
===================================================== */

function renderCategories() {
    Object.values(sectionSettings).forEach(function (settings) {
        const container = document.getElementById(
            settings.categoryContainer
        );

        const categoryList = categories[settings.categoryKey];

        if (!container || !categoryList) {
            return;
        }

        container.innerHTML = "";

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
                    showToast("این بخش به‌زودی فعال می‌شود 🚧");
                    return;
                }

                renderCategoryPosts(
                    settings.postsType,
                    category.id,
                    settings.postsContainer,
                    category.title
                );
            });

            container.appendChild(button);
        });
    });
}


/* =====================================================
   نمایش پست‌های یک دسته
===================================================== */

function renderCategoryPosts(
    type,
    categoryId,
    containerId,
    categoryTitle
) {
    const container = document.getElementById(containerId);

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const filteredPosts = posts.filter(function (post) {
        return (
            post.type === type &&
            post.category === categoryId
        );
    });

    if (filteredPosts.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                در دسته‌ی «${categoryTitle}» هنوز پستی قرار نگرفته است.
            </div>
        `;

        return;
    }

    filteredPosts.forEach(function (post) {
        container.appendChild(createPostCard(post));
    });
}


/* =====================================================
   آماده‌سازی نام دسته‌بندی پست‌ها
===================================================== */

function preparePosts() {
    const allCategories = [
        ...categories.movies,
        ...categories.books,
        ...categories.mods,
        ...categories.articles
    ];

    posts.forEach(function (post) {
        const category = allCategories.find(function (item) {
            return item.id === post.category;
        });

        post.categoryName = category
            ? category.title
            : "بدون دسته‌بندی";
    });
}


/* =====================================================
   تغییر صفحه
===================================================== */

function showPage(pageId) {
    const allPages = document.querySelectorAll(".page-section");

    allPages.forEach(function (page) {
        page.classList.remove("active-page");
    });

    const selectedPage = document.getElementById(pageId);

    if (!selectedPage) {
        console.error("صفحه پیدا نشد:", pageId);
        showToast("صفحه موردنظر پیدا نشد.");
        return;
    }

    selectedPage.classList.add("active-page");

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


/* =====================================================
   منوی پایین
===================================================== */

document.querySelectorAll(".nav-item").forEach(function (item) {
    item.addEventListener("click", function () {
        const pageId = item.getAttribute("data-page");

        if (pageId) {
            showPage(pageId);
        }
    });
});


/* =====================================================
   لینک‌های فوتر
   شامل «درباره ما» و «تماس با ما»
===================================================== */

document.addEventListener("click", function (event) {
    const footerLink = event.target.closest(".footer-link");

    if (!footerLink) {
        return;
    }

    const pageId = footerLink.getAttribute("data-page");

    if (pageId) {
        showPage(pageId);
    }
});


/* =====================================================
   دکمه‌های بازگشت
===================================================== */

document.querySelectorAll(".back-btn").forEach(function (button) {
    button.addEventListener("click", function () {
        const pageId = button.getAttribute("data-page");

        if (pageId) {
            showPage(pageId);
        }
    });
});


/* =====================================================
   بازکردن پست
===================================================== */

function openPost(postId) {
    const post = posts.find(function (item) {
        return String(item.id) === String(postId);
    });

    if (!post) {
        showToast("پست موردنظر پیدا نشد.");
        return;
    }

    const container = document.getElementById("singlePost");

    if (!container) {
        return;
    }

    container.innerHTML = `
        <h1>${post.title || "بدون عنوان"}</h1>

        <span class="post-date">
            🗓 ${post.date || "بدون تاریخ"} |
            🏷 ${post.categoryName || "بدون دسته‌بندی"}
        </span>

        <div class="post-content">
            ${post.content || post.description || "محتوایی ثبت نشده است."}
        </div>
    `;

    showPage("postPage");
}


/* =====================================================
   جست‌وجوی پست‌ها
===================================================== */

function searchPosts() {
    const input = document.getElementById("searchInput");
    const message = document.getElementById("searchMessage");
    const results = document.getElementById("searchResults");

    if (!input || !message || !results) {
        return;
    }

    const query = input.value.trim().toLowerCase();

    results.innerHTML = "";

    if (!query) {
        message.textContent =
            "نام چیزی را که می‌خواهی جست‌وجو کنی بنویس.";
        return;
    }

    const foundPosts = posts.filter(function (post) {
        const searchableText = `
            ${post.title || ""}
            ${post.description || ""}
            ${post.content || ""}
            ${post.category || ""}
            ${post.categoryName || ""}
        `.toLowerCase();

        return searchableText.includes(query);
    });

    if (foundPosts.length === 0) {
        message.textContent =
            `برای «${input.value}» پستی پیدا نشد.`;

        return;
    }

    message.textContent =
        `${foundPosts.length} نتیجه برای «${input.value}» پیدا شد.`;

    foundPosts.forEach(function (post) {
        results.appendChild(createPostCard(post));
    });
}


const searchButton = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

if (searchButton) {
    searchButton.addEventListener("click", searchPosts);
}

if (searchInput) {
    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            searchPosts();
        }
    });
}


/* =====================================================
   نمایش اعلان
===================================================== */

function showToast(message) {
    if (!toast) {
        return;
    }

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(function () {
        toast.classList.remove("show");
    }, 3000);
}


/* =====================================================
   اجرای اولیه
===================================================== */

preparePosts();
renderLatestPosts();
renderCategories();

/* =====================================================
   اشتراک‌گذاری سایت
===================================================== */

const shareSiteButton =
    document.getElementById("shareSiteBtn");


if (shareSiteButton) {
    shareSiteButton.addEventListener("click", async function () {
        const shareData = {
            title: "پیکان‌خان",
            text: "به هاب سرگرمی پیکان‌خان سر بزن! 🚗",
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                showToast("اشتراک‌گذاری انجام شد ✅");
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(
                    window.location.href
                );

                showToast(
                    "لینک سایت کپی شد؛ حالا می‌توانی آن را بفرستی 📋"
                );
            } else {
                showToast(
                    "مرورگر شما از اشتراک‌گذاری پشتیبانی نمی‌کند."
                );
            }
        } catch (error) {
            if (error.name !== "AbortError") {
                showToast("اشتراک‌گذاری انجام نشد.");
            }
        }
    });
        }
