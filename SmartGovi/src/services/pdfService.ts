import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { format } from 'date-fns';
import { DashboardSummary, User } from '../types';

interface PDFReportData {
  summary: DashboardSummary;
  user: User;
  dateRangeLabel: string;
}

class PDFService {
  async generateAndShareReport(data: PDFReportData): Promise<void> {
    try {
      const html = this.getHTMLTemplate(data);
      
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Share ${data.user.farmName || 'Smart Govi'} Report`,
          UTI: 'com.adobe.pdf',
        });
      } else {
        throw new Error('Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  private getHTMLTemplate(data: PDFReportData): string {
    const { summary, user, dateRangeLabel } = data;
    const timestamp = format(new Date(), 'MMM d, yyyy HH:mm');
    const farmName = user.farmName || 'My Farm';
    const userName = user.fullName;

    const incomeRows = summary.incomeBreakdown?.map(item => `
      <tr>
        <td>${item.categoryName}</td>
        <td style="text-align: right;">Rs ${item.amount.toLocaleString()}</td>
        <td style="text-align: right;">${item.percentage.toFixed(1)}%</td>
      </tr>
    `).join('') || '<tr><td colspan="3" style="text-align: center;">No data</td></tr>';

    const expenseRows = summary.expenseBreakdown?.map(item => `
      <tr>
        <td>${item.categoryName}</td>
        <td style="text-align: right;">Rs ${item.amount.toLocaleString()}</td>
        <td style="text-align: right;">${item.percentage.toFixed(1)}%</td>
      </tr>
    `).join('') || '<tr><td colspan="3" style="text-align: center;">No data</td></tr>';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { 
              font-family: 'Helvetica', 'Arial', sans-serif;
              padding: 40px;
              color: #333;
            }
            .header {
              border-bottom: 2px solid #2E7D32;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #2E7D32;
              margin: 0;
              font-size: 28px;
            }
            .farm-info {
              display: flex;
              justify-content: space-between;
              margin-top: 10px;
            }
            .info-label {
              font-weight: bold;
              color: #757575;
              font-size: 12px;
              text-transform: uppercase;
            }
            .info-value {
              font-size: 14px;
              margin-top: 4px;
            }
            .summary-cards {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              margin-bottom: 40px;
            }
            .card {
              background: #f5f5f5;
              padding: 15px;
              border-radius: 10px;
            }
            .card-income { border-left: 5px solid #4CAF50; }
            .card-expense { border-left: 5px solid #F44336; }
            .card-balance { border-left: 5px solid #2196F3; }
            
            .section-title {
              font-size: 18px;
              color: #2E7D32;
              border-bottom: 1px solid #E0E0E0;
              padding-bottom: 8px;
              margin-bottom: 15px;
              font-weight: bold;
              text-transform: uppercase;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            th {
              background-color: #f5f5f5;
              padding: 12px;
              text-align: left;
              font-size: 12px;
              text-transform: uppercase;
              color: #757575;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #f0f0f0;
              font-size: 14px;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 10px;
              color: #9E9E9E;
              border-top: 1px solid #E0E0E0;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${farmName} - Financial Report</h1>
            <div class="farm-info">
              <div>
                <div class="info-label">Farmer</div>
                <div class="info-value">${userName}</div>
              </div>
              <div style="text-align: right;">
                <div class="info-label">Period</div>
                <div class="info-value">${dateRangeLabel}</div>
              </div>
            </div>
          </div>

          <div class="summary-cards">
            <div class="card card-income">
              <div class="info-label">Total Income</div>
              <div class="info-value" style="color: #2E7D32; font-weight: bold; font-size: 18px;">
                Rs ${summary.totalIncome.toLocaleString()}
              </div>
            </div>
            <div class="card card-expense">
              <div class="info-label">Total Expense</div>
              <div class="info-value" style="color: #C62828; font-weight: bold; font-size: 18px;">
                Rs ${summary.totalExpense.toLocaleString()}
              </div>
            </div>
            <div class="card card-balance">
              <div class="info-label">Net Balance</div>
              <div class="info-value" style="color: #1565C0; font-weight: bold; font-size: 18px;">
                Rs ${summary.balance.toLocaleString()}
              </div>
            </div>
          </div>

          <div class="section-title">Income Breakdown</div>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th style="text-align: right;">Amount</th>
                <th style="text-align: right;">%</th>
              </tr>
            </thead>
            <tbody>
              ${incomeRows}
            </tbody>
          </table>

          <div class="section-title">Expense Breakdown</div>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th style="text-align: right;">Amount</th>
                <th style="text-align: right;">%</th>
              </tr>
            </thead>
            <tbody>
              ${expenseRows}
            </tbody>
          </table>

          <div class="footer">
            Generated by Smart Govi App on ${timestamp}<br/>
            Supporting modern agriculture for a better tomorrow.
          </div>
        </body>
      </html>
    `;
  }
}

export const pdfService = new PDFService();
