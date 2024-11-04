interface ProductDTO {
    product_id: number;
    product_code: string;
    name: string;
    image: string;
    category: CategoryDTO;
    attribute1: AttributeDTO | null;
    attribute2: AttributeDTO | null;
    attribute3: AttributeDTO | null;
    qty_min: number;
    qty_max: number;
    unit_base: UnitDTO;
    unit_sub: UnitDTO;
    convertion_factor: number;
}
  
interface CategoryDTO {
    category_id: number;
    name: string;
}
  
interface AttributeDTO {
    attribute_id: number;
    name: string;
    type: string;
    list: string;
}
  
interface UnitDTO {
    unit_id: number;
    name: string;
    symbol: string;
    created_at: string;
}
  