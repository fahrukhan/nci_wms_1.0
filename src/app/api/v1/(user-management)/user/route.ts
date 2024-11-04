import { db } from "@/drizzle/drizzle";
import { users } from "@/drizzle/schema/UserManagement/users.schema";
import { asc, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import {
  createUnauthorizedResponse,
  getUserFromSession,
  validateBearerToken,
} from "@/lib/utils/AuthUtils";

export async function GET(request: NextRequest) {
  try {
    const session = await validateBearerToken(request);
    if (!session) {
      return createUnauthorizedResponse("Missing or invalid bearer token");
    }

    const user = await getUserFromSession(session);
    if (!user) {
      return createUnauthorizedResponse("User not found");
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "10");
    const offset = (page - 1) * perPage;

    const allUsers = await db
      .select()
      .from(users)
      .orderBy(asc(users.username))
      .offset(offset)
      .limit(perPage);
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)`.as("count") })
      .from(users);
    const totalCount = Number(totalCountResult[0].count);

    return NextResponse.json({
      status: 200,
      status_message: "Users data retrieved",
      data: allUsers,
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / perPage),
      },
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
    return NextResponse.json(
      { error: "Failed to retrieve users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await validateBearerToken(request);
    if (!session) {
      return createUnauthorizedResponse("Missing or invalid bearer token");
    }

    const user = await getUserFromSession(session);
    if (!user) {
      return createUnauthorizedResponse("User not found");
    }

    const newUser: UserDTO = await request.json();

    if (
      !newUser.email ||
      !newUser.password ||
      !newUser.username ||
      !newUser.role_id
    ) {
      return NextResponse.json(
        {
          status: 400,
          status_message: "Please input all the required fields",
          data: {},
        },
        { status: 400 }
      );
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, newUser.username))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        {
          status: 400,
          status_message: "User already exists",
          data: {},
        },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(newUser.password, 10);

    const createdUser = await db
      .insert(users)
      .values({
        id: uuidv4(),
        email: newUser.email,
        password: passwordHash,
        phone: newUser.phone,
        username: newUser.username,
        role_id: newUser.role_id,
        company_id: 1,
      })
      .returning();

    return NextResponse.json(
      {
        status: 201,
        status_message: "User created successfully",
        data: createdUser[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to create user",
        data: {},
      },
      { status: 500 }
    );
  }
}
