export default async function handler(req, res) {
  // تنظیم هدرهای CORS برای ارتباط با فرانت‌اند
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return res.status(500).json({ error: 'تنظیمات دیتابیس در ورسل کامل نیست!' });
  }

  // تابع کمکی برای اجرای دستورات Redis از طریق REST API
  async function redisCommand(command, ...args) {
    const url = `${UPSTASH_URL}/${command}/${args.map(encodeURIComponent).join('/')}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
      },
    });
    return await response.json();
  }

  const { action, postId } = req.method === 'GET' ? req.query : req.body;

  if (!postId) {
    return res.status(400).json({ error: 'شناسه پست مشخص نیست!' });
  }

  const likesKey = `post:${postId}:likes`;
  const commentsKey = `post:${postId}:comments`;

  try {
    // ۱. دریافت اطلاعات لایک و کامنت‌ها (GET)
    if (req.method === 'GET') {
      const likesRes = await redisCommand('get', likesKey);
      const commentsRes = await redisCommand('lrange', commentsKey, '0', '-1');

      const likes = likesRes.result ? parseInt(likesRes.result, 10) : 0;
      const comments = commentsRes.result ? commentsRes.result.map((c) => JSON.parse(c)) : [];

      return res.status(200).json({ likes, comments });
    }

    // ۲. ثبت لایک یا کامنت (POST)
    if (req.method === 'POST') {
      if (action === 'like') {
        const newLikes = await redisCommand('incr', likesKey);
        return res.status(200).json({ success: true, likes: newLikes.result });
      }

      if (action === 'comment') {
        const { author, text } = req.body;
        if (!author || !text) {
          return res.status(400).json({ error: 'نام و متن نظر الزامی است.' });
        }

        const newComment = {
          id: Date.now().toString(),
          author: author.trim().slice(0, 50),
          text: text.trim().slice(0, 500),
          date: new Date().toLocaleDateString('fa-IR'),
        };

        // اضافه کردن کامنت به انتهای لیست در ردیس
        await redisCommand('rpush', commentsKey, JSON.stringify(newComment));
        return res.status(200).json({ success: true, comment: newComment });
      }

      return res.status(400).json({ error: 'عملیات نامعتبر است.' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Redis Error:', error);
    return res.status(500).json({ error: 'خطای سرور ردیس' });
  }
}
