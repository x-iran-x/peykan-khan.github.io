/* =====================================================
   پست‌های سایت
   فعلاً خالی است؛ بعداً پست‌های جدید را اینجا اضافه می‌کنیم.
===================================================== */

const posts = [
    /*
    نمونه‌ی اضافه‌کردن پست:

    {
        id: 1,
        title: "نام پست",
        type: "movie",
        category: "cinema",
        date: "۲۹ مرداد ۱۴۰۵",
        description: "توضیح کوتاه پست",
        content: "متن کامل پست اینجا نوشته می‌شود."
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
   عناصر صفحه
===================================================== */

const landing = document.getElementById("landing");
const siteContent = document.getElementById("siteContent");
const bottomNav = document.getElementById("bottomNav");
const goBtn = document.getElementById("goBtn");
const toast = document.getElementById("toast");


/* =====================================================
   نمایش صفحه‌ی اصلی بعد از کلیک
===================================================== */

goBtn.addEventListener("click", function () {
    landing.classList.add("hidden");

    setTimeout(function () {
        landing.style.display = "none";
        siteContent.classList.add("visible");
        bottomNav.classList.add("show");

        showPage("homePage");
    }, 600);
});


/* =====================================================
   ساخت کارت پست
===================================================== */

function createPostCard(post) {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
        <h3>${post.title}</h3>

        <p>${post.description || "توضیحی برای این پست ثبت نشده است."}</p>

        <div class="card-meta">
            <span>🗓 ${post.date || "بدون تاریخ"}</span>
            <span>🏷 ${post.categoryName || "بدون دسته‌بندی"}</span>
        </div>

        <span class="open-post" data-post-id="${post.id}">
            مشاهده‌ی کامل پست ←
        </span>
    `;

    card.querySelector(".open-post").addEventListener("click", function () {
        openPost(post.id);
    });

    return card;
}


/* =====================================================
   نمایش پست‌های خانه
   فقط پست‌های جدید در این قسمت می‌آیند.
===================================================== */

function renderLatestPosts() {
    const container = document.getElementById("latestPosts");

    container.innerHTML = "";

    const latestPosts = [...posts]
        .sort((a, b) => Number(b.id) - Number(a.id))
        .slice(0, 10);

    if (latestPosts.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                هنوز پست جدیدی منتشر نشده است.<br>
                به‌زودی مطالب جذاب پیکان خان اینجا قرار می‌گیرند 🚀
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
        const container = document.getElementById(settings.categoryContainer);
        const categoryList = categories[settings.categoryKey];

        container.innerHTML = "";

        categoryList.forEach(function (category) {
            const button = document.createElement("button");
            button.className = "category-card";

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
   نمایش پست‌های مربوط به یک دسته
===================================================== */

function renderCategoryPosts(type, categoryId, containerId, categoryTitle) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    const filteredPosts = posts.filter(function (post) {
        return post.type === type && post.category === categoryId;
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
   آماده‌سازی نام دسته برای کارت پست
===================================================== */

function preparePosts() {
    posts.forEach(function (post) {
        const allCategories = [
            ...categories.movies,
            ...categories.books,
            ...categories.mods,
            ...categories.articles
        ];

        const category = allCategories.find(function (item) {
            return item.id === post.category;
        });

        post.categoryName = category ? category.title : "بدون دسته‌بندی";
    });
}


/* =====================================================
   نمایش صفحه
===================================================== */

function showPage(pageId) {
    document.querySelectorAll(".page-section").forEach(function (page) {
        page.classList.remove("active-page");
    });

    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }

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
   کلیک روی منوی پایین
===================================================== */

document.querySelectorAll(".nav-item").forEach(function (item) {
    item.addEventListener("click", function () {
        showPage(item.dataset.page);
    });
});

/* =====================================================
   لینک‌های فوتر
===================================================== */

document.querySelectorAll(".footer-link").forEach(function (link) {
    link.addEventListener("click", function () {
        showPage(link.dataset.page);
    });
});

/* =====================================================
   دکمه‌های بازگشت
===================================================== */

document.querySelectorAll(".back-btn").forEach(function (button) {
    button.addEventListener("click", function () {
        showPage(button.dataset.page);
    });
});


/* =====================================================
   بازکردن صفحه‌ی اختصاصی پست
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

    container.innerHTML = `
        <h1>${post.title}</h1>

        <span class="post-date">
            🗓 ${post.date || "بدون تاریخ"} |
            🏷 ${post.categoryName || "بدون دسته‌بندی"}
        </span>

        <div class="post-content">
            ${post.content || post.description || "محتوایی برای این پست ثبت نشده است."}
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

    const query = input.value.trim().toLowerCase();

    results.innerHTML = "";

    if (!query) {
        message.textContent = "نام چیزی را که می‌خواهی جست‌وجو کنی بنویس.";
        return;
    }

    const foundPosts = posts.filter(function (post) {
        const searchableText = `
            ${post.title}
            ${post.description}
            ${post.content}
            ${post.category}
            ${post.categoryName}
        `.toLowerCase();

        return searchableText.includes(query);
    });

    if (foundPosts.length === 0) {
        message.textContent = `برای «${input.value}» پستی پیدا نشد.`;
        return;
    }

    message.textContent = `${foundPosts.length} نتیجه برای «${input.value}» پیدا شد.`;

    foundPosts.forEach(function (post) {
        results.appendChild(createPostCard(post));
    });
}

document.getElementById("searchBtn").addEventListener("click", searchPosts);

document.getElementById("searchInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        searchPosts();
    }
});


/* =====================================================
   نمایش اعلان
===================================================== */

function showToast(message) {
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
