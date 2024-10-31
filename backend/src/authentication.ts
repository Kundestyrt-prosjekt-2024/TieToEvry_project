import { auth } from '../../constants/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { User } from '../types/user';
import { Timestamp } from 'firebase/firestore';
import { addChildToParent, addUser, getUser } from './UserDAO';

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
      phonenumber: phonenumber,
      children: [],
    };

    const userId = await addUser(user.uid, newUser);
    return userId;

  } catch (error: any) {
    throw new Error(error.message);
  }
};

const registerChild = async (
  email: string,
  password: string,
  name: string,
  phonenumber: number,
  birthdate: Date,
  parentUid: string,
) => {
  try {
    const childCredential = await createUserWithEmailAndPassword(auth, email, password);
    const child = childCredential.user;

    const newUser: User = {
      created_at: Timestamp.now().toDate(),
      birthdate: birthdate,
      name: name,
      passphrase: password,
      phonenumber: phonenumber,
      children: [],
      parents: [parentUid],
    };

    const userId = await addChildToParent(parentUid, child.uid, newUser);
    return userId;

  } catch (error: any) {
    throw new Error(error.message);
  }
};

const loginUser = async (email: string, password: string) => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    getUser(userCredential.user.uid);
    return userCredential.user.uid;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export { registerUser, loginUser, registerChild};