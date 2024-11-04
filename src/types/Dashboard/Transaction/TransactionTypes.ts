 interface SelectBox {
    value: string;
    label: string;
}

interface InboundRecordDTO {
    inbound_id: string;
    inbound_date: string;
    supplier_name: string;
    admin_name: string;
    ref: string;
}

interface InboundDetailDTO {
  inbound_id: string;
  inbound_date: string;
  supplier_name: string;
  warehouse_name: string;
  admin_name: string;
  ref: string;
  note: string;
  detail: [
    {
      product_code: string;
      product_name: string;
      qty: number;
      unit_name: string;
    }
  ];
}
  
interface OutboundRecordDTO {
    outbound_id: string;
    outbound_date: string;
    customer_name: string;
    admin_name: string;
    ref: string;
}

interface TransferRecordDTO {
    transfer_id: string;
    transfer_date: string;
    origin_warehouse: string;
    destination_warehouse: string;
    note: string;
}

interface TransferDetailDTO {
  transfer_id: string;
  transfer_date: string;
  origin_name: string;
  destination_name: string;
  admin_name: string;
  ref: string;
  note: string;
  detail: [
    {
      product_code: string;
      product_name: string;
      qty: number;
      unit_name: string;
    }
  ];
}

interface RelocationRequestDTO {
  destination_id: number;
  ref: string;
  note: string;
  scan_type: string;
  device : string;
  app_version : string;
  data : RelocationRequestDetailDTO[];
}

interface RelocationRequestDetailDTO {
  origin_location_id: number;
  products : {
    product_id: number,
    item_id: string[],
  }[],
}

interface RelocationRecordDTO {
  relocation_id: string;
  relocation_date: string;
  ref: string;
  note: string;
  origin_name: string;
  destination_name: string;
}

interface RelocationDetailDTO {
  transfer_id: string;
  transfer_date: string;
  destination_name: string;
  origin_name: string;
  admin_name: string;
  ref: string;
  note: string;
  detail: [
    {
      product_name: string;
      product_code: string;
      unit_name: string;
      unit_symbol: string;
      qty: number;
    }
  ];
}

interface StockOpnameProfileDTO {
  stock_opname_profile_id: string;
  title: string;
  description: string;
  activity: number;
}

interface StockOpnameProfileDetailDTO {
  stock_opname_id: string;
  stock_opname_date: string;
  location_id: number;
  location_name: string;
  location_path_name: string;
  scan_type: string;
  user_id: string;
  user_name: string;
  created_at: string;
  quantity: number;
}