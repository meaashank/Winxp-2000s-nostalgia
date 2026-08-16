import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API 1: Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // API 2: Real live web search endpoint for IE6 Google / Search Bar
  app.get('/api/search', async (req, res) => {
    try {
      const q = (req.query.q as string || '').trim();
      if (!q) {
        return res.json({ results: [] });
      }

      const results: Array<{ title: string; url: string; snippet: string }> = [];

      // 1. Fetch Wikipedia live search matches
      try {
        const wikiRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
            q
          )}&format=json&origin=*&utf8=1&srlimit=6`,
          { headers: { 'User-Agent': 'MidnightCyberCafe/1.0 (Windows XP 2004 IE6)' } }
        );
        if (wikiRes.ok) {
          const wikiData = await wikiRes.json();
          if (wikiData?.query?.search) {
            for (const item of wikiData.query.search) {
              const cleanSnippet = item.snippet
                .replace(/<[^>]*>?/gm, '')
                .replace(/&quot;/g, '"')
                .replace(/&amp;/g, '&')
                .replace(/&#039;/g, "'");
              results.push({
                title: `${item.title} - Wikipedia`,
                url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`,
                snippet: cleanSnippet + '...',
              });
            }
          }
        }
      } catch (err) {
        console.warn('Wikipedia search error:', err);
      }

      // 2. Fetch DuckDuckGo instant search / topics
      try {
        const ddgRes = await fetch(
          `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1&skip_disambig=0`,
          { headers: { 'User-Agent': 'MidnightCyberCafe/1.0 (Windows XP 2004 IE6)' } }
        );
        if (ddgRes.ok) {
          const ddgData = await ddgRes.json();
          if (ddgData.AbstractText && ddgData.AbstractURL) {
            results.unshift({
              title: ddgData.Heading || q,
              url: ddgData.AbstractURL,
              snippet: ddgData.AbstractText,
            });
          }

          if (Array.isArray(ddgData.RelatedTopics)) {
            for (const topic of ddgData.RelatedTopics.slice(0, 5)) {
              if (topic.Text && topic.FirstURL) {
                results.push({
                  title: topic.Text.split(' - ')[0] || topic.Text.slice(0, 40),
                  url: topic.FirstURL,
                  snippet: topic.Text,
                });
              }
            }
          }
        }
      } catch (err) {
        console.warn('DuckDuckGo search error:', err);
      }

      // Fallback if no direct API results
      if (results.length === 0) {
        results.push({
          title: `${q} - Wikipedia Search`,
          url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(q)}`,
          snippet: `Search Wikipedia encyclopedia entries for "${q}".`,
        });
        results.push({
          title: `Wiby Search: ${q} (Retro Web Index)`,
          url: `https://wiby.me/?q=${encodeURIComponent(q)}`,
          snippet: `Search the classic, indie, and nostalgic web on the Wiby engine for "${q}".`,
        });
        results.push({
          title: `FrogFind 2004 Search: ${q}`,
          url: `http://frogfind.com/?q=${encodeURIComponent(q)}`,
          snippet: `Vintage computer search results for "${q}" converted to lightweight HTML.`,
        });
      }

      res.json({ results });
    } catch (error: any) {
      console.error('Search endpoint error:', error);
      res.status(500).json({ error: error.message || 'Search failed' });
    }
  });

  // API 3: Web proxy endpoint to load live websites inside 2004 IE6 frame
  app.get('/api/proxy', async (req, res) => {
    try {
      let targetUrl = req.query.url as string;
      if (!targetUrl) {
        return res.status(400).send('Missing target url');
      }

      if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = `https://${targetUrl}`;
      }

      const parsedTarget = new URL(targetUrl);

      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent':
            'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
      });

      const contentType = response.headers.get('content-type') || 'text/html';

      // Set headers on our response, explicitly omitting framing restrictions
      res.setHeader('Content-Type', contentType);
      res.removeHeader('X-Frame-Options');
      res.removeHeader('Content-Security-Policy');
      res.setHeader('Access-Control-Allow-Origin', '*');

      if (contentType.includes('text/html')) {
        let html = await response.text();

        // Inject <base> tag so relative CSS/images resolve correctly
        const baseTag = `<base href="${targetUrl}">`;
        if (html.includes('<head>')) {
          html = html.replace('<head>', `<head>${baseTag}`);
        } else if (html.includes('<HEAD>')) {
          html = html.replace('<HEAD>', `<HEAD>${baseTag}`);
        } else {
          html = `${baseTag}${html}`;
        }

        // Inject script to intercept links and notify parent 2004 IE6 window
        const scriptInjection = `
<script>
  document.addEventListener('click', function(e) {
    var target = e.target.closest('a');
    if (target && target.href && !target.href.startsWith('javascript:')) {
      e.preventDefault();
      try {
        window.parent.postMessage({ type: 'IE_NAVIGATE', url: target.href }, '*');
      } catch(err) {}
      window.location.href = '/api/proxy?url=' + encodeURIComponent(target.href);
    }
  }, true);
</script>
`;
        if (html.includes('</body>')) {
          html = html.replace('</body>', `${scriptInjection}</body>`);
        } else {
          html = `${html}${scriptInjection}`;
        }

        return res.send(html);
      } else {
        // Stream non-HTML assets (images, css, etc.)
        const buffer = await response.arrayBuffer();
        return res.send(Buffer.from(buffer));
      }
    } catch (error: any) {
      console.error('Proxy error:', error);
      res.status(500).send(`
        <html>
          <head><title>Internet Explorer - Cannot display the webpage</title></head>
          <body style="font-family: Tahoma, Arial, sans-serif; font-size: 12px; background: #fff; padding: 20px;">
            <div style="color: #003399; font-size: 16px; font-weight: bold; margin-bottom: 10px;">
              The page cannot be displayed
            </div>
            <p>The page you are looking for is currently unavailable. The Web site might be experiencing technical difficulties, or you may need to adjust your browser settings.</p>
            <p><strong>Attempted URL:</strong> ${req.query.url}</p>
            <p style="color: #666; font-size: 11px;">Error details: ${error.message || 'Connection timeout or invalid domain'}</p>
            <hr style="border: 0; border-top: 1px solid #d4d0c8; margin: 15px 0;">
            <button onclick="window.history.back()" style="padding: 4px 10px; font-size: 11px; cursor: pointer;">Back</button>
            <button onclick="window.location.reload()" style="padding: 4px 10px; font-size: 11px; cursor: pointer; margin-left: 8px;">Refresh</button>
          </body>
        </html>
      `);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Midnight Cyber Café Server running on http://localhost:${PORT}`);
  });
}

startServer();
