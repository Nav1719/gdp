import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBGEfyrPE6JL_YlGFy5_sHbkzRpRvVQQFg",
  authDomain: "pdf-managment-web-app.firebaseapp.com",
  projectId: "pdf-managment-web-app",
  storageBucket: "pdf-managment-web-app.appspot.com",
  messagingSenderId: "103051307500",
  appId: "1:103051307500:web:8828a1b28a1ee0d3e2b8c9",
};

const Firebase = initializeApp(firebaseConfig);
export default Firebase;
