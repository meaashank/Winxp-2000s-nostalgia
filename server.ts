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

      const results: Array<{ title: string; url: string; snippet: string; source?: string }> = [];

      // 1. Fetch Wikipedia live search matches
      try {
        const wikiRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
            q
          )}&format=json&origin=*&utf8=1&srlimit=7`,
          {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) MidnightCyberCafe/2.0',
            },
          }
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
                source: 'Wikipedia',
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
          {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) MidnightCyberCafe/2.0',
            },
          }
        );
        if (ddgRes.ok) {
          const ddgData = await ddgRes.json();
          if (ddgData.AbstractText && ddgData.AbstractURL) {
            results.unshift({
              title: ddgData.Heading || q,
              url: ddgData.AbstractURL,
              snippet: ddgData.AbstractText,
              source: 'Instant Answer',
            });
          }

          if (Array.isArray(ddgData.RelatedTopics)) {
            for (const topic of ddgData.RelatedTopics.slice(0, 6)) {
              if (topic.Text && topic.FirstURL) {
                results.push({
                  title: topic.Text.split(' - ')[0] || topic.Text.slice(0, 45),
                  url: topic.FirstURL,
                  snippet: topic.Text,
                  source: 'Web Index',
                });
              }
            }
          }
        }
      } catch (err) {
        console.warn('DuckDuckGo search error:', err);
      }

      // 3. Fallback / curated retro & encyclopedia search destinations
      if (results.length === 0) {
        results.push({
          title: `${q} - Wikipedia Encyclopedia`,
          url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(q)}`,
          snippet: `Search real-time encyclopedic entries and articles for "${q}".`,
          source: 'Wikipedia',
        });
        results.push({
          title: `Wiby Search: "${q}" (Indie & Classic Web Index)`,
          url: `https://wiby.me/?q=${encodeURIComponent(q)}`,
          snippet: `Search classic, lightweight, and independent web pages for "${q}".`,
          source: 'Wiby Engine',
        });
        results.push({
          title: `FrogFind 2004 View: "${q}"`,
          url: `http://frogfind.com/?q=${encodeURIComponent(q)}`,
          snippet: `Ultra-fast text-friendly browser view of internet search results for "${q}".`,
          source: 'FrogFind',
        });
      }

      res.json({ results });
    } catch (error: any) {
      console.error('Search endpoint error:', error);
      res.status(500).json({ error: error.message || 'Search failed' });
    }
  });

  // API 3: Live trending headlines and feeds for the browser homepage
  app.get('/api/live-feed', async (req, res) => {
    try {
      const items: Array<{ title: string; url: string; category: string; source: string }> = [];

      // Hacker News Top Stories
      try {
        const hnTopRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        if (hnTopRes.ok) {
          const storyIds: number[] = await hnTopRes.json();
          const topIds = storyIds.slice(0, 5);
          for (const id of topIds) {
            const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            if (storyRes.ok) {
              const story = await storyRes.json();
              if (story && story.title) {
                items.push({
                  title: story.title,
                  url: story.url || `https://news.ycombinator.com/item?id=${id}`,
                  category: 'Tech News',
                  source: 'Hacker News',
                });
              }
            }
          }
        }
      } catch (err) {
        console.warn('HN feed fetch error:', err);
      }

      // Default curated active feeds if offline or rate-limited
      if (items.length < 3) {
        items.push(
          {
            title: 'Wikipedia: Today\'s Featured Articles & Discoveries',
            url: 'https://en.wikipedia.org/wiki/Main_Page',
            category: 'Encyclopedia',
            source: 'Wikipedia',
          },
          {
            title: 'Wiby: Search Engine for the Classic Web',
            url: 'https://wiby.me',
            category: 'Retro Web',
            source: 'Wiby',
          },
          {
            title: 'Hacker News: Real-Time Technology & Programming',
            url: 'https://news.ycombinator.com',
            category: 'Tech',
            source: 'Y Combinator',
          },
          {
            title: 'FrogFind: The Vintage Computer Friendly Search Engine',
            url: 'http://frogfind.com',
            category: 'Fast Search',
            source: 'FrogFind',
          }
        );
      }

      res.json({ items });
    } catch (error: any) {
      console.error('Live feed error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // API 4: Live Web Reader / Text Extraction Endpoint
  app.get('/api/reader', async (req, res) => {
    try {
      let targetUrl = req.query.url as string;
      if (!targetUrl) {
        return res.status(400).send('Missing url parameter');
      }

      if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = `https://${targetUrl}`;
      }

      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });

      const rawHtml = await response.text();

      // Extract basic title, headings, paragraphs, and links
      const titleMatch = rawHtml.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : targetUrl;

      // Clean HTML tags for reader mode
      let cleanContent = rawHtml
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '')
        .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
        .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '');

      // Grab main article / body content
      const bodyMatch = cleanContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      const bodyHtml = bodyMatch ? bodyMatch[1] : cleanContent;

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>${title} - IE6 Reader Mode</title>
            <style>
              body {
                font-family: Tahoma, Verdana, Arial, sans-serif;
                font-size: 13px;
                line-height: 1.6;
                color: #222;
                background: #fdfdfd;
                max-width: 760px;
                margin: 0 auto;
                padding: 20px;
              }
              header {
                border-bottom: 2px solid #003399;
                padding-bottom: 12px;
                margin-bottom: 20px;
              }
              h1 {
                font-size: 20px;
                color: #003399;
                margin: 0 0 6px 0;
              }
              .url-meta {
                font-size: 11px;
                color: #666;
                font-family: monospace;
              }
              .reader-banner {
                background: #eef3fa;
                border: 1px solid #c0d4ec;
                padding: 8px 12px;
                font-size: 11px;
                color: #003366;
                margin-bottom: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
              }
              a {
                color: #0000cc;
              }
              p {
                margin: 0 0 14px 0;
              }
              img {
                max-width: 100%;
                height: auto;
                border: 1px solid #ccc;
              }
            </style>
          </head>
          <body>
            <div class="reader-banner">
              <span>📖 <strong>Internet Explorer Fast Reader</strong>: Displaying article content for <code>${targetUrl}</code></span>
              <a href="/api/proxy?url=${encodeURIComponent(targetUrl)}" style="font-weight: bold;">[Switch to Raw Live View]</a>
            </div>
            <header>
              <h1>${title}</h1>
              <div class="url-meta">Source: <a href="/api/proxy?url=${encodeURIComponent(targetUrl)}">${targetUrl}</a></div>
            </header>
            <main>
              ${bodyHtml}
            </main>
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
          </body>
        </html>
      `);
    } catch (err: any) {
      res.status(500).send(`Failed to parse article: ${err.message}`);
    }
  });

  // API 5: Web proxy endpoint to load live websites inside 2004 IE6 frame
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
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Upgrade-Insecure-Requests': '1',
        },
      });

      const contentType = response.headers.get('content-type') || 'text/html';

      // Set headers on our response, explicitly stripping framing and security restrictions
      res.setHeader('Content-Type', contentType);
      res.removeHeader('X-Frame-Options');
      res.removeHeader('Content-Security-Policy');
      res.removeHeader('Cross-Origin-Embedder-Policy');
      res.removeHeader('Cross-Origin-Opener-Policy');
      res.removeHeader('Cross-Origin-Resource-Policy');
      res.setHeader('Access-Control-Allow-Origin', '*');

      if (contentType.includes('text/html')) {
        let html = await response.text();

        // Inject <base> tag so relative CSS, fonts, and images resolve correctly
        const baseTag = `<base href="${targetUrl}">`;
        if (html.includes('<head>')) {
          html = html.replace('<head>', `<head>${baseTag}`);
        } else if (html.includes('<HEAD>')) {
          html = html.replace('<HEAD>', `<HEAD>${baseTag}`);
        } else {
          html = `${baseTag}${html}`;
        }

        // Inject robust link and form submission interceptor script
        const scriptInjection = `
<script>
  // 1. Intercept all link clicks and keep them inside our proxy
  document.addEventListener('click', function(e) {
    var target = e.target.closest('a');
    if (target && target.href && !target.href.startsWith('javascript:')) {
      e.preventDefault();
      var dest = target.href;
      try {
        window.parent.postMessage({ type: 'IE_NAVIGATE', url: dest }, '*');
      } catch(err) {}
      window.location.href = '/api/proxy?url=' + encodeURIComponent(dest);
    }
  }, true);

  // 2. Intercept search and navigation form submissions
  document.addEventListener('submit', function(e) {
    var form = e.target;
    if (form && form.action) {
      var method = (form.method || 'GET').toUpperCase();
      if (method === 'GET') {
        e.preventDefault();
        var formData = new FormData(form);
        var actionUrl = new URL(form.action, document.baseURI || window.location.href);
        var params = new URLSearchParams(formData);
        var finalUrl = actionUrl.origin + actionUrl.pathname + (params.toString() ? '?' + params.toString() : '');
        try {
          window.parent.postMessage({ type: 'IE_NAVIGATE', url: finalUrl }, '*');
        } catch(err) {}
        window.location.href = '/api/proxy?url=' + encodeURIComponent(finalUrl);
      }
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
        <!DOCTYPE html>
        <html>
          <head><title>Internet Explorer - Cannot display the webpage</title></head>
          <body style="font-family: Tahoma, Arial, sans-serif; font-size: 12px; background: #fff; padding: 20px; color: #111;">
            <div style="color: #003399; font-size: 16px; font-weight: bold; margin-bottom: 10px;">
              The page cannot be displayed
            </div>
            <p>The page you are looking for is currently unavailable or returned a connection error. You can try viewing it in Reader Mode or opening it in a new window.</p>
            <p><strong>Attempted URL:</strong> <code>${req.query.url}</code></p>
            <p style="color: #666; font-size: 11px;">Error details: ${error.message || 'Connection timeout or invalid domain'}</p>
            <hr style="border: 0; border-top: 1px solid #d4d0c8; margin: 15px 0;">
            <div style="display: flex; gap: 8px;">
              <a href="/api/reader?url=${encodeURIComponent(req.query.url as string)}" style="display: inline-block; padding: 5px 12px; background: #003399; color: #fff; text-decoration: none; font-size: 11px; border-radius: 2px;">📖 Try Reader Mode</a>
              <button onclick="window.location.reload()" style="padding: 5px 12px; font-size: 11px; cursor: pointer;">Refresh</button>
              <button onclick="window.history.back()" style="padding: 5px 12px; font-size: 11px; cursor: pointer;">Back</button>
            </div>
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
