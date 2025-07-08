import { db } from './config/db';
import { WbApiService } from './services/wbApi.service';
import { TariffService } from './services/tariff.service';
import { GoogleSheetsService } from './services/googleSheets.service';
import { setupSyncGoogleSheetsTask } from './tasks/syncGoogleSheets.task';
import { setupUpdateTariffsTask } from './tasks/updateTariffs.task';

async function initializeApp() {
  try {
    // проверка подключения к бд
    await db.raw('SELECT 1');
    console.log('Database connection established');

    // инициализация сервисов
    const wbApi = WbApiService.getInstance();
    const tariffService = new TariffService();
    const googleSheetsService = new GoogleSheetsService();

    // настройка автообновлений по времени
    console.log('Setting up cron jobs...');
    setupSyncGoogleSheetsTask();
    setupUpdateTariffsTask();
    console.log('Cron jobs registered');

    try {
      // загрузка данных при запуске скрипта
      console.log('Fetching tariffs from WB...');
      const wbTariffs = await wbApi.getBoxTariffs();
      console.log(`Received ${wbTariffs.data.length} tariffs from WB`);

      console.log('Saving tariffs to DB...');
      await tariffService.saveOrUpdateTariffs(wbTariffs);

      const dbTariffs = await tariffService.getLatestTariffs();
      console.log(`Loaded ${dbTariffs.data.length} tariffs from DB`);

      if (dbTariffs.data.length > 0) {
        console.log('Syncing with Google Sheets...');
        await googleSheetsService.updateSheets(dbTariffs.data);
        console.log('Google Sheets updated successfully');
      } else {
        console.log('No tariffs data available for Google Sheets');
      }

      console.log('Application started successfully');
    } catch (error) {
      console.error('Application error:', error);
      const dbTariffs = await tariffService.getLatestTariffs();
      if (dbTariffs.data.length > 0) {
        console.log('Using last available tariffs from DB');
        await googleSheetsService.updateSheets(dbTariffs.data);
      }
    }
  } catch (error) {
    console.error('Initialization failed:', error);
    process.exit(1);
  }
}

initializeApp();