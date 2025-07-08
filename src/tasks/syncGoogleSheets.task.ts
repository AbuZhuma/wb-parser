import cron from 'node-cron';
import { TariffService } from '../services/tariff.service';
import { GoogleSheetsService } from '../services/googleSheets.service';

export function setupSyncGoogleSheetsTask(): void {
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('Starting Google Sheets sync...');
      const tariffService = new TariffService();
      const googleSheetsService = new GoogleSheetsService();

      const latestTariffs = await tariffService.getLatestTariffs();
      if (latestTariffs.data && latestTariffs.data.length > 0) {
        await googleSheetsService.updateSheets(latestTariffs.data);
      }

      console.log('Google Sheets updated successfully');
    } catch (error) {
      console.error('Error in Google Sheets sync task:', error);
    }
  });
}