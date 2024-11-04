import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/drizzle';
import { contacts, NewContact } from '@/drizzle/schema/MasterData/masterData.schema';
import { asc, sql } from 'drizzle-orm';

// Get all contacts
export async function GET(request : NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '10');

    const offset = (page - 1) * perPage;

    const allContacts = await db.select().from(contacts).offset(offset).limit(perPage).orderBy(asc(contacts.name));
    const totalCountResult = await db.select({ count: sql<number>`count(*)`.as('count') }).from(contacts);                      
    const totalCount = Number(totalCountResult[0].count);
    return NextResponse.json({
      status: 200,
      status_message: "Contacts data retrieved",
      data: allContacts,
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / perPage),
      },
    });
  } catch (error) {
    console.error('Error retrieving contacts:', error);
    return NextResponse.json({ error: 'Failed to retrieve contacts' }, { status: 500 });
  }
}


// Create a new contact
export async function POST(request: NextRequest) {
    try {
      const reqData : NewContact = await request.json();
  
      if (!reqData.name || !reqData.address || !reqData.phone || !reqData.type) {
        return NextResponse.json(
          {
            status: 400,
            status_message: "Missing required fields",
            data: {},
          },
          { status: 400 }
        );
      }
  
      const newContact = await db.insert(contacts).values(reqData).returning();
  
      return NextResponse.json(
        {
          status: 201,
          status_message: "Contact created successfully",
          data: newContact[0],
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('Error creating contact:', error);
      return NextResponse.json(
        {
          status: 500,
          status_message: "Failed to create contact",
          data: {},
        },
        { status: 500 }
      );
    }
  }
  