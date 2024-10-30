import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Users } from './users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Users),
          useClass: Repository,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  it('should register a new user', async () => {
    const email = 'testuser@linktic.app';
    const password = 'password123';

    // Mock the repository methods
    jest
      .spyOn(userRepository, 'create')
      .mockReturnValue({ id: 1, email, password });
    jest
      .spyOn(userRepository, 'save')
      .mockResolvedValue({ id: 1, email, password });

    // Hash the password for comparison
    const hashedPassword = await bcrypt.hash(password, 10);

    // Call the register method
    const result = await authService.register(email, password);

    // Assertions
    expect(result).toEqual({ id: 1, email, password: hashedPassword });
    expect(userRepository.create).toHaveBeenCalledWith({
      email,
      password: hashedPassword,
    });
    expect(userRepository.save).toHaveBeenCalled();
  });
});
