// /api/update-post.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'فقط متد POST مجازه دادا!' });

  const { postData, filePath } = req.body; // postData همون دیتای جدیدته
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = "peykan-khan/peykan-khan.github.io"; // اسم ریپو خودت رو اینجا بزن

  try {
    // ۱. گرفتن محتوای فعلی فایل از گیت‌هاب
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    const fileData = await response.json();
    const currentContent = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf-8'));

    // ۲. اضافه کردن پست جدید به آرایه پست‌ها
    currentContent.push(postData);

    // ۳. آپدیت کردن فایل در گیت‌هاب
    await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`, {
      method: 'PUT',
      headers: { 
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Add new post from panel',
        content: Buffer.from(JSON.stringify(currentContent, null, 2)).toString('base64'),
        sha: fileData.sha
      })
    });

    res.status(200).json({ message: 'دمت گرم! پست با موفقیت ثبت شد.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
