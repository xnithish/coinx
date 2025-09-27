
Coinx is a simple, lightweight web app for tracking cryptocurrency markets and managing a personal crypto portfolio.

Overview
- Track prices for thousands of cryptocurrencies (using coingecko APIs).
- Maintain a portfolio of holdings with balances and cost basis.
- View portfolio value, profit & loss, and historical performance.
- Browse market data (price, 24h change, market cap, volume) for selected coins.

Demo
- (Add a link or screenshots here if available)

Features
- Portfolio management: add, edit, and remove assets with amount and purchase price.
- Live market data: fetches price and market stats from a public API (e.g., CoinGecko).
- Simple charts and tables for quick insights.
- Import/export portfolio as JSON or CSV.
- (Optional) Authentication for per-user portfolios.

Tech stack (suggested)
- Frontend: React (Vite or Next.js)
- Styling: Tailwind CSS or plain CSS
- API: CoinGecko public API (or another free crypto market API)
- Backend (optional): Node/Express or serverless functions for advanced features

Quick start (development)
```bash
# Clone the repo
git clone https://github.com/xnithish/coinx.git
cd coinx

# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Open the app (default port shown in terminal, e.g., http://localhost:3000)
```

Configuration
- If using CoinGecko or another public API, no API key is required for basic usage.
- For rate-limited or authenticated APIs (or exchange integrations), add keys in a .env file or backend secrets as appropriate.
- Example .env (if needed):
```env
REACT_APP_API_BASE=https://api.coingecko.com/api/v3
# REACT_APP_EXCHANGE_API_KEY=your_key_here
```

Usage
- Add assets to your portfolio with an amount and purchase price.
- View real-time (or near real-time) market values and aggregated portfolio metrics.
- Export your portfolio as JSON/CSV for backups or external analysis.

Contributing
- Contributions are welcome! Please open issues for bugs or feature requests and submit PRs for fixes.
- Suggested workflow: fork -> feature-branch -> commit -> open PR.
- Please include tests or screenshots for UI changes when applicable.

Roadmap ideas
- Per-user authentication and persistent portfolios
- Sync with exchanges via API keys
- Price alerts/notifications
- Mobile-friendly responsive UI
- Historical performance charts and CSV import mapping

License
- MIT

Maintainer
- xnithish

