import { ActionResponse } from '@/types/common';
import { NextResponse } from 'next/server';

// HTTP status codes enum for consistency
export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500,
}

// Error types for better error handling
export enum ErrorType {
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
    AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
    NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
    CONFLICT_ERROR = 'CONFLICT_ERROR',
    DATABASE_ERROR = 'DATABASE_ERROR',
    INTERNAL_ERROR = 'INTERNAL_ERROR',
}

/**
 * Create a success response
 */
export function getSuccessResponse<T>(
    data: T,
    message?: string,
    totalItems?: number
): NextResponse<ActionResponse<T>> {
    return NextResponse.json({
        success: true,
        data,
        message,
        totalItems
    }, { status: HttpStatus.OK });
}

/**
 * Create an error response for server actions
 */
export function getErrorResponse(
    message: string,
    {
        isWarning,
        errors,
        status
    }: {
        isWarning?: boolean
        errors?: Record<string, string[] | string[]>
        status?: HttpStatus
    } = {
            isWarning: false,
            errors: {},
            status: HttpStatus.BAD_REQUEST
        }
): NextResponse<ActionResponse> {
    return NextResponse.json({
        success: false,
        message,
        isError: !isWarning,
        isWarning,
        data: errors,
        totalItems: 0
    }, { status });
}

/**
 * Create a validation error response
 */
export function createValidationErrorResponse(
    errors: Record<string, string[]>,
    message: string = 'Validation failed'
): NextResponse<ActionResponse> {
    return getErrorResponse(
        message,
        {
            errors,
            status: HttpStatus.UNPROCESSABLE_ENTITY
        }
    );
}

/**
 * Create an authentication error response
 */
// export function getAuthErrorResponse(): NextResponse<ActionResponse> {
//     return getErrorResponse(
//         MESSAGE.AUTHENTICATION_REQUIRED,
//         {
//             status: HttpStatus.UNAUTHORIZED,
//             isWarning: true,
//             errors: {
//                 message: [MESSAGE.AUTHENTICATION_REQUIRED]
//             }
//         }
//     );
// }

/**
 * Create an authorization error response
 */
export function createForbiddenResponse(
    message: string = 'Insufficient permissions'
): NextResponse<ActionResponse> {
    return getErrorResponse(
        message,
        {
            status: HttpStatus.FORBIDDEN,
            isWarning: true,
            errors: {
                message: [message]
            }
        }
    );
}

/**
 * Create a not found error response
 */
export function createNotFoundResponse(
    message: string = 'Resource not found'
): NextResponse<ActionResponse> {
    return getErrorResponse(
        message,
        {
            status: HttpStatus.NOT_FOUND,
            isWarning: true,
            errors: {
                message: [message]
            }
        }
    );
}

/**
 * Create a conflict error response
 */
export function createConflictResponse(
    message: string = 'Resource already exists'
): NextResponse<ActionResponse> {
    return getErrorResponse(
        message,
        {
            status: HttpStatus.CONFLICT,
            isWarning: true,
            errors: {
                message: [message]
            }
        }
    );
}

/**
 * Create a database error response
 */
export function createDatabaseErrorResponse(
    message: string = 'Database operation failed'
): NextResponse<ActionResponse> {
    return getErrorResponse(
        message,
        {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            isWarning: true,
            errors: {
                message: [message]
            }
        }
    );
}

/**
 * Handle Prisma errors and convert to standardized responses
 */
export function handlePrismaError(error: unknown): NextResponse<ActionResponse> {
    console.error('Prisma error:', error);

    // Handle specific Prisma errors
    if (typeof error == 'object' && error !== null && 'code' in error && error['code'] === 'P2002') {
        // Unique constraint violation
        return createConflictResponse('A record with this data already exists');
    }

    if (typeof error == 'object' && error !== null && 'code' in error && error['code'] === 'P2025') {
        // Record not found
        return createNotFoundResponse('The requested record was not found');
    }

    if (typeof error == 'object' && error !== null && 'code' in error && error['code'] === 'P2003') {
        // Foreign key constraint violation
        return createValidationErrorResponse(
            { reference: ['Referenced record does not exist'] },
            'Invalid reference'
        );
    }

    if (typeof error == 'object' && error !== null && 'code' in error && error['code'] === 'P2014') {
        // Required relation violation
        return createValidationErrorResponse(
            { relation: ['Required relation is missing'] },
            'Missing required relation'
        );
    }

    // Generic database error
    return createDatabaseErrorResponse('An unexpected database error occurred');
}

/**
 * Create a paginated response with metadata
 */
export function createPaginatedResponse<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message: string = 'Data retrieved successfully'
): NextResponse<ActionResponse<{ items: T[]; pagination: unknown }>> {
    const totalPages = Math.ceil(total / limit);

    const responseData = {
        items: data,
        pagination: {
            page,
            limit,
            total,
            totalPages,
        },
    };

    return getSuccessResponse(responseData, message);
}

/**
 * Validate required fields in request body
 */
export function validateRequiredFields(
    body: Record<string, unknown>,
    requiredFields: string[]
): Record<string, string[]> | null {
    const errors: Record<string, string[]> = {};

    requiredFields.forEach((field) => {
        if (!body[field] || (typeof body[field] === 'string' && body[field].trim() === '')) {
            errors[field] = [`${field} is required`];
        }
    });

    return Object.keys(errors).length > 0 ? errors : null;
}

/**
 * Async error handler wrapper for API routes
 */
export function withErrorHandler<T extends unknown[], R>(
    fn: (...args: T) => Promise<R>
) {
    return async (...args: T): Promise<R | NextResponse<ActionResponse>> => {
        try {
            return await fn(...args);
        } catch (error: unknown) {
            console.error('API Error:', error);

            // Handle Prisma errors specifically
            // @ts-expect-error TYPE ERROR
            if (error.code && error.code.startsWith('P')) {
                return handlePrismaError(error);
            }

            // Handle validation errors
            // @ts-expect-error TYPE ERROR
            if (error.name === 'ValidationError') {
                // @ts-expect-error TYPE ERROR
                return createValidationErrorResponse(error.errors || {}, error.message || 'Validation failed');
            }

            // Generic internal server error
            return getErrorResponse('An unexpected error occurred');
        }
    };
}