import { User } from '../types';
import LocalStorageService from './LocalStorageService';
import { MOCK_USER } from './mockData';

const USER_KEY = '@user';

class UserService {
  static async getUser(): Promise<User> {
    const storedUser = await LocalStorageService.getItem<User>(USER_KEY);
    if (!storedUser) {
      // Initialize with mock user if not found
      await LocalStorageService.setItem(USER_KEY, MOCK_USER);
      return MOCK_USER;
    }
    return storedUser;
  }

  static async updateUser(user: User): Promise<void> {
    await LocalStorageService.setItem(USER_KEY, user);
  }

  static async updateAddress(address: string): Promise<void> {
    const user = await this.getUser();
    const updatedUser = { ...user, address };
    await this.updateUser(updatedUser);
  }

  static async addSavedAddress(newAddress: string): Promise<void> {
    const user = await this.getUser();
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
    return user.savedAddresses || [];
  }
}

export default UserService;
