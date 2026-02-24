# Bakery Sales Tracker

## Setup Google Sheets

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Sheets API
4. Create Service Account (IAM & Admin → Service Accounts)
5. Create JSON key for the service account
6. Copy the `client_email` and `private_key` from the JSON
7. Create a Google Sheet and share it with the service account email (Editor access)
8. Copy the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`

## Setup App

1. Install dependencies:
```bash
npm install
```

2. Update `.env.local` with your credentials:
- `GOOGLE_CLIENT_EMAIL`: From service account JSON
- `GOOGLE_PRIVATE_KEY`: From service account JSON (keep the quotes)
- `SHEET_ID`: From your Google Sheet URL

3. Run locally:
```bash
npm run dev
```

## Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

Your sheet should have columns: Date | Customer | Product | Selling Price | Cost | Profit | Time Taken (hrs)
