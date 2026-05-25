import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import 'dotenv/config';
declare const pool: pg.Pool;
export declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/client").DefaultArgs>;
export { PrismaClient };
export * from '@prisma/client';
export { pool };
