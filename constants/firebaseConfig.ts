import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

const firebaseConfig: FirebaseConfig = {
    apiKey: "AIzaSyBGdV7sgbXXsRkqEtBlFoedN88mLen56_c",
    authDomain: "mobile-banking-app-dacb3.firebaseapp.com",
    projectId: "mobile-banking-app-dacb3",
    storageBucket: "mobile-banking-app-dacb3.appspot.com",
    messagingSenderId: "489868362025",
    appId: "1:489868362025:web:6f15a3c38a84885fbb3738",
    measurementId: "G-Q4VNTZCLKD"
  };

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };