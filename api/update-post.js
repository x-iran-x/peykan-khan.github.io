export default async function handler(req, res) {
  // ۱. تنظیمات دسترسی (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'فقط متد POST قبوله دادا!' });
  }

  const { postData, filePath } = req.body; 
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  
  // این همون آدرسِ صحیح ریپازیتوریِ تو که توی عکس دیدم:
  const GITHUB_REPO = "x-iran-x/peykan-khan.github.io"; 

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'توکن گیت‌هاب پیدا نشد!' });
  }

  try {
    // گرفتنِ محتوای فعلی فایل
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`, {
      headers: { 
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error(`خطا در پیدا کردن فایل: ${response.statusText} (مطمئن شو مسیرِ فایل درسته)`);
    }

    const fileData = await response.json();
    const currentContent = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf-8'));

    // اضافه کردن پست جدید
    currentContent.push(postData);

    // آپدیت کردن فایل
    await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
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
