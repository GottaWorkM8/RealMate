import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCw441pGntBTNbKuH5HE6tJTN8rnzkC3jE",
  authDomain: "realmate-12bb1.firebaseapp.com",
  projectId: "realmate-12bb1",
  storageBucket: "realmate-12bb1.appspot.com",
  messagingSenderId: "66597990953",
  appId: "1:66597990953:web:da4b516a45fe4afaeee238",
  measurementId: "G-PRW55SVFCX",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const storage = getStorage();
export const db = getFirestore(app);
export default app;
