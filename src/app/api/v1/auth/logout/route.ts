import { createUnauthorizedResponse, getUserFromSession, validateBearerToken } from "@/lib/utils/AuthUtils";
import { lucia } from "@/lucia/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    try {

    const session = await validateBearerToken(request);
    if (!session) {
        return createUnauthorizedResponse('Missing or invalid bearer token');
    }

    await lucia.invalidateSession(session.session!.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    return NextResponse.json(
        {
            status: 200,
            status_message: 'User logged out successfully',
            data: null,
        },
        { 
            status: 200,
            headers: {
                "Set-Cookie": sessionCookie.serialize()
            }
        }
    );
} catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json(
        {
            status: 500,
            status_message: 'Failed to log out',
            data: error,
        },
        { status: 500 }
    );
    }   
}
