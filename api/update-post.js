export default async function handler(req, res) {
  // ۱. تنظیمات دسترسی برای اینکه مرورگر اجازه بده از گیت‌هاب به ورسل درخواست بفرستی
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ۲. جواب دادن به درخواستِ "پیش‌پرواز" (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ۳. حالا چک کردن اینکه حتماً متد POST باشه
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'دادا! این یه API هست، فقط با متد POST کار می‌کنه.' });
  }

  const { postData, filePath } = req.body; 
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = "peykan-khan/peykan-khan.github.io"; 

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'توکن گیت‌هاب پیدا نشد!' });
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });

    if (!response.ok) {
      throw new Error(`خطا در پیدا کردن فایل: ${response.statusText}`);
    }

    const fileData = await response.json();
    const currentContent = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf-8'));

    currentContent.push(postData);

    await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`, {
      method: 'PUT',
      headers: { 
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Peykan Khan Panel: Add new post',
        content: Buffer.from(JSON.stringify(currentContent, null, 2)).toString('base64'),
        sha: fileData.sha 
      })
    });

    res.status(200).json({ message: 'ایول! پست با موفقیت ثبت شد.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
