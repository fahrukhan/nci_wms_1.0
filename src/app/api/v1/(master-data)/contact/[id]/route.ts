import { db } from "@/drizzle/drizzle";
import { Contact, contacts } from "@/drizzle/schema/MasterData/masterData.schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";



// Get contact details
export async function GET(request: NextRequest, { params } : { params : { id : string }}) {

    try {

      const contact = await db
        .select()
        .from(contacts)
        .where(eq(contacts.contact_id, Number(params.id)))
        .limit(1);
  
      if (contact.length === 0) {
        return NextResponse.json(
          {
            status: 404,
            status_message: "Contact not found",
            data: {},
          },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        {
          status: 200,
          status_message: "Contact details retrieved",
          data: contact[0],
        },
        { status: 200, }
      );
    } catch (error) {
      console.error('Error retrieving contact details:', error);
      return NextResponse.json(
        {
          status: 500,
          status_message: "Failed to retrieve contact details",
          data: {},
        },
        { status: 500 }
      );
    }
}


export async function PUT(request: NextRequest, { params } : { params : { id : string }}) {

  try {
    const updateData: Partial<Contact> = await request.json();

    const updatedContact = await db
      .update(contacts)
      .set(updateData)
      .where(eq(contacts.contact_id, Number(params.id)))
      .returning();

    if (updatedContact.length === 0) {
      return NextResponse.json(
        {
          status: 404,
          status_message: "Contact not found",
          data: {},
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: 200,
        status_message: "Contact updated successfully",
        data: updatedContact[0],
      },
      { status: 200, }
    );
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to update contact",
        data: {},
      },
      { status: 500 }
    );
  }
}

// Delete a contact
export async function DELETE(request: NextRequest, { params } : { params : { id : string }}) {
  try {
   
    const deletedContact = await db
      .delete(contacts)
      .where(eq(contacts.contact_id, Number(params.id)))
      .returning();

    if (deletedContact.length === 0) {
      return NextResponse.json(
        {
          status: 404,
          status_message: "Contact not found",
          data: {},
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: 200,
        status_message: "Contact deleted successfully",
        data: {},
      },
      { status: 200, }
    );
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to delete contact",
        data: {},
      },
      { status: 500 }
    );
  }
}