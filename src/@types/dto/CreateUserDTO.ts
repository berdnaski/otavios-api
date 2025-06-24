export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    role?: 'ADMIN' | 'BARBER';
    commission?: number;
}

export interface CreateUserPrismaDTO extends Omit<CreateUserDTO, 'commission' | 'role'> {
  role: 'ADMIN' | 'BARBER';
  commission: number;
}
