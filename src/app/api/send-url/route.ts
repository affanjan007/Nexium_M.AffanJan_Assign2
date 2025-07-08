import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
    }

    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

    if (!N8N_WEBHOOK_URL) {
      return NextResponse.json({ error: 'N8N_WEBHOOK_URL not set in .env.local' }, { status: 500 });
    }

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0' // optional but helps with some blogs
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('n8n Webhook Error:', errorText);
      return NextResponse.json({
        error: 'Failed to send request to n8n webhook',
        details: errorText,
      }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({
      error: 'Internal Server Error',
      message: (error as Error).message,
    }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: true,
    externalResolver: true,
  },
};
