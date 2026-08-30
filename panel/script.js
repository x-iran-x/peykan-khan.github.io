// /panel/script.js

// ۱. مدیریت نمایش فیلدهای هر نوع پست
document.getElementById('postType').addEventListener('change', function() {
  const type = this.value;
  document.querySelectorAll('.type-fields').forEach(div => div.style.display = 'none');
  document.getElementById(type + 'Fields').style.display = 'block';
});

// ۲. تابع تبدیل لینک گوگل‌درایو به لینک دانلود مستقیم
function getDirectDriveLink(url) {
  const match = url.match(/\/d\/(.+?)\//);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return url; // اگه لینک استاندارد نبود، خودش رو برگردون
}

// ۳. ارسال اطلاعات به API
document.getElementById('postForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const submitBtn = document.getElementById('submitBtn');
  const statusMessage = document.getElementById('statusMessage');
  const type = document.getElementById('postType').value;
  
  submitBtn.disabled = true;
  statusMessage.textContent = 'در حال ثبت پست... لطفا صبر کن دادا!';
  statusMessage.className = 'status-box';

  // ساخت آبجکت پست بر اساس فیلدها
  let postData = {
    id: Date.now(), // آیدی عددی بر اساس زمان
    title: document.getElementById('title').value,
    type: type,
    date: document.getElementById('date').value,
    description: document.getElementById('description').value
  };

  // اضافه کردن فیلدهای اختصاصی
  if (type === 'book') {
    postData.author = document.getElementById('bookAuthor').value;
    postData.translator = document.getElementById('bookTranslator').value;
    postData.password = document.getElementById('bookPassword').value;
    const directLink = getDirectDriveLink(document.getElementById('bookDriveLink').value);
    postData.content = `<p>درباره کتاب: ${document.getElementById('bookAbout').value}</p><p>مشخصات: نویسنده ${postData.author} - مترجم ${postData.translator}</p><p>رمز فایل: ${postData.password}</p><a href="${directLink}" class="download-btn">دانلود مستقیم کتاب</a>`;
  } else if (type === 'movie') {
    postData.director = document.getElementById('movieDirector').value;
    postData.year = document.getElementById('movieYear').value;
    postData.quality = document.getElementById('movieQuality').value;
    postData.content = `<p>کارگردان: ${postData.director}</p><p>سال: ${postData.year}</p><p>کیفیت: ${postData.quality}</p>${document.getElementById('movieEmbed').value}<br><a href="${document.getElementById('movieDownloadLink').value}" class="download-btn">دانلود فیلم</a>`;
  } else if (type === 'mod') {
    postData.game = document.getElementById('modGame').value;
    const directLink = getDirectDriveLink(document.getElementById('modDriveLink').value);
    postData.content = `<p>بازی: ${postData.game}</p><p>نکات: ${document.getElementById('modNotes').value}</p><a href="${directLink}" class="download-btn">دانلود مود</a>`;
  } else if (type === 'article') {
    postData.content = document.getElementById('articleHtmlContent').value;
  }

  // فرستادن به API
  try {
    const response = await fetch('/api/update-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postData, filePath: 'posts.json' })
    });

    if (response.ok) {
      statusMessage.textContent = 'دمت گرم! پست با موفقیت ثبت شد.';
      statusMessage.className = 'status-box success';
      document.getElementById('postForm').reset();
    } else {
      throw new Error('خطا در ثبت پست!');
    }
  } catch (error) {
    statusMessage.textContent = 'یه مشکلی پیش اومد دادا: ' + error.message;
    statusMessage.className = 'status-box error';
  } finally {
    submitBtn.disabled = false;
  }
});
