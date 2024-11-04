import { db } from "@/drizzle/drizzle";
import { locations, Location } from "@/drizzle/schema/MasterData/masterData.schema";
import { sql } from "drizzle-orm";

// Helper function to get the default location data for a given warehouse ID
export async function getDefaultLocation(warehouseId : number): Promise<Location> {

    const result = await db
        .select()
        .from(locations)
        .where(sql`${locations.warehouse_id} = ${warehouseId} and ${locations.name} = 'default'`);
    return result[0] as Location;
};
