import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase configuration for your web app, they are public keys

const firebaseConfig = {
  apiKey: "AIzaSyDD9MFMveO2hXLUkfHN6J-7W_czmk9U6zE",
  authDomain: "react-blogs-3496b.firebaseapp.com",
  projectId: "react-blogs-3496b",
  storageBucket: "react-blogs-3496b.appspot.com",
  messagingSenderId: "939312523334",
  appId: "1:939312523334:web:ee6b83e12441041413c247",
};

initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
