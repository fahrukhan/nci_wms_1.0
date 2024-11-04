import { db } from "@/drizzle/drizzle";
import { User, users } from "@/drizzle/schema/UserManagement/users.schema";
import { lucia } from "@/lucia/auth";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function validateBearerToken(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  const session = await lucia.validateSession(token);

  return session;
}

export async function getUserFromSession({session}: any) {
  if (!session) {
    return null;
  }
  const user = await db.select().from(users).where(sql`${users.id} = ${session.userId}`);
  return user[0] as User;
}

export function createUnauthorizedResponse(message: string) {
  return NextResponse.json(
    {
      status: 401,
      status_message: 'Unauthorized',
      data: message,
    },
    { status: 401 }
  );
}