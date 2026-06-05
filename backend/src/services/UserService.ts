import { userRepository } from '../repositories/UserRepository';
import { IUser } from '../models/User';

export class UserService {
  async getAllUsers(): Promise<IUser[]> {
    return userRepository.findAll();
  }

  async getUserById(id: string): Promise<IUser | null> {
    return userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return userRepository.findByEmail(email);
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    // In a real app, hash password here before saving
    return userRepository.create(userData);
  }
}

export const userService = new UserService();
