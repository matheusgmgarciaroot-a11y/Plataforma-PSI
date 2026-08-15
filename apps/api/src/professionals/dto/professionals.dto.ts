export class CreateProfessionalDto {
  name!: string;
  email!: string;
  password!: string;
  crp!: string;
  gender!: string;
  birthDate!: string;
  phone!: string;
  consultationPrice!: string;
}

export class UpdateCredentialsDto {
  name?: string;
  email?: string;
  password?: string;
  crp?: string;
  phone?: string;
  consultationPrice?: string;
  nextPaymentDate?: string;
}
