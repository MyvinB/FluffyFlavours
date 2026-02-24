import { google } from 'googleapis';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Inventory!A2:C',
    });

    const rows = response.data.values || [];
    const inventory = rows.map(row => ({
      product: row[0],
      costPrice: parseFloat(row[1]) || 0,
      sellingPrice: parseFloat(row[2]) || 0,
    }));

    return Response.json({ inventory });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
