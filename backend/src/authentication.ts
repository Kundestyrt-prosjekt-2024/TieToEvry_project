import { auth } from '../../constants/firebaseConfig';
import { createUserWithEmailAndPassword} from 'firebase/auth';
import UserDAO, { User } from './UserDAO';
import { Timestamp } from 'firebase/firestore';

const userDAO = new UserDAO();

const registerUser = async (
  email: string,
  password: string,
  name: string,
  passphrase: string,
  phonenumber: number
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const newUser: User = {
      UserID: user.uid,
      created_at: Timestamp.now(),
      name: name,
      passphrase: passphrase,
      phonenumber: phonenumber
    };

    await userDAO.addUser(newUser);
    console.log("User registered and added to Firestore:", newUser);
  } catch (error) {
    console.error("Error registering user: ", error);
  }
};

export { registerUser };