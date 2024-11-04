import { db } from "@/drizzle/drizzle";
import { categories } from "@/drizzle/schema/MasterData/masterData.schema";
import { createUnauthorizedResponse, getUserFromSession, validateBearerToken } from "@/lib/utils/AuthUtils";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params } : { params: { id: string }}) {
    try {

      const requestBody = await request.json();

      const session = await validateBearerToken(request);
      if (!session) {
          return createUnauthorizedResponse('Missing or invalid bearer token');
      }
  
      const user  = await getUserFromSession(session);
      if (!user) {
        return createUnauthorizedResponse('User not found');
      }
  
      if (!requestBody.name) {
        return NextResponse.json(
          {
            status: 400,
            status_message: "Missing required fields",
            data: {},
          },
          { status: 400 }
        );
      }
  
      const updatedCategory = await db
        .update(categories)
        .set({name : requestBody.name})
        .where(eq(categories.category_id, Number(params.id)))
        .returning();
  
      if (updatedCategory.length === 0) {
        return NextResponse.json(
          {
            status: 404,
            status_message: "Category not found",
            data: {},
          },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        {
          status: 200,
          status_message: "Category updated successfully",
          data: updatedCategory[0],
        },
        { status: 200, }
      );
    } catch (error) {
      console.error('Error updating category:', error);
      return NextResponse.json(
        {
          status: 500,
          status_message: "Failed to update category",
          data: {},
        },
        { status: 500 }
      );
    }
  }
  
  // Delete Category
  export async function DELETE(request : NextRequest, { params } : { params: { id: string } }) {
    try {

      const session = await validateBearerToken(request);
      if (!session) {
          return createUnauthorizedResponse('Missing or invalid bearer token');
      }
  
      const user  = await getUserFromSession(session);
      if (!user) {
        return createUnauthorizedResponse('User not found');
      }

      if (!(Number(params.id))) {
        return NextResponse.json(
          {
            status: 400,
            status_message: "Missing category_id",
            data: {},
          },
          { status: 400 }
        );
      }

      const deletedCategory = await db
        .delete(categories)
        .where(eq(categories.category_id, Number(params.id)))
        .returning();
  
      if (deletedCategory.length === 0) {
        return NextResponse.json(
          {
            status: 404,
            status_message: "Category not found",
            data: {},
          },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        {
          status: 200,
          status_message: "Category deleted successfully",
          data: {},
        },      { status: 200, }
      );
    } catch (error) {
      console.error('Error deleting category:', error);
      return NextResponse.json(
        {
          status: 500,
          status_message: "Failed to delete category",
          data: {},
        },
        { status: 500 }
      );
    }
  }