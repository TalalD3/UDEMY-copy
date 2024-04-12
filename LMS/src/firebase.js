import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
import { getFirestore } from "@firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAZljFvzsLywhzr_kwmHFlIayuj51AyS5o",
  authDomain: "lerning-course.firebaseapp.com",
  projectId: "lerning-course",
  storageBucket: "lerning-course.appspot.com",
  messagingSenderId: "818962871084",
  appId: "1:818962871084:web:cfc6fa8c4aea0f4396f289",
  measurementId: "G-6Y6Q1Z2RJL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app)
export const db = getFirestore(app)