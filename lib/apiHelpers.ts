import { NextRequest } from "next/server";

export async function parseRequestBody<T = unknown>(request: NextRequest): Promise<T> {
    try {
        return await request.json();
    } catch (error) {
        console.error('Error parsing JSON:', error);
        throw new Error('Invalid JSON in request body');
    }
}