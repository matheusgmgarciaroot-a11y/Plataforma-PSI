import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { ContractDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const professional = await this.prisma.client.professional.findUnique({
      where: { email },
    });

    if (!professional) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      professional.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    if (professional.status === 'pending') {
      throw new UnauthorizedException(
        'Seu cadastro está pendente de aprovação pelo usuário master.',
      );
    }

    if (professional.status === 'suspended') {
      throw new UnauthorizedException(
        'Seu acesso foi suspenso por pendência financeira. Por favor, regularize seu pagamento para liberar as atividades.',
      );
    }

    const payload = {
      sub: professional.id,
      email: professional.email,
      role: professional.role,
      name: professional.name,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: professional.id,
        name: professional.name,
        email: professional.email,
        role: professional.role,
      },
    };
  }

  async contract(data: ContractDto) {
    const existing = await this.prisma.client.professional.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictException('Este e-mail já está cadastrado no sistema.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // Parse date if present
    let parsedBirthDate: Date | null = null;
    if (data.birthDate) {
      parsedBirthDate = new Date(data.birthDate);
    }

    await this.prisma.client.professional.create({
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
        status: 'pending', // Starts as pending approval
        specialty: 'Psicologia',
      },
    });

    return {
      success: true,
      message:
        'Cadastro de contratação enviado com sucesso. Aguarde a liberação de suas credenciais pelo usuário master.',
    };
  }
}
