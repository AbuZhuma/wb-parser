export interface BoxTariff {
  box_id: number;
  name: string;
  weight: number;
  width: number;
  height: number;
  depth: number;
  price: number;
  delivery_period: number;
  coefficient: number;
}

export interface WbApiResponse {
  response: {
    data: {
      dtNextBox: string;
      dtTillMax: string;
      warehouseList: WarehouseData[];
    };
  };
}

interface WarehouseData {
  warehouseName: string;
  boxStorageBase: string;
  boxDeliveryBase: string;
  boxStorageLiter: string;
  boxDeliveryLiter: string;
  boxDeliveryAndStorageExpr: string;
}