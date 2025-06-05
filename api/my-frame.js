// File: api/my-frame.js
export default function handler(req, res) {
  const appUrl = "https://warpcast-to-farcaster.vercel.app/"; // Aapke Mini App ka URL
  const imageUrl = "https://warpcast-to-farcaster.vercel.app/og.png"; // Aapke Frame ki image ka URL

  // Agar aap doosra button (Share This Frame) abhi nahi banana chahte,
  // toh button2_meta aur post_url_meta wali lines ko hata sakte hain.
  // Ya button 2 ko bhi action="link" de sakte hain.
  const button2_meta = `
    <meta property="fc:frame:button:2" content="Share This Frame" />
    <meta property="fc:frame:button:2:action" content="post_redirect" />`;
  const post_url_meta = `<meta property="fc:frame:post_url" content="https://warpcast-to-farcaster.vercel.app/api/redirect-to-share" />`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="og:title" content="WTF Frame" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${imageUrl}" />
        <meta property="fc:frame:button:1" content="Open WTF Mini App" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="${appUrl}" />
        ${button2_meta} {/* Button 2 ke meta tags yahan daale */}
        ${post_url_meta} {/* Post URL yahan daala (agar button 2 post/post_redirect action ka hai) */}
        {/* Agar sirf ek hi button (Open Mini App) rakhna hai, toh upar ke button2_meta aur post_url_meta wali lines aur unke reference hata dein */}
      </head>
      <body>
        <h1>This is a Farcaster Frame. View it on a Farcaster client.</h1>
        <p>Or <a href="${appUrl}">open the Mini App directly</a>.</p>
      </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
