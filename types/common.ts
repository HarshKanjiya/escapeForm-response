// Common response types for server actions

import { Form, Question } from "@prisma/client"

export interface ActionResponse<T = unknown> {
    success: boolean
    data?: T
    isError?: boolean
    isWarning?: boolean
    message?: string,
    totalItems?: number
}

export interface ActionError {
    success: false
    error: string
    message?: string
}

export interface ActionSuccess<T = unknown> {
    success: true
    data: T
    message?: string
}

// Helper functions to create consistent responses
export function createSuccessResponse<T>(
    data: T,
    message?: string
): ActionSuccess<T> {
    return {
        success: true,
        data,
        message
    }
}

export function createErrorResponse(
    error: string,
    message?: string
): ActionError {
    return {
        success: false,
        error,
        message
    }
}

export interface CountryOption {
    code: string; // ISO 2
    dialCode: string; // +1, +91 etc
    name: string;
    flag: string; // Emoji flag
}

export type FormWithQuestionsAndEdges = Form & {
    questions: Question[];
    edges: any[];
}

export type formMetadata = {
    primaryColor?: string;
    secondaryColor?: string;
    actionBtnSize?: 'sm' | 'default' | 'lg' | 'xl';
    backBtnLabel?: string;
    nextBtnLabel?: string;
    submitBtnLabel?: string;
}