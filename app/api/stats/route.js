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
      range: 'Orders!A2:H',
    });

    const rows = response.data.values || [];
    
    // Most sold item (by quantity)
    const productQuantities = {};
    rows.forEach(row => {
      const product = row[2];  // Product is column 2
      const quantity = parseInt(row[3]) || 0;  // Quantity is column 3
      productQuantities[product] = (productQuantities[product] || 0) + quantity;
    });
    const mostSold = Object.entries(productQuantities).sort((a, b) => b[1] - a[1])[0];
    
    // Most profitable item (total profit)
    const productProfits = {};
    rows.forEach(row => {
      const product = row[2];  // Product is column 2
      const profit = parseFloat(row[6]) || 0;  // Profit is column 6
      productProfits[product] = (productProfits[product] || 0) + profit;
    });
    const mostProfitable = Object.entries(productProfits).sort((a, b) => b[1] - a[1])[0];
    
    // Top 3 customers (by total spent)
    const customerSpending = {};
    rows.forEach(row => {
      const customer = row[1];  // Customer is column 1
      const quantity = parseInt(row[3]) || 0;  // Quantity is column 3
      const sellingPrice = parseFloat(row[4]) || 0;  // Selling Price is column 4
      const total = quantity * sellingPrice;
      customerSpending[customer] = (customerSpending[customer] || 0) + total;
    });
    const topCustomers = Object.entries(customerSpending)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, total]) => ({ name, total }));

    // Monthly performance (last 3 months)
    const monthlyData = {};
    rows.forEach(row => {
      const date = row[0];  // Date is column 0
      if (!date) return;
      
      const monthKey = date.substring(0, 7); // "2026-02"
      const quantity = parseInt(row[3]) || 0;
      const sellingPrice = parseFloat(row[4]) || 0;
      const profit = parseFloat(row[6]) || 0;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { sales: 0, profit: 0, orders: 0 };
      }
      monthlyData[monthKey].sales += quantity * sellingPrice;
      monthlyData[monthKey].profit += profit;
      monthlyData[monthKey].orders += 1;
    });
    
    const monthlyPerformance = Object.entries(monthlyData)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 3)
      .map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        ...data
      }));

    return Response.json({ 
      mostSold: mostSold ? { product: mostSold[0], quantity: mostSold[1] } : null,
      mostProfitable: mostProfitable ? { product: mostProfitable[0], profit: mostProfitable[1] } : null,
      topCustomers,
      monthlyPerformance
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
