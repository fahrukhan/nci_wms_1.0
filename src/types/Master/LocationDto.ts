import { Location } from "@/drizzle/schema/MasterData/locations.schema";


export interface LocationDTO extends Omit<Location, 'warehouse_id'> {
    warehouse_id: number;   
    warehouse_name: string;
}