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

const GroupProfiles = () => {
  // CURRENT USER
  const { currentUser } = useAuth();

  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();
  const location = useLocation();

  // Function to get group document from Firestore
  const getGroupData = async (groupId) => {
    const groupDoc = await getDoc(doc(db, "groups", groupId));
    return groupDoc.data();
  };

  useEffect(() => {
    const path = location.pathname;
    const match = path.match(/^\/profiles\/groups\/(.+)$/);
    if (match) {
      const groupId = match[1];
      const group = getGroupData(groupId);
      if (group) {
        return;
      }
    }
  }, []);

  return <div>GroupProfiles</div>;
};

export default GroupProfiles;
