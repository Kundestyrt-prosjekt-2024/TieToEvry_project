import { auth } from '../../constants/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { User } from '../types/user';
import { Timestamp } from 'firebase/firestore';
import UserDAO from './UserDAO';

const registerUser = async (
  email: string,
  password: string,
  name: string,
  phonenumber: number,
  birthdate: Date,
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const newUser: User = {
      created_at: Timestamp.now().toDate(),
      birthdate: birthdate,
      name: name,
      passphrase: password,
      phonenumber: phonenumber
    };

    const userDAO = new UserDAO();
    const userId = await userDAO.addUser(user.uid, newUser);
    return userId;

  } catch (error) {
    return undefined
  }
};

const loginUser = async (email: string, password: string): Promise<User | undefined> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDAO = new UserDAO();
    const user = await userDAO.getUser(userCredential.user.uid);
    return user;
  } catch (error) {
    return undefined;
  }
};

export { registerUser, loginUser };