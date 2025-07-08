import { db } from '../config/db';
import { BoxTariff } from '../types/tariff.type';

export class TariffService {
  async saveOrUpdateTariffs(tariffs: { data: BoxTariff[]; date: string }): Promise<void> {
    try {
      const existing = await db('tariffs')
        .where('date', tariffs.date)
        .first();

      if (existing) {
        await db('tariffs')
          .where('date', tariffs.date)
          .update({
            data: JSON.stringify(tariffs.data),
            updated_at: db.fn.now()
          });
      } else {
        await db('tariffs').insert({
          date: tariffs.date,
          data: JSON.stringify(tariffs.data)
        });
      }
    } catch (error) {
      console.error('Error saving tariffs:', error);
      throw error;
    }
  }

  async getLatestTariffs(): Promise<{ data: BoxTariff[] }> {
    try {
      const result = await db('tariffs')
        .orderBy('date', 'desc')
        .limit(1)
        .first();

      if (!result || !result.data) {
        return { data: [] };
      }

      return {
        data: typeof result.data === 'string' 
          ? JSON.parse(result.data) 
          : result.data
      };
    } catch (error) {
      console.error('Error getting latest tariffs:', error);
      throw error;
    }
  }
}