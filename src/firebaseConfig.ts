// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBhLIxNbTAeuZx0EtP1W83NLQEx8oRT8Bc",
  authDomain: "inventory-17799.firebaseapp.com",
  projectId: "inventory-17799",
  storageBucket: "inventory-17799.appspot.com",
  messagingSenderId: "990518663070",
  appId: "1:990518663070:web:c0ae08b8cdd9acb7eda88f",
  measurementId: "G-BPFBSQCTEX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
