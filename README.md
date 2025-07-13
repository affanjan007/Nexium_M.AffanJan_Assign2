Blog Summarizer with English Summary + Urdu Translation

This project is a full-stack application that extracts, summarizes, and translates blog content using Google Gemini and stores results in Supabase and MongoDB.

Features:
* Blog URL input → Extracts full blog content using `n8n` scraping.
* English Summary → Generated using Google Gemini API.
* Urdu Translation → Summary translated to fluent Urdu using Gemini.
* Storage:
  * Supabase PostgreSQL → Stores summaries (URL, title, summaries).
  * MongoDB → Stores full raw extracted blog text.


Tech Stack:
* Frontend: Next.js 14 (App Router)
* Backend: Node.js + Prisma 
* Language Model: Google Gemini API
* Scraping Workflow: n8n.io
* Databases:
  * Supabase – PostgreSQL for structured summary storage
  * MongoDB Atlas – For full blog content


How It Works:
1. You enter a blog URL in the frontend.
2. `n8n` scrapes the blog page and returns the HTML.
3. The extracted content is sent to Google Gemini for summarization.
4. The English summary is translated into Urdu using Gemini again.
5. Results are saved:
   * English + Urdu summaries → Supabase
   * Full blog content → MongoDB


How to Run:

1.  Start `n8n` locally

Make sure you have [n8n](https://n8n.io/) installed.

n8n start

> Runs at: [http://localhost:5678](http://localhost:5678)

Ensure your scraping workflow is active and working.

2. Start your Next.js App

Install dependencies:

npm install

Start development server:

npm run dev

> Runs at: [http://localhost:3000](http://localhost:3000)


Environment Variables:
Create a `.env` file and add:
GEMINI_API_KEY=your_google_gemini_api_key
DATABASE_URL=your_supabase_postgres_url
MONGODB_URI=your_mongo_connection_string


Project Structure:
/app/api/send-url/route.ts      → Main API logic
/lib/quotes.ts                  → Quote fetching (if any)
/components/QuoteDisplay.tsx    → Display summaries
/prisma/schema.prisma           → Supabase DB schema

