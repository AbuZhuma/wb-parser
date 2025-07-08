import axios from 'axios';
import { BoxTariff, WbApiResponse } from '../types/tariff.type';
import dotenv from 'dotenv';

dotenv.config();

export class WbApiService {
  private static instance: WbApiService;
  private apiToken: string;
  private apiUrl = 'https://common-api.wildberries.ru/api/v1/tariffs/box';

  private constructor() {
    this.apiToken = process.env.WB_API_TOKEN || '';
    if (!this.apiToken) {
      throw new Error('WB_API_TOKEN is not defined');
    }
  }

  public static getInstance(): WbApiService {
    if (!WbApiService.instance) {
      WbApiService.instance = new WbApiService();
    }
    return WbApiService.instance;
  }

  async getBoxTariffs(): Promise<{ data: BoxTariff[]; date: string }> {
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      
      const response = await axios.get<WbApiResponse>(this.apiUrl, {
        params: { date: currentDate },
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      const boxTariffs: BoxTariff[] = response.data.response.data.warehouseList.map((warehouse, index) => ({
        box_id: index + 1,
        name: warehouse.warehouseName,
        coefficient: parseFloat(warehouse.boxDeliveryAndStorageExpr) || 0,
        weight: 0,
        width: 0,
        height: 0,
        depth: 0,
        price: parseFloat(warehouse.boxDeliveryBase) || 0,
        delivery_period: 0
      }));

      return {
        data: boxTariffs,
        date: currentDate
      };
    } catch (error) {
      console.error('Error fetching WB tariff');
      throw error;
    }
  }
}