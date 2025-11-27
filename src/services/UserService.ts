import { User } from '../types';
import LocalStorageService from './LocalStorageService';

const USER_KEY = '@user';

class UserService {
  static async getUser(): Promise<User | null> {
    const storedUser = await LocalStorageService.getItem<User>(USER_KEY);
    return storedUser;
  }

  static async updateUser(user: User): Promise<void> {
    await LocalStorageService.setItem(USER_KEY, user);
  }

  static async updateAddress(address: string): Promise<void> {
    const user = await this.getUser();
    if (!user) return;
    const updatedUser = { ...user, address };
    await this.updateUser(updatedUser);
  }

  static async addSavedAddress(newAddress: string): Promise<void> {
    const user = await this.getUser();
    if (!user) return;
    const savedAddresses = user.savedAddresses || [];
    if (!savedAddresses.includes(newAddress)) {
      const updatedUser = {
        ...user,
        savedAddresses: [...savedAddresses, newAddress],
      };
      await this.updateUser(updatedUser);
    }
  }

  static async getSavedAddresses(): Promise<string[]> {
    const user = await this.getUser();
    if (!user) return [];
    return user.savedAddresses || [];
  }
}

export default UserService;
