import { NextRequest, NextResponse } from "next/server";
import {
  roles,
  users,
  userWarehouses,
} from "@/drizzle/schema/UserManagement/userManagement.schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { db } from "@/drizzle/drizzle";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const { email, username, password, role_id, warehouse_ids, phone } =
    await request.json();

  // Check if there are any empty fields
  if (
    !email ||
    !password ||
    !username ||
    !role_id ||
    !warehouse_ids ||
    warehouse_ids.length === 0
  ) {
    return NextResponse.json(
      {
        status: 400,
        status_message: "Missing required fields",
        data: null,
      },
      { status: 400 }
    );
  }

  try {
    // Check if the user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (existingUser.length > 0) {
      return NextResponse.json(
        {
          status: 400,
          status_message: "User already exists",
          data: null,
        },
        { status: 400 }
      );
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    const [user] = await db
      .insert(users)
      .values({
        id: uuidv4(),
        email: email,
        password: passwordHash,
        username: username,
        role_id: role_id,
        phone: phone, // Add phone field
        created_at: new Date(),
      })
      .returning();

    // Insert entries into userWarehouses table
    for (const warehouseId of warehouse_ids) {
      await db.insert(userWarehouses).values({
        user_id: user.id,
        warehouse_id: warehouseId,
      });
    }

    const [role] = await db
      .select()
      .from(roles)
      .where(eq(roles.role_id, user.role_id))
      .limit(1);

    return NextResponse.json(
      {
        status: 201,
        status_message: "User registered successfully",
        data: {
          email: user.email,
          username: user.username,
          role: role.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to register user",
        data: null,
      },
      { status: 500 }
    );
  }
}
