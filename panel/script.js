// /panel/script.js

// ۱. مدیریت نمایش فیلدهای هر نوع پست
document.getElementById('postType').addEventListener('change', function() {
  const type = this.value;
  document.querySelectorAll('.type-fields').forEach(div => div.style.display = 'none');
  const targetField = document.getElementById(type + 'Fields');
  if (targetField) targetField.style.display = 'block';
});

// ۲. تابع تبدیل لینک گوگل‌درایو به لینک دانلود مستقیم
function getDirectDriveLink(url) {
  if (!url) return '';
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return url;
}

// ۳. ارسال اطلاعات به API
document.getElementById('postForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const submitBtn = document.getElementById('submitBtn');
  const statusMessage = document.getElementById('statusMessage');
  const type = document.getElementById('postType').value;
  
  // استخراج دسته‌بندی بر اساس نوع انتخابی
  let selectedCategory = '';
  const categoryElem = document.getElementById(`${type}Category`);
  if (categoryElem) {
    selectedCategory = categoryElem.value;
  }

  // اگر دسته‌بندی انتخاب نشده بود، اجازه ثبت نمیده!
  if (!selectedCategory) {
    statusMessage.textContent = 'دادا لطفاً اول دسته‌بندی پست رو مشخص کن!';
    statusMessage.className = 'status-box error';
    return;
  }

  submitBtn.disabled = true;
  statusMessage.textContent = 'در حال ثبت پست... لطفاً صبر کن دادا!';
  statusMessage.className = 'status-box';

  // ساخت آبجکت پایه پست با رعایت فیلد category
  let postData = {
    id: Date.now(),
    title: document.getElementById('title').value,
    type: type,
    category: selectedCategory,
    date: document.getElementById('date').value,
    description: document.getElementById('description').value
  };

  try {
    if (type === 'book') {
      const author = document.getElementById('bookAuthor').value;
      const translator = document.getElementById('bookTranslator').value;
      const password = document.getElementById('bookPassword').value;
      const about = document.getElementById('bookAbout') ? document.getElementById('bookAbout').value : '';
      const directLink = getDirectDriveLink(document.getElementById('bookDriveLink').value);
      
      postData.content = `<p>درباره کتاب: ${about}</p><p>مشخصات: نویسنده ${author} - مترجم ${translator}</p><p>رمز فایل: ${password}</p><a href="${directLink}" class="download-btn">دانلود مستقیم کتاب</a>`;
    } else if (type === 'movie') {
      const director = document.getElementById('movieDirector').value;
      const year = document.getElementById('movieYear').value;
      const quality = document.getElementById('movieQuality').value;
      const embed = document.getElementById('movieEmbed') ? document.getElementById('movieEmbed').value : '';
      const downloadLink = document.getElementById('movieDownloadLink') ? document.getElementById('movieDownloadLink').value : '';
      
      postData.content = `<p>کارگردان: ${director}</p><p>سال: ${year}</p><p>کیفیت: ${quality}</p>${embed}<br><a href="${downloadLink}" class="download-btn">دانلود فیلم</a>`;
    } else if (type === 'mod') {
      const game = document.getElementById('modGame').value;
      const notes = document.getElementById('modNotes') ? document.getElementById('modNotes').value : '';
      const directLink = getDirectDriveLink(document.getElementById('modDriveLink').value);
      
      postData.content = `<p>بازی: ${game}</p><p>نکات: ${notes}</p><a href="${directLink}" class="download-btn">دانلود مود</a>`;
    } else if (type === 'article') {
      postData.content = document.getElementById('articleHtmlContent').value;
    }

    // ارسال به API ورسل
    const response = await fetch('https://peykan-khan-github-io.vercel.app/api/update-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postData, filePath: 'posts.json' })
    });

    if (response.ok) {
      statusMessage.textContent = 'دمت گرم دادا! پست با دسته‌بندی معتبر با موفقیت ثبت شد.';
      statusMessage.className = 'status-box success';
      document.getElementById('postForm').reset();
      // برگرداندن نمایش فرم به حالت اولیه
      document.querySelectorAll('.type-fields').forEach(div => div.style.display = 'none');
    } else {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error || errorData.message || (await response.text());
      statusMessage.textContent = `خطای سرور (${response.status}): ${errorMsg}`;
      statusMessage.className = 'status-box error';
    }
  } catch (error) {
    statusMessage.textContent = 'خطای سیستمی: ' + error.message;
    statusMessage.className = 'status-box error';
  } finally {
    submitBtn.disabled = false;
  }
});
