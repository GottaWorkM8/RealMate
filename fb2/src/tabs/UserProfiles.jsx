import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../api/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "contexts/AuthContext";

const UserProfiles = () => {
  // CURRENT USER
  const { currentUser } = useAuth();

  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();
  const location = useLocation();

  // Function to get user document from Firestore
  const getUserData = async (userId) => {
    const userDoc = await getDoc(doc(db, "users", userId));
    return userDoc.data();
  };

  useEffect(() => {
    const path = location.pathname;
    const match = path.match(/^\/profiles\/users\/(.+)$/);
    if (match) {
      const userId = match[1];
      const user = getUserData(userId);
      if (user) {
        return;
      }
    }
  }, []);

  return <div>UserProfiles</div>;
};

export default UserProfiles;
