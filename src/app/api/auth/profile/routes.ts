import { NextRequest , NextResponse } from "next/server";
import { cookies } from "next/headers";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';



async function userProfile(request: NextRequest, userId: string | undefined) {
    try{
         const respone = await fetch(`${BACKEND_URL}/users/${userId}/profile`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookies().toString() // Forward cookies for session management
        },
        credentials: 'include'
    });
    }catch(error){

    }
    
}