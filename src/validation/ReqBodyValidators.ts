import { StockOpnameProfile } from "@/drizzle/schema/Transaction/stockOpnameProfiles.schema";
import { ValidationSchema } from "./Schema";
import { StockOpname } from "@/drizzle/schema/Transaction/stockOpnames.schema";

function StockOpnameProfileValidator(data: StockOpnameProfile): Array<string> {
  const userSchema = new ValidationSchema<StockOpnameProfile>([
    { name: "title", fn: (value) => typeof value.title === "string" && value.title.length > 0 },
    { name: "description", fn: (value) => typeof value.description === "string" && value.title.length > 0 },
    { name: "warehouse_id", fn: ({ warehouse_id }) => typeof warehouse_id === "number" && warehouse_id > 0 },
  ]);

  const errors = userSchema.validate(data);
  return errors;
}

function StockOpnameValidator(data: StockOpname): Array<string> {
  const userSchema = new ValidationSchema<StockOpname>([
    { name: "stock_opname_profile_id", fn: (value) => typeof value.stock_opname_profile_id === "string" && value.stock_opname_profile_id.length > 0 },
    { name: "location_id", fn: ({ location_id }) => typeof location_id === "number" && location_id > 0 },
    { name: "scan_type", fn: (value) => typeof value.scan_type === "string" && (value.scan_type == "rfid" || value.scan_type == "qr") }
  ]);

  const errors = userSchema.validate(data);
  return errors;
}
  
export const ReqBodyValidators = {
  StockOpnameProfileValidator,StockOpnameValidator
}
