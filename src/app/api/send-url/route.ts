import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

function extractBlogContent(html: string): { content: string; title: string } {
  const $ = cheerio.load(html);
  
  $('script, style, nav, header, footer, aside, .advertisement, .ads, .sidebar, .comments, .comment, .social-share, .related-posts, .newsletter, .popup, .modal').remove();
  
  const contentSelectors = [
    'article',
    '.post-content',
    '.entry-content',
    '.content',
    'main',
    '.post',
    '.article-content',
    '.blog-content',
    '.post-body',
    '.entry-body',
    '[role="main"]',
    '.container .content',
    '.main-content',
    '.post-text',
    '.article-body',
    '.content-body',
    '.entry-text',
    '.post-entry',
    '.article-inner',
    '.blog-post'
  ];
  
  let content = '';
  const title = $('title').text().trim() || 
                $('h1').first().text().trim() || 
                $('.post-title').text().trim() ||
                $('.entry-title').text().trim() ||
                $('.article-title').text().trim() ||
                'Blog Post';
  
  for (const selector of contentSelectors) {
    const element = $(selector);
    if (element.length > 0) {
      content = element.text().trim();
      if (content.length > 300) {
        break;
      }
    }
  }
  
  if (!content || content.length < 300) {
    content = $('body').text().trim();
  }
  
  content = content
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .replace(/[^\w\s\.\,\!\?\;\:\-\(\)\[\]\{\}\"\']/g, '')
    .trim();
  
  if (content.length > 10000) {
    content = content.substring(0, 10000) + '...';
  }
  
  return { content, title };
}

async function generateEnglishSummary(content: string, title: string): Promise<string> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const prompt = `Please provide a comprehensive and well-structured summary of the following blog post. Make it informative, engaging, and capture the key points and main ideas:

Title: ${title}

Content: ${content}

Please provide a clear, concise summary in 4-6 sentences that covers the main points, key insights, and important details from the blog post.`;

  const maxRetries = 3;
  let attempt = 0;
  let lastError: unknown = null;

  while (attempt < maxRetries) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status >= 500 || response.status === 429) {
          throw new Error(`Temporary server error: ${response.status} - ${errorText}`);
        }
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const summary = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!summary) {
        throw new Error('No summary generated from Gemini API');
      }

      return summary.trim();
    } catch (error: unknown) {
      lastError = error;
      attempt++;
      if (attempt < maxRetries) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`Retrying English summary generation (attempt ${attempt + 1}) due to error:`, message);
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  const finalMessage = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`Failed to generate English summary after ${maxRetries} attempts. Last error: ${finalMessage}`);
}

async function translateToUrdu(englishSummary: string): Promise<string> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const prompt = `Please translate the following English text into clear, natural, and fluent Urdu. Make sure the translation maintains the meaning and tone of the original text:

English Text:
${englishSummary}

Please provide a natural Urdu translation that reads well and conveys the same information effectively.`;

  const maxRetries = 3;
  let attempt = 0;
  let lastError: unknown = null;

  while (attempt < maxRetries) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status >= 500 || response.status === 429) {
          throw new Error(`Temporary server error: ${response.status} - ${errorText}`);
        }
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const translation = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!translation) {
        throw new Error('No Urdu translation generated from Gemini API');
      }

      return translation.trim();
    } catch (error: unknown) {
      lastError = error;
      attempt++;
      if (attempt < maxRetries) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`Retrying Urdu translation (attempt ${attempt + 1}) due to error:`, message);
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  const finalMessage = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`Failed to translate to Urdu after ${maxRetries} attempts. Last error: ${finalMessage}`);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 });
    }

    let validatedUrl: URL;
    try {
      validatedUrl = new URL(url);
      if (!['http:', 'https:'].includes(validatedUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch {
      return NextResponse.json({ error: 'Invalid URL format. Please provide a valid HTTP or HTTPS URL.' }, { status: 400 });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    let html: string;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Cache-Control': 'max-age=0',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      html = await response.text();
    } catch (fetchError) {
      clearTimeout(timeoutId);
      const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error';
      return NextResponse.json({
        error: 'Failed to fetch blog content',
        details: errorMessage.includes('AbortError') ? 'Request timeout - the URL took too long to respond' : errorMessage,
      }, { status: 500 });
    }

    const { content, title } = extractBlogContent(html);
    
    if (content.length < 100) {
      return NextResponse.json({
        error: 'Content too short or not extractable',
        details: 'The blog content could not be properly extracted. Please ensure the URL points to a valid blog post.',
      }, { status: 400 });
    }

    let englishSummary: string;
    try {
      englishSummary = await generateEnglishSummary(content, title);
    } catch (summaryError) {
      const errorMessage = summaryError instanceof Error ? summaryError.message : 'Unknown error';
      return NextResponse.json({
        error: 'Failed to generate English summary',
        details: errorMessage,
      }, { status: 500 });
    }

    let urduSummary: string;
    try {
      urduSummary = await translateToUrdu(englishSummary);
    } catch (translationError) {
      const errorMessage = translationError instanceof Error ? translationError.message : 'Unknown error';
      return NextResponse.json({
        error: 'Failed to translate to Urdu',
        details: errorMessage,
      }, { status: 500 });
    }

    let savedSummary = null;
    let databaseStatus = 'failed';
    try {
      savedSummary = await prisma.summary.create({
        data: {
          url: url,
          title: title,
          englishSummary: englishSummary,
          urduSummary: urduSummary,
        },
      });
      databaseStatus = 'success';
      console.log('Summary saved successfully:', savedSummary.id);
    } catch (dbError) {
      console.error('Database error:', dbError);
      databaseStatus = 'failed';
    }

    const result = {
      success: true,
      originalUrl: url,
      title: title,
      englishSummary: englishSummary,
      urduSummary: urduSummary,
      savedToDatabase: savedSummary ? true : false,
      databaseStatus: databaseStatus,
      summaryId: savedSummary?.id || null,
      metadata: {
        contentLength: content.length,
        processingTime: new Date().toISOString(),
      }
    };

    return NextResponse.json(result);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({
      error: 'Internal Server Error',
      message: errorMessage,
      timestamp: new Date().toISOString(),
      stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined,
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed. Use POST instead.' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed. Use POST instead.' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed. Use POST instead.' }, { status: 405 });
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    responseLimit: '8mb',
  },
};