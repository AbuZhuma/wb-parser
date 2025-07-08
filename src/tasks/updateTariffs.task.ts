import cron from 'node-cron';
import { WbApiService } from '../services/wbApi.service';
import { TariffService } from '../services/tariff.service';

export function setupUpdateTariffsTask(): void {
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('Starting tariffs update...');
      const wbApi = WbApiService.getInstance();
      const tariffService = new TariffService();

      const tariffs = await wbApi.getBoxTariffs();
      await tariffService.saveOrUpdateTariffs(tariffs);

      console.log('Tariffs updated successfully');
    } catch (error) {
      console.error('Error in tariffs update task:', error);
    }
  });
}