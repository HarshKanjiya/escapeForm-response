import { Prisma, PrismaClient } from "@prisma/client";


declare global {
  var __prisma: PrismaClient | undefined;
}

const globalForPrisma = globalThis as unknown as {
  __prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma = prisma;
}


export { Prisma };

export type TeamWithProjects = Prisma.TeamGetPayload<{
  include: { projects: true };
}>;

export type ProjectWithForms = Prisma.ProjectGetPayload<{
  include: { forms: true; team: true };
}>;

export type FormWithResponses = Prisma.FormGetPayload<{
  include: { responses: true; project: true };
}>;

export type FormWithProject = Prisma.FormGetPayload<{
  include: { project: { include: { team: true } } };
}>;

// Export enums for use in components


// Default export for compatibility
export default prisma;