import { google, sheets_v4 } from 'googleapis';
import { BoxTariff } from '../types/tariff.type';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export class GoogleSheetsService {
  private readonly auth;
  private readonly sheets: sheets_v4.Sheets;
  private readonly sheetIds: string[];

  constructor() {
    this.auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, '../../credentials.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    this.sheetIds = process.env.GOOGLE_SHEET_IDS?.split(',') || [];
  }

  async updateSheets(tariffs: BoxTariff[]): Promise<void> {
    try {
      if (!Array.isArray(tariffs)) {
        throw new Error('Tariffs data is not an array');
      }

      const sortedTariffs = tariffs.sort((a, b) => a.coefficient - b.coefficient);
      const authClient = await this.auth.getClient();

      for (const sheetId of this.sheetIds) {
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: sheetId,
          range: 'stocks_coefs!A1',
          valueInputOption: 'RAW',
          requestBody: {
            values: [
              ['Box ID', 'Name', 'Weight', 'Width', 'Height', 'Depth', 'Price', 'Delivery Period', 'Coefficient'],
              ...sortedTariffs.map(t => [
                t.box_id,
                t.name,
                t.weight,
                t.width,
                t.height,
                t.depth,
                t.price,
                t.delivery_period,
                t.coefficient,
              ]),
            ],
          },
          auth: authClient as any,
        });
        console.log(`Updated Google Sheet: ${sheetId}`);
      }
    } catch (error) {
      console.error('Error updating Google Sheets:', error);
      throw error;
    }
  }
}