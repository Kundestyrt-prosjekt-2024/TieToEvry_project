import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the Zustand store
interface UserStore {
  userID: string | null;
  isLoading: boolean;
  setUserID: (userID: string) => void;
  loadUserID: () => Promise<void>;
  logout: () => Promise<void>;
}

const useUserStore = create<UserStore>((set) => ({
  userID: null,
  isLoading: true,
  
  // Method to set the userID
  setUserID: (userID: string) => {
    set({ userID });
  },

  // Method to load userID from AsyncStorage
  loadUserID: async () => {
    try {
      set({ isLoading: true });
      const storedUserID = await AsyncStorage.getItem('userID');
      if (storedUserID) {
        set({ userID: storedUserID });
      } else {
        set({ userID: null });
      }
    } catch (error) {
      console.error('Failed to load userID', error);
      set({ userID: null });
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    try {
      // Remove userID from AsyncStorage
      await AsyncStorage.removeItem('userID');
      // Reset userID in the Zustand state
      set({ userID: null });
    } catch (error) {
      console.error('Failed to log out user', error);
    }
  },
}));

export default useUserStore;