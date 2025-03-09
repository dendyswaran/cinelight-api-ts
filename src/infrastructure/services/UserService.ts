import { sign } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { User, UserProps } from '../../domain/entities/User';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/constants';

export interface IUserService {
  createUser(userData: UserProps): Promise<User>;
  findByUsername(username: string): Promise<User | null>;
  authenticate(username: string, password: string): Promise<{ user: User; token: string } | null>;
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  updateUser(id: number, userData: Partial<UserProps>): Promise<User | null>;
  deleteUser(id: number): Promise<boolean>;
}

export class UserService implements IUserService {
  private userRepository: Repository<User>;

  constructor(userRepository: Repository<User>) {
    this.userRepository = userRepository;
  }

  async createUser(userData: UserProps): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async authenticate(
    username: string,
    password: string
  ): Promise<{ user: User; token: string } | null> {
    const user = await this.findByUsername(username);

    if (!user || !user.validatePassword(password) || !user.isActive) {
      return null;
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    // Use a direct string format that jsonwebtoken accepts ('1h', '7d', etc.)
    const token = sign(payload, JWT_SECRET, {
      expiresIn: typeof JWT_EXPIRES_IN === 'number' ? JWT_EXPIRES_IN : '24h'
    });

    return { user, token };
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateUser(id: number, userData: Partial<UserProps>): Promise<User | null> {
    const user = await this.findById(id);

    if (!user) {
      return null;
    }

    Object.assign(user, userData);
    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return !!result.affected;
  }
}
