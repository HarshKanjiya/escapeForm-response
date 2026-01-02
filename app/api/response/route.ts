
import { getErrorResponse, getSuccessResponse, withErrorHandler } from '@/lib/api-response';
import { parseRequestBody } from '@/lib/apiHelpers';
import { prisma } from '@/lib/prisma';
import { IFormResponse } from '@/types/common';
import { NextRequest } from 'next/server';

// ONLY NEW SUBMITS when form starts 
export const POST = withErrorHandler(async (request: NextRequest) => {

    const body = await parseRequestBody<IFormResponse>(request);

    const dto = {
        formId: body.formId,
        notified: false,
        userId: body.userId || null,
        partialSave: body.partialSave || false,
        status: body.status,
        data: body.data,
        startedAt: new Date(),
        updatedAt: new Date(),
    };

    const response = await prisma.response.create({
        data: dto,
    })
    if (!response) {
        return getErrorResponse('Failed to save form response');
    }

    return getSuccessResponse(response, 'Form response saved successfully');
});



export const PUT = withErrorHandler(async (request: NextRequest) => {

    const body = await parseRequestBody<IFormResponse>(request);

    if (!body.id) {
        return getErrorResponse('Response ID is required for update');
    }

    const dto = {
        notified: false,
        userId: body.userId || null,
        partialSave: body.partialSave || false,
        status: body.status,
        data: body.data,
        updatedAt: new Date(),
    };

    if (body.status == 'COMPLETED') {
        dto['submittedAt'] = new Date();
    }

    const response = await prisma.response.update({
        where: { id: body.id },
        data: dto,
    })
    if (!response) {
        return getErrorResponse('Failed to update form response');
    }

    return getSuccessResponse(response, 'Form response updated successfully');
});