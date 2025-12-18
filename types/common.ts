// Common response types for server actions

import { Form } from "@prisma/client"
import { Question as PrismaQuestion, QuestionOption } from "@prisma/client";

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


export type Question = Omit<PrismaQuestion, 'metadata'> & {
    metadata?: IQuestionMetadata,
    options?: QuestionOption[];
}

export interface IQuestionMetadata {
    min?: number | Date | undefined;
    max?: number | Date | undefined;
    pattern?: string;
    maxSizeMB?: number;                     // for file upload field
    randomize?: boolean;                    // for multiple choice, checkbox, dropdown
    anyFileType?: boolean;                  // for file upload field
    allowedFileTypes?: string[];            // MIME types
    allowAnyCountry?: boolean;              // for phone number field
    allowedCountries?: string[];            // ISO country codes
    starCount?: number;                     // for star rating field
    detailBtnText?: string;                 // for detail field
    userConsentText?: string;               // for consent field
    userConsentRequired?: boolean;          // for consent field

    address?: boolean;                      // for address field
    addressRequired?: boolean;                      // for address field
    address2?: boolean;                     // for address field
    address2Required?: boolean;                     // for address field
    city?: boolean;                         // for address field
    cityRequired?: boolean;                         // for address field
    state?: boolean;                        // for address field
    stateRequired?: boolean;                        // for address field
    zip?: boolean;                          // for address field
    zipRequired?: boolean;                          // for address field
    country?: boolean;                      // for address field
    countryRequired?: boolean;                      // for address field
    postalCode?: boolean;                   // for address field
    postalCodeRequired?: boolean;                   // for address field
}