import { BaseRepository } from './BaseRepository';
import User, { IUser } from '../models/User';

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email });
  }

  async findByRole(role: string): Promise<IUser[]> {
    return this.findAll({ role });
  }
}

export const userRepository = new UserRepository();
