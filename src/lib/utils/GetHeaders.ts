"use server"; 
import { cookies } from "next/headers";

// Helper function to get headers with token
export const getHeaders = async (isFormData = false) => {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    return {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      "Authorization": `Bearer ${token}`,
}}