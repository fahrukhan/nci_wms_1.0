interface StockItemRecordDTO {
    warehouse_id: number;
    warehouse_name: string;
    count: number;
}

interface StockWarehouseData {
    items: StockProductData[];
    totalQty: number;
    warehouseName: string;
}

interface StockProductData {
    products_id: number;
    products_name: string;
    count: number;
}

interface TagRegistrationRecordDTO {
    item_id: string;
    note: string;
    ref: string;
    user_name: string;
    created_at: string;
}

interface StockLocationRecordDTO {
    warehouse_id: number;
    warehouse_name: string;
    stock_qty: number;
}

interface StockLocationWarehouse {
    warehouse: WarehouseData;
    product_stock: ProductStockData[];
}

interface ProductStockData {
    product_id: number;
    product_name: string;
    stock_qty: number;
}

interface WarehouseData {
    warehouse_id: number;
    name: string;
    address: string;
    phone: string;
    company_id: number
}

interface StockProductWarehouse {
    warehouse: WarehouseData;
    product: ProductData;
    attribute_stock: AttributeStock[];
}

interface ProductData {
    product_id: number;
    name: string;
    image: string;
    category_id: number;
    attribute1_id: number | null;
    attribute2_id: number | null;
    attribute3_id: number | null;
    qty_min: number;
    qty_max: number;
    unit_base_id: number;
    unit_sub_id: number;
    convertion_factor: number;
    product_code: string;
  }
  
  interface AttributeStock {
    attribute: string;
    stock_qty: number;
  }
  
  interface StockProductLocationWarehouse {
    warehouse: WarehouseData;
    location_stock: LocationStockData[];
}

interface LocationStockData {
    location_id: number;
    location_name: string;
    location_path_name: string;
    stock_qty: number;
}

interface StockLocationProduct {
    warehouse: WarehouseData;
    location: LocationStockData;
    product_stock: ProductStockData[];
}

interface TrackingDataRecordDTO {
    product_id: number;
    product_name: string;
    item_id: string;
    rfid: string;
    location_id: number;
    location_name: string;
    location_path_name: string;
    history: HistoryData[];
}

interface HistoryData {
    activity: string;
    note: string;
    ref: string;
    user_name: string;
    created_at: string
}