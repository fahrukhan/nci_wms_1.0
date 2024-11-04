import { db } from '@/drizzle/drizzle';
import { v4 as uuidv4 } from 'uuid';
import { item_logs, NewItemLogs, ItemLogs } from '@/drizzle/schema/MasterData/masterData.schema';
import { NewUserLog, UserLog, user_logs } from '@/drizzle/schema/UserManagement/userManagement.schema';

export async function createItemLog(data: ItemLogDTO): Promise<ItemLogs> {
  try {
    const newItemLog: NewItemLogs = {
      item_id: data.item_id,
      note: data.note,
      ref: data.ref,
      activity: data.activity,
      user_id: data.user_id,
    };
    const [insertedLog] = await db.insert(item_logs).values(newItemLog).returning();
    return insertedLog;
  } catch (error) {
    console.error('Error creating item log:', error);
    throw error;
  }
}

export async function createUserLog(data: UserLogDTO): Promise<UserLog> {
  try {
    const newUserLog: NewUserLog = {
      user_log_id : uuidv4(),
      device: data.device,
      version: data.version,
      activity: data.activity,
      user_id: data.user_id,
      ref: data.ref,
      note: data.note
    };
    const [insertedLog] = await db.insert(user_logs).values(newUserLog).returning();
    return insertedLog;
  } catch (error) {
    console.error('Error creating user log:', error);
    throw error;
  }
}