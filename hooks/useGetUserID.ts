import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useGetUserID = () => {
  const [userID, setUserID] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Automatically check userID on mount
  useEffect(() => {
    const checkUserID = async () => {
      try {
        setIsLoading(true);
        const storedUserID = await AsyncStorage.getItem("userID");
        setUserID(storedUserID); // Set the actual userID if present, or null if not
      } catch (error) {
        console.error("Failed to load userID", error);
        setUserID(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserID();
  }, []);

  return { userID, isLoading };
};

export default useGetUserID;