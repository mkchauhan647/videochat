import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
// import { getFunctions } from "firebase/functions";
// import { getMessaging } from "firebase/messaging";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDWQ43J-qQxlSC5KevnTYqD8fag_F_x6Dc",
    authDomain: "videochat-8bec2.firebaseapp.com",
    projectId: "videochat-8bec2",
    storageBucket: "videochat-8bec2.appspot.com",
    messagingSenderId: "807607574155",
    appId: "1:807607574155:web:0afb7faeb9c1059d67be8e",
    measurementId: "G-PMVEM96252"
  };
  
  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// export {app}
export { db, auth, storage };
