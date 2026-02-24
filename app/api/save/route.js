import { google } from 'googleapis';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { customer, date, items } = await request.json();

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    const rows = items.map(item => [
      date,
      customer,
      item.product,
      item.quantity,
      item.sellingPrice,
      item.costPrice,
      ((item.sellingPrice - item.costPrice) * item.quantity).toFixed(2),
      item.timeTaken
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Orders!A:H',
      valueInputOption: 'USER_ENTERED',
      resource: { values: rows },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
