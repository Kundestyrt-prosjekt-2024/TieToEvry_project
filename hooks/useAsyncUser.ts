import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the custom hook
const useAsyncUser = () => {
  const [hasUser, setHasUser] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        setHasUser(!!user); // If user exists, set hasUser to true, otherwise false
      } catch (error) {
        console.error("Failed to load user data", error);
        setHasUser(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkUser();
  }, []);

  return { hasUser, isChecking };
};

export default useAsyncUser;