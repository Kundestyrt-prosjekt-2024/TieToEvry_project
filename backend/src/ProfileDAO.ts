import { storage } from "@/constants/firebaseConfig";
import { getDownloadURL, listAll, ref } from "firebase/storage";


export async function getProfilePictures() {
    const folderRef = ref(storage, 'Profile Pictures');
  
    try {
      const result = await listAll(folderRef);
  
      const urlPromises = result.items.map(itemRef => getDownloadURL(itemRef));
      const urls = await Promise.all(urlPromises);
      const profilePictures = urls.filter(url => url !== "https://firebasestorage.googleapis.com/v0/b/mobile-banking-app-dacb3.appspot.com/o/Profile%20Pictures%2FDefault_pfp.png?alt=media&token=3c5ea107-33ee-4b7b-8df6-4ab8b3522aaa");

      return profilePictures;
  
    } catch (error) {
      console.error("Error fetching profile pictures:", error);
      return [];
    }
}
