import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@projeto-psi/database';
import * as db from '@projeto-psi/database';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public client: PrismaClient;

  constructor() {
    this.client = db.prisma;
  }

  async onModuleInit() {
    if (!this.client) {
      console.error('CLIENT IS UNDEFINED! DB object keys:', Object.keys(db));
      throw new Error('Prisma client is not initialized.');
    }
    // Connect database
    await this.client.$connect();
  }

  async onModuleDestroy() {
    if (this.client) {
      // Disconnect database
      await this.client.$disconnect();
    }
  }
}
