# Amy Yuan - Personal Website

A minimalist personal website with an AI-powered chat interface.

## Features

- **Modern Design**: Dark theme with elegant typography and subtle animations
- **AI Chat**: Powered by Vercel AI SDK and OpenAI
- **Responsive**: Works beautifully on all devices
- **Fast**: Built with Next.js 15 and optimized for performance

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [Tailwind CSS 4](https://tailwindcss.com/) - Styling
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI chat functionality
- [OpenAI](https://openai.com/) - GPT models

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd amyzyuan
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Add your OpenAI API key to `.env.local`

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo)

1. Push to GitHub
2. Import to Vercel
3. Add `OPENAI_API_KEY` environment variable
4. Deploy!

## License

MIT
