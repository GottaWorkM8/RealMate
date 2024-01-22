import React, { useContext, useState, useEffect } from "react";
import {
  auth,
  storage,
  setUserAbout,
  setUserKeywordSet,
  setUserPrefs,
  setUserProfile,
  updateUserLastActive,
} from "../apis/firebase";
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
import { generateUserKeywords } from "utils";

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

        const avatarDownloadURL = await getDownloadURL(
          ref(storage, "avatars/user.png")
        );
        await updateProfile(user, {
          displayName: fullName,
          photoURL: avatarDownloadURL,
        });
        console.log("User profile updated");

        const keywords = generateUserKeywords(firstName, lastName);
        await setUserKeywordSet(user.uid, keywords);
        await setUserProfile(user.uid, fullName, avatarDownloadURL);
        await setUserPrefs(user.uid);
        const bgDownloadURL = await getDownloadURL(
          ref(storage, "backgrounds/background.jpg")
        );
        await setUserAbout(
          user.uid,
          firstName,
          lastName,
          email,
          birthdate,
          bgDownloadURL
        );
        console.log("Documents added with ID: ", user.uid);

        await sendEmailVerification(user);
        console.log("Email Verification message sent");
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
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        const updateLastActiveInterval = setInterval(async () => {
          await updateUserLastActive(user.uid);
        }, 60000);
        return () => clearInterval(updateLastActiveInterval);
      }
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
