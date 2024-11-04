import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/drizzle';
import { eq } from 'drizzle-orm';
import { locations, NewLocation, warehouses } from '@/drizzle/schema/MasterData/masterData.schema';


export async function GET(request: NextRequest) {
    try {
      const locationId = request.nextUrl.searchParams.get('location_id');
      if (!locationId) {
        return NextResponse.json({ error: 'Missing location_id parameter' }, { status: 400 });
      }
  
      const locationDetail = await db
        .select({
          location_id: locations.location_id,
          name: locations.name,
          parent_id: locations.parent_id,
          path: locations.path,
          pathName: locations.pathName,
          warehouse: {
            warehouse_id: warehouses.warehouse_id,
            name: warehouses.name,
            phone: warehouses.phone,
            address: warehouses.address,
          },
        })
        .from(locations)
        .where(eq(locations.location_id, Number(locationId)))
        .innerJoin(warehouses, eq(locations.warehouse_id, warehouses.warehouse_id))
        .limit(1);
  
      if (locationDetail.length === 0) {
        return NextResponse.json({ error: 'Location not found' }, { status: 404 });
      }
  
      return NextResponse.json({
        status: 200,
        status_message: "Location detail retrieved",
        data: locationDetail[0],
      });
    } catch (error) {
      console.error('Error retrieving location detail:', error);
      return NextResponse.json({ error: 'Failed to retrieve location detail' }, { status: 500 });
    }
  }
  
  export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const locationId = params.id;
    try {
      if (!locationId) {
        return NextResponse.json({ error: 'Missing location_id parameter' }, { status: 400 });
      }
  
      const updatedLocation: Partial<NewLocation> = await request.json();
  
      // Fetch the current location data
      const currentLocation = await db
        .select()
        .from(locations)
        .where(eq(locations.location_id, Number(locationId)))
        .limit(1);
  
      if (currentLocation.length === 0) {
        return NextResponse.json({ error: 'Location not found' }, { status: 404 });
      }
  
      // Update pathName
      let newPathName = currentLocation[0].pathName;
      if (updatedLocation.name && currentLocation[0].pathName) {
        const pathParts = currentLocation[0].pathName.split('/');
        pathParts[pathParts.length - 1] = updatedLocation.name;
        newPathName = pathParts.join('/');
      }
  
      // Update the location in the database
      const editedLocation = await db
        .update(locations)
        .set({
          name: updatedLocation.name,
          pathName: newPathName,
        })
        .where(eq(locations.location_id, Number(locationId)))
        .returning();
  
      return NextResponse.json(
        {
          status: 200,
          status_message: "Location updated successfully",
          data: editedLocation[0],
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error updating location:', error);
      return NextResponse.json({ error: 'Failed to update location' }, { status: 500 });
    }
  }
  

  export async function DELETE(request: NextRequest, {params} : {params : {id : string}}) {
    try {
      const locationId = params.id;
      if (!locationId) {
        return NextResponse.json({ error: 'Missing location_id parameter' }, { status: 400 });
      }
  
      const deletedLocation = await db
        .delete(locations)
        .where(eq(locations.location_id, Number(locationId)))
        .returning();
  
      if (deletedLocation.length === 0) {
        return NextResponse.json({ error: 'Location not found' }, { status: 404 });
      }
  
      return NextResponse.json(
        {
          status: 200,
          status_message: "Location deleted successfully",
          data: deletedLocation[0],
        },
        { status: 200, }
      );
    } catch (error : any) {
      console.error('Error deleting location:', error);
      return NextResponse.json({ error: 'Failed to delete location', message: error.message }, { status: 500 });
    }
  }
  