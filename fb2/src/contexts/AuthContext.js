import React, { useContext, useState, useEffect } from "react";
import { auth, db, storage } from "../api/firebase";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

const AuthContext = React.createContext(undefined);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();

  // STATES
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // USER SEARCH KEYWORDS
  const generateKeywords = (lastName, fullName) => {
    const lName = lastName.toLowerCase();
    const fName = fullName.toLowerCase();
    const keywords = [];
    for (let i = 1; i <= lName.length; i++)
      keywords.push(lName.substring(0, i));
    for (let i = 1; i <= fName.length; i++)
      keywords.push(fName.substring(0, i));

    return keywords;
  };

  // SIGN UP
  const register = async (firstName, lastName, email, password, birthdate) => {
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User account created");

      if (userCredential) {
        const user = userCredential.user;
        const fullName = firstName + " " + lastName;

        const fileRef = ref(storage, "avatars/user.png");
        const avatarDownloadURL = await getDownloadURL(fileRef);
        await updateProfile(user, {
          displayName: fullName,
          photoURL: avatarDownloadURL,
        });
        console.log("User profile updated");

        const keywords = generateKeywords(lastName, fullName);
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName: fullName,
          firstName: firstName,
          lastName: lastName,
          email: email,
          birthdate: new Date(birthdate),
          creationDate: new Date(),
          avatarURL: avatarDownloadURL,
          keywords: keywords,
        });
        console.log("Document added with ID: ", user.uid);

        // await sendEmailVerification(user);
        // console.log("Email Verification sent");

        console.log(user);
      }
    } catch (error) {
      throw error;
    }
  };

  // SIGN IN
  const login = async (email, password) => {
    setPersistence(auth, browserLocalPersistence);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User signed in");

      if (userCredential) {
        const user = userCredential.user;
        console.log(user);
      }
    } catch (error) {
      throw error;
    }
  };

  // SIGN OUT
  const logout = async () => {
    try {
      signOut(auth);
      navigate("/login");
      console.log("Signed out");
    } catch (error) {
      throw error;
    }
  };

  // USER STATE OBSERVER
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
