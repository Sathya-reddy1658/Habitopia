// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "@firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBgAx8TN1XszV_AHwj4J5i-QDAkIN8sicA",
    authDomain: "hackforsdgwinners.firebaseapp.com",
    projectId: "hackforsdgwinners",
    storageBucket: "hackforsdgwinners.appspot.com",
    messagingSenderId: "479740391385",
    appId: "1:479740391385:web:7a2bf377e146786e7cb3c8",
    measurementId: "G-X3R41JMGLP"
  };
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export {auth,app};