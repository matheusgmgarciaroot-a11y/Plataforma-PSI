import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import {
  CreateProfessionalDto,
  UpdateCredentialsDto,
} from './dto/professionals.dto';

@Injectable()
export class ProfessionalsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.client.professional.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        crp: true,
        specialty: true,
        role: true,
        status: true,
        gender: true,
        birthDate: true,
        phone: true,
        consultationPrice: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const professional = await this.prisma.client.professional.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        crp: true,
        specialty: true,
        role: true,
        status: true,
        gender: true,
        birthDate: true,
        phone: true,
        consultationPrice: true,
        createdAt: true,
      },
    });

    if (!professional) {
      throw new NotFoundException('Profissional não encontrado.');
    }

    return professional;
  }

  async updateStatus(id: string, status: string) {
    // Verify if it exists
    await this.findOne(id);

    return this.prisma.client.professional.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });
  }

  async updateCredentials(id: string, data: UpdateCredentialsDto) {
    await this.findOne(id);

    const updateData: Record<string, any> = {};
    if (data.email) {
      // Check duplicate email
      const existing = await this.prisma.client.professional.findFirst({
        where: {
          email: data.email,
          NOT: { id },
        },
      });
      if (existing) {
        throw new ConflictException(
          'E-mail já utilizado por outro profissional.',
        );
      }
      updateData.email = data.email;
    }

    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(data.password, salt);
    }

    if (data.name) {
      updateData.name = data.name;
    }
    if (data.crp) {
      updateData.crp = data.crp;
    }
    if (data.phone) {
      updateData.phone = data.phone;
    }
    if (data.consultationPrice !== undefined) {
      updateData.consultationPrice = data.consultationPrice
        ? parseFloat(data.consultationPrice)
        : null;
    }

    return this.prisma.client.professional.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        crp: true,
        status: true,
      },
    });
  }

  async createManual(data: CreateProfessionalDto) {
    const existing = await this.prisma.client.professional.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictException('Este e-mail já está cadastrado no sistema.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    let parsedBirthDate: Date | null = null;
    if (data.birthDate) {
      parsedBirthDate = new Date(data.birthDate);
    }

    return this.prisma.client.professional.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        crp: data.crp,
        gender: data.gender,
        birthDate: parsedBirthDate,
        phone: data.phone,
        consultationPrice: data.consultationPrice
          ? parseFloat(data.consultationPrice)
          : null,
        role: 'professional',
        status: 'active', // Active immediately because it is created by admin
        specialty: 'Psicologia',
      },
      select: {
        id: true,
        name: true,
        email: true,
        crp: true,
        status: true,
      },
    });
  }

  async remove(id: string) {
    const prof = await this.findOne(id);

    // Prevent deleting the admin master user
    if (prof.role === 'admin') {
      throw new ConflictException(
        'O usuário administrador master não pode ser excluído.',
      );
    }

    await this.prisma.client.professional.delete({
      where: { id },
    });

    return { deleted: true, id };
  }
}
