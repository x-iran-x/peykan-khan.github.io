// /api/update-post.js
export default async function handler(req, res) {
  // ۱. چک کردن اینکه حتماً متد POST باشه
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'دادا! این یه API هست، فقط با متد POST کار می‌کنه.' });
  }

  const { postData, filePath } = req.body; 
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  
  // ۲. اینجا اسم دقیق ریپازیتوری خودت رو گذاشتم
  const GITHUB_REPO = "peykan-khan/peykan-khan.github.io"; 

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'توکن گیت‌هاب پیدا نشد! برو Vercel چک کن دادا.' });
  }

  try {
    // ۳. گرفتن محتوای فعلی فایل از گیت‌هاب
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });

    if (!response.ok) {
      throw new Error(`خطا در پیدا کردن فایل: ${response.statusText}`);
    }

    const fileData = await response.json();
    // تبدیل محتوای base64 به متن قابل فهم
    const currentContent = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf-8'));

    // ۴. اضافه کردن پست جدید به آرایه پست‌ها
    currentContent.push(postData);

    // ۵. آپدیت کردن فایل در گیت‌هاب با استفاده از SHA (برای اینکه گیت‌هاب قبول کنه)
    await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`, {
      method: 'PUT',
      headers: { 
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Peykan Khan Panel: Add new post',
        content: Buffer.from(JSON.stringify(currentContent, null, 2)).toString('base64'),
        sha: fileData.sha // این خیلی مهمه، وگرنه گیت‌هاب اجازه آپدیت نمی‌ده
      })
    });

    res.status(200).json({ message: 'ایول! پست با موفقیت توی گیت‌هاب ثبت شد.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
