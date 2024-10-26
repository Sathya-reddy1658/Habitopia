import { auth } from "../firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updatePassword,
  updateProfile
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { customAlphabet } from 'nanoid';

const db = getFirestore();

const createUserDocument = async (user, fid = null) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const name_from_email = user.email?.split('@')[0] || user.displayName || 'User';
  
  try {
    await setDoc(userRef, {
      displayName: user.displayName || name_from_email,
      email: user.email,
      uid: user.uid,
      fid: fid || user.fid || customAlphabet(user.uid, 6)(),
      photoURL: user.photoURL || "https://i.pinimg.com/736x/6f/bb/e2/6fbbe2b24b48864513b92d929772d877.jpg",
      createdAt: new Date(),
      totalScore: 69
    }, { merge: true });
    
    return userRef;
  } catch (error) {
    console.error("Error creating user document:", error);
    throw error;
  }
};

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    const name_from_email = email.split('@')[0];
    const fid = customAlphabet(user.uid, 6)();

    await updateProfile(user, {
      displayName: name_from_email
    });

    await createUserDocument(user, fid);
    return result;
  } catch (error) {
    console.error("Error in registration:", error);
    throw error;
  }
};

export const doSignInWithEmailAndPassword = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    await createUserDocument(user);
    return result;
  } catch (error) {
    console.error("Error in sign in:", error);
    throw error;
  }
};

export const doSignInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    await createUserDocument(user);
    return result;
  } catch (error) {
    console.error("Error in Google sign in:", error);
    throw error;
  }
};

export const doSignOut = () => {
  return auth.signOut();
};

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`,
  });
};